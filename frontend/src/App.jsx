import { useState, useEffect } from 'react'
import { Sun, Moon, Terminal, CheckCircle2, ShieldCheck, Database, Layout } from 'lucide-react'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'No configurada'

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
              <p className="text-xs font-mono text-retro-muted">SYS.VER: 1.0.0 // RETRO-TECH SPA</p>
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
          </div>
        </header>

        {/* Phase 0 Badge & Summary */}
        <section className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-retro-success/15 text-retro-success font-mono text-xs font-semibold border border-retro-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> FASE 0 COMPLETADA
              </span>
              <h2 className="text-xl font-bold mt-2">Configuración del Entorno y Sistema de Diseño</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-retro-muted block">API ENDPOINT:</span>
              <code className="text-xs font-mono text-retro-accent font-semibold bg-retro-bg px-2 py-1 rounded border border-retro-border inline-block mt-0.5">
                {apiUrl}
              </code>
            </div>
          </div>

          <p className="text-sm text-retro-muted leading-relaxed">
            El entorno base de la SPA ha sido configurado bajo la metodología <strong>Desarrollo Basado en Especificaciones (SDD)</strong> con la paleta semántica <strong>Silicon Valley Retro-Tech</strong>, tipografías sincronizadas y script anti-FOUC.
          </p>
        </section>

        {/* Feature Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-retro-card border border-retro-border p-4 rounded-lg shadow-retro-sm space-y-2">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <Layout className="w-4 h-4" />
              <span>Sistema de Diseño</span>
            </div>
            <p className="text-xs text-retro-muted">
              Solarized Warm Light & Retro Petroleum Dark con tokens semánticos CSS y soporte de contraste.
            </p>
            <div className="pt-2 flex gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-retro-bg border border-retro-border">JetBrains Mono</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-retro-bg border border-retro-border">Plus Jakarta Sans</span>
            </div>
          </div>

          <div className="bg-retro-card border border-retro-border p-4 rounded-lg shadow-retro-sm space-y-2">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Validación y Formularios</span>
            </div>
            <p className="text-xs text-retro-muted">
              React Hook Form 7, Zod 3 y resolvers listos para validación declarativa y captura de errores 400.
            </p>
            <div className="pt-2">
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-retro-bg border border-retro-border">RHF + Zod v3</span>
            </div>
          </div>

          <div className="bg-retro-card border border-retro-border p-4 rounded-lg shadow-retro-sm space-y-2">
            <div className="flex items-center gap-2 text-retro-accent font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>Red y Drag & Drop</span>
            </div>
            <p className="text-xs text-retro-muted">
              Axios y @hello-pangea/dnd preparados para sincronización de 15 endpoints y Optimistic UI con rollback.
            </p>
            <div className="pt-2">
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-retro-bg border border-retro-border">#TK-849F2A</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-center pt-6 text-xs font-mono text-retro-muted border-t border-retro-border">
          Fase 0 finalizada con éxito. Listo para arrancar la Fase 1: Capa de Servicios API (`src/api`).
        </footer>

      </div>
    </div>
  )
}

export default App
