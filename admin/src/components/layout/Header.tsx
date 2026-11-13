import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const { user, logout } = useAuth();
  const initial = user?.name.trim().charAt(0).toUpperCase() ?? 'A';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-ink/90 px-4 backdrop-blur sm:px-6">
      <button type="button" onClick={onOpenMenu} aria-label="Abrir menu" className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden">
        <Menu className="size-5" />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-gold font-bold text-ink" aria-hidden>
            {initial}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-white">{user?.name ?? 'Administrador'}</p>
            <p className="text-xs text-slate-400">{user?.role === 'SUPER_ADMIN' ? 'Super admin' : 'Administrador'}</p>
          </div>
        </div>
        <button type="button" onClick={() => void logout()} className="btn-ghost" aria-label="Sair">
          <LogOut className="size-4" aria-hidden />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
