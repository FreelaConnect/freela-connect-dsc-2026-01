import { useState } from 'react'
import { AuthDialog, type AuthMode } from './components/AuthDialog'
import { useAuth } from './hooks/useAuth'
import { apiBaseUrl } from './services/http'

const illustrationUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA5AqFK_NSxR7Y4l_sw-sN-atN3KcTABvYnlUhysQgA5A1CApcDUxkltz9kGAYHjRx_Epz-roVxL7yC9BIOXqESE4tw0_i63bB1G06OoOfp6-cCOryZZjOALHZ0s1C1KKUg84Vaa-oxMBOBV4bIJIL2x4ZtbnuyQDVO1qSE6M3r4hE4d-edTOJTDfc5U7ULq1oTNOk5XwVBxZc1dRPkTgRtNcfQDCv6TT1Zrn2jvBppZc0JFqhzEhhIyG-Piyb8_rWiWIQgHnQY-w'

function App() {
  const { isAuthenticated, loading, logout, user } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setAuthDialogOpen(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-on-surface sm:p-6">
      <section className="relative flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-surface shadow-soft sm:min-h-[860px] sm:rounded-2xl">
        <div className="pointer-events-none absolute left-0 top-0 h-1/2 w-full bg-gradient-to-b from-primary-fixed/70 to-transparent" />

        <header className="relative z-10 flex items-center justify-between px-6 pt-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              FreelaConnect
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Projetos, contratos e pagamentos
            </p>
          </div>

          {loading ? (
            <span className="rounded-full bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant">
              Verificando
            </span>
          ) : isAuthenticated && user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition active:scale-95"
            >
              Sair
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-outline-variant transition active:scale-95"
            >
              Entrar
            </button>
          )}
        </header>

        <div className="relative z-10 px-6 pt-8">
          <div className="aspect-[4/3] w-full animate-float overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-soft">
            <img
              src={illustrationUrl}
              alt="Ilustração de colaboração entre clientes e freelancers"
              className="h-full w-full object-contain p-4"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-10 text-center">
          <h1 className="max-w-[340px] text-3xl font-bold leading-tight text-on-surface">
            Conecte seu talento às melhores oportunidades
          </h1>
          <p className="mt-4 max-w-[300px] text-base leading-6 text-on-surface-variant">
            Encontre projetos, envie propostas, acompanhe contratos e receba
            pagamentos com mais segurança.
          </p>

          <div className="mt-8 grid w-full grid-cols-3 gap-2 text-left">
            <FeatureCard title="Propostas" text="Envie ofertas claras." />
            <FeatureCard title="Contratos" text="Acompanhe versões." />
            <FeatureCard title="Pagamentos" text="Veja o status." />
          </div>

          {isAuthenticated && user ? (
            <div className="mt-6 w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-left">
              <p className="text-sm font-semibold text-on-surface">
                Você está conectado como {user.name}.
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                API conectada em {apiBaseUrl}
              </p>
            </div>
          ) : null}
        </div>

        <footer className="relative z-10 px-6 pb-10">
          <div className="mb-6 flex items-center justify-center gap-1">
            <span className="h-2 w-8 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-outline-variant" />
            <span className="h-2 w-2 rounded-full bg-outline-variant" />
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => openAuth('register')}
              className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-on-primary shadow-soft transition hover:bg-primary-container active:scale-[0.98]"
            >
              Começar
            </button>
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="h-12 w-full rounded-xl text-base font-semibold text-primary transition hover:bg-primary-fixed/50 active:scale-[0.98]"
            >
              Já tenho conta
            </button>
          </div>
        </footer>
      </section>

      <AuthDialog
        open={authDialogOpen}
        initialMode={authMode}
        onClose={() => setAuthDialogOpen(false)}
      />
    </main>
  )
}

type FeatureCardProps = {
  title: string
  text: string
}

function FeatureCard({ title, text }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-outline-variant/70 bg-surface-container-lowest p-3">
      <p className="text-xs font-bold text-primary">{title}</p>
      <p className="mt-1 text-xs leading-4 text-on-surface-variant">{text}</p>
    </div>
  )
}

export default App
