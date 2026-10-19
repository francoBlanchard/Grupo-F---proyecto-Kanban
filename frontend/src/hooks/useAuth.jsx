import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Proveedor de Sesión y Autenticación
 * Diseñado según la sección 2 del Plan de Implementación para soportar
 * autenticación simulada persistida en localStorage y conexión transparente con JWT
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Iniciar sesión de usuario
   * @param {{ email: string, password?: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Simular latencia de red para feedback UX visual (isSubmitting)
      await new Promise((resolve) => setTimeout(resolve, 350));

      const cleanEmail = credentials.email?.trim() || 'developer@devboard.io';
      const cleanName = cleanEmail.includes('@')
        ? cleanEmail.split('@')[0].replace('.', ' ').toUpperCase()
        : 'DEVELOPER';

      const mockToken = `devboard_jwt_${btoa(cleanEmail)}_${Date.now()}`;
      const mockUser = {
        id: 'usr-dev-849f2a',
        name: cleanName,
        email: cleanEmail,
        role: 'Fullstack Engineer',
        avatarTag: cleanName.slice(0, 2),
      };

      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);

      return { success: true, user: mockUser };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión y purgar credenciales
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('devboard_token');
    } catch (e) {
      console.warn('Error al limpiar localStorage en logout:', e);
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para consumir el estado y acciones de autenticación
 * @returns {{ user: Object|null, token: string|null, isAuthenticated: boolean, isLoading: boolean, login: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

export default useAuth;
