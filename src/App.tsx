import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd-mobile'
import zhTW from 'antd-mobile/es/locales/zh-TW'
import { I18nextProvider } from 'react-i18next'
import { store } from './app/store'
import i18n from './locales/i18n'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

// 懶加載頁面組件
const WelcomePage = React.lazy(() => import('./pages/WelcomePage'))
const LineAuthPage = React.lazy(() => import('./pages/LineAuthPage'))
const PhoneVerificationPage = React.lazy(() => import('./pages/PhoneVerificationPage'))
const VerificationCodePage = React.lazy(() => import('./pages/VerificationCodePage'))
const VerificationSuccessPage = React.lazy(() => import('./pages/VerificationSuccessPage'))

// 載入中組件
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="loading-spinner__content">
      <div className="loading-spinner__spinner"></div>
      <p>載入中...</p>
    </div>
  </div>
)

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ConfigProvider locale={zhTW}>
            <div className="app">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/line-auth" element={<LineAuthPage />} />
                  <Route path="/phone-verification" element={<PhoneVerificationPage />} />
                  <Route path="/verification-code" element={<VerificationCodePage />} />
                  <Route path="/verification-success" element={<VerificationSuccessPage />} />
                </Routes>
              </Suspense>
            </div>
          </ConfigProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
