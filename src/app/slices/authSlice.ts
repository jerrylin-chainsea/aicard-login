import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface IAuthState {
  isAuthenticated: boolean
  userId: string | null
  displayName: string | null
  avatarUrl: string | null
  roles: string[]
  isLoading: boolean
  error: string | null
  hasAgreedToTerms: boolean
}

const initialState: IAuthState = {
  isAuthenticated: false,
  userId: null,
  displayName: null,
  avatarUrl: null,
  roles: [],
  isLoading: false,
  error: null,
  hasAgreedToTerms: false,
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // 模擬 LIFF 初始化
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 這裡應該實際呼叫 LIFF API
      const mockUser = {
        userId: 'mock_user_123',
        displayName: '張小華',
        avatarUrl: 'https://via.placeholder.com/96x96',
        roles: ['user'],
      }
      
      return mockUser
    } catch (error) {
      return rejectWithValue('認證初始化失敗')
    }
  }
)

export const agreeToTerms = createAsyncThunk(
  'auth/agreeToTerms',
  async (_, { rejectWithValue }) => {
    try {
      // 模擬同意服務條款
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      return rejectWithValue('同意服務條款失敗')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAgreedToTerms: (state, action: PayloadAction<boolean>) => {
      state.hasAgreedToTerms = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.userId = null
      state.displayName = null
      state.avatarUrl = null
      state.roles = []
      state.hasAgreedToTerms = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.userId = action.payload.userId
        state.displayName = action.payload.displayName
        state.avatarUrl = action.payload.avatarUrl
        state.roles = action.payload.roles
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(agreeToTerms.fulfilled, (state) => {
        state.hasAgreedToTerms = true
      })
  },
})

export const { setAgreedToTerms, clearError, logout } = authSlice.actions
export default authSlice.reducer
