import { Check } from 'lucide-react';

export default function Hero() {
  return (
    <section id="topo" className="py-24 md:py-28 overflow-hidden relative">
      <div className="w-full max-w-[1152px] mx-auto px-5 relative z-10 grid md:grid-cols-[1.25fr_1fr] gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-genesis-surface/90 border border-genesis-accent/30 text-genesis-accent font-bold text-[11.5px] tracking-wider uppercase mb-5">
            <i className="w-2 h-2 rounded-full bg-genesis-accent block"></i> Código limpo · Foco em conversão
          </span>
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[1.1] tracking-tight mb-5">
            Engenharia de software e soluções web para <span className="bg-gradient-to-r from-genesis-accent to-white bg-clip-text text-transparent">alavancar o seu negócio</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-[34em] mb-8">
            Desenvolvemos <strong className="text-white font-semibold">plataformas de alta performance</strong> e automações com arquitetura limpa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a href="#portfolio" className="inline-flex justify-center items-center h-12 px-6 rounded-2xl bg-genesis-accent text-genesis-surface font-extrabold text-[15px] hover:bg-genesis-accentHover shadow-[0_0_28px_rgba(31,181,188,0.35)] transition-all">Ver nossos projetos</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-white/10 text-[13px] font-medium text-gray-300">
            <span className="flex items-center gap-2"><Check size={16} className="text-genesis-accent" /> Carregamento rápido</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-genesis-accent" /> Mobile primeiro</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-genesis-accent" /> SEO otimizado</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-genesis-accent" /> Suporte pós-entrega</span>
          </div>
        </div>
      </div>
    </section>
  );
}