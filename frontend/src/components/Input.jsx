import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente presentacional Input compatible con React Hook Form
 * Incluye renderizado de errores inline mapeados desde Zod o respuestas 400
 */
export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    mono = false,
    id,
    name,
    type = 'text',
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-retro-text tracking-wide"
        >
          {label} {required && <span className="text-retro-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full px-3 py-2 rounded-md bg-retro-bg text-retro-text border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-retro-accent/40 ${
            mono ? 'font-mono' : 'font-sans'
          } ${
            error
              ? 'border-retro-danger focus:border-retro-danger pr-9'
              : 'border-retro-border focus:border-retro-accent hover:border-retro-text/40'
          } ${className}`}
          {...props}
        />

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-retro-danger">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-xs text-retro-danger font-medium flex items-center gap-1 mt-1"
        >
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-retro-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
