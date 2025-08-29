import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';
import verificationSlice from '@/app/slices/verificationSlice';
import PhoneVerificationPage from './PhoneVerificationPage';

// Mock store
const createTestStore = () => {
  return configureStore({
    reducer: {
      verification: verificationSlice,
    },
    preloadedState: {
      verification: {
        phoneNumber: '',
        isLoading: false,
        error: null,
        isPhoneVerified: false,
        countdown: 0,
        canResend: true,
      },
    },
  });
};

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock dispatch
const mockDispatch = vi.fn();
vi.mock('@/app/hooks', () => ({
  ...vi.importActual('@/app/hooks'),
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  
  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

describe('PhoneVerificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReturnValue(Promise.resolve());
  });

  it('應該正確渲染頁面標題和描述', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    expect(screen.getByText('AiCard')).toBeInTheDocument();
    expect(screen.getByText('電子名片助理')).toBeInTheDocument();
    expect(screen.getByText('手機號碼驗證')).toBeInTheDocument();
    expect(screen.getByText('請輸入您的手機號碼以接收驗證碼')).toBeInTheDocument();
  });

  it('應該顯示手機號碼輸入框和國家選擇器', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    expect(screen.getByLabelText('手機號碼')).toBeInTheDocument();
    expect(screen.getByText('🇹🇼')).toBeInTheDocument();
    expect(screen.getByText('+886')).toBeInTheDocument();
  });

  it('應該在輸入手機號碼時更新狀態', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.change(input, { target: { value: '0900000000' } });
    
    expect(input).toHaveValue('0900000000');
  });

  it('應該在手機號碼有效時啟用發送按鈕', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const sendButton = screen.getByText('發送驗證碼');
    expect(sendButton).toBeDisabled();
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.change(input, { target: { value: '0900000000' } });
    
    expect(sendButton).not.toBeDisabled();
  });

  it('應該在點擊發送按鈕時調用發送驗證碼動作', async () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.change(input, { target: { value: '0900000000' } });
    
    const sendButton = screen.getByText('發送驗證碼');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('應該在點擊返回按鈕時導航到 LINE 認證頁面', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const backButton = screen.getByLabelText('返回');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/line-auth');
  });

  it('應該在輸入框聚焦時顯示聚焦狀態', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.focus(input);
    
    const phoneInput = input.closest('.phone-verification-page__phone-input');
    expect(phoneInput).toHaveClass('focused');
  });

  it('應該在輸入框失焦時隱藏聚焦狀態', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    const phoneInput = input.closest('.phone-verification-page__phone-input');
    expect(phoneInput).not.toHaveClass('focused');
  });

  it('應該限制手機號碼輸入長度為10位', () => {
    renderWithProviders(<PhoneVerificationPage />);
    
    const input = screen.getByLabelText('手機號碼');
    fireEvent.change(input, { target: { value: '090000000012345' } });
    
    expect(input).toHaveValue('0900000000');
  });

  it('應該在驗證成功後顯示成功提示', async () => {
    const { rerender } = renderWithProviders(<PhoneVerificationPage />);
    
    // 模擬驗證成功狀態
    const store = createTestStore();
    store.dispatch({
      type: 'verification/setPhoneVerified',
      payload: true,
    });
    
    rerender(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <PhoneVerificationPage />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('已發送驗證碼')).toBeInTheDocument();
    });
  });
});
