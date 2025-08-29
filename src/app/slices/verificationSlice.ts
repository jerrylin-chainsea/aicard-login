import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { logService } from '@/services/logService'
import { BUSINESS, CONFIG, ERROR_CODES } from '@/constants'

export interface IVerificationState {
  phoneNumber: string
  verificationCode: string
  isPhoneVerified: boolean
  isCodeVerified: boolean
  isLoading: boolean
  error: string | null
  countdown: number
  canResend: boolean
}

const initialState: IVerificationState = {
  phoneNumber: '',
  verificationCode: '',
  isPhoneVerified: false,
  isCodeVerified: false,
  isLoading: false,
  error: null,
  countdown: 0,
  canResend: true,
}

export const sendVerificationCode = createAsyncThunk(
  'verification/sendCode',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      logService.info('Starting verification code sending process', {
        phoneNumber: logService.maskPhoneNumber(phoneNumber),
        timestamp: new Date().toISOString()
      })

      // 模擬發送驗證碼
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!phoneNumber || !BUSINESS.VALIDATION.PHONE_NUMBER.test(phoneNumber)) {
        const error = new Error('手機號碼格式不正確')
        logService.error('Phone number validation failed', {
          phoneNumber: logService.maskPhoneNumber(phoneNumber),
          error: error.message
        }, error)
        throw error
      }
      
      logService.info('Verification code sent successfully', {
        phoneNumber: logService.maskPhoneNumber(phoneNumber),
        timestamp: new Date().toISOString()
      })
      
      return { success: true, phoneNumber }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '發送驗證碼失敗'
      logService.error('Failed to send verification code', {
        phoneNumber: logService.maskPhoneNumber(phoneNumber),
        error: errorMessage
      }, error instanceof Error ? error : undefined)
      
      return rejectWithValue(errorMessage)
    }
  }
)

export const verifyCode = createAsyncThunk(
  'verification/verifyCode',
  async (code: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { verification: IVerificationState }
      const phoneNumber = state.verification.phoneNumber
      
      logService.info('Starting verification code verification', {
        phoneNumber: logService.maskPhoneNumber(phoneNumber),
        codeLength: code.length,
        timestamp: new Date().toISOString()
      })

      // 模擬驗證碼驗證
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!code || code.length !== CONFIG.VERIFICATION_CODE_LENGTH) {
        const error = new Error('驗證碼格式不正確')
        logService.error('Verification code format validation failed', {
          phoneNumber: logService.maskPhoneNumber(phoneNumber),
          codeLength: code.length,
          expectedLength: CONFIG.VERIFICATION_CODE_LENGTH,
          error: error.message
        }, error)
        throw error
      }
      
      // 模擬驗證失敗的情況
      if (code === '000000') {
        const error = new Error('驗證碼不正確')
        logService.error('Verification code verification failed', {
          phoneNumber: logService.maskPhoneNumber(phoneNumber),
          code: code,
          error: error.message
        }, error)
        throw error
      }
      
      logService.info('Verification code verified successfully', {
        phoneNumber: logService.maskPhoneNumber(phoneNumber),
        codeLength: code.length,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, code }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '驗證碼驗證失敗'
      logService.error('Verification code verification failed', {
        code: code,
        error: errorMessage
      }, error instanceof Error ? error : undefined)
      
      return rejectWithValue(errorMessage)
    }
  }
)

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload
      logService.debug('Phone number updated in state', {
        phoneNumber: logService.maskPhoneNumber(action.payload),
        timestamp: new Date().toISOString()
      })
    },
    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload
      logService.debug('Verification code updated in state', {
        codeLength: action.payload.length,
        timestamp: new Date().toISOString()
      })
    },
    clearError: (state) => {
      if (state.error) {
        logService.info('Error cleared from verification state', {
          previousError: state.error,
          timestamp: new Date().toISOString()
        })
      }
      state.error = null
    },
    startCountdown: (state) => {
      state.countdown = CONFIG.RESEND_COUNTDOWN
      state.canResend = false
      logService.debug('Countdown started for resend verification code', {
        countdown: CONFIG.RESEND_COUNTDOWN,
        timestamp: new Date().toISOString()
      })
    },
    decrementCountdown: (state) => {
      if (state.countdown > 0) {
        state.countdown -= 1
        if (state.countdown === 0) {
          state.canResend = true
          logService.debug('Countdown finished, resend enabled', {
            timestamp: new Date().toISOString()
          })
        }
      }
    },
    resetVerification: (state) => {
      logService.info('Verification state reset', {
        phoneNumber: logService.maskPhoneNumber(state.phoneNumber),
        timestamp: new Date().toISOString()
      })
      
      state.verificationCode = ''
      state.isPhoneVerified = false
      state.isCodeVerified = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendVerificationCode.pending, (state) => {
        state.isLoading = true
        state.error = null
        logService.debug('Verification code sending started', {
          timestamp: new Date().toISOString()
        })
      })
      .addCase(sendVerificationCode.fulfilled, (state, action) => {
        state.isLoading = false
        state.isPhoneVerified = true
        state.phoneNumber = action.payload.phoneNumber
        logService.info('Verification code sending completed successfully', {
          phoneNumber: logService.maskPhoneNumber(action.payload.phoneNumber),
          timestamp: new Date().toISOString()
        })
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        logService.error('Verification code sending failed', {
          error: action.payload as string,
          timestamp: new Date().toISOString()
        })
      })
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true
        state.error = null
        logService.debug('Verification code verification started', {
          timestamp: new Date().toISOString()
        })
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.isLoading = false
        state.isCodeVerified = true
        logService.info('Verification code verification completed successfully', {
          timestamp: new Date().toISOString()
        })
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        logService.error('Verification code verification failed', {
          error: action.payload as string,
          timestamp: new Date().toISOString()
        })
      })
  },
})

export const {
  setPhoneNumber,
  setVerificationCode,
  clearError,
  startCountdown,
  decrementCountdown,
  resetVerification,
} = verificationSlice.actions

export default verificationSlice.reducer
