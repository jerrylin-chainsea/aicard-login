import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { sendVerificationCode, startCountdown, decrementCountdown } from '@/app/slices/verificationSlice'
import { logService } from '@/services/logService'
import { BUSINESS, CONFIG, ROUTES, EVENTS } from '@/constants'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import './PhoneVerificationPage.css'

const PhoneVerificationPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { phoneNumber, isLoading, error, isPhoneVerified, countdown, canResend } = useAppSelector((state: any) => state.verification)
  
  const [localPhoneNumber, setLocalPhoneNumber] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // 記錄頁面訪問
    logService.info('Phone verification page accessed', {
      url: window.location.href,
      timestamp: new Date().toISOString()
    })

    if (isPhoneVerified) {
      setShowSuccessAlert(true)
      setTimeout(() => {
        navigate(ROUTES.VERIFICATION_CODE)
      }, CONFIG.VERIFICATION_TIMEOUT / 30) // 2秒後導航
    }
  }, [isPhoneVerified, navigate])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        dispatch(decrementCountdown())
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [countdown, dispatch])

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalPhoneNumber(value)
    
    // 記錄用戶輸入行為
    logService.debug('Phone number input changed', {
      inputLength: value.length,
      isValid: BUSINESS.VALIDATION.PHONE_NUMBER.test(value)
    })
  }

  const handleSendCode = async () => {
    if (localPhoneNumber.trim()) {
      try {
        logService.info('Sending verification code', {
          phoneNumber: logService.maskPhoneNumber(localPhoneNumber.trim()),
          event: EVENTS.VERIFICATION_START
        })

        dispatch(startCountdown())
        const result = await dispatch(sendVerificationCode(localPhoneNumber.trim()))
        
        if (sendVerificationCode.fulfilled.match(result)) {
          logService.info('Verification code sent successfully', {
            phoneNumber: logService.maskPhoneNumber(localPhoneNumber.trim()),
            event: EVENTS.VERIFICATION_SUCCESS
          })
        } else if (sendVerificationCode.rejected.match(result)) {
          logService.error('Failed to send verification code', {
            phoneNumber: logService.maskPhoneNumber(localPhoneNumber.trim()),
            error: result.error?.message,
            event: EVENTS.VERIFICATION_FAILED
          })
        }
      } catch (error) {
        logService.error('Unexpected error in handleSendCode', {
          phoneNumber: logService.maskPhoneNumber(localPhoneNumber.trim()),
          error: error instanceof Error ? error.message : 'Unknown error'
        }, error instanceof Error ? error : undefined)
      }
    }
  }

  const handleBack = () => {
    logService.info('User navigated back from phone verification', {
      from: ROUTES.PHONE_VERIFICATION,
      to: ROUTES.LINE_AUTH
    })
    navigate(ROUTES.LINE_AUTH)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }

  const isPhoneNumberValid = BUSINESS.VALIDATION.PHONE_NUMBER.test(localPhoneNumber.trim())

  return (
    <div className="phone-verification-page">
      <div className="phone-verification-page__header">
        <div className="phone-verification-page__logo">
          <h1 className="phone-verification-page__title">AiCard</h1>
          <p className="phone-verification-page__subtitle">電子名片助理</p>
        </div>
      </div>

      <div className="phone-verification-page__content">
        <div className="phone-verification-page__card">
          <div className="phone-verification-page__back-button">
            <button
              type="button"
              className="phone-verification-page__back-icon"
              onClick={handleBack}
              aria-label={t('common.back')}
            >
              arrow_back
            </button>
            <div className="phone-verification-page__spacer"></div>
          </div>

          <div className="phone-verification-page__verification-content">
            <div className="phone-verification-page__icon-section">
              <div className="phone-verification-page__verification-icon">
                <div className="phone-verification-page__icon-circle">
                  <svg
                    width="21"
                    height="33"
                    viewBox="0 0 21 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 0H5C3.9 0 3 0.9 3 2V31C3 32.1 3.9 33 5 33H16C17.1 33 18 32.1 18 31V2C18 0.9 17.1 0 16 0ZM16 31H5V2H16V31Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="phone-verification-page__verification-title">
              {t('verification.phoneVerification')}
            </h2>
            <p className="phone-verification-page__verification-description">
              {t('verification.phoneVerificationDescription')}
            </p>

            <div className="phone-verification-page__form">
              <div className="phone-verification-page__form-label">
                <label>{t('verification.phoneNumber')}</label>
              </div>
              
              <div className={`phone-verification-page__phone-input ${isFocused ? 'focused' : ''}`}>
                <div className="phone-verification-page__country-selector">
                  <div className="phone-verification-page__country-flag">🇹🇼</div>
                  <div className="phone-verification-page__country-code">+886</div>
                  <div className="phone-verification-page__dropdown-arrow">
                    <svg
                      width="10"
                      height="5"
                      viewBox="0 0 10 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0L5 5L10 0H0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                
                <input
                  type="tel"
                  placeholder={t('verification.phoneNumberPlaceholder')}
                  value={localPhoneNumber}
                  onChange={handlePhoneNumberChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="phone-verification-page__input-field"
                  maxLength={10}
                  aria-describedby={error ? 'phone-error' : undefined}
                />
              </div>
              
              {error && (
                <div id="phone-error" className="phone-verification-page__error-message" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="phone-verification-page__actions">
            <Button
              variant="primary"
              size="large"
              disabled={!isPhoneNumberValid || isLoading}
              onClick={handleSendCode}
              className="phone-verification-page__send-button"
              loading={isLoading}
            >
              {isLoading ? t('common.loading') : t('verification.sendVerificationCode')}
            </Button>
          </div>
        </div>
      </div>

      {showSuccessAlert && (
        <div className="phone-verification-page__success-alert" role="alert">
          <div className="phone-verification-page__alert-content">
            <div className="phone-verification-page__success-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.707 5.293C17.098 5.684 17.098 6.316 16.707 6.707L8.707 14.707C8.512 14.902 8.256 15 8 15C7.744 15 7.488 14.902 7.293 14.707L3.293 10.707C2.902 10.316 2.902 9.684 3.293 9.293C3.684 8.902 4.316 8.902 4.707 9.293L8 12.586L15.293 5.293C15.684 4.902 16.316 4.902 16.707 5.293Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="phone-verification-page__alert-text">
              {t('verification.verificationCodeSent')}
            </span>
          </div>
        </div>
      )}

      {error && <Toast content={error} type="error" />}
    </div>
  )
}

export default PhoneVerificationPage
