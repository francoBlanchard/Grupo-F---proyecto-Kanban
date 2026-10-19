import { useNavigate } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Button } from '../components';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-retro-card border border-retro-border rounded-lg p-8 shadow-retro space-y-5">
        <div className="inline-flex p-3 rounded-lg bg-retro-accent/15 text-retro-accent border border-retro-accent/30 shadow-retro-sm">
          <Terminal className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono text-xs text-retro-danger font-bold block mb-1">
            [SYS.ERR // 404_PAGE_NOT_FOUND]
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-retro-text">
            Recurso No Localizado
          </h1>
          <p className="text-xs text-retro-muted mt-2 leading-relaxed">
            La ruta solicitada no existe en la jerarquía del sistema DevBoard.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/boards')}
            className="w-full"
          >
            Volver a Tableros
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
