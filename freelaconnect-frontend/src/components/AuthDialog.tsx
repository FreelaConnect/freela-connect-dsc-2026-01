import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/http'

export type AuthMode = 'login' | 'register' | 'recover' | 'reset' | 'success'

type AuthDialogProps = {
  open: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export function AuthDialog({
  open,
  onClose,
  initialMode = 'login',
}: AuthDialogProps) {
  const { forgotPassword, login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setError('')
      setSuccess('')
      setShowPassword(false)
    }
  }, [initialMode, open])

  if (!open) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await login({ email, password })
        onClose()
      }

      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.')
          return
        }

        if (!acceptedTerms) {
          setError('Você precisa aceitar os termos de uso para continuar.')
          return
        }

        await register({ name, email, password })
        onClose()
      }

      if (mode === 'recover') {
        const response = await forgotPassword({ email })
        setSuccess(response.message)

        if (response.resetToken) {
          setResetToken(response.resetToken)
          setMode('reset')
        }
      }

      if (mode === 'reset') {
        await resetPassword({ token: resetToken, password })
        setPassword('')
        setConfirmPassword('')
        setResetToken('')
        setMode('success')
      }
    } catch (caughtError) {
      setError(toMessage(caughtError))
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setSuccess('')
    setShowPassword(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-0 sm:px-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.86)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
    >
      <div
        className="isolate flex max-h-screen min-h-screen w-full max-w-md flex-col overflow-y-auto px-4 shadow-2xl ring-1 ring-[#bdc8ce] sm:min-h-[760px] sm:rounded-2xl sm:px-6"
        style={{ backgroundColor: '#f7f9fb', color: '#191c1e' }}
      >
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-[#bdc8ce]/50 py-5"
          style={{ backgroundColor: '#f7f9fb' }}
        >
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
          >
            Fechar
          </button>
        </header>

        {mode === 'success' ? (
          <SuccessState onLogin={() => switchMode('login')} />
        ) : (
          <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
            {mode === 'login' ? (
              <LoginFields
                email={email}
                password={password}
                showPassword={showPassword}
                submitting={submitting}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
                onRecover={() => switchMode('recover')}
              />
            ) : null}

            {mode === 'register' ? (
              <RegisterFields
                name={name}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                acceptedTerms={acceptedTerms}
                showPassword={showPassword}
                submitting={submitting}
                onNameChange={setName}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onTermsChange={setAcceptedTerms}
                onTogglePassword={() => setShowPassword((current) => !current)}
              />
            ) : null}

            {mode === 'recover' ? (
              <RecoverFields
                email={email}
                submitting={submitting}
                onEmailChange={setEmail}
                onHasToken={() => switchMode('reset')}
              />
            ) : null}

            {mode === 'reset' ? (
              <ResetFields
                token={resetToken}
                password={password}
                showPassword={showPassword}
                submitting={submitting}
                onTokenChange={setResetToken}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
                onBack={() => switchMode('recover')}
              />
            ) : null}

            <Feedback error={error} success={success} />

            <AuthFooter mode={mode} onSwitchMode={switchMode} />
          </form>
        )}
      </div>
    </div>
  )
}

type LoginFieldsProps = {
  email: string
  password: string
  showPassword: boolean
  submitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onRecover: () => void
}

function LoginFields({
  email,
  password,
  showPassword,
  submitting,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onRecover,
}: LoginFieldsProps) {
  return (
    <>
      <section
        className="flex flex-col items-center pt-10 text-center"
        style={{ backgroundColor: '#f7f9fb' }}
      >
        <h2 id="auth-dialog-title" className="text-2xl font-bold">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-base text-on-surface-variant">
          Conecte-se e continue seus projetos.
        </p>
      </section>

      <section
        className="flex flex-1 flex-col justify-center py-8"
        style={{ backgroundColor: '#f7f9fb' }}
      >
        <div className="space-y-6">
          <TextField
            label="E-mail"
            icon="@"
            type="email"
            value={email}
            placeholder="nome@exemplo.com"
            autoComplete="email"
            onChange={onEmailChange}
            required
          />
          <TextField
            label="Senha"
            icon="L"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="••••••••"
            autoComplete="current-password"
            onChange={onPasswordChange}
            required
            minLength={8}
            trailingButton={{
              label: showPassword ? 'Ocultar senha' : 'Mostrar senha',
              text: showPassword ? 'Ocultar' : 'Ver',
              onClick: onTogglePassword,
            }}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRecover}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
          <SubmitButton loading={submitting}>Entrar</SubmitButton>
        </div>

        <SocialOptions />
      </section>
    </>
  )
}

