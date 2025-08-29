// import liff from '@line/liff'
// import { LIFF_CONFIG, LIFF_FEATURES, LIFF_ERROR_MESSAGES } from '@/constants/liff'

// LIFF 服務類 - 暫時禁用，返回模擬數據
export class LiffService {
  private static instance: LiffService
  private isInitialized = true // 直接設為已初始化
  private isLoggedIn = false

  private constructor() {}

  // 單例模式
  public static getInstance(): LiffService {
    if (!LiffService.instance) {
      LiffService.instance = new LiffService()
    }
    return LiffService.instance
  }

  // 初始化 LIFF - 暫時禁用
  public async initialize(): Promise<boolean> {
    console.log('LiffService: LIFF 功能暫時禁用，使用模擬狀態')
    this.isInitialized = true
    this.isLoggedIn = false
    return true
  }

  // 檢查是否已登入 - 暫時禁用
  public isUserLoggedIn(): boolean {
    console.log('LiffService: 登入檢查功能暫時禁用')
    return this.isLoggedIn
  }

  // 獲取用戶個人資料 - 暫時禁用
  public async getUserProfile() {
    console.log('LiffService: 獲取用戶資料功能暫時禁用')
    return {
      userId: 'mock_user_123',
      displayName: '張小華',
      pictureUrl: 'https://via.placeholder.com/96x96/1FB0F0/FFFFFF?text=張',
      statusMessage: '模擬用戶狀態',
    }
  }

  // 獲取 ID Token - 暫時禁用
  public async getIdToken(): Promise<string | null> {
    console.log('LiffService: 獲取 ID Token 功能暫時禁用')
    return 'mock_id_token'
  }

  // 獲取 Access Token - 暫時禁用
  public async getAccessToken(): Promise<string | null> {
    console.log('LiffService: 獲取 Access Token 功能暫時禁用')
    return 'mock_access_token'
  }

  // 登入 - 暫時禁用
  public async login(): Promise<void> {
    console.log('LiffService: 登入功能暫時禁用')
    this.isLoggedIn = true
  }

  // 登出 - 暫時禁用
  public async logout(): Promise<void> {
    console.log('LiffService: 登出功能暫時禁用')
    this.isLoggedIn = false
  }

  // 分享訊息 - 暫時禁用
  public async shareMessage(messages: any[]): Promise<boolean> {
    console.log('LiffService: 分享訊息功能暫時禁用')
    return false
  }

  // 掃描 QR Code - 暫時禁用
  public async scanQRCode(): Promise<string | null> {
    console.log('LiffService: 掃描 QR Code 功能暫時禁用')
    return null
  }

  // 開啟外部瀏覽器 - 暫時禁用
  public async openExternalBrowser(url: string): Promise<void> {
    console.log('LiffService: 開啟外部瀏覽器功能暫時禁用，URL:', url)
    // 在開發環境中，可以選擇是否真的開啟新視窗
    if (import.meta.env.DEV) {
      window.open(url, '_blank')
    }
  }

  // 獲取 LIFF 上下文 - 暫時禁用
  public getContext() {
    console.log('LiffService: 獲取 LIFF 上下文功能暫時禁用')
    return {
      type: 'external',
      viewType: 'full',
      userId: 'mock_user_123',
      utouId: null,
      roomId: null,
      groupId: null,
    }
  }

  // 檢查是否在 LINE 應用內 - 暫時禁用
  public isInLineClient(): boolean {
    console.log('LiffService: LINE 應用內檢查功能暫時禁用')
    return false
  }

  // 檢查是否在外部瀏覽器 - 暫時禁用
  public isInExternalBrowser(): boolean {
    console.log('LiffService: 外部瀏覽器檢查功能暫時禁用')
    return true
  }

  // 獲取語言設定 - 暫時禁用
  public getLanguage(): string {
    console.log('LiffService: 獲取語言設定功能暫時禁用')
    return 'zh-TW'
  }

  // 獲取版本 - 暫時禁用
  public getVersion(): string {
    console.log('LiffService: 獲取版本功能暫時禁用')
    return 'mock'
  }

  // 獲取 OS 資訊 - 暫時禁用
  public getOS(): string {
    console.log('LiffService: 獲取 OS 資訊功能暫時禁用')
    return 'mock'
  }

  // 獲取 LINE 版本 - 暫時禁用
  public getLineVersion(): string {
    console.log('LiffService: 獲取 LINE 版本功能暫時禁用')
    return 'mock'
  }

  // 檢查功能是否可用 - 暫時禁用
  public isFeatureAvailable(feature: string): boolean {
    console.log('LiffService: 功能檢查暫時禁用，功能:', feature)
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
  }
}

// 導出單例實例
export const liffService = LiffService.getInstance()
