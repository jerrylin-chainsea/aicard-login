// LIFF 相關常量配置 - 暫時禁用
// export const LIFF_CONFIG = {
//   // LIFF ID - 從環境變數獲取，fallback 到默認值
//   LIFF_ID: import.meta.env.VITE_LIFF_ID || '2007967311-2z7mQ9Rb',
//   
//   // LIFF 環境
//   LIFF_ENV: import.meta.env.VITE_LIFF_ENV || 'development',
//   
//   // 支援的登入方式
//   LOGIN_METHODS: {
//     LINE: 'line',
//     GOOGLE: 'google',
//     FACEBOOK: 'facebook',
//   },
//   
//   // 權限範圍
//   SCOPE: 'profile openid',
//   
//   // 重定向 URI - 根據環境動態設置
//   REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || 
//     (import.meta.env.DEV ? 'http://localhost:3001' : 'https://golden-piroshki-ffaed2.netlify.app/'),
//   
//   // 開發環境 fallback 模式
//   ENABLE_DEV_FALLBACK: import.meta.env.DEV,
// } as const

// 模擬 LIFF 配置
export const LIFF_CONFIG = {
  LIFF_ID: 'mock_liff_id',
  LIFF_ENV: 'development',
  LOGIN_METHODS: {
    LINE: 'line',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
  },
  SCOPE: 'profile openid',
  REDIRECT_URI: 'http://localhost:3001',
  ENABLE_DEV_FALLBACK: true,
} as const

// LIFF 功能開關 - 暫時禁用
// export const LIFF_FEATURES = {
//   // 是否啟用 LINE 登入
//   ENABLE_LINE_LOGIN: true,
//   
//   // 是否啟用個人資料獲取
//   ENABLE_PROFILE: true,
//   
//   // 是否啟用好友列表
//   ENABLE_FRIENDS: false,
//   
//   // 是否啟用群組功能
//   ENABLE_GROUPS: false,
//   
//   // 是否啟用分享功能
//   ENABLE_SHARE: true,
//   
//   // 是否啟用掃描 QR Code
//   ENABLE_SCAN_QR: false,
//   
//   // 是否啟用支付功能
//   ENABLE_PAYMENT: false,
// } as const

// 模擬 LIFF 功能開關
export const LIFF_FEATURES = {
  ENABLE_LINE_LOGIN: false,
  ENABLE_PROFILE: false,
  ENABLE_FRIENDS: false,
  ENABLE_GROUPS: false,
  ENABLE_SHARE: false,
  ENABLE_SCAN_QR: false,
  ENABLE_PAYMENT: false,
} as const

// LIFF 錯誤訊息 - 暫時禁用
// export const LIFF_ERROR_MESSAGES = {
//   INIT_FAILED: 'LIFF 初始化失敗',
//   NOT_IN_CLIENT: '請在 LINE 應用內開啟',
//   UNAUTHORIZED: '未授權訪問',
//   FORBIDDEN: '禁止訪問',
//   INVALID_ID_TOKEN: '無效的 ID Token',
//   UNAVAILABLE: '服務暫時不可用',
//   INVALID_ARGUMENT: '無效的參數',
//   UNABLE_TO_PARSE_PARAM: '無法解析參數',
//   OPEN_WINDOW_FAILED: '開啟視窗失敗',
//   INVALID_RESPONSE: '無效的回應',
//   INVALID_REQUEST: '無效的請求',
//   OAUTH_ERROR: 'OAuth 錯誤',
//   INVALID_ACCESS_TOKEN: '無效的 Access Token',
//   QUOTA_EXCEEDED: '配額超限',
//   UNAVAILABLE_DEVICE: '設備不可用',
//   UNAVAILABLE_USER: '用戶不可用',
//   UNAUTHORIZED_DEVICE: '設備未授權',
//   UNAUTHORIZED_USER: '用戶未授權',
//   MATCH_TALK_NOT_FOUND: '找不到對應的聊天',
//   INVALID_CONTEXT: '無效的上下文',
//   INVALID_ID_TOKEN_HINT: '無效的 ID Token Hint',
//   INVALID_CONSENT: '無效的同意',
//   BLOCKED_USER: '用戶被封鎖',
// } as const

// 模擬 LIFF 錯誤訊息
export const LIFF_ERROR_MESSAGES = {
  INIT_FAILED: 'LIFF 功能暫時禁用',
  NOT_IN_CLIENT: 'LIFF 功能暫時禁用',
  UNAUTHORIZED: 'LIFF 功能暫時禁用',
  FORBIDDEN: 'LIFF 功能暫時禁用',
  INVALID_ID_TOKEN: 'LIFF 功能暫時禁用',
  UNAVAILABLE: 'LIFF 功能暫時禁用',
  INVALID_ARGUMENT: 'LIFF 功能暫時禁用',
  UNABLE_TO_PARSE_PARAM: 'LIFF 功能暫時禁用',
  OPEN_WINDOW_FAILED: 'LIFF 功能暫時禁用',
  INVALID_RESPONSE: 'LIFF 功能暫時禁用',
  INVALID_REQUEST: 'LIFF 功能暫時禁用',
  OAUTH_ERROR: 'LIFF 功能暫時禁用',
  INVALID_ACCESS_TOKEN: 'LIFF 功能暫時禁用',
  QUOTA_EXCEEDED: 'LIFF 功能暫時禁用',
  UNAVAILABLE_DEVICE: 'LIFF 功能暫時禁用',
  UNAVAILABLE_USER: 'LIFF 功能暫時禁用',
  UNAUTHORIZED_DEVICE: 'LIFF 功能暫時禁用',
  UNAUTHORIZED_USER: 'LIFF 功能暫時禁用',
  MATCH_TALK_NOT_FOUND: 'LIFF 功能暫時禁用',
  INVALID_CONTEXT: 'LIFF 功能暫時禁用',
  INVALID_ID_TOKEN_HINT: 'LIFF 功能暫時禁用',
  INVALID_CONSENT: 'LIFF 功能暫時禁用',
  BLOCKED_USER: 'LIFF 功能暫時禁用',
} as const
