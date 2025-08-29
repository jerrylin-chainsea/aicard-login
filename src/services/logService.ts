// 日誌服務 - 簡化版本，避免瀏覽器環境問題
// 每個核心代碼文件需自動引入 logService
// 使用 debug、info、warn、error 四個級別

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface ILogContext {
  userId?: string
  tenantId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  timestamp: string
  [key: string]: any
}

export interface ILogEntry {
  level: LogLevel
  message: string
  context: ILogContext
  error?: Error
  stack?: string
}

class LogService {
  // 簡化版本，避免環境檢測問題
  private isDevelopment = true
  private isProduction = false

  constructor() {
    // 簡化初始化
  }

  private createContext(additionalContext: Partial<ILogContext> = {}): ILogContext {
    return {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ...additionalContext
    }
  }

  private formatLogEntry(entry: ILogEntry): string {
    const { level, message, context, error } = entry
    const timestamp = context.timestamp
    const contextStr = Object.entries(context)
      .filter(([key]) => key !== 'timestamp')
      .map(([key, value]) => `${key}=${value}`)
      .join(' ')
    
    let logStr = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    if (contextStr) logStr += ` | ${contextStr}`
    if (error) logStr += ` | Error: ${error.message}`
    
    return logStr
  }

  private log(level: LogLevel, message: string, context: Partial<ILogContext> = {}, error?: Error) {
    const logContext = this.createContext(context)
    const logEntry: ILogEntry = {
      level,
      message,
      context: logContext,
      error,
      stack: error?.stack
    }

    // 格式化日誌
    const formattedLog = this.formatLogEntry(logEntry)

    // 控制台輸出
    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) console.debug(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedLog)
        break
    }
  }

  // 公共方法
  debug(message: string, context: Partial<ILogContext> = {}) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context: Partial<ILogContext> = {}) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context: Partial<ILogContext> = {}) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context: Partial<ILogContext> = {}, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, context: Partial<ILogContext> = {}, error?: Error) {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // 工具方法
  maskPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber || phoneNumber.length < 4) {
      return '***'
    }
    return phoneNumber.substring(0, 2) + '****' + phoneNumber.substring(phoneNumber.length - 2)
  }

  // 簡化的 Sentry 上報（暫時禁用）
  reportToSentry(entry: ILogEntry) {
    // 暫時禁用 Sentry 上報
    console.log('Sentry reporting disabled:', entry)
  }
}

// 導出單例實例
export const logService = new LogService()
