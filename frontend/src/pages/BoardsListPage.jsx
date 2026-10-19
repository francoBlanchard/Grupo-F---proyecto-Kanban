import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Layout, AlertTriangle, Database } from 'lucide-react';
import { boardService } from '../api';
import { mockBoards } from '../api/mockData';
import { useAuth, useTheme, useToast } from '../hooks';
import { Navbar, Button, Spinner, ConfirmDialog } from '../components';
import { BoardCard, BoardFormModal } from '../features/boards';

/**
 * Vista Contenedora (Smart) para el Listado General de Tableros
 * Ruta: /boards (Protegida)
 */
export function BoardsListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Estados de Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga de Tableros desde la API REST
  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await boardService.getAllBoards();
      setBoards(data);
      setIsUsingMocks(false);
    } catch (err) {
      console.warn('API no disponible. Ofreciendo fallback de datos sintéticos:', err);
      setError(err.message || 'No se pudo conectar con el servidor backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Cargar datos sintéticos en modo offline
  const handleLoadMockData = () => {
    setBoards(structuredClone(mockBoards));
    setIsUsingMocks(true);
    setError(null);
    toast.info('Cargados datos de prueba locales (Modo Offline)', 'DATOS SINTÉTICOS');
  };

  // Creación / Edición de Tablero
  const handleSaveBoard = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingBoard) {
        // Actualización PATCH
        if (!isUsingMocks) {
          const updated = await boardService.updateBoard(editingBoard._id, formData);
          setBoards((prev) =>
            prev.map((b) => (b._id === editingBoard._id ? { ...b, ...updated } : b))
          );
        } else {
          setBoards((prev) =>
            prev.map((b) => (b._id === editingBoard._id ? { ...b, ...formData } : b))
          );
        }
        toast.success('Tablero actualizado exitosamente', 'SYS.BOARD');
        setIsFormModalOpen(false);
      } else {
        // Creación POST
        let createdBoard;
        if (!isUsingMocks) {
          createdBoard = await boardService.createBoard(formData);
        } else {
          createdBoard = {
            _id: `67b60e11${Date.now().toString().slice(-16)}`,
            ...formData,
            columns: [],
            createdAt: new Date().toISOString(),
          };
          setBoards((prev) => [createdBoard, ...prev]);
        }

        toast.success(`Tablero "${createdBoard.title}" creado`, 'SYS.BOARD');
        setIsFormModalOpen(false);

        // Regla estricta de React Router: Navegación programática ÚNICAMENTE
        // después de que la mutación en la API haya respondido de forma exitosa
        navigate(`/boards/${createdBoard._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Error al procesar el tablero', 'ERROR DE SERVIDOR');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminación con confirmación y advertencia en cascada
  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;
    setIsSubmitting(true);
    try {
      if (!isUsingMocks) {
        await boardService.deleteBoard(boardToDelete._id);
      }
      setBoards((prev) => prev.filter((b) => b._id !== boardToDelete._id));
      toast.error(
        `Tablero "${boardToDelete.title}" y todos sus recursos eliminados en cascada`,
        'BORRADO EN CASCADA'
      );
      setIsConfirmOpen(false);
      setBoardToDelete(null);
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el tablero', 'ERROR 500');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text transition-colors duration-200">
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header de la Vista */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-retro-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-retro-accent">
                [TABLEROS KANBAN]
              </span>
              {isUsingMocks && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-retro-warning/15 text-retro-warning border border-retro-warning/30 font-semibold">
                  MODO OFFLINE
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-retro-text mt-1">
              Espacio de Trabajo
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={fetchBoards}
              disabled={isLoading}
            >
              Refrescar
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingBoard(null);
                setIsFormModalOpen(true);
              }}
            >
              Nuevo Tablero
            </Button>
          </div>
        </div>

        {/* Estado de Carga */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Spinner size="lg" />
            <p className="font-mono text-xs text-retro-muted animate-pulse">
              OBTENIENDO COLECCIÓN DE TABLEROS DESDE REST API...
            </p>
          </div>
        )}

        {/* Estado de Error de Red */}
        {!isLoading && error && (
          <div className="p-6 rounded-lg bg-retro-card border border-retro-danger/50 shadow-retro space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-retro-danger/10 text-retro-danger border border-retro-danger/30 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-retro-text">
                  Fallo en la conexión con el servidor backend
                </h3>
                <p className="text-xs text-retro-muted mt-1 leading-relaxed">
                  {error}. Verifica que el backend esté ejecutándose en el puerto configurado (ej. 5000).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="sm" onClick={fetchBoards}>
                Reintentar Conexión
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Database}
                onClick={handleLoadMockData}
              >
                Cargar Datos Sintéticos (Offline)
              </Button>
            </div>
          </div>
        )}

        {/* Estado Vacío */}
        {!isLoading && !error && boards.length === 0 && (
          <div className="py-16 text-center rounded-lg border border-dashed border-retro-border bg-retro-card/40 p-8 space-y-4">
            <div className="inline-flex p-3 rounded-lg bg-retro-bg border border-retro-border text-retro-muted">
              <Layout className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-retro-text">
                No hay tableros registrados
              </h3>
              <p className="text-xs text-retro-muted mt-1 max-w-sm mx-auto">
                Crea tu primer tablero de trabajo para organizar columnas y tickets bajo la jerarquía Kanban.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingBoard(null);
                setIsFormModalOpen(true);
              }}
            >
              Crear Primer Tablero
            </Button>
          </div>
        )}

        {/* Grilla de Tableros */}
        {!isLoading && !error && boards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onOpen={(id) => navigate(`/boards/${id}`)}
                onEdit={(b) => {
                  setEditingBoard(b);
                  setIsFormModalOpen(true);
                }}
                onDelete={(b) => {
                  setBoardToDelete(b);
                  setIsConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Modal de Formulario */}
        <BoardFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleSaveBoard}
          initialData={editingBoard}
          isSubmitting={isSubmitting}
        />

        {/* Diálogo de Confirmación de Borrado en Cascada */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setBoardToDelete(null);
          }}
          onConfirm={handleDeleteBoard}
          title={`¿Eliminar tablero "${boardToDelete?.title}"?`}
          message="Esta operación eliminará permanentemente el tablero y todos sus registros."
          cascadeWarning="Se activará el borrado en cascada en la base de datos eliminando todas las columnas y tickets contenidos en este tablero."
          confirmText="Sí, eliminar en cascada"
          isSubmitting={isSubmitting}
        />

      </main>
    </div>
  );
}

export default BoardsListPage;
