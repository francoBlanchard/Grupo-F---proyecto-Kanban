import { GripVertical, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '../../components';

/**
 * Componente presentacional TicketCard para las tarjetas de tareas Kanban
 * (Sin useEffect - puro props y callbacks)
 * @param {{
 *   ticket: {
 *     _id: string,
 *     title: string,
 *     description?: string,
 *     priority: 'low' | 'medium' | 'high',
 *     order?: number,
 *     columnId?: string
 *   },
 *   onEdit: (ticket: Object) => void,
 *   onDelete: (ticket: Object) => void,
 *   dragHandleProps?: Object,
 *   draggableProps?: Object,
 *   isDragging?: boolean
 * }} props
 */
export function TicketCard({
  ticket,
  onEdit,
  onDelete,
  dragHandleProps,
  draggableProps,
  isDragging = false,
}) {
  const ticketCode = ticket._id
    ? `#TK-${ticket._id.slice(-6).toUpperCase()}`
    : '#TK-LOCAL';

  const priorityLabels = {
    low: 'BAJA',
    medium: 'MEDIA',
    high: 'ALTA',
  };

  return (
    <div
      {...draggableProps}
      className={`p-3.5 rounded-md bg-retro-bg border transition-all duration-150 select-none ${
        isDragging
          ? 'border-retro-accent shadow-retro-md rotate-1 scale-[1.02] z-30'
          : 'border-retro-border hover:border-retro-accent/50 shadow-retro-sm hover:-translate-y-0.5'
      }`}
    >
      {/* Header: ID, Drag Handle & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="text-retro-muted hover:text-retro-text cursor-grab active:cursor-grabbing p-0.5"
              title="Arrastrar ticket"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="font-mono text-[11px] font-bold text-retro-muted">
            {ticketCode}
          </span>
        </div>

        <Badge variant={ticket.priority} mono>
          {priorityLabels[ticket.priority] || 'MEDIA'}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-retro-text tracking-tight leading-snug break-words">
        {ticket.title}
      </h3>

      {/* Description Preview (if present) */}
      {ticket.description && (
        <p className="text-xs text-retro-muted mt-1.5 line-clamp-2 leading-relaxed break-words">
          {ticket.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-3 pt-2 border-t border-retro-border/50 flex items-center justify-end gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(ticket);
          }}
          className="p-1 rounded text-retro-muted hover:text-retro-text hover:bg-retro-card transition-colors"
          title="Editar ticket"
          aria-label="Editar ticket"
        >
          <Edit3 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket);
          }}
          className="p-1 rounded text-retro-muted hover:text-retro-danger hover:bg-retro-card transition-colors"
          title="Eliminar ticket"
          aria-label="Eliminar ticket"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
