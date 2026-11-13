import { LayoutTemplate, MonitorSmartphone, Share2 } from 'lucide-react';

export default function Solutions() {
  return (
    <section id="solucoes" className="py-20 md:py-24 relative">
      <div className="w-full max-w-[1152px] mx-auto px-5">
        <div className="max-w-[680px] mx-auto mb-12 text-center">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase mb-3">O que <span className="text-genesis-accent">construímos</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <article className="bg-genesis-surface/55 border border-white/10 rounded-[24px] p-7 hover:border-genesis-accent/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-genesis-accent/10 border border-genesis-accent/20 flex items-center justify-center text-genesis-accent mb-4"><LayoutTemplate /></div>
            <h3 className="text-[1.02rem] uppercase font-extrabold mb-2.5 text-white">Desenvolvimento web</h3>
            <p className="text-gray-400 text-[15px]">Vitrines estáticas de alta velocidade focadas em conversão.</p>
          </article>
          <article className="bg-genesis-surface/55 border border-white/10 rounded-[24px] p-7 hover:border-genesis-accent/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-genesis-accent/10 border border-genesis-accent/20 flex items-center justify-center text-genesis-accent mb-4"><MonitorSmartphone /></div>
            <h3 className="text-[1.02rem] uppercase font-extrabold mb-2.5 text-white">Sistemas sob medida</h3>
            <p className="text-gray-400 text-[15px]">Painéis administrativos e automação de processos internos.</p>
          </article>
          <article className="bg-genesis-surface/55 border border-white/10 rounded-[24px] p-7 hover:border-genesis-accent/45 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-genesis-accent/10 border border-genesis-accent/20 flex items-center justify-center text-genesis-accent mb-4"><Share2 /></div>
            <h3 className="text-[1.02rem] uppercase font-extrabold mb-2.5 text-white">Integrações (APIs)</h3>
            <p className="text-gray-400 text-[15px]">Conexão segura entre bancos de dados e serviços em nuvem.</p>
          </article>
        </div>
      </div>
    </section>
  );
}