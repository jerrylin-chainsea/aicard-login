import React, { createContext, useContext, useEffect, useState } from 'react'
import { liffService } from '@/services/liffService'

// LIFF 上下文接口
interface ILiffContext {
  isInitialized: boolean
  isLoggedIn: boolean
  isInLineClient: boolean
  profile: any
  error: string | null
  initialize: () => Promise<void>
  login: () => Promise<void>
  logout: () => Promise<void>
}

// 創建 LIFF 上下文
const LiffContext = createContext<ILiffContext | undefined>(undefined)

// LIFF 提供者組件
export const LiffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInLineClient, setIsInLineClient] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // 初始化 LIFF
  const initialize = async () => {
    try {
      setError(null)
      const success = await liffService.initialize()
      
      if (success) {
        const loggedIn = liffService.isUserLoggedIn()
        const inLineClient = liffService.isInLineClient()
        
        setIsInitialized(true)
        setIsLoggedIn(loggedIn)
        setIsInLineClient(inLineClient)

        // 如果已登入，獲取用戶資料
        if (loggedIn) {
          try {
            const userProfile = await liffService.getUserProfile()
            setProfile(userProfile)
          } catch (profileError) {
            console.error('獲取用戶資料失敗:', profileError)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'LIFF 初始化失敗')
      console.error('LIFF 初始化失敗:', err)
    }
  }

  // 登入
  const login = async () => {
    try {
      setError(null)
      await liffService.login()
      
      // 登入成功後重新初始化
      await initialize()
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
      console.error('登入失敗:', err)
    }
  }

  // 登出
  const logout = async () => {
    try {
      setError(null)
      await liffService.logout()
      
      setIsLoggedIn(false)
      setProfile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登出失敗')
      console.error('登出失敗:', err)
    }
  }

  // 組件掛載時初始化
  useEffect(() => {
    initialize()
  }, [])

  const contextValue: ILiffContext = {
    isInitialized,
    isLoggedIn,
    isInLineClient,
    profile,
    error,
    initialize,
    login,
    logout,
  }

  return (
    <LiffContext.Provider value={contextValue}>
      {children}
    </LiffContext.Provider>
  )
}

// 使用 LIFF 上下文的 Hook
export const useLiffContext = () => {
  const context = useContext(LiffContext)
  if (context === undefined) {
    throw new Error('useLiffContext 必須在 LiffProvider 內使用')
  }
  return context
}
