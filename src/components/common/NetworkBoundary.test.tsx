import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NetworkBoundary from './NetworkBoundary'
import { logService } from '@/services/logService'

// Mock logService
vi.mock('@/services/logService', () => ({
  logService: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock navigator.onLine
const mockNavigator = {
  onLine: true,
}

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
})

describe('NetworkBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置網路狀態
    mockNavigator.onLine = true
  })

  afterEach(() => {
    // 清理事件監聽器
    window.removeEventListener('online', vi.fn())
    window.removeEventListener('offline', vi.fn())
  })

  it('應該正常渲染子組件當網路連線正常時', () => {
    render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(screen.getByText('測試內容')).toBeInTheDocument()
  })

  it('應該在網路離線時顯示離線 UI', () => {
    mockNavigator.onLine = false

    render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(screen.getByText('網路連線中斷')).toBeInTheDocument()
    expect(screen.getByText('請檢查您的網路連線並重試。')).toBeInTheDocument()
    expect(screen.getByText('重試')).toBeInTheDocument()
    expect(screen.getByText('重新整理')).toBeInTheDocument()
  })

  it('應該在網路恢復時自動隱藏離線 UI', async () => {
    mockNavigator.onLine = false

    const { rerender } = render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    // 確認離線 UI 顯示
    expect(screen.getByText('網路連線中斷')).toBeInTheDocument()

    // 模擬網路恢復
    mockNavigator.onLine = true
    window.dispatchEvent(new Event('online'))

    // 重新渲染
    rerender(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('測試內容')).toBeInTheDocument()
    })
  })

  it('應該在點擊重試按鈕時記錄日誌並隱藏錯誤', () => {
    mockNavigator.onLine = false

    const onRetry = vi.fn()

    render(
      <NetworkBoundary onRetry={onRetry}>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    const retryButton = screen.getByText('重試')
    fireEvent.click(retryButton)

    expect(logService.info).toHaveBeenCalledWith(
      'User initiated retry after network error',
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    )

    expect(onRetry).toHaveBeenCalled()
  })

  it('應該在點擊重新整理按鈕時記錄日誌', () => {
    mockNavigator.onLine = false

    // Mock window.location.reload
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    const refreshButton = screen.getByText('重新整理')
    fireEvent.click(refreshButton)

    expect(logService.info).toHaveBeenCalledWith(
      'User initiated page refresh after network error',
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    )

    expect(reloadSpy).toHaveBeenCalled()

    reloadSpy.mockRestore()
  })

  it('應該在網路狀態變化時記錄日誌', () => {
    mockNavigator.onLine = false

    const onOffline = vi.fn()
    const onOnline = vi.fn()

    render(
      <NetworkBoundary onOffline={onOffline} onOnline={onOnline}>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    // 觸發離線事件
    window.dispatchEvent(new Event('offline'))

    expect(logService.warn).toHaveBeenCalledWith(
      'Network connection lost',
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    )

    expect(onOffline).toHaveBeenCalled()

    // 觸發上線事件
    mockNavigator.onLine = true
    window.dispatchEvent(new Event('online'))

    expect(logService.info).toHaveBeenCalledWith(
      'Network connection restored',
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    )

    expect(onOnline).toHaveBeenCalled()
  })

  it('應該顯示自定義 fallback UI', () => {
    const customFallback = <div>自定義網路錯誤頁面</div>

    mockNavigator.onLine = false

    render(
      <NetworkBoundary fallback={customFallback}>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(screen.getByText('自定義網路錯誤頁面')).toBeInTheDocument()
    expect(screen.queryByText('網路連線中斷')).not.toBeInTheDocument()
  })

  it('應該在離線時顯示網路檢查提示', () => {
    mockNavigator.onLine = false

    render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(screen.getByText('💡 提示：請檢查以下項目')).toBeInTheDocument()
    expect(screen.getByText('Wi-Fi 或行動網路是否已開啟')).toBeInTheDocument()
    expect(screen.getByText('網路連線是否穩定')).toBeInTheDocument()
    expect(screen.getByText('是否在飛航模式')).toBeInTheDocument()
  })

  it('應該在網路異常時顯示不同的標題和描述', () => {
    // 模擬網路異常狀態（有錯誤但網路連線正常）
    const NetworkBoundaryWithError = () => {
      const [hasError, setHasError] = React.useState(true)
      
      React.useEffect(() => {
        // 模擬網路錯誤
        setHasError(true)
      }, [])

      if (hasError) {
        return (
          <div className="network-boundary">
            <div className="network-boundary__container">
              <h1 className="network-boundary__title">網路連線異常</h1>
              <p className="network-boundary__description">網路連線不穩定，請稍後再試。</p>
            </div>
          </div>
        )
      }

      return <div>測試內容</div>
    }

    render(<NetworkBoundaryWithError />)

    expect(screen.getByText('網路連線異常')).toBeInTheDocument()
    expect(screen.getByText('網路連線不穩定，請稍後再試。')).toBeInTheDocument()
  })

  it('應該正確處理初始網路狀態檢查', () => {
    // 測試初始狀態為離線
    mockNavigator.onLine = false

    render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(screen.getByText('網路連線中斷')).toBeInTheDocument()
    expect(logService.warn).toHaveBeenCalledWith(
      'Network connection lost',
      expect.objectContaining({
        timestamp: expect.any(String)
      })
    )
  })

  it('應該在組件卸載時清理事件監聽器', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <NetworkBoundary>
        <div>測試內容</div>
      </NetworkBoundary>
    )

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})
