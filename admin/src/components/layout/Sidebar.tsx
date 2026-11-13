import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, FolderKanban, Inbox, X } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const links = [
  { to: '/admin/leads', label: 'Leads e Orçamentos', Icon: Inbox },
  { to: '/admin/projetos', label: 'Mostruário', Icon: FolderKanban },
];

export const Sidebar = ({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) => (
  <>
    {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onCloseMobile} aria-hidden />}
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-panel transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-accent/40 bg-card text-lg font-black text-accent">G</span>
          <span className={`text-sm font-extrabold tracking-wide text-white uppercase ${collapsed ? 'lg:hidden' : ''}`}>Genesis Admin</span>
        </div>
        <button type="button" onClick={onCloseMobile} aria-label="Fechar menu" className="text-slate-400 lg:hidden">
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Navegação do painel">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${collapsed ? 'lg:justify-center' : ''} ${
                isActive ? 'bg-accent/15 text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-white/10 p-3 lg:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  </>
);
