import { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Componente presentacional Select compatible con React Hook Form
 */
export const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    helperText,
    id,
    name,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const selectId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-retro-text tracking-wide"
        >
          {label} {required && <span className="text-retro-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={`w-full px-3 py-2 pr-9 rounded-md bg-retro-bg text-retro-text border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-retro-accent/40 appearance-none font-sans cursor-pointer ${
            error
              ? 'border-retro-danger focus:border-retro-danger'
              : 'border-retro-border focus:border-retro-accent hover:border-retro-text/40'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-retro-card text-retro-text">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-retro-muted">
          {error ? (
            <AlertCircle className="w-4 h-4 text-retro-danger" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {error ? (
        <p
          id={`${selectId}-error`}
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

export default Select;
