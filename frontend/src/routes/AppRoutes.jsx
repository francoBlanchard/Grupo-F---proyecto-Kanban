import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import BoardsListPage from '../pages/BoardsListPage';
import BoardDetailPage from '../pages/BoardDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Matriz de rutas SPA de DevBoard
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública de autenticación */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirección raíz a /boards */}
      <Route path="/" element={<Navigate to="/boards" replace />} />

      {/* Rutas protegidas por ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/boards" element={<BoardsListPage />} />
        <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      </Route>

      {/* Ruta 404 para cualquier ruta no mapeada */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
