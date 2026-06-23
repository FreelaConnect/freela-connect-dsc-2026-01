import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authService from '../services/authService'
import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from '../services/tokenStorage'
import type {
  AuthUser,
  ForgotPasswordInput,
  LoginCredentials,
  PasswordRecoveryResponse,
  RegisterInput,
  ResetPasswordInput,
  ResetPasswordResponse,
} from '../types/auth'
import { AuthContext, type AuthContextValue } from './authContextValue'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const activeToken = getStoredToken()

    if (!activeToken) {
      setUser(null)
      setToken(null)
      return null
    }

    try {
      const currentUser = await authService.getMe(activeToken)
      setToken(activeToken)
      setUser(currentUser)
      return currentUser
    } catch {
      logout()
      return null
    }
  }, [logout])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      setLoading(true)
      await refreshUser()

      if (active) {
        setLoading(false)
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [refreshUser])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    storeToken(response.accessToken)
    setToken(response.accessToken)
    setUser(response.user)
    return response.user
  }, [])

  const register = useCallback(
    async (input: RegisterInput) => {
      const createdUser = await authService.register(input)
      await login({ email: input.email, password: input.password })
      return createdUser
    },
    [login],
  )

  const forgotPassword = useCallback(
    (input: ForgotPasswordInput): Promise<PasswordRecoveryResponse> =>
      authService.forgotPassword(input),
    [],
  )

  const resetPassword = useCallback(
    (input: ResetPasswordInput): Promise<ResetPasswordResponse> =>
      authService.resetPassword(input),
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      loading,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
