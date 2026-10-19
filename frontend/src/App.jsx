import { useState } from 'react'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider, useToast } from './hooks/useToast'
import {
  Navbar,
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Modal,
  ConfirmDialog,
  Spinner
} from './components'
import { 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Edit3, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react'

function ComponentShowcase() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, login, logout } = useAuth()
  const { toast } = useToast()

  // Estados locales para interactividad pura del showcase
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmittingSim, setIsSubmittingSim] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const handleSimulateSubmit = () => {
    setIsSubmittingSim(true)
    setTimeout(() => {
      setIsSubmittingSim(false)
      toast.success('Petición completada con éxito', 'SIMULACIÓN API')
    }, 1200)
  }

  const handleDeleteConfirm = () => {
    setIsSubmittingSim(true)
    setTimeout(() => {
      setIsSubmittingSim(false)
      setIsConfirmOpen(false)
      toast.error('Columna y 4 tickets eliminados en cascada', 'BORRADO CASCADA')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text transition-colors duration-200">
      {/* Navbar Atómico */}
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoginClick={() => login({ email: 'santiago.dev@devboard.io' })}
        onLogout={logout}
        currentBoardTitle="Sprint Alpha (Showcase)"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner de Estado de Fase 3 */}
        <section className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-retro-success/15 text-retro-success font-mono text-xs font-semibold border border-retro-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> FASE 3 COMPLETADA
              </span>
              <h1 className="text-xl font-bold mt-2">Biblioteca de Componentes Presentacionales Atómicos</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showErrors ? 'danger' : 'secondary'}
                size="sm"
                icon={SlidersHorizontal}
                onClick={() => setShowErrors(!showErrors)}
              >
                {showErrors ? 'Ocultar Errores' : 'Simular Errores'}
              </Button>
            </div>
          </div>

          <p className="text-sm text-retro-muted leading-relaxed">
            Se generó la biblioteca de componentes atómicos puros (dummy) bajo la regla estricta: <strong>0 llamados a la API y 0 useEffect</strong>. Todos los componentes operan exclusivamente vía props y callbacks, implementando los tokens de <strong>Silicon Valley Retro-Tech</strong>.
          </p>
        </section>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel 1: Controles y Formularios */}
          <div className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro-sm space-y-5">
            <h2 className="text-base font-bold text-retro-text flex items-center gap-2 border-b border-retro-border pb-3">
              <Layers className="w-4 h-4 text-retro-accent" />
              <span>Controles de Formulario (Input, Textarea, Select)</span>
            </h2>

            <div className="space-y-4">
              <Input
                label="Título del Ticket"
                required
                placeholder="Ej. Implementar autenticación JWT"
                error={showErrors ? 'El título del ticket es obligatorio' : undefined}
                helperText={!showErrors ? 'Máximo 150 caracteres' : undefined}
                defaultValue="Refactorizar módulo de columnas"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Prioridad"
                  options={[
                    { value: 'low', label: 'Baja (Low)' },
                    { value: 'medium', label: 'Media (Medium)' },
                    { value: 'high', label: 'Alta (High)' },
                  ]}
                  defaultValue="high"
                />

                <Input
                  label="Identificador Técnico"
                  mono
                  defaultValue="#TK-849F2A"
                  readOnly
                  helperText="Autocalculado con tipografía monoespaciada"
                />
              </div>

              <Textarea
                label="Descripción del Requerimiento"
                placeholder="Detalla criterios de aceptación..."
                rows={3}
                error={showErrors ? 'La descripción excede los 2000 caracteres permitidos' : undefined}
                defaultValue="Garantizar que al eliminar una columna se eliminen todos sus tickets hijos en cascada."
              />
            </div>
          </div>

          {/* Panel 2: Botones, Badges y Modales */}
          <div className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro-sm space-y-5">
            <h2 className="text-base font-bold text-retro-text flex items-center gap-2 border-b border-retro-border pb-3">
              <SlidersHorizontal className="w-4 h-4 text-retro-accent" />
              <span>Botones, Badges y Diálogos Modales</span>
            </h2>

            {/* Badges */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-retro-muted block">Variantes de Badge (Prioridades y Estados):</span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="low">LOW PRIORITY</Badge>
                <Badge variant="medium">MEDIUM PRIORITY</Badge>
                <Badge variant="high">HIGH PRIORITY</Badge>
                <Badge variant="accent">#TK-104</Badge>
                <Badge variant="success">200 OK</Badge>
                <Badge variant="danger">400 BAD REQUEST</Badge>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-retro-muted block">Variantes de Botón & Estados de Carga:</span>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Button
                  variant="primary"
                  icon={Plus}
                  isSubmitting={isSubmittingSim}
                  onClick={handleSimulateSubmit}
                >
                  Guardar Cambios
                </Button>
                <Button
                  variant="secondary"
                  icon={Edit3}
                  onClick={() => setIsModalOpen(true)}
                >
                  Abrir Modal
                </Button>
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Eliminar Columna
                </Button>
              </div>
            </div>

            {/* Spinners */}
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-retro-muted">
              <span>SPINNERS:</span>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>

          </div>

        </div>

        {/* Modal de Ejemplo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Ticket"
          subtitle="FORMULARIO DE DEMOSTRACIÓN"
          maxWidth="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isSubmitting={isSubmittingSim}
                onClick={handleSimulateSubmit}
              >
                Crear Ticket
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Título" placeholder="Ej. Actualizar dependencias" />
            <Textarea label="Descripción" placeholder="Detalle técnico..." />
          </div>
        </Modal>

        {/* Diálogo de Confirmación con Advertencia de Cascada */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar la columna 'En Progreso'?"
          message="Esta acción no se puede deshacer y retirará la columna de la interfaz."
          cascadeWarning="Se eliminarán automáticamente los 4 tickets contenidos en esta columna mediante el hook de borrado en cascada."
          confirmText="Sí, eliminar con cascada"
          isSubmitting={isSubmittingSim}
        />

        {/* Footer */}
        <footer className="text-center pt-6 text-xs font-mono text-retro-muted border-t border-retro-border">
          Fase 3 finalizada con éxito. Listo para arrancar la Fase 4: Módulos de Dominio y Formularios Validados (`src/features`).
        </footer>

      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ComponentShowcase />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
