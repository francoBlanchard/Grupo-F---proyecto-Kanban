import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Terminal, Shield, KeyRound, Sparkles } from 'lucide-react';
import { useAuth, useToast } from '../hooks';
import { Input, Button } from '../components';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe contener al menos 6 caracteres'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ruta previa para redirección inteligente tras login
  const from = location.state?.from?.pathname || '/boards';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.torvalds@devboard.io',
      password: 'password123',
    },
  });

  // Si ya está autenticado, redirigir inmediatamente
  if (isAuthenticated) {
    navigate('/boards', { replace: true });
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success(`Bienvenido a DevBoard, ${data.email.split('@')[0]}`, 'SESIÓN INICIADA');
      // Navegación programática ÚNICAMENTE tras resolución exitosa
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Error al autenticar credenciales', 'ERROR DE ACCESO');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'lead.engineer@devboard.io', { shouldValidate: true });
    setValue('password', 'secretPass2026', { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200">
      
      {/* Container */}
      <div className="w-full max-w-md bg-retro-card border border-retro-border rounded-xl p-8 shadow-retro-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-lg bg-retro-accent/15 text-retro-accent border border-retro-accent/30 shadow-retro-sm">
            <Terminal className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-retro-text">
            DevBoard
          </h1>
          <p className="font-mono text-xs text-retro-muted uppercase tracking-wider">
            [SISTEMA DE GESTIÓN KANBAN // ACCESO RESTRINGIDO]
          </p>
        </div>

        {/* Formulario con RHF + Zod */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="desarrollador@empresa.io"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Contraseña de Acceso"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isSubmitting={isSubmitting}
              icon={KeyRound}
              className="w-full"
            >
              Iniciar Sesión
            </Button>

            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded flex items-center justify-center gap-1.5 text-xs font-mono text-retro-muted hover:text-retro-text hover:bg-retro-bg/60 transition-colors border border-dashed border-retro-border"
            >
              <Sparkles className="w-3.5 h-3.5 text-retro-accent" />
              <span>Autocompletar Credenciales Demo</span>
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-4 border-t border-retro-border text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-retro-muted">
            <Shield className="w-3.5 h-3.5 text-retro-success" />
            CONEXIÓN SEGURA // PROTOCOLO SDD
          </span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
