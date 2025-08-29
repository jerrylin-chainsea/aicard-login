import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import './WelcomePage.css'

const WelcomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // 本地狀態管理 - 模擬原本的 Redux 狀態
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 模擬用戶資料 - 原本從 LIFF 獲取
  const mockProfile = {
    userId: 'mock_user_123',
    displayName: '張小華',
    pictureUrl: null,
    statusMessage: null,
  }

  // 模擬初始化 - 原本是 Redux 的 initializeAuth
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const handleAgreeToTerms = () => {
    setHasAgreedToTerms(!hasAgreedToTerms)
  }

  const handleLineLogin = async () => {
    if (hasAgreedToTerms) {
      try {
        setIsLoading(true)
        
        if (isLoggedIn) {
          // 如果已經登入，直接導向下一個頁面
          navigate('/line-auth')
        } else {
          // 模擬登入成功
          await new Promise(resolve => setTimeout(resolve, 1000))
          setIsLoggedIn(true)
          setIsLoading(false)
          
          // 登入成功後導向下一頁
          navigate('/line-auth')
        }
      } catch (error) {
        console.error('登入失敗:', error)
        setError('登入失敗，請稍後再試')
        setIsLoading(false)
      }
    }
  }

  const handleTermsClick = () => {
    // 這裡應該導向服務條款頁面
    console.log('導向服務條款頁面')
  }

  const handlePrivacyClick = () => {
    // 這裡應該導向隱私政策頁面
    console.log('導向隱私政策頁面')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  // 如果正在載入，顯示載入狀態
  if (isLoading) {
    return (
      <div className="welcome-page">
        <div className="welcome-page__loading">
          <div className="welcome-page__spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // 如果有錯誤，顯示錯誤狀態
  if (error) {
    return (
      <div className="welcome-page">
        <div className="welcome-page__error">
          <p>{error}</p>
          <Button onClick={() => setError(null)}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="welcome-page">
      <div className="welcome-page__header">
        <div className="welcome-page__logo">
          <h1 className="welcome-page__title">AiCard</h1>
          <p className="welcome-page__subtitle">電子名片助理</p>
        </div>
      </div>

      <div className="welcome-page__content">
        <div className="welcome-page__card">
          <h2 className="welcome-page__welcome-text">{t('auth.welcome')}</h2>
          
          <div className="welcome-page__user-info">
            <div className="welcome-page__avatar">
              {mockProfile.pictureUrl ? (
                <img src={mockProfile.pictureUrl} alt="用戶頭像" />
              ) : (
                <div className="welcome-page__avatar-placeholder"></div>
              )}
            </div>
            <div className="welcome-page__user-details">
              <h3 className="welcome-page__user-name">
                {mockProfile.displayName}
              </h3>
              
            </div>
          </div>

          <div className="welcome-page__terms">
            <button
              type="button"
              className={`welcome-page__checkbox ${hasAgreedToTerms ? 'checked' : ''}`}
              onClick={handleAgreeToTerms}
              aria-label="同意服務條款和隱私政策"
            />
            <p className="welcome-page__terms-text">
              我已閱讀並同意{' '}
              <button
                type="button"
                className="welcome-page__link"
                onClick={handleTermsClick}
              >
                {t('auth.termsOfService')}
              </button>
              {' '}和{' '}
              <button
                type="button"
                className="welcome-page__link"
                onClick={handlePrivacyClick}
              >
                {t('auth.privacyPolicy')}
              </button>
            </p>
          </div>

          <Button
            variant="primary"
            size="large"
            disabled={!hasAgreedToTerms}
            onClick={handleLineLogin}
            className="welcome-page__login-button"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <div 
              className="welcome-page__line-icon"
              style={{
                order: 1,
                flexShrink: 0
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.346 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="#F5F5F5"/>
              </svg>
            </div>
            <span
              style={{
                order: 2
              }}
            >
              {isLoggedIn ? '繼續使用' : t('auth.lineLogin')}
            </span>
          </Button>

          {isLoggedIn && (
            <Button
              variant="secondary"
              size="medium"
              onClick={handleLogout}
              className="welcome-page__logout-button"
            >
              登出
            </Button>
          )}

          
        </div>
      </div>

      {/* 錯誤提示 */}
      {error && (
        <Toast 
          content={error} 
          type="error" 
        />
      )}
    </div>
  )
}

export default WelcomePage
