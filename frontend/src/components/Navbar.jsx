import { Terminal, Sun, Moon, LogIn, LogOut, ArrowLeft, User } from 'lucide-react';
import Button from './Button';

/**
 * Componente presentacional Navbar (Sin useEffect - puro props y callbacks)
 * @param {{
 *   user?: { name: string, email: string, avatarTag?: string } | null,
 *   isAuthenticated?: boolean,
 *   theme: 'light' | 'dark',
 *   onToggleTheme: () => void,
 *   onLogout?: () => void,
 *   onLoginClick?: () => void,
 *   currentBoardTitle?: string,
 *   onBackClick?: () => void,
 * }} props
 */
export function Navbar({
  user = null,
  isAuthenticated = false,
  theme = 'light',
  onToggleTheme,
  onLogout,
  onLoginClick,
  currentBoardTitle,
  onBackClick,
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-retro-card/95 backdrop-blur border-b border-retro-border shadow-retro-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="p-1.5 rounded hover:bg-retro-bg text-retro-muted hover:text-retro-text border border-transparent hover:border-retro-border transition-colors"
              aria-label="Volver al listado"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-retro-accent/15 text-retro-accent border border-retro-accent/30 shadow-retro-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-retro-text">
              DevBoard
            </span>
          </div>

          {currentBoardTitle && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-retro-border text-xs font-mono">
              <span className="text-retro-muted">TABLERO:</span>
              <span className="font-semibold text-retro-accent truncate max-w-[200px]">
                {currentBoardTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-retro-border bg-retro-bg hover:border-retro-accent text-xs font-mono font-medium transition-colors shadow-retro-sm"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-retro-accent" />
                <span className="hidden md:inline">CLARO</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-retro-accent" />
                <span className="hidden md:inline">OSCURO</span>
              </>
            )}
          </button>

          {/* User Status / Login / Logout */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-retro-bg border border-retro-border text-xs font-mono">
                <User className="w-3 h-3 text-retro-muted" />
                <span className="font-semibold text-retro-text truncate max-w-[120px]">
                  {user.name}
                </span>
              </div>

              {onLogout && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onLogout}
                  icon={LogOut}
                >
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              )}
            </div>
          ) : (
            onLoginClick && (
              <Button
                variant="primary"
                size="sm"
                onClick={onLoginClick}
                icon={LogIn}
              >
                Ingresar
              </Button>
            )
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
