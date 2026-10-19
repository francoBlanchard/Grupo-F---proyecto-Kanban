import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardSchema } from './boardSchema';
import { Modal, Input, Textarea, Button } from '../../components';

/**
 * Modal controlado para creación y edición de Tableros con RHF + Zod
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (data: { title: string, description?: string }) => Promise<void> | void,
 *   initialData?: { title?: string, description?: string } | null,
 *   isSubmitting?: boolean
 * }} props
 */
export function BoardFormModal({
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
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Sincronizar datos al abrir o cambiar initialData
  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || '',
        description: initialData?.description || '',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
    } catch (err) {
      // Mapear error 400 del backend directamente al campo title o general
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
      title={isEditing ? 'Editar Tablero' : 'Nuevo Tablero'}
      subtitle={isEditing ? 'MODIFICACIÓN DE RECURSO' : 'CREACIÓN DE RECURSO'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Título del Tablero"
          required
          placeholder="Ej. Plataforma E-Commerce Sprint 1"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Descripción (Opcional)"
          placeholder="Describe el objetivo y alcance de este tablero..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Tablero'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default BoardFormModal;
