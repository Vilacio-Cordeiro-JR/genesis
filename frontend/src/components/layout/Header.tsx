import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#solucoes', label: 'Soluções' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#contato', label: 'Contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#070707]/90 backdrop-blur-md border-b border-white/10">
      <div className="w-full max-w-[1152px] mx-auto px-5">
        <div className="flex items-center justify-between h-[68px]">
          <a href="#topo" className="flex items-center gap-2 font-heading font-black text-[17px] text-white uppercase tracking-wider">
            Genesis Tech
          </a>
          <nav aria-label="Principal" className="hidden md:flex gap-6 text-[14.5px] font-medium text-gray-300">
            {links.map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-genesis-accent transition-colors">{label}</a>
            ))}
          </nav>
          <div className="hidden md:flex">
            <a href="#contato" className="bg-genesis-accent text-genesis-surface px-5 py-2.5 rounded-2xl font-extrabold text-[14px] hover:bg-genesis-accentHover transition-colors shadow-[0_0_28px_rgba(31,181,188,0.35)]">
              Solicitar orçamento
            </a>
          </div>
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-white"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Principal (celular)" className="md:hidden border-t border-white/10 bg-[#070707]">
          <div className="w-full max-w-[1152px] mx-auto px-5 py-4 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="py-3 text-[16px] font-medium text-gray-200 hover:text-genesis-accent transition-colors">{label}</a>
            ))}
            <a href="#contato" onClick={() => setOpen(false)} className="mt-2 text-center bg-genesis-accent text-genesis-surface px-5 py-3 rounded-2xl font-extrabold text-[15px]">
              Solicitar orçamento
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
