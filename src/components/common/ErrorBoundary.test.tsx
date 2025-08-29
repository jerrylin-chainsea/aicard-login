import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'
import { logService } from '@/services/logService'

// Mock logService
vi.mock('@/services/logService', () => ({
  logService: {
    error: vi.fn(),
  },
}))

// 模擬會拋出錯誤的組件
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>正常渲染</div>
}

// 模擬會拋出錯誤的組件（帶組件堆疊）
const ThrowErrorWithStack = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    const error = new Error('Test error with stack')
    error.stack = 'Error: Test error with stack\n    at ThrowErrorWithStack'
    throw error
  }
  return <div>正常渲染</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 console.error 的 mock
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('應該正常渲染子組件當沒有錯誤時', () => {
    render(
      <ErrorBoundary>
        <div>測試內容</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('測試內容')).toBeInTheDocument()
  })

  it('應該捕獲錯誤並顯示錯誤 UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('錯誤')).toBeInTheDocument()
    expect(screen.getByText('抱歉，發生了一些問題。請稍後再試。')).toBeInTheDocument()
    expect(screen.getByText('重試')).toBeInTheDocument()
    expect(screen.getByText('回到首頁')).toBeInTheDocument()
  })

  it('應該記錄錯誤到日誌服務', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(logService.error).toHaveBeenCalledWith(
      'React Error Boundary caught an error',
      expect.objectContaining({
        componentStack: expect.any(String),
        url: expect.any(String)
      }),
      expect.any(Error)
    )
  })

  it('應該在開發環境下顯示錯誤詳情', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowErrorWithStack shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('開發者資訊')).toBeInTheDocument()
    expect(screen.getByText('錯誤訊息：Test error with stack')).toBeInTheDocument()
    expect(screen.getByText('錯誤堆疊：')).toBeInTheDocument()

    // 恢復環境變數
    process.env.NODE_ENV = originalEnv
  })

  it('應該在生產環境下隱藏錯誤詳情', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('開發者資訊')).not.toBeInTheDocument()
    expect(screen.queryByText('錯誤訊息：')).not.toBeInTheDocument()

    // 恢復環境變數
    process.env.NODE_ENV = originalEnv
  })

  it('應該在點擊重試按鈕時重置錯誤狀態', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // 確認錯誤狀態
    expect(screen.getByText('錯誤')).toBeInTheDocument()

    // 點擊重試按鈕
    const retryButton = screen.getByText('重試')
    fireEvent.click(retryButton)

    // 重新渲染，這次不拋出錯誤
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    // 應該正常渲染子組件
    expect(screen.getByText('正常渲染')).toBeInTheDocument()
    expect(screen.queryByText('錯誤')).not.toBeInTheDocument()
  })

  it('應該在點擊回到首頁按鈕時導航到首頁', () => {
    // Mock window.location.href
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' } as any

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const homeButton = screen.getByText('回到首頁')
    fireEvent.click(homeButton)

    expect(window.location.href).toBe('/')

    // 恢復 window.location
    window.location = originalLocation
  })

  it('應該調用可選的 onError 回調', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('應該渲染自定義 fallback UI', () => {
    const customFallback = <div>自定義錯誤頁面</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('自定義錯誤頁面')).toBeInTheDocument()
    expect(screen.queryByText('錯誤')).not.toBeInTheDocument()
  })

  it('應該處理沒有錯誤堆疊的情況', () => {
    const ThrowErrorNoStack = () => {
      const error = new Error('Test error')
      delete (error as any).stack
      throw error
    }

    render(
      <ErrorBoundary>
        <ThrowErrorNoStack />
      </ErrorBoundary>
    )

    expect(screen.getByText('錯誤')).toBeInTheDocument()
    expect(logService.error).toHaveBeenCalled()
  })

  it('應該在錯誤邊界內部拋出錯誤時不會無限循環', () => {
    // 這個測試確保錯誤邊界不會因為內部錯誤而崩潰
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
    }).not.toThrow()

    consoleSpy.mockRestore()
  })
})
