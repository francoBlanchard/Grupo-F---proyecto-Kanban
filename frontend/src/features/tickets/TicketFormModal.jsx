import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema } from './ticketSchema';
import { Modal, Input, Textarea, Select, Button } from '../../components';

/**
 * Modal controlado para creación y edición de Tickets con RHF + Zod
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (data: { title: string, description?: string, priority: string }) => Promise<void> | void,
 *   initialData?: { title?: string, description?: string, priority?: string } | null,
 *   isSubmitting?: boolean
 * }} props
 */
export function TicketFormModal({
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
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'medium',
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

  const priorityOptions = [
    { value: 'low', label: 'Baja (Low Priority)' },
    { value: 'medium', label: 'Media (Medium Priority)' },
    { value: 'high', label: 'Alta (High Priority)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Ticket' : 'Nuevo Ticket'}
      subtitle={isEditing ? 'MODIFICACIÓN DE TAREA' : 'CREACIÓN DE TAREA EN COLUMNA'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Título del Ticket"
          required
          placeholder="Ej. Implementar arquitectura de microservicios"
          error={errors.title?.message}
          {...register('title')}
        />

        <Select
          label="Nivel de Prioridad"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />

        <Textarea
          label="Descripción Técnica (Opcional)"
          placeholder="Detalla especificaciones, contratos o notas de desarrollo..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default TicketFormModal;
