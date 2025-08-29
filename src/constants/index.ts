// 常量管理文件 - 按照 PROCESS.md 規範要求
// 所有硬編碼值必須使用常量，禁止在代碼中直接使用字符串

// API 接口路徑
export const API_ENDPOINTS = {
  // 認證相關
  LINE_AUTH: '/api/auth/line',
  PHONE_VERIFICATION: '/api/verification/phone',
  VERIFICATION_CODE: '/api/verification/code',
  VERIFICATION_VERIFY: '/api/verification/verify',
  
  // 用戶相關
  USER_PROFILE: '/api/user/profile',
  USER_UPDATE: '/api/user/update',
} as const;

// 存儲鍵名
export const STORAGE_KEYS = {
  // LocalStorage
  AUTH_TOKEN: 'aicard_auth_token',
  USER_PROFILE: 'aicard_user_profile',
  AGREED_TO_TERMS: 'aicard_agreed_to_terms',
  
  // SessionStorage
  VERIFICATION_PHONE: 'aicard_verification_phone',
  VERIFICATION_ATTEMPTS: 'aicard_verification_attempts',
  
  // Cookie
  SESSION_ID: 'aicard_session_id',
  LANGUAGE: 'aicard_language',
} as const;

// 配置參數
export const CONFIG = {
  // 超時時間
  API_TIMEOUT: 30000, // 30秒
  VERIFICATION_TIMEOUT: 60000, // 60秒
  
  // 重試次數
  MAX_RETRY_COUNT: 3,
  MAX_VERIFICATION_ATTEMPTS: 5,
  
  // 分頁大小
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // 文件限制
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // 驗證碼
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_EXPIRE: 300000, // 5分鐘
  RESEND_COUNTDOWN: 60, // 60秒
} as const;

// UI 常量
export const UI = {
  // 顏色值
  COLORS: {
    PRIMARY: '#2263EB',
    SUCCESS: '#00A53E',
    WARNING: '#FF9500',
    ERROR: '#B3261E',
    LINE_GREEN: '#00B900',
    BACKGROUND_GRADIENT: 'linear-gradient(90deg, rgba(16, 163, 233, 1) 0%, rgba(37, 100, 234, 1) 100%)',
  },
  
  // UI 文字常量
  TEXT: {
    LOADING: '載入中...',
    ERROR: '發生錯誤',
    SUCCESS: '操作成功',
    CONFIRM: '確認',
    CANCEL: '取消',
    BACK: '返回',
    SUBMIT: '提交',
    SAVE: '儲存',
    DELETE: '刪除',
    EDIT: '編輯',
    CLOSE: '關閉',
    RETRY: '重試',
  } as const,
  
  // 尺寸參數
  SIZES: {
    BORDER_RADIUS: {
      SMALL: 8,
      MEDIUM: 12,
      LARGE: 20,
    },
    PADDING: {
      SMALL: 8,
      MEDIUM: 16,
      LARGE: 24,
    },
    MARGIN: {
      SMALL: 8,
      MEDIUM: 16,
      LARGE: 24,
    },
    SHADOW: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
} as const;

// 業務常量
export const BUSINESS = {
  // 支持格式
  SUPPORTED_LANGUAGES: ['zh-TW', 'zh-CN', 'en-US'] as const,
  DEFAULT_LANGUAGE: 'zh-TW' as const,
  
  // 狀態值
  VERIFICATION_STATUS: {
    PENDING: 'pending',
    SENT: 'sent',
    VERIFIED: 'verified',
    FAILED: 'failed',
    EXPIRED: 'expired',
  } as const,
  
  // 枚舉值
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  } as const,
  
  // 驗證規則
  VALIDATION: {
    PHONE_NUMBER: /^09\d{8}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
} as const;

// 路由路徑
export const ROUTES = {
  HOME: '/',
  LINE_AUTH: '/line-auth',
  PHONE_VERIFICATION: '/phone-verification',
  VERIFICATION_CODE: '/verification-code',
  VERIFICATION_SUCCESS: '/verification-success',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// 錯誤代碼
export const ERROR_CODES = {
  // 認證錯誤
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // 驗證錯誤
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_CODE: 'INVALID_CODE',
  CODE_EXPIRED: 'CODE_EXPIRED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  
  // 網絡錯誤
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // 業務錯誤
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PHONE_ALREADY_EXISTS: 'PHONE_ALREADY_EXISTS',
  INVALID_OPERATION: 'INVALID_OPERATION',
} as const;

// 事件名稱
export const EVENTS = {
  // 用戶事件
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  USER_UPDATE: 'user_update',
  
  // 驗證事件
  VERIFICATION_START: 'verification_start',
  VERIFICATION_SUCCESS: 'verification_success',
  VERIFICATION_FAILED: 'verification_failed',
  VERIFICATION_RESEND: 'verification_resend',
  
  // 頁面事件
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  ERROR_OCCURRED: 'error_occurred',
} as const;
