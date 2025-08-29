import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('應該正確渲染按鈕文字', () => {
    render(<Button>測試按鈕</Button>)
    expect(screen.getByText('測試按鈕')).toBeInTheDocument()
  })

  it('應該正確處理點擊事件', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>點擊測試</Button>)
    
    fireEvent.click(screen.getByText('點擊測試'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('應該在禁用狀態下不可點擊', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>禁用按鈕</Button>)
    
    const button = screen.getByText('禁用按鈕')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('應該在載入狀態下顯示載入指示器', () => {
    render(<Button loading>載入按鈕</Button>)
    
    const button = screen.getByText('載入按鈕')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('應該正確應用不同的變體樣式', () => {
    const { rerender } = render(<Button variant="primary">主要按鈕</Button>)
    expect(screen.getByText('主要按鈕')).toHaveClass('bg-line-green')
    
    rerender(<Button variant="secondary">次要按鈕</Button>)
    expect(screen.getByText('次要按鈕')).toHaveClass('bg-white')
    
    rerender(<Button variant="outline">外框按鈕</Button>)
    expect(screen.getByText('外框按鈕')).toHaveClass('bg-transparent')
  })

  it('應該正確應用不同的尺寸樣式', () => {
    const { rerender } = render(<Button size="small">小按鈕</Button>)
    expect(screen.getByText('小按鈕')).toHaveClass('px-3 py-2 text-sm')
    
    rerender(<Button size="medium">中按鈕</Button>)
    expect(screen.getByText('中按鈕')).toHaveClass('px-4 py-3 text-base')
    
    rerender(<Button size="large">大按鈕</Button>)
    expect(screen.getByText('大按鈕')).toHaveClass('px-6 py-4 text-lg')
  })

  it('應該正確應用自定義 className', () => {
    render(<Button className="custom-class">自定義按鈕</Button>)
    expect(screen.getByText('自定義按鈕')).toHaveClass('custom-class')
  })
})
