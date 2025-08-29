import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logService } from '@/services/logService'
import { UI, ERROR_CODES } from '@/constants'

interface IErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface IErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<IErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤到日誌服務
    logService.error('React Error Boundary caught an error', {
      componentStack: errorInfo.componentStack,
      url: window.location.href
    }, error)

    // 調用可選的錯誤處理回調
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // 自定義錯誤 UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默認錯誤 UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
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
            </div>
            
            <h1 className="error-boundary__title">
              {UI.TEXT.ERROR}
            </h1>
            
            <p className="error-boundary__description">
              抱歉，發生了一些問題。請稍後再試。
            </p>

            {import.meta.env?.DEV && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__summary">
                  開發者資訊
                </summary>
                <div className="error-boundary__error-info">
                  <p><strong>錯誤訊息：</strong>{this.state.error.message}</p>
                  <p><strong>錯誤堆疊：</strong></p>
                  <pre className="error-boundary__stack">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <p><strong>組件堆疊：</strong></p>
                  )}
                  <pre className="error-boundary__stack">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="error-boundary__actions">
              <button
                type="button"
                className="error-boundary__retry-button"
                onClick={this.handleRetry}
              >
                重試
              </button>
              
              <button
                type="button"
                className="error-boundary__home-button"
                onClick={this.handleGoHome}
              >
                回到首頁
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
