import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../lib/errors';

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin/leads';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Login realizado com sucesso.');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,#1C2541,#0B132B_65%)] p-4">
      <form onSubmit={onSubmit} className="panel w-full max-w-md space-y-5 p-8 shadow-2xl">
        <div className="text-center">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-accent/40 bg-ink text-2xl font-black text-accent">G</span>
          <h1 className="text-2xl font-extrabold text-white">Genesis Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Entre para gerenciar o mostruário e os orçamentos.</p>
        </div>

        <div>
          <label htmlFor="email" className="label">E-mail</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="password" className="label">Senha</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Entrar
        </button>
      </form>
    </main>
  );
};
