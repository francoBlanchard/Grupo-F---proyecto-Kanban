import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente presentacional Textarea compatible con React Hook Form
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    name,
    rows = 3,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const textareaId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-retro-text tracking-wide"
        >
          {label} {required && <span className="text-retro-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={`w-full px-3 py-2 rounded-md bg-retro-bg text-retro-text border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-retro-accent/40 resize-y font-sans ${
            error
              ? 'border-retro-danger focus:border-retro-danger'
              : 'border-retro-border focus:border-retro-accent hover:border-retro-text/40'
          } ${className}`}
          {...props}
        />

        {error && (
          <div className="absolute top-3 right-3 pointer-events-none text-retro-danger">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p
          id={`${textareaId}-error`}
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

export default Textarea;
