import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, AuthProvider, ToastProvider } from './hooks';
import { AppRoutes } from './routes/AppRoutes';

/**
 * Raíz de la Single Page Application (SPA) DevBoard
 * Ensambla el enrutador BrowserRouter con los tres contextos arquitectónicos
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
