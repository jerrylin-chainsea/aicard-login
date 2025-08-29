import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/app/slices/authSlice'
import verificationReducer from '@/app/slices/verificationSlice'
import i18n from '@/locales/i18n'
import WelcomePage from './WelcomePage'

// 建立測試用的 store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      verification: verificationReducer,
    },
    preloadedState: initialState,
  })
}

// 測試用的 wrapper 組件
const TestWrapper: React.FC<{ children: React.ReactNode; initialState?: any }> = ({ 
  children, 
  initialState 
}) => {
  const store = createTestStore(initialState)
  
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  )
}

describe('WelcomePage', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      }
    })
  })

  it('應該正確渲染頁面標題', () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('AiCard')).toBeInTheDocument()
    expect(screen.getByText('電子名片助理')).toBeInTheDocument()
  })

  it('應該顯示歡迎文字', () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('auth.welcome')).toBeInTheDocument()
  })

  it('應該顯示服務條款同意選項', () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText(/我已閱讀並同意/)).toBeInTheDocument()
    expect(screen.getByText('服務條款')).toBeInTheDocument()
    expect(screen.getByText('隱私政策')).toBeInTheDocument()
  })

  it('應該在未同意服務條款時禁用登入按鈕', () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    const loginButton = screen.getByText('auth.lineLogin')
    expect(loginButton).toBeDisabled()
  })

  it('應該在同意服務條款後啟用登入按鈕', async () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      const loginButton = screen.getByText('auth.lineLogin')
      expect(loginButton).not.toBeDisabled()
    })
  })

  it('應該在點擊登入按鈕後導向 LINE 授權頁面', async () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    )
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      const loginButton = screen.getByText('auth.lineLogin')
      fireEvent.click(loginButton)
      expect(mockNavigate).toHaveBeenCalledWith('/line-auth')
    })
  })

  it('應該在載入狀態下顯示載入指示器', () => {
    render(
      <TestWrapper initialState={{
        auth: {
          isLoading: true,
          error: null,
          hasAgreedToTerms: false,
          isAuthenticated: false,
          userId: null,
          displayName: null,
          avatarUrl: null,
          roles: [],
        }
      }}>
        <WelcomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('common.loading')).toBeInTheDocument()
  })

  it('應該在錯誤狀態下顯示錯誤訊息和重試按鈕', () => {
    render(
      <TestWrapper initialState={{
        auth: {
          isLoading: false,
          error: '認證失敗',
          hasAgreedToTerms: false,
          isAuthenticated: false,
          userId: null,
          displayName: null,
          avatarUrl: null,
          roles: [],
        }
      }}>
        <WelcomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('認證失敗')).toBeInTheDocument()
    expect(screen.getByText('重試')).toBeInTheDocument()
  })
})
