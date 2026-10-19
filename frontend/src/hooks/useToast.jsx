import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastCounter = 0;

/**
 * Proveedor Global de Notificaciones Toast
 * Esencial para el feedback de Optimistic UI y reversión (Rollback)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', message, title, duration = 4000 }) => {
      const id = `toast-${Date.now()}-${++toastCounter}`;
      const newToast = { id, type, message, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (message, title = 'ÉXITO', duration = 3500) =>
        addToast({ type: 'success', message, title, duration }),
      error: (message, title = 'ERROR', duration = 5000) =>
        addToast({ type: 'error', message, title, duration }),
      warning: (message, title = 'ALERTA', duration = 4000) =>
        addToast({ type: 'warning', message, title, duration }),
      info: (message, title = 'INFO', duration = 3500) =>
        addToast({ type: 'info', message, title, duration }),
    }),
    [addToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      toast,
    }),
    [toasts, addToast, removeToast, toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Contenedor flotante retro de Toasts */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} item={item} onClose={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Componente atómico de Toast con estética Silicon Valley Retro-Tech
 */
function ToastItem({ item, onClose }) {
  const config = {
    success: {
      icon: CheckCircle2,
      label: '[SYS.SUCCESS]',
      borderClass: 'border-retro-success/60',
      textClass: 'text-retro-success',
      bgBadge: 'bg-retro-success/15',
    },
    error: {
      icon: AlertOctagon,
      label: '[SYS.ERROR]',
      borderClass: 'border-retro-danger/60',
      textClass: 'text-retro-danger',
      bgBadge: 'bg-retro-danger/15',
    },
    warning: {
      icon: AlertTriangle,
      label: '[SYS.WARN]',
      borderClass: 'border-retro-warning/60',
      textClass: 'text-retro-warning',
      bgBadge: 'bg-retro-warning/15',
    },
    info: {
      icon: Info,
      label: '[SYS.INFO]',
      borderClass: 'border-retro-accent/60',
      textClass: 'text-retro-accent',
      bgBadge: 'bg-retro-accent/15',
    },
  }[item.type] || config.info;

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-md bg-retro-card border ${config.borderClass} shadow-retro transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className={`p-1 rounded ${config.bgBadge} ${config.textClass} shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-mono text-[10px] font-bold ${config.textClass}`}>
            {config.label}
          </span>
          {item.title && (
            <span className="text-xs font-semibold text-retro-text truncate">
              {item.title}
            </span>
          )}
        </div>
        <p className="text-xs text-retro-muted break-words leading-relaxed">
          {item.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-text transition-colors shrink-0"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * Hook para disparar alertas toast
 * @returns {{ toasts: Array, addToast: Function, removeToast: Function, toast: Object }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
}

export default useToast;
