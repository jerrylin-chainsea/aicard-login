import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';
import VerificationCodePage from './VerificationCodePage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock antd-mobile
vi.mock('antd-mobile', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-testid={className}
    >
      {children}
    </button>
  ),
  Toast: {
    show: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('VerificationCodePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('應該正確渲染驗證碼頁面', () => {
    renderWithProviders(<VerificationCodePage />);
    
    // 檢查頁面標題
    expect(screen.getByText('輸入驗證碼')).toBeInTheDocument();
    
    // 檢查描述文字
    expect(screen.getByText('驗證碼已發送至 0900000000')).toBeInTheDocument();
    
    // 檢查輸入標籤
    expect(screen.getByText('6位數驗證碼')).toBeInTheDocument();
    
    // 檢查按鈕
    expect(screen.getByText('驗證')).toBeInTheDocument();
    expect(screen.getByText('重新發送驗證碼')).toBeInTheDocument();
  });

  it('應該渲染6個驗證碼輸入框', () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    
    inputs.forEach((input, index) => {
      expect(input).toHaveAttribute('aria-label', `驗證碼第${index + 1}位`);
      expect(input).toHaveAttribute('maxLength', '1');
      expect(input).toHaveAttribute('inputMode', 'numeric');
    });
  });

  it('應該在輸入驗證碼時自動跳轉到下一個輸入框', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 在第一個輸入框輸入數字
    fireEvent.change(inputs[0], { target: { value: '1' } });
    
    // 檢查第一個輸入框的值
    expect(inputs[0]).toHaveValue('1');
    
    // 檢查焦點是否跳轉到第二個輸入框
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });
  });

  it('應該在按下退格鍵時跳轉到上一個輸入框', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 在第二個輸入框輸入數字
    fireEvent.change(inputs[1], { target: { value: '2' } });
    
    // 將焦點移到第三個輸入框
    inputs[2].focus();
    
    // 在第三個輸入框按下退格鍵（當輸入框為空時）
    fireEvent.keyDown(inputs[2], { key: 'Backspace' });
    
    // 檢查焦點是否跳轉到第二個輸入框
    await waitFor(() => {
      expect(inputs[1]).toHaveFocus();
    });
  });

  it('應該在驗證碼不完整時禁用驗證按鈕', () => {
    renderWithProviders(<VerificationCodePage />);
    
    const verifyButton = screen.getByTestId('verification-code-page__verify-button');
    expect(verifyButton).toBeDisabled();
  });

  it('應該在驗證碼完整時啟用驗證按鈕', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 填滿所有輸入框
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    await waitFor(() => {
      const verifyButton = screen.getByTestId('verification-code-page__verify-button');
      expect(verifyButton).not.toBeDisabled();
    });
  });

  it('應該在驗證失敗時顯示錯誤訊息', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 輸入特定的驗證碼來觸發錯誤
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    const verifyButton = screen.getByTestId('verification-code-page__verify-button');
    fireEvent.click(verifyButton);
    
    // 檢查錯誤訊息
    await waitFor(() => {
      expect(screen.getByText('驗證碼不正確')).toBeInTheDocument();
    });
    
    // 檢查第一個輸入框是否有錯誤樣式
    expect(inputs[0]).toHaveClass('error');
  });

  it('應該在驗證成功時導航到成功頁面', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 輸入非123456的驗證碼
    inputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 2).toString() } });
    });
    
    const verifyButton = screen.getByTestId('verification-code-page__verify-button');
    fireEvent.click(verifyButton);
    
    // 檢查是否導航到成功頁面
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verification-success');
    });
  });

  it('應該在點擊返回按鈕時導航到手機驗證頁面', () => {
    renderWithProviders(<VerificationCodePage />);
    
    const backButton = screen.getByLabelText('返回');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/phone-verification');
  });

  it('應該在重新發送驗證碼時啟動倒計時', async () => {
    renderWithProviders(<VerificationCodePage />);
    
    const resendButton = screen.getByTestId('verification-code-page__resend-button');
    fireEvent.click(resendButton);
    
    // 檢查按鈕是否被禁用
    expect(resendButton).toBeDisabled();
    
    // 檢查按鈕文字是否顯示倒計時
    expect(resendButton).toHaveTextContent('重新發送驗證碼 (60)');
  });

  it('應該限制每個輸入框只能輸入一個字符', () => {
    renderWithProviders(<VerificationCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // 嘗試在第一個輸入框輸入多個字符
    fireEvent.change(inputs[0], { target: { value: '123' } });
    
    // 檢查只保留了第一個字符
    expect(inputs[0]).toHaveValue('1');
  });
});
