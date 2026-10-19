import { Loader2 } from 'lucide-react';

/**
 * Componente presentacional Spinner con estética retro
 * @param {{ size?: 'sm' | 'md' | 'lg', className?: string }} props
 */
export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin text-retro-accent shrink-0 ${sizeMap[size] || sizeMap.md} ${className}`}
      aria-label="Cargando..."
    />
  );
}

export default Spinner;
