import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, ArrowLeft, RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import { boardService, columnService, ticketService } from '../api';
import { mockBoards } from '../api/mockData';
import { useAuth, useTheme, useToast } from '../hooks';
import { Navbar, Button, Spinner, ConfirmDialog } from '../components';
import { ColumnContainer, ColumnFormModal } from '../features/columns';
import { TicketCard, TicketFormModal } from '../features/tickets';

/**
 * Vista Contenedora (Smart) para el Detalle del Tablero Kanban
 * Ruta: /boards/:boardId (Protegida)
 * Implementa Control de Concurrencia y Optimistic UI con Rollback
 */
export function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Estados de Modales
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState(null);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga del Tablero con Jerarquía Anidada (Board -> Column -> Ticket)
  const fetchBoardDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await boardService.getBoardById(boardId);
      setBoard(data);
      setIsUsingMocks(false);
    } catch (err) {
      console.warn(`Fallo al cargar tablero ${boardId}. Probando mock fallback:`, err);
      // Buscar en mocks como fallback
      const foundInMock = mockBoards.find((b) => b._id === boardId) || mockBoards[0];
      if (foundInMock) {
        setBoard(structuredClone(foundInMock));
        setIsUsingMocks(true);
        toast.info('Mostrando datos sintéticos para este tablero (Modo Offline)', 'DATOS MOCK');
      } else {
        setError(err.message || 'Tablero no encontrado');
      }
    } finally {
      setIsLoading(false);
    }
  }, [boardId, toast]);

  useEffect(() => {
    fetchBoardDetail();
  }, [fetchBoardDetail]);

  // =========================================================================
  // Control de Concurrencia y Algoritmo de Optimistic UI con Rollback
  // =========================================================================
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // 1. Si no hay destino o se soltó en la misma posición, no hacer nada
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const targetColId = destination.droppableId;
    const newOrder = destination.index;

    // 2. Guardar copia de seguridad inmutable del estado actual para rollback
    const previousBoard = structuredClone(board);

    // 3. Aplicar mutación optimista local inmediatamente antes de que el servidor responda
    setBoard((currentBoard) => {
      const next = structuredClone(currentBoard);
      const sourceCol = next.columns.find((c) => c._id === sourceColId);
      const targetCol = next.columns.find((c) => c._id === targetColId);

      if (!sourceCol || !targetCol) return currentBoard;

      // Remover el ticket de la columna de origen
      const [movedTicket] = sourceCol.tickets.splice(source.index, 1);
      if (!movedTicket) return currentBoard;

      // Actualizar metadatos de columna y orden
      movedTicket.columnId = targetColId;
      movedTicket.order = newOrder;

      // Insertar el ticket en la columna de destino
      targetCol.tickets.splice(newOrder, 0, movedTicket);

      // Re-indexar los órdenes locales
      targetCol.tickets.forEach((t, index) => {
        t.order = index;
      });

      return next;
    });

    // 4. Ejecutar petición al backend en segundo plano
    if (!isUsingMocks) {
      try {
        await ticketService.updateTicket(board._id, sourceColId, draggableId, {
          targetColumnId: targetColId,
          order: newOrder,
        });
      } catch (apiError) {
        // 5. ROLLBACK AUTOMÁTICO ante error 400, 404 o 500
        console.error('[Optimistic UI] Error al persistir movimiento. Ejecutando rollback:', apiError);
        setBoard(previousBoard);

        const errorMsg =
          apiError.response?.data?.error ||
          apiError.message ||
          'Error al mover el ticket. Operación revertida.';
        toast.error(errorMsg, 'ROLLBACK DE ESTADO');
      }
    }
  };

  // =========================================================================
  // Mutaciones de Columnas (Petición estándar con indicador de carga)
  // =========================================================================
  const handleSaveColumn = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCol) {
        if (!isUsingMocks) {
          await columnService.updateColumn(board._id, editingCol._id, formData);
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          const col = next.columns.find((c) => c._id === editingCol._id);
          if (col) col.title = formData.title;
          return next;
        });
        toast.success(`Columna renombrada a "${formData.title}"`, 'SYS.COLUMN');
      } else {
        let createdCol;
        if (!isUsingMocks) {
          createdCol = await columnService.createColumn(board._id, formData);
          createdCol.tickets = [];
        } else {
          createdCol = {
            _id: `67b60e22${Date.now().toString().slice(-16)}`,
            title: formData.title,
            boardId: board._id,
            order: board.columns.length,
            tickets: [],
          };
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          next.columns.push(createdCol);
          return next;
        });
        toast.success(`Columna "${formData.title}" agregada`, 'SYS.COLUMN');
      }
      setIsColModalOpen(false);
      setEditingCol(null);
    } catch (err) {
      toast.error(err.message || 'Error al guardar la columna', 'ERROR');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // Mutaciones de Tickets (Petición estándar con indicador de carga)
  // =========================================================================
  const handleSaveTicket = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTicket) {
        if (!isUsingMocks) {
          await ticketService.updateTicket(
            board._id,
            editingTicket.columnId,
            editingTicket._id,
            formData
          );
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          for (const col of next.columns) {
            const t = col.tickets.find((item) => item._id === editingTicket._id);
            if (t) {
              t.title = formData.title;
              t.description = formData.description;
              t.priority = formData.priority;
              break;
            }
          }
          return next;
        });
        toast.success(`Ticket actualizado`, 'SYS.TICKET');
      } else {
        let createdTicket;
        if (!isUsingMocks) {
          createdTicket = await ticketService.createTicket(
            board._id,
            targetColumnId,
            formData
          );
        } else {
          createdTicket = {
            _id: `67b60e33${Date.now().toString().slice(-16)}`,
            ...formData,
            columnId: targetColumnId,
            order: 99,
            createdAt: new Date().toISOString(),
          };
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          const col = next.columns.find((c) => c._id === targetColumnId);
          if (col) {
            if (!col.tickets) col.tickets = [];
            col.tickets.push(createdTicket);
          }
          return next;
        });
        toast.success(`Ticket "${formData.title}" creado`, 'SYS.TICKET');
      }
      setIsTicketModalOpen(false);
      setEditingTicket(null);
      setTargetColumnId(null);
    } catch (err) {
      toast.error(err.message || 'Error al procesar el ticket', 'ERROR');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // Borrado con confirmación de borrado en cascada
  // =========================================================================
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      if (itemToDelete.type === 'column') {
        const col = itemToDelete.data;
        const ticketCount = col.tickets?.length || 0;
        if (!isUsingMocks) {
          await columnService.deleteColumn(board._id, col._id);
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          next.columns = next.columns.filter((c) => c._id !== col._id);
          return next;
        });
        toast.error(
          `Columna "${col.title}" y sus ${ticketCount} tickets eliminados en cascada`,
          'BORRADO EN CASCADA'
        );
      } else if (itemToDelete.type === 'ticket') {
        const ticket = itemToDelete.data;
        if (!isUsingMocks) {
          await ticketService.deleteTicket(board._id, ticket.columnId, ticket._id);
        }
        setBoard((prev) => {
          const next = structuredClone(prev);
          for (const col of next.columns) {
            col.tickets = col.tickets.filter((t) => t._id !== ticket._id);
          }
          return next;
        });
        toast.info('Ticket eliminado', 'SYS.TICKET');
      }
      setIsConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el elemento', 'ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text flex flex-col transition-colors duration-200">
      <Navbar
        user={user}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
        currentBoardTitle={board?.title}
        onBackClick={() => navigate('/boards')}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col max-w-full p-4 sm:p-6 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-retro-border shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/boards')}
              className="p-1.5 rounded hover:bg-retro-card text-retro-muted hover:text-retro-text border border-retro-border shadow-retro-sm transition-colors"
              title="Volver al listado de tableros"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-retro-accent">
                  {board ? `#BD-${board._id.slice(-6).toUpperCase()}` : '#BOARD'}
                </span>
                {isUsingMocks && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-retro-warning/15 text-retro-warning border border-retro-warning/30 font-semibold">
                    OFFLINE FALLBACK
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-retro-text truncate max-w-xl">
                {board?.title || 'Cargando tablero...'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={fetchBoardDetail}
              disabled={isLoading}
            >
              Refrescar
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingCol(null);
                setIsColModalOpen(true);
              }}
            >
              Nueva Columna
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-20">
            <Spinner size="lg" />
            <p className="font-mono text-xs text-retro-muted animate-pulse">
              SINCRONIZANDO COLUMNAS Y TICKETS KANBAN...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6 m-auto max-w-lg rounded-lg bg-retro-card border border-retro-danger shadow-retro text-center space-y-4">
            <div className="inline-flex p-3 rounded-lg bg-retro-danger/10 text-retro-danger border border-retro-danger/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-retro-text">
                Error al acceder al tablero
              </h3>
              <p className="text-xs text-retro-muted mt-1 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => navigate('/boards')}>
                Volver a Tableros
              </Button>
              <Button variant="primary" size="sm" onClick={fetchBoardDetail}>
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Kanban Board Drag and Drop Canvas */}
        {!isLoading && !error && board && (
          <div className="flex-1 pt-4 overflow-x-auto min-h-0">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex items-start gap-4 h-full pb-4">
                {board.columns?.map((column) => (
                  <Droppable key={column._id} droppableId={column._id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`transition-colors rounded-lg ${
                          snapshot.isDraggingOver
                            ? 'ring-2 ring-retro-accent/60 bg-retro-accent/5'
                            : ''
                        }`}
                      >
                        <ColumnContainer
                          column={column}
                          onAddTicket={(colId) => {
                            setTargetColumnId(colId);
                            setEditingTicket(null);
                            setIsTicketModalOpen(true);
                          }}
                          onEditColumn={(col) => {
                            setEditingCol(col);
                            setIsColModalOpen(true);
                          }}
                          onDeleteColumn={(col) => {
                            setItemToDelete({ type: 'column', data: col });
                            setIsConfirmOpen(true);
                          }}
                        >
                          {column.tickets?.map((ticket, index) => (
                            <Draggable
                              key={ticket._id}
                              draggableId={ticket._id}
                              index={index}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                >
                                  <TicketCard
                                    ticket={ticket}
                                    dragHandleProps={dragProvided.dragHandleProps}
                                    isDragging={dragSnapshot.isDragging}
                                    onEdit={(t) => {
                                      setEditingTicket(t);
                                      setTargetColumnId(column._id);
                                      setIsTicketModalOpen(true);
                                    }}
                                    onDelete={(t) => {
                                      setItemToDelete({ type: 'ticket', data: t });
                                      setIsConfirmOpen(true);
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ColumnContainer>
                      </div>
                    )}
                  </Droppable>
                ))}

                {board.columns?.length === 0 && (
                  <div className="m-auto py-16 px-8 text-center border border-dashed border-retro-border rounded-lg bg-retro-card/40 space-y-3">
                    <Layers className="w-8 h-8 text-retro-muted mx-auto" />
                    <div>
                      <h3 className="text-sm font-bold text-retro-text">
                        Tablero sin columnas
                      </h3>
                      <p className="text-xs text-retro-muted mt-0.5">
                        Agrega al menos una columna para comenzar a crear y ordenar tickets.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => setIsColModalOpen(true)}
                    >
                      Crear Primera Columna
                    </Button>
                  </div>
                )}
              </div>
            </DragDropContext>
          </div>
        )}

        {/* Modal de Columnas */}
        <ColumnFormModal
          isOpen={isColModalOpen}
          onClose={() => {
            setIsColModalOpen(false);
            setEditingCol(null);
          }}
          onSubmit={handleSaveColumn}
          initialData={editingCol}
          isSubmitting={isSubmitting}
        />

        {/* Modal de Tickets */}
        <TicketFormModal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setEditingTicket(null);
            setTargetColumnId(null);
          }}
          onSubmit={handleSaveTicket}
          initialData={editingTicket}
          isSubmitting={isSubmitting}
        />

        {/* Diálogo de Confirmación con advertencia de cascada */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title={
            itemToDelete?.type === 'column'
              ? `¿Eliminar columna "${itemToDelete.data.title}"?`
              : `¿Eliminar ticket "${itemToDelete?.data.title}"?`
          }
          message="Esta operación eliminará permanentemente el registro de la base de datos."
          cascadeWarning={
            itemToDelete?.type === 'column'
              ? `Se eliminarán automáticamente los ${itemToDelete.data.tickets?.length || 0} tickets hijos asociados a esta columna.`
              : undefined
          }
          confirmText="Sí, eliminar"
          isSubmitting={isSubmitting}
        />

      </main>
    </div>
  );
}

export default BoardDetailPage;
