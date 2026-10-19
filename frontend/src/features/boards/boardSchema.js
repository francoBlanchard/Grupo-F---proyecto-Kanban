import { z } from 'zod';

/**
 * Esquema de validación declarativa para Tableros con Zod
 */
export const boardSchema = z.object({
  title: z
    .string({ required_error: 'El título del tablero es obligatorio' })
    .trim()
    .min(1, 'El título del tablero es obligatorio')
    .max(120, 'El título no puede superar los 120 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export default boardSchema;
