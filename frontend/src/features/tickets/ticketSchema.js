import { z } from 'zod';

/**
 * Esquema de validación declarativa para Tickets con Zod
 */
export const ticketSchema = z.object({
  title: z
    .string({ required_error: 'El título del ticket es obligatorio' })
    .trim()
    .min(1, 'El título del ticket es obligatorio')
    .max(150, 'El título no puede superar los 150 caracteres'),
  description: z
    .string()
    .trim()
    .max(2000, 'La descripción no puede superar los 2000 caracteres')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: "La prioridad debe ser 'Baja', 'Media' o 'Alta'" }),
  }),
});

export default ticketSchema;
