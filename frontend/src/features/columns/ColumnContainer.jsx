import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

/**
 * Componente presentacional ColumnContainer para el tablero Kanban
 * (Sin useEffect - puro props y callbacks)
 * @param {{
 *   column: {
 *     _id: string,
 *     title: string,
 *     order?: number,
 *     tickets?: Array
 *   },
 *   onAddTicket: (columnId: string) => void,
 *   onEditColumn: (column: Object) => void,
 *   onDeleteColumn: (column: Object) => void,
 *   children: React.ReactNode
 * }} props
 */
export function ColumnContainer({
  column,
  onAddTicket,
  onEditColumn,
  onDeleteColumn,
  children,
}) {
  const ticketCount = column.tickets?.length || 0;

  return (
    <div className="w-80 shrink-0 flex flex-col max-h-full rounded-lg bg-retro-card border border-retro-border shadow-retro">
      
      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-retro-border bg-retro-card/70 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-retro-bg border border-retro-border text-retro-accent">
            [{ticketCount}]
          </span>
          <h2 className="text-sm font-bold text-retro-text truncate tracking-tight" title={column.title}>
            {column.title}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onAddTicket(column._id)}
            className="p-1 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-accent border border-transparent hover:border-retro-border transition-colors"
            title="Agregar ticket"
            aria-label="Agregar ticket"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEditColumn(column)}
            className="p-1 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-text border border-transparent hover:border-retro-border transition-colors"
            title="Editar columna"
            aria-label="Editar columna"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDeleteColumn(column)}
            className="p-1 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-danger border border-transparent hover:border-retro-danger/30 transition-colors"
            title="Eliminar columna (cascada)"
            aria-label="Eliminar columna"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ticket List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[140px] max-h-[calc(100vh-240px)]">
        {children}
        {ticketCount === 0 && (
          <div className="py-8 text-center border border-dashed border-retro-border rounded-md">
            <span className="font-mono text-xs text-retro-muted block">
              [VACÍO // SIN TICKETS]
            </span>
            <button
              onClick={() => onAddTicket(column._id)}
              className="mt-2 text-xs font-medium text-retro-accent hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Crear primer ticket
            </button>
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-retro-border/60 bg-retro-card/40">
        <button
          onClick={() => onAddTicket(column._id)}
          className="w-full py-1.5 px-3 rounded flex items-center justify-center gap-1.5 text-xs font-medium text-retro-muted hover:text-retro-text hover:bg-retro-bg/60 transition-colors font-mono border border-transparent hover:border-retro-border"
        >
          <Plus className="w-3.5 h-3.5 text-retro-accent" />
          <span>NUEVO TICKET</span>
        </button>
      </div>

    </div>
  );
}

export default ColumnContainer;
