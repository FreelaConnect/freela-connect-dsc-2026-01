const TOKEN_KEY = 'freelaconnect:access-token'

export function getStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_KEY)
}
