import { z } from 'zod';

/**
 * Esquema de validación declarativa para Columnas con Zod
 */
export const columnSchema = z.object({
  title: z
    .string({ required_error: 'El título de la columna es obligatorio' })
    .trim()
    .min(1, 'El título de la columna es obligatorio')
    .max(80, 'El título no puede superar los 80 caracteres'),
});

export default columnSchema;
