import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordInput,
  LoginCredentials,
  PasswordRecoveryResponse,
  RegisterInput,
  ResetPasswordInput,
  ResetPasswordResponse,
} from '../types/auth'
import { apiRequest } from './http'

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function getMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    token,
  })
}

export function register(input: RegisterInput): Promise<AuthUser> {
  return apiRequest<AuthUser>('/users', {
    method: 'POST',
    body: {
      ...input,
      role: 'user',
    },
  })
}

export function forgotPassword(
  input: ForgotPasswordInput,
): Promise<PasswordRecoveryResponse> {
  return apiRequest<PasswordRecoveryResponse>('/auth/forgot-password', {
    method: 'POST',
    body: input,
  })
}

export function resetPassword(
  input: ResetPasswordInput,
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: input,
  })
}
