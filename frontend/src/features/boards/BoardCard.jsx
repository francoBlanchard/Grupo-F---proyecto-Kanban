import { Layout, Calendar, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { Badge, Button } from '../../components';

/**
 * Componente presentacional BoardCard para la vista de listado de tableros
 * (Sin useEffect - puro props y callbacks)
 * @param {{
 *   board: {
 *     _id: string,
 *     title: string,
 *     description?: string,
 *     columns?: Array,
 *     createdAt?: string,
 *     updatedAt?: string
 *   },
 *   onOpen: (boardId: string) => void,
 *   onEdit: (board: Object) => void,
 *   onDelete: (board: Object) => void
 * }} props
 */
export function BoardCard({ board, onOpen, onEdit, onDelete }) {
  const columnCount = board.columns?.length || 0;
  const ticketCount =
    board.columns?.reduce((acc, col) => acc + (col.tickets?.length || 0), 0) || 0;

  const formattedDate = board.createdAt
    ? new Date(board.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const boardTag = board._id ? `#BD-${board._id.slice(-6).toUpperCase()}` : '#BOARD';

  return (
    <div className="flex flex-col justify-between p-5 rounded-lg bg-retro-card border border-retro-border hover:border-retro-accent/60 shadow-retro transition-all duration-150 group">
      
      {/* Top Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="accent" mono>
            {boardTag}
          </Badge>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-retro-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div>
          <h3
            onClick={() => onOpen(board._id)}
            className="text-lg font-bold text-retro-text hover:text-retro-accent cursor-pointer transition-colors tracking-tight line-clamp-1"
          >
            {board.title}
          </h3>
          <p className="text-xs text-retro-muted mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
            {board.description || 'Sin descripción registrada para este tablero.'}
          </p>
        </div>
      </div>

      {/* Metrics & Actions Section */}
      <div className="mt-5 pt-4 border-t border-retro-border/70 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-retro-bg border border-retro-border text-retro-text font-semibold">
            {columnCount} {columnCount === 1 ? 'COLUMNA' : 'COLUMNAS'}
          </span>
          <span className="text-retro-muted">
            {ticketCount} {ticketCount === 1 ? 'TICKET' : 'TICKETS'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(board)}
            className="p-1.5 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-text border border-transparent hover:border-retro-border transition-colors"
            title="Editar tablero"
            aria-label="Editar tablero"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => onDelete(board)}
            className="p-1.5 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-danger border border-transparent hover:border-retro-danger/30 transition-colors"
            title="Eliminar tablero"
            aria-label="Eliminar tablero"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpen(board._id)}
            className="ml-1"
          >
            <span>Abrir</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

    </div>
  );
}

export default BoardCard;