type RegisterFieldsProps = {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
  showPassword: boolean
  submitting: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onTermsChange: (value: boolean) => void
  onTogglePassword: () => void
}

function RegisterFields({
  name,
  email,
  password,
  confirmPassword,
  acceptedTerms,
  showPassword,
  submitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTermsChange,
  onTogglePassword,
}: RegisterFieldsProps) {
  return (
    <>
      <section className="pt-8 text-center" style={{ backgroundColor: '#f7f9fb' }}>
        <h2 id="auth-dialog-title" className="text-2xl font-bold">
          Crie sua conta
        </h2>
        <p className="mt-2 text-base text-on-surface-variant">
          Comece sua jornada profissional hoje.
        </p>
      </section>

      <section className="py-8" style={{ backgroundColor: '#f7f9fb' }}>
        <div
          className="space-y-4 rounded-xl border border-[#bdc8ce]/50 p-5 shadow-sm"
          style={{ backgroundColor: '#ffffff' }}
        >
          <TextField
            label="Nome completo"
            icon="P"
            type="text"
            value={name}
            autoComplete="name"
            onChange={onNameChange}
            required
          />
          <TextField
            label="E-mail"
            icon="@"
            type="email"
            value={email}
            autoComplete="email"
            onChange={onEmailChange}
            required
          />
          <TextField
            label="Senha"
            icon="L"
            type={showPassword ? 'text' : 'password'}
            value={password}
            autoComplete="new-password"
            onChange={onPasswordChange}
            required
            minLength={8}
            trailingButton={{
              label: showPassword ? 'Ocultar senha' : 'Mostrar senha',
              text: showPassword ? 'Ocultar' : 'Ver',
              onClick: onTogglePassword,
            }}
          />
          <TextField
            label="Confirmação de senha"
            icon="V"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            autoComplete="new-password"
            onChange={onConfirmPasswordChange}
            required
            minLength={8}
          />

          <label className="flex items-start gap-3 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => onTermsChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
              required
            />
            <span>
              Aceito os{' '}
              <span className="font-semibold text-primary">Termos e Condições</span>{' '}
              de uso do FreelaConnect.
            </span>
          </label>

          <SubmitButton loading={submitting}>Criar conta</SubmitButton>

          <SocialOptions compact />
        </div>
      </section>
    </>
  )
}

type RecoverFieldsProps = {
  email: string
  submitting: boolean
  onEmailChange: (value: string) => void
  onHasToken: () => void
}

function RecoverFields({
  email,
  submitting,
  onEmailChange,
  onHasToken,
}: RecoverFieldsProps) {
  return (
    <section
      className="flex flex-1 flex-col justify-center py-8"
      style={{ backgroundColor: '#f7f9fb' }}
    >
      <div
        className="rounded-xl border border-[#bdc8ce]/40 p-6 shadow-sm"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h2 id="auth-dialog-title" className="text-2xl font-bold text-primary">
          Recuperar senha
        </h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Se o e-mail estiver cadastrado, enviaremos as instruções de
          recuperação.
        </p>

        <div className="mt-8 space-y-6">
          <TextField
            label="E-mail"
            icon="@"
            type="email"
            value={email}
            placeholder="Digite seu e-mail cadastrado"
            autoComplete="email"
            onChange={onEmailChange}
            required
          />
          <SubmitButton loading={submitting}>Enviar instruções</SubmitButton>
          <button
            type="button"
            onClick={onHasToken}
            className="w-full text-center text-sm font-semibold text-primary hover:underline"
          >
            Tenho um token
          </button>
        </div>
      </div>
    </section>
  )
}

type ResetFieldsProps = {
  token: string
  password: string
  showPassword: boolean
  submitting: boolean
  onTokenChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onBack: () => void
}

function ResetFields({
  token,
  password,
  showPassword,
  submitting,
  onTokenChange,
  onPasswordChange,
  onTogglePassword,
  onBack,
}: ResetFieldsProps) {
  return (
    <section
      className="flex flex-1 flex-col justify-center py-8"
      style={{ backgroundColor: '#f7f9fb' }}
    >
      <div
        className="rounded-xl border border-[#bdc8ce]/40 p-6 shadow-sm"
        style={{ backgroundColor: '#ffffff' }}
      >
        <h2 id="auth-dialog-title" className="text-2xl font-bold text-primary">
          Redefinir senha
        </h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Insira o token recebido e escolha sua nova senha de acesso.
        </p>

        <div className="mt-8 space-y-6">
          <TextField
            label="Token de recuperação"
            icon="#"
            type="text"
            value={token}
            autoComplete="one-time-code"
            onChange={onTokenChange}
            required
          />
          <TextField
            label="Nova senha"
            icon="L"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            onChange={onPasswordChange}
            required
            minLength={8}
            trailingButton={{
              label: showPassword ? 'Ocultar senha' : 'Mostrar senha',
              text: showPassword ? 'Ocultar' : 'Ver',
              onClick: onTogglePassword,
            }}
          />
          <SubmitButton loading={submitting}>Redefinir senha</SubmitButton>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-sm font-semibold text-on-surface-variant transition hover:text-primary"
          >
            Voltar para recuperação
          </button>
        </div>
      </div>
    </section>
  )
}

