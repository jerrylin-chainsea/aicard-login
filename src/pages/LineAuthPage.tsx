import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import './LineAuthPage.css';

const LineAuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleAgreeAndContinue = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 調用 LINE 授權 API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 調用
      
      Toast.show({
        content: '授權成功',
        position: 'center',
      });
      
      // 導航到手機驗證頁面
      navigate('/phone-verification');
    } catch (error) {
      Toast.show({
        content: '授權失敗，請重試',
        position: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="line-auth-page">
      {/* 頂部 Logo 區域 */}
      <div className="line-auth-page__header">
        <div className="line-auth-page__logo">
          <h1 className="line-auth-page__title">AiCard</h1>
          <p className="line-auth-page__subtitle">電子名片助理</p>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="line-auth-page__content">
        <div className="line-auth-page__card">
          {/* 返回按鈕區域 */}
          <div className="line-auth-page__back-button">
            <button
              type="button"
              className="line-auth-page__back-icon"
              onClick={handleBack}
              aria-label="返回"
            >
              arrow_back
            </button>
            <div className="line-auth-page__spacer"></div>
          </div>

          {/* 授權內容區域 */}
          <div className="line-auth-page__auth-content">
            <div className="line-auth-page__icon-section">
              <div className="line-auth-page__icon-circle">
                <div className="line-auth-page__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                      fill="#06B902"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="line-auth-page__auth-title">
              {t('auth.lineDataAuth')}
            </h2>
            <p className="line-auth-page__auth-description">
              {t('auth.lineDataDescription')}
            </p>

            {/* 授權項目列表 */}
            <div className="line-auth-page__permissions">
              <div className="line-auth-page__permission-item">
                <div className="line-auth-page__permission-dot"></div>
                <span className="line-auth-page__permission-text">
                  {t('auth.basicProfile')}
                </span>
              </div>
              <div className="line-auth-page__permission-item">
                <div className="line-auth-page__permission-dot"></div>
                <span className="line-auth-page__permission-text">
                  {t('auth.userId')}
                </span>
              </div>
            </div>
          </div>

          {/* 按鈕區域 */}
          <div className="line-auth-page__actions">
            <Button
              className="line-auth-page__agree-button"
              onClick={handleAgreeAndContinue}
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : t('auth.agreeAndContinue')}
            </Button>
            <Button
              className="line-auth-page__cancel-button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineAuthPage;
