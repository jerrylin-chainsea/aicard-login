import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import './VerificationCodePage.css';

const VerificationCodePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState<string[]>(new Array(6).fill(''));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isVerificationError, setIsVerificationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // 初始化倒計時
    if (isResendDisabled) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            setResendCountdown(60);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isResendDisabled]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // 限制每個輸入框只能輸入一個字符

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // 清除錯誤狀態
    if (isVerificationError) {
      setIsVerificationError(false);
      setErrorMessage('');
    }

    // 自動跳轉到下一個輸入框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // 如果當前輸入框為空且按下退格鍵，跳轉到上一個輸入框
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      Toast.show({
        content: '請輸入完整的6位數驗證碼',
        position: 'center',
      });
      return;
    }

    // 模擬驗證失敗的情況來展示錯誤狀態
    if (code === '123456') {
      setIsVerificationError(true);
      setErrorMessage('驗證碼不正確');
      // 聚焦到第一個輸入框
      inputRefs.current[0]?.focus();
      return;
    }

    // 模擬驗證成功
    Toast.show({
      content: '驗證成功',
      position: 'center',
    });
    
    // 導航到成功頁面
    navigate('/verification-success');
  };

  const handleResendCode = () => {
    setIsResendDisabled(true);
    setResendCountdown(60);
    setIsVerificationError(false);
    setErrorMessage('');
    
    // TODO: 調用重新發送驗證碼 API
    Toast.show({
      content: '驗證碼已重新發送',
      position: 'center',
    });
  };

  const handleBack = () => {
    navigate('/phone-verification');
  };

  const handleInputFocus = (index: number) => {
    // 聚焦時清除錯誤狀態
    if (isVerificationError) {
      setIsVerificationError(false);
      setErrorMessage('');
    }
  };

  return (
    <div className="verification-code-page">
      {/* 頂部導航 */}
      <div className="verification-code-page__header">
        <button 
          className="verification-code-page__back-button"
          onClick={handleBack}
          aria-label="返回"
        >
          <span className="verification-code-page__back-icon">arrow_back</span>
        </button>
        <h1 className="verification-code-page__title">{t('verification.enterVerificationCode')}</h1>
        <div className="verification-code-page__spacer"></div>
      </div>

      {/* 主要內容 */}
      <div className="verification-code-page__content">
        {/* 圖標和標題區域 */}
        <div className="verification-code-page__icon-section">
          <div className="verification-code-page__icon-circle">
            <div className="verification-code-page__icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 21H5V3H13V9H19V21Z" 
                  fill="#00A53E"
                />
              </svg>
            </div>
          </div>
          <h2 className="verification-code-page__subtitle">{t('verification.enterVerificationCode')}</h2>
          <p className="verification-code-page__description">
            {t('verification.verificationCodeDescription', { phoneNumber: '0900000000' })}
          </p>
        </div>

        {/* 驗證碼輸入區域 */}
        <div className="verification-code-page__input-section">
          <label className="verification-code-page__input-label">
            {t('verification.sixDigitCode')}
          </label>
          <div className="verification-code-page__code-inputs">
            {verificationCode.map((digit, index) => (
              <div key={index} className="verification-code-page__input-wrapper">
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleInputFocus(index)}
                  className={`verification-code-page__code-input ${
                    isVerificationError ? 'error' : ''
                  }`}
                  placeholder=""
                  aria-label={`驗證碼第${index + 1}位`}
                />
              </div>
            ))}
          </div>
          {isVerificationError && (
            <div className="verification-code-page__error-message">
              {errorMessage}
            </div>
          )}
        </div>

        {/* 按鈕區域 */}
        <div className="verification-code-page__actions">
          <Button
            className="verification-code-page__verify-button"
            onClick={handleVerify}
            disabled={verificationCode.join('').length !== 6}
          >
            {t('verification.verify')}
          </Button>
          <Button
            className="verification-code-page__resend-button"
            onClick={handleResendCode}
            disabled={isResendDisabled}
          >
            {isResendDisabled 
              ? t('verification.resendCountdown', { countdown: resendCountdown })
              : t('verification.resendVerificationCode')
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodePage;
