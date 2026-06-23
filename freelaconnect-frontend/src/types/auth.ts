export type UserRole = 'user' | 'ADMIN' | 'CLIENT' | 'FREELANCER'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

export type AuthUser = {
  userId: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  version: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type AuthResponse = {
  accessToken: string
  user: AuthUser
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type ForgotPasswordInput = {
  email: string
}

export type PasswordRecoveryResponse = {
  message: string
  resetToken?: string
}

export type ResetPasswordInput = {
  token: string
  password: string
}

export type ResetPasswordResponse = {
  message: string
}
