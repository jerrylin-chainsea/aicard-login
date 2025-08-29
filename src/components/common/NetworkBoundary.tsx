import React, { useState, useEffect } from 'react'
import { logService } from '@/services/logService'
import { UI, ERROR_CODES } from '@/constants'
import './NetworkBoundary.css'

interface INetworkBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onRetry?: () => void
  onOffline?: () => void
  onOnline?: () => void
}

const NetworkBoundary: React.FC<INetworkBoundaryProps> = ({
  children,
  fallback,
  onRetry,
  onOffline,
  onOnline
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      logService.info('Network connection restored', {
        timestamp: new Date().toISOString()
      })
      setIsOnline(true)
      setHasError(false)
      setErrorMessage(null)
      onOnline?.()
    }

    const handleOffline = () => {
      logService.warn('Network connection lost', {
        timestamp: new Date().toISOString()
      })
      setIsOnline(false)
      setHasError(true)
      setErrorMessage(ERROR_CODES.NETWORK_ERROR)
      onOffline?.()
    }

    // 監聽網路狀態變化
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 檢查初始網路狀態
    if (!navigator.onLine) {
      handleOffline()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOnline, onOffline])

  const handleRetry = () => {
    logService.info('User initiated retry after network error', {
      timestamp: new Date().toISOString()
    })
    
    setHasError(false)
    setErrorMessage(null)
    onRetry?.()
  }

  const handleRefresh = () => {
    logService.info('User initiated page refresh after network error', {
      timestamp: new Date().toISOString()
    })
    window.location.reload()
  }

  // 如果沒有錯誤且網路正常，渲染子組件
  if (!hasError && isOnline) {
    return <>{children}</>
  }

  // 如果有自定義 fallback，使用它
  if (fallback) {
    return <>{fallback}</>
  }

  // 預設的錯誤 UI
  return (
    <div className="network-boundary">
      <div className="network-boundary__container">
        <div className="network-boundary__icon">
          {!isOnline ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44C20.955 52 12 43.045 12 32S20.955 12 32 12s20 8.955 20 20-8.955 20-20 20z"
                fill="#B3261E"
              />
              <path
                d="M32 20c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V22c0-1.1-.9-2-2-2z"
                fill="#B3261E"
              />
              <circle cx="32" cy="42" r="2" fill="#B3261E" />
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44C20.955 52 12 43.045 12 32S20.955 12 32 12s20 8.955 20 20-8.955 20-20 20z"
                fill="#FF9500"
              />
              <path
                d="M32 20c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V22c0-1.1-.9-2-2-2z"
                fill="#FF9500"
              />
              <circle cx="32" cy="42" r="2" fill="#FF9500" />
            </svg>
          )}
        </div>
        
        <h1 className="network-boundary__title">
          {!isOnline ? '網路連線中斷' : '網路連線異常'}
        </h1>
        
        <p className="network-boundary__description">
          {!isOnline 
            ? '請檢查您的網路連線並重試。'
            : '網路連線不穩定，請稍後再試。'
          }
        </p>

        <div className="network-boundary__actions">
          <button
            type="button"
            className="network-boundary__retry-button"
            onClick={handleRetry}
          >
            {UI.TEXT.RETRY}
          </button>
          
          <button
            type="button"
            className="network-boundary__refresh-button"
            onClick={handleRefresh}
          >
            重新整理
          </button>
        </div>

        {!isOnline && (
          <div className="network-boundary__offline-tip">
            <p>💡 提示：請檢查以下項目</p>
            <ul>
              <li>Wi-Fi 或行動網路是否已開啟</li>
              <li>網路連線是否穩定</li>
              <li>是否在飛航模式</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkBoundary
