import { X } from 'lucide-react';

/**
 * Componente presentacional Modal (Puro / Sin useEffect)
 * Controlado al 100% mediante props (isOpen, onClose)
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   subtitle?: string,
 *   children: React.ReactNode,
 *   footer?: React.ReactNode,
 *   maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
 * }} props
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}) {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-bg/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className={`w-full ${maxWidthStyles[maxWidth] || maxWidthStyles.md} bg-retro-card text-retro-text border border-retro-border rounded-lg shadow-retro-md overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 border-b border-retro-border bg-retro-card">
          <div>
            <h3 id="modal-title" className="text-base font-bold tracking-tight text-retro-text">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-mono text-retro-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-retro-muted hover:text-retro-text hover:bg-retro-bg border border-transparent hover:border-retro-border transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-retro-border bg-retro-card/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
