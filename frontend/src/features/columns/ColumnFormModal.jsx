import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { columnSchema } from './columnSchema';
import { Modal, Input, Button } from '../../components';

/**
 * Modal controlado para creación y edición de Columnas con RHF + Zod
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (data: { title: string }) => Promise<void> | void,
 *   initialData?: { title?: string } | null,
 *   isSubmitting?: boolean
 * }} props
 */
export function ColumnFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || '',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      if (message) {
        setError('title', { type: 'server', message });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Renombrar Columna' : 'Nueva Columna'}
      subtitle={isEditing ? 'EDICIÓN DE ESTADO' : 'CREACIÓN DE ESTADO EN TABLERO'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Título de la Columna"
          required
          placeholder="Ej. Por hacer, En progreso, Listo"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-retro-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isSubmitting={isSubmitting}
          >
            {isEditing ? 'Actualizar Columna' : 'Crear Columna'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ColumnFormModal;
