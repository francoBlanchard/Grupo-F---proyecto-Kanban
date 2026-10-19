import { useState } from 'react'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider, useToast } from './hooks/useToast'
import { Navbar, Button, ConfirmDialog } from './components'
import { BoardCard, BoardFormModal } from './features/boards'
import { ColumnContainer, ColumnFormModal } from './features/columns'
import { TicketCard, TicketFormModal } from './features/tickets'
import { mockBoards } from './api/mockData'
import { 
  CheckCircle2, 
  Plus, 
  Layout, 
  Kanban 
} from 'lucide-react'

function FeatureShowcase() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, login, logout } = useAuth()
  const { toast } = useToast()

  // Tablero de demostración con datos sintéticos
  const [boardData, setBoardData] = useState(() => structuredClone(mockBoards[0]))
  
  // Modales de formulario
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)

  const [isColModalOpen, setIsColModalOpen] = useState(false)
  const [editingCol, setEditingCol] = useState(null)

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [activeColId, setActiveColId] = useState(null)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Acciones de Tablero
  const handleSaveBoard = async (data) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setBoardData(prev => ({ ...prev, ...data }))
      setIsSubmitting(false)
      setIsBoardModalOpen(false)
      toast.success(editingBoard ? 'Tablero actualizado' : 'Tablero creado', 'SYS.BOARD')
    }, 800)
  }

  // Acciones de Columna
  const handleSaveColumn = async (data) => {
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingCol) {
        setBoardData(prev => {
          const next = structuredClone(prev)
          const col = next.columns.find(c => c._id === editingCol._id)
          if (col) col.title = data.title
          return next
        })
        toast.success(`Columna renombrada a "${data.title}"`, 'SYS.COLUMN')
      } else {
        const newCol = {
          _id: `67b60e22${Date.now().toString().slice(-16)}`,
          title: data.title,
          boardId: boardData._id,
          order: boardData.columns.length,
          tickets: [],
        }
        setBoardData(prev => {
          const next = structuredClone(prev)
          next.columns.push(newCol)
          return next
        })
        toast.success(`Columna "${data.title}" agregada`, 'SYS.COLUMN')
      }
      setIsSubmitting(false)
      setIsColModalOpen(false)
    }, 700)
  }

  // Acciones de Ticket
  const handleSaveTicket = async (data) => {
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingTicket) {
        setBoardData(prev => {
          const next = structuredClone(prev)
          for (const col of next.columns) {
            const t = col.tickets.find(item => item._id === editingTicket._id)
            if (t) {
              t.title = data.title
              t.description = data.description
              t.priority = data.priority
              break
            }
          }
          return next
        })
        toast.success(`Ticket "${data.title}" actualizado`, 'SYS.TICKET')
      } else {
        const newTicket = {
          _id: `67b60e33${Date.now().toString().slice(-16)}`,
          title: data.title,
          description: data.description,
          priority: data.priority,
          columnId: activeColId,
          order: 99,
        }
        setBoardData(prev => {
          const next = structuredClone(prev)
          const col = next.columns.find(c => c._id === activeColId)
          if (col) col.tickets.push(newTicket)
          return next
        })
        toast.success(`Ticket creado en columna`, 'SYS.TICKET')
      }
      setIsSubmitting(false)
      setIsTicketModalOpen(false)
    }, 700)
  }

  // Borrado con confirmación y advertencia en cascada
  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    setIsSubmitting(true)

    setTimeout(() => {
      if (itemToDelete.type === 'column') {
        const colTicketsCount = itemToDelete.data.tickets?.length || 0
        setBoardData(prev => {
          const next = structuredClone(prev)
          next.columns = next.columns.filter(c => c._id !== itemToDelete.data._id)
          return next
        })
        toast.error(`Columna eliminada junto con sus ${colTicketsCount} tickets asociados`, 'BORRADO CASCADA')
      } else if (itemToDelete.type === 'ticket') {
        setBoardData(prev => {
          const next = structuredClone(prev)
          for (const col of next.columns) {
            col.tickets = col.tickets.filter(t => t._id !== itemToDelete.data._id)
          }
          return next
        })
        toast.info('Ticket eliminado del tablero', 'SYS.TICKET')
      }

      setIsSubmitting(false)
      setIsConfirmOpen(false)
      setItemToDelete(null)
    }, 600)
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
        currentBoardTitle={boardData.title}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner de Estado de Fase 4 */}
        <section className="bg-retro-card border border-retro-border rounded-lg p-6 shadow-retro">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-retro-success/15 text-retro-success font-mono text-xs font-semibold border border-retro-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> FASE 4 COMPLETADA
              </span>
              <h1 className="text-xl font-bold mt-2">Módulos de Dominio y Formularios Validados (RHF + Zod)</h1>
            </div>
            
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setEditingCol(null)
                  setIsColModalOpen(true)
                }}
              >
                Nueva Columna
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setEditingBoard(null)
                  setIsBoardModalOpen(true)
                }}
              >
                Nuevo Tablero
              </Button>
            </div>
          </div>

          <p className="text-sm text-retro-muted leading-relaxed">
            Se implementaron los módulos por dominio (<strong>boards</strong>, <strong>columns</strong>, <strong>tickets</strong>) con esquemas declarativos de validación <strong>Zod</strong>, tarjetas presentacionales desacopladas (<strong>0 useEffect</strong>) y modales controlados con <strong>React Hook Form</strong> para captura de errores y estados de carga.
          </p>
        </section>

        {/* Sección 1: Tarjetas de Tablero (BoardCard) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-retro-border pb-2">
            <Layout className="w-4 h-4 text-retro-accent" />
            <h2 className="text-sm font-bold tracking-tight text-retro-text uppercase font-mono">
              [DOMINIO: BOARDS // BOARDCARD & MODAL]
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BoardCard
              board={boardData}
              onOpen={(id) => toast.info(`Navegación al tablero ${id}`, 'ROUTER')}
              onEdit={(b) => {
                setEditingBoard(b)
                setIsBoardModalOpen(true)
              }}
              onDelete={(b) => {
                setItemToDelete({ type: 'board', data: b })
                setIsConfirmOpen(true)
              }}
            />
            <BoardCard
              board={mockBoards[1]}
              onOpen={(id) => toast.info(`Navegación al tablero ${id}`, 'ROUTER')}
              onEdit={(b) => toast.info(`Editar ${b.title}`, 'SHOWCASE')}
              onDelete={(b) => toast.warning('Eliminar tablero demo', 'SHOWCASE')}
            />
          </div>
        </section>

        {/* Sección 2: Tablero Kanban (ColumnContainer & TicketCard) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-retro-border pb-2">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-retro-accent" />
              <h2 className="text-sm font-bold tracking-tight text-retro-text uppercase font-mono">
                [DOMINIO: KANBAN // COLUMNCONTAINER & TICKETCARD]
              </h2>
            </div>
            <span className="text-xs font-mono text-retro-muted">
              {boardData.columns.length} COLUMNAS ACTIVAS
            </span>
          </div>

          {/* Kanban Board Horizontal Scroll */}
          <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1">
            {boardData.columns.map((col) => (
              <ColumnContainer
                key={col._id}
                column={col}
                onAddTicket={(colId) => {
                  setActiveColId(colId)
                  setEditingTicket(null)
                  setIsTicketModalOpen(true)
                }}
                onEditColumn={(c) => {
                  setEditingCol(c)
                  setIsColModalOpen(true)
                }}
                onDeleteColumn={(c) => {
                  setItemToDelete({ type: 'column', data: c })
                  setIsConfirmOpen(true)
                }}
              >
                {col.tickets?.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onEdit={(t) => {
                      setEditingTicket(t)
                      setActiveColId(col._id)
                      setIsTicketModalOpen(true)
                    }}
                    onDelete={(t) => {
                      setItemToDelete({ type: 'ticket', data: t })
                      setIsConfirmOpen(true)
                    }}
                  />
                ))}
              </ColumnContainer>
            ))}
          </div>
        </section>

        {/* Modales de Formulario */}
        <BoardFormModal
          isOpen={isBoardModalOpen}
          onClose={() => setIsBoardModalOpen(false)}
          onSubmit={handleSaveBoard}
          initialData={editingBoard}
          isSubmitting={isSubmitting}
        />

        <ColumnFormModal
          isOpen={isColModalOpen}
          onClose={() => setIsColModalOpen(false)}
          onSubmit={handleSaveColumn}
          initialData={editingCol}
          isSubmitting={isSubmitting}
        />

        <TicketFormModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onSubmit={handleSaveTicket}
          initialData={editingTicket}
          isSubmitting={isSubmitting}
        />

        {/* Diálogo de Confirmación para borrado destructivo */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false)
            setItemToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
          title={
            itemToDelete?.type === 'column'
              ? `¿Eliminar columna "${itemToDelete.data.title}"?`
              : itemToDelete?.type === 'ticket'
              ? `¿Eliminar ticket "${itemToDelete.data.title}"?`
              : '¿Eliminar tablero?'
          }
          message="Esta acción no se puede deshacer y retirará el recurso de la base de datos."
          cascadeWarning={
            itemToDelete?.type === 'column'
              ? `Se eliminarán en cascada ${itemToDelete.data.tickets?.length || 0} tickets asociados a esta columna.`
              : itemToDelete?.type === 'board'
              ? 'Se eliminarán en cascada todas las columnas y tickets de este tablero.'
              : undefined
          }
          isSubmitting={isSubmitting}
        />

        {/* Footer */}
        <footer className="text-center pt-6 text-xs font-mono text-retro-muted border-t border-retro-border">
          Fase 4 finalizada con éxito. Listo para arrancar la Fase 5: Vistas Principales, Enrutamiento SPA y Optimistic UI (`src/pages` / `src/routes`).
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
          <FeatureShowcase />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
