/**
 * Componente presentacional Badge para prioridades y metadatos
 * @param {{
 *   variant?: 'default' | 'low' | 'medium' | 'high' | 'accent' | 'success' | 'danger',
 *   mono?: boolean,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function Badge({
  variant = 'default',
  mono = true,
  children,
  className = '',
}) {
  const variantStyles = {
    default: 'bg-retro-card text-retro-text border-retro-border',
    low: 'bg-retro-accent/10 text-retro-accent border-retro-accent/30',
    medium: 'bg-retro-warning/15 text-retro-warning border-retro-warning/30',
    high: 'bg-retro-danger/15 text-retro-danger border-retro-danger/30',
    accent: 'bg-retro-accent/15 text-retro-accent border-retro-accent/30',
    success: 'bg-retro-success/15 text-retro-success border-retro-success/30',
    danger: 'bg-retro-danger/15 text-retro-danger border-retro-danger/30',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;
  const fontStyle = mono ? 'font-mono' : 'font-sans';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border ${selectedVariant} ${fontStyle} transition-colors tracking-tight ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
