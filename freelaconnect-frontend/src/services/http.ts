const DEFAULT_API_URL = 'http://localhost:3002'

export const apiBaseUrl = (
  import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
).replace(/\/$/, '')

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string | null
}

type ApiErrorBody = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      0,
    )
  }

  if (!response.ok) {
    const errorBody = await readErrorBody(response)
    throw new ApiError(toUserMessage(errorBody, response.status), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function readErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    return (await response.json()) as ApiErrorBody
  } catch {
    return null
  }
}

function toUserMessage(errorBody: ApiErrorBody | null, status: number): string {
  if (status === 401) {
    return 'E-mail ou senha inválidos.'
  }

  if (status === 409) {
    return 'Já existe um cadastro com esses dados.'
  }

  if (status === 422 || status === 400) {
    const message = errorBody?.message

    if (Array.isArray(message) && message.length > 0) {
      return message.join(' ')
    }

    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }

    return 'Revise os dados informados e tente novamente.'
  }

  if (status >= 500) {
    return 'O servidor encontrou um problema. Tente novamente em instantes.'
  }

  return 'Não foi possível concluir a solicitação. Tente novamente.'
}