function SuccessState({ onLogin }: { onLogin: () => void }) {
  return (
    <section
      className="flex flex-1 flex-col justify-center py-10 text-center"
      style={{ backgroundColor: '#f7f9fb' }}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-3xl font-bold text-primary">
        OK
      </div>
      <h2 id="auth-dialog-title" className="mt-8 text-2xl font-bold text-primary">
        Senha redefinida com sucesso.
      </h2>
      <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-on-surface-variant">
        Sua senha foi atualizada. Agora você pode entrar na sua conta usando
        suas novas credenciais.
      </p>
      <button
        type="button"
        onClick={onLogin}
        className="mt-8 h-12 w-full rounded-lg bg-primary text-base font-semibold text-on-primary transition hover:bg-primary-container active:scale-[0.98]"
      >
        Fazer login
      </button>
    </section>
  )
}

type TextFieldProps = {
  label: string
  icon: string
  type: string
  value: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  onChange: (value: string) => void
  trailingButton?: {
    label: string
    text: string
    onClick: () => void
  }
}

function TextField({
  label,
  icon,
  type,
  value,
  placeholder,
  autoComplete,
  required,
  minLength,
  onChange,
  trailingButton,
}: TextFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-sm font-semibold text-on-surface-variant">
        {label}
      </span>
      <span
        className="flex h-14 items-center overflow-hidden rounded-xl border border-[#bdc8ce] shadow-sm transition focus-within:border-[#00647c] focus-within:ring-2 focus-within:ring-[#00647c]/10"
        style={{ backgroundColor: '#ffffff' }}
      >
        <span className="flex w-11 justify-center text-sm font-bold text-on-surface-variant">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 border-none bg-transparent px-1 py-4 text-base text-on-surface outline-none placeholder:text-outline focus:ring-0"
        />
        {trailingButton ? (
          <button
            type="button"
            aria-label={trailingButton.label}
            onClick={trailingButton.onClick}
            className="px-3 text-xs font-semibold text-primary"
          >
            {trailingButton.text}
          </button>
        ) : null}
      </span>
    </label>
  )
}

function SubmitButton({
  children,
  loading,
}: {
  children: string
  loading: boolean
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-on-primary shadow-sm transition hover:bg-primary-container active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? 'Aguarde...' : children}
    </button>
  )
}

function SocialOptions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-4' : 'pt-8'}>
      <div className="relative flex items-center py-3">
        <div className="flex-grow border-t border-outline-variant/60" />
        <span className="mx-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Ou continue com
        </span>
        <div className="flex-grow border-t border-outline-variant/60" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
        >
          Google
        </button>
        <button
          type="button"
          className="flex h-12 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
        >
          Facebook
        </button>
      </div>
    </div>
  )
}

function AuthFooter({
  mode,
  onSwitchMode,
}: {
  mode: AuthMode
  onSwitchMode: (mode: AuthMode) => void
}) {
  if (mode === 'recover' || mode === 'reset') {
    return (
      <footer className="pb-8 text-center text-sm text-on-surface-variant">
        Lembrou sua senha?{' '}
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className="font-bold text-primary hover:underline"
        >
          Entrar agora
        </button>
      </footer>
    )
  }

  return (
    <footer className="pb-8 text-center text-sm text-on-surface-variant">
      {mode === 'login' ? 'Não tem uma conta?' : 'Já tenho conta?'}{' '}
      <button
        type="button"
        onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
        className="font-bold text-primary hover:underline"
      >
        {mode === 'login' ? 'Criar conta' : 'Entrar agora'}
      </button>
    </footer>
  )
}

function Feedback({ error, success }: { error: string; success: string }) {
  if (!error && !success) {
    return null
  }

  return (
    <div className="pb-5">
      {error ? (
        <p className="rounded-lg border border-error/30 bg-error-container px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-primary/20 bg-primary-fixed px-3 py-2 text-sm text-primary">
          {success}
        </p>
      ) : null}
    </div>
  )
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-on-primary">
        FC
      </span>
      <span className="text-lg font-bold text-primary">FreelaConnect</span>
    </div>
  )
}

function toMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  return 'Não foi possível concluir a ação. Tente novamente.'
}
