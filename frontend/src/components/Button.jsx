import { forwardRef } from 'react';
import Spinner from './Spinner';

/**
 * Componente presentacional Button con soporte para variantes retro y estados de carga
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isSubmitting = false,
    disabled = false,
    icon: Icon,
    children,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-retro-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded gap-1.5 font-mono',
    md: 'text-sm px-4 py-2 rounded-md gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-retro-accent text-white hover:bg-retro-accent-hover active:translate-y-0.5 shadow-retro-sm border border-retro-accent-hover',
    secondary:
      'bg-retro-card text-retro-text border border-retro-border hover:border-retro-accent shadow-retro-sm active:translate-y-0.5',
    danger:
      'bg-retro-danger/10 text-retro-danger border border-retro-danger/30 hover:bg-retro-danger/20 active:translate-y-0.5 shadow-retro-sm',
    ghost:
      'bg-transparent text-retro-text hover:bg-retro-card/80 border border-transparent hover:border-retro-border',
    outline:
      'bg-transparent text-retro-accent border border-retro-accent/50 hover:bg-retro-accent/10 active:translate-y-0.5',
  };

  const isDisabled = disabled || isSubmitting;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Spinner size="sm" className="text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
});

export default Button;
