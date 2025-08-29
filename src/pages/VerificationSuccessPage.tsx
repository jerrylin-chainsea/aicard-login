import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import './VerificationSuccessPage.css';

const VerificationSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackToLine = () => {
    // 在開發環境中，導航回首頁
    if (import.meta.env.DEV) {
      navigate('/');
      return;
    }

    // 在生產環境中，嘗試關閉視窗或導航回首頁
    try {
      // 檢查是否在 iframe 中
      if (window.self !== window.top) {
        // 如果在 iframe 中，導航回首頁
        navigate('/');
        return;
      }

      // 嘗試關閉視窗
      window.close();
      
      // 如果關閉失敗，導航回首頁
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (error) {
      console.log('無法關閉視窗，導航回首頁');
      navigate('/');
    }
  };

  return (
    <div className="verification-success-page">
      {/* 頂部 Logo 區域 */}
      <div className="verification-success-page__header">
        <div className="verification-success-page__logo">
          <h1 className="verification-success-page__title">AiCard</h1>
          <p className="verification-success-page__subtitle">電子名片助理</p>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="verification-success-page__content">
        <div className="verification-success-page__card">
          {/* 成功內容區域 */}
          <div className="verification-success-page__success-content">
            <div className="verification-success-page__icon-section">
              <div className="verification-success-page__icon-circle">
                <div className="verification-success-page__icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="verification-success-page__success-title">
              {t('verification.verificationSuccess')}
            </h2>
            <p className="verification-success-page__success-description">
              {t('verification.verificationSuccessDescription')}
            </p>
          </div>

          {/* 按鈕區域 */}
          <div className="verification-success-page__actions">
            <Button
              className="verification-success-page__back-button"
              onClick={handleBackToLine}
            >
              {t('verification.backToLine')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccessPage;
