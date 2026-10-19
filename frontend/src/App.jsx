import { ThemeProvider, useTheme } from './hooks/useTheme'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider, useToast } from './hooks/useToast'
import { 
  Sun, 
  Moon, 
  Terminal, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Bell, 
  Layers, 
  UserCircle 
} from 'lucide-react'

function DashboardPreview() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSimulateLogin = async () => {
    await login({ email: 'alex.torvalds@devboard.io' })
    toast.success('Sesión iniciada como alex.torvalds@devboard.io', 'AUTENTICACIÓN')
  }

  const handleLogout = () => {
    logout()
    toast.info('Sesión cerrada correctamente', 'SEGURIDAD')
  }

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text p-6 md:p-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-retro-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-retro-accent/15 text-retro-accent border border-retro-accent/30 shadow-retro-sm">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">DevBoard</h1>
              <p className="text-xs font-mono text-retro-muted">SYS.VER: 1.2.0 // RETRO-TECH SPA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-retro-border bg-retro-card hover:border-retro-accent text-sm font-medium transition-all shadow-retro-sm"
              aria-label="Alternar tema visual"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-retro-accent" />
                  <span className="font-mono text-xs">MODO CLARO</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-retro-accent" />
                  <span className="font-mono text-xs">MODO OSCURO</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-retro-danger/40 bg-retro-danger/10 text-retro-danger hover:bg-retro-danger/20 text-xs font-mono font-semibold transition-all shadow-retro-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SALIR</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateLogin}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-retro-accent/50 bg-retro-accent text-white hover:bg-retro-accent/90 text-xs font-mono font-semibold transition-all shadow-retro-sm disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isLoading ? 'CONECTANDO...' : 'LOGIN DEMO'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Phase 2 Status Card */}
        <section className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-retro-success/15 text-retro-success font-mono text-xs font-semibold border border-retro-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> FASE 2 COMPLETADA
              </span>
              <h2 className="text-xl font-bold mt-2">Contextos Globales y Custom Hooks</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-retro-muted block">ESTADO DE SESIÓN:</span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                isAuthenticated 
                  ? 'bg-retro-success/15 text-retro-success border-retro-success/30' 
                  : 'bg-retro-warning/15 text-retro-warning border-retro-warning/30'
              }`}>
                {isAuthenticated ? `AUTH // ${user.name}` : 'ANÓNIMO // PÚBLICO'}
              </span>
            </div>
          </div>

          <p className="text-sm text-retro-muted leading-relaxed">
            Se implementaron los tres contextos arquitectónicos fundamentales: <strong>ThemeContext</strong> (gestión síncrona Light/Dark con persistencia), <strong>AuthContext</strong> (sesión desacoplada con tokens simulados o JWT) y <strong>ToastContext</strong> (cola de notificaciones reactivas indispensables para rollback de Optimistic UI).
          </p>
        </section>

        {/* Interactive Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Theme Hook */}
          <div className="bg-retro-card border border-retro-border p-5 rounded-lg shadow-retro-sm space-y-3">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <Sun className="w-4 h-4" />
              <span>useTheme</span>
            </div>
            <p className="text-xs text-retro-muted">
              Control reactivo del tema con soporte de media query de sistema operativo y almacenamiento en localStorage.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-retro-muted">TEMA ACTUAL:</span>
              <span className="font-bold text-retro-accent uppercase">{theme}</span>
            </div>
          </div>

          {/* Card 2: Auth Hook */}
          <div className="bg-retro-card border border-retro-border p-5 rounded-lg shadow-retro-sm space-y-3">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <UserCircle className="w-4 h-4" />
              <span>useAuth</span>
            </div>
            <p className="text-xs text-retro-muted">
              Gestión de sesión persistida lista para autenticación protegida en rutas `/boards` y `/boards/:boardId`.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-retro-muted">TOKEN:</span>
              <span className="truncate max-w-[140px] text-retro-muted">
                {isAuthenticated ? 'TOKEN_ACTIVO' : 'NULL'}
              </span>
            </div>
          </div>

          {/* Card 3: Toast System */}
          <div className="bg-retro-card border border-retro-border p-5 rounded-lg shadow-retro-sm space-y-3">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <Bell className="w-4 h-4" />
              <span>useToast</span>
            </div>
            <p className="text-xs text-retro-muted">
              Dispara alertas con autodespacho y estilos retro-tech para rollback optimista y confirmaciones.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => toast.success('Ticket guardado correctamente')}
                className="px-2 py-1 text-[10px] font-mono rounded bg-retro-success/10 text-retro-success border border-retro-success/30 hover:bg-retro-success/20"
              >
                Success
              </button>
              <button
                onClick={() => toast.error('Error 400: Rollback activado')}
                className="px-2 py-1 text-[10px] font-mono rounded bg-retro-danger/10 text-retro-danger border border-retro-danger/30 hover:bg-retro-danger/20"
              >
                Error
              </button>
              <button
                onClick={() => toast.warning('Advertencia de borrado en cascada')}
                className="px-2 py-1 text-[10px] font-mono rounded bg-retro-warning/10 text-retro-warning border border-retro-warning/30 hover:bg-retro-warning/20"
              >
                Warn
              </button>
              <button
                onClick={() => toast.info('Sincronizando con backend...')}
                className="px-2 py-1 text-[10px] font-mono rounded bg-retro-accent/10 text-retro-accent border border-retro-accent/30 hover:bg-retro-accent/20"
              >
                Info
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 text-xs font-mono text-retro-muted border-t border-retro-border">
          Fase 2 finalizada con éxito. Listo para arrancar la Fase 3: Componentes Presentacionales Atómicos de UI (`src/components`).
        </footer>

      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <DashboardPreview />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
