import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * Diálogo presentacional de confirmación para eliminaciones destructivas en cascada
 * (Sin useEffect - puro props y callbacks)
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   title?: string,
 *   message: string,
 *   cascadeWarning?: string,
 *   confirmText?: string,
 *   cancelText?: string,
 *   isSubmitting?: boolean
 * }} props
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar operación?',
  message,
  cascadeWarning,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  isSubmitting = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="OPERACIÓN DESTRUCTIVA"
      maxWidth="sm"
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isSubmitting={isSubmitting}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-retro-danger/10 text-retro-danger border border-retro-danger/30 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm text-retro-text leading-relaxed">
            {message}
          </p>
        </div>

        {cascadeWarning && (
          <div className="p-2.5 rounded bg-retro-bg border border-retro-danger/40 text-xs font-mono text-retro-danger">
            <span className="font-bold block mb-0.5">[ADVERTENCIA DE CASCADA]</span>
            {cascadeWarning}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
