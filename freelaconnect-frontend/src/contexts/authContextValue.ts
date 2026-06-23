import { createContext } from 'react'
import type {
  AuthUser,
  ForgotPasswordInput,
  LoginCredentials,
  PasswordRecoveryResponse,
  RegisterInput,
  ResetPasswordInput,
  ResetPasswordResponse,
} from '../types/auth'

export type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  forgotPassword: (
    input: ForgotPasswordInput,
  ) => Promise<PasswordRecoveryResponse>
  resetPassword: (input: ResetPasswordInput) => Promise<ResetPasswordResponse>
  logout: () => void
  refreshUser: () => Promise<AuthUser | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
