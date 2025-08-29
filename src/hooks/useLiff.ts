import { useState, useEffect, useCallback } from 'react'
// import { liffService } from '@/services/liffService'
// import { LIFF_FEATURES } from '@/constants/liff'

// LIFF 狀態接口
export interface ILiffState {
  isInitialized: boolean
  isLoggedIn: boolean
  isInLineClient: boolean
  isInExternalBrowser: boolean
  isLoading: boolean
  error: string | null
  profile: {
    userId: string | null
    displayName: string | null
    pictureUrl: string | null
    statusMessage: string | null
  } | null
  context: any
  language: string
  version: string
  os: string
  lineVersion: string
}

// LIFF Hook 返回類型
export interface ILiffHookReturn extends ILiffState {
  // 方法
  initialize: () => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
  loadUserProfile: () => Promise<void>
  shareMessage: (messages: any[]) => Promise<boolean>
  scanQRCode: () => Promise<string | null>
  openExternalBrowser: (url: string) => Promise<void>
  getIdToken: () => Promise<string | null>
  getAccessToken: () => Promise<string | null>
  isFeatureAvailable: (feature: string) => boolean
  clearError: () => void
}

// LIFF Hook - 暫時禁用，返回模擬狀態
export const useLiff = (): ILiffHookReturn => {
  const [state, setState] = useState<ILiffState>({
    isInitialized: true, // 直接設為已初始化
    isLoggedIn: false,
    isInLineClient: false,
    isInExternalBrowser: true, // 模擬外部瀏覽器環境
    isLoading: false,
    error: null,
    profile: {
      userId: 'mock_user_123',
      displayName: '張小華',
      pictureUrl: null,
      statusMessage: null,
    },
    context: null,
    language: 'zh-TW',
    version: 'mock',
    os: 'mock',
    lineVersion: 'mock',
  })

  // 初始化 LIFF - 暫時禁用
  const initialize = useCallback(async () => {
    console.log('LIFF 功能暫時禁用，使用模擬狀態')
    // 不需要做任何事情，狀態已經設置好了
  }, [])

  // 載入用戶資料 - 暫時禁用
  const loadUserProfile = useCallback(async () => {
    console.log('載入用戶資料功能暫時禁用')
    // 不需要做任何事情
  }, [])

  // 登入 - 暫時禁用
  const login = useCallback(async () => {
    console.log('LINE 登入功能暫時禁用')
    // 模擬登入成功
    setState(prev => ({
      ...prev,
      isLoggedIn: true,
      profile: {
        userId: 'mock_user_123',
        displayName: '張小華',
        pictureUrl: 'https://via.placeholder.com/96x96/1FB0F0/FFFFFF?text=張',
        statusMessage: '模擬用戶狀態',
      },
    }))
  }, [])

  // 登出 - 暫時禁用
  const logout = useCallback(async () => {
    console.log('登出功能暫時禁用')
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
      profile: {
        userId: 'mock_user_123',
        displayName: '張小華',
        pictureUrl: null,
        statusMessage: null,
      },
    }))
  }, [])

  // 分享訊息 - 暫時禁用
  const shareMessage = useCallback(async (messages: any[]) => {
    console.log('分享功能暫時禁用')
    return false
  }, [])

  // 掃描 QR Code - 暫時禁用
  const scanQRCode = useCallback(async () => {
    console.log('掃描功能暫時禁用')
    return null
  }, [])

  // 開啟外部瀏覽器 - 暫時禁用
  const openExternalBrowser = useCallback(async (url: string) => {
    console.log('開啟外部瀏覽器功能暫時禁用，URL:', url)
    // 在開發環境中，可以選擇是否真的開啟新視窗
    if (import.meta.env.DEV) {
      window.open(url, '_blank')
    }
  }, [])

  // 獲取 ID Token - 暫時禁用
  const getIdToken = useCallback(async () => {
    console.log('獲取 ID Token 功能暫時禁用')
    return 'mock_id_token'
  }, [])

  // 獲取 Access Token - 暫時禁用
  const getAccessToken = useCallback(async () => {
    console.log('獲取 Access Token 功能暫時禁用')
    return 'mock_access_token'
  }, [])

  // 檢查功能是否可用 - 暫時禁用
  const isFeatureAvailable = useCallback((feature: string) => {
    console.log('功能檢查暫時禁用，功能:', feature)
    // 返回模擬的功能可用性
    const mockFeatures = {
      'ENABLE_LINE_LOGIN': true,
      'ENABLE_PROFILE': true,
      'ENABLE_FRIENDS': false,
      'ENABLE_GROUPS': false,
      'ENABLE_SHARE': false,
      'ENABLE_SCAN_QR': false,
      'ENABLE_PAYMENT': false,
    }
    return mockFeatures[feature as keyof typeof mockFeatures] || false
  }, [])

  // 清除錯誤
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // 組件掛載時初始化 - 暫時禁用
  useEffect(() => {
    console.log('LIFF 初始化已禁用，使用模擬狀態')
    // 不需要做任何事情，狀態已經設置好了
  }, [])

  return {
    // 狀態
    ...state,
    
    // 方法
    initialize,
    login,
    logout,
    loadUserProfile,
    shareMessage,
    scanQRCode,
    openExternalBrowser,
    getIdToken,
    getAccessToken,
    isFeatureAvailable,
    clearError,
  }
}
