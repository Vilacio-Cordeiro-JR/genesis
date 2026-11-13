import { useSecurity } from '../../contexts/SecurityContext';

export default function Footer() {
  const { setPrivacyOpen } = useSecurity();
  return (
    <footer className="py-12 md:py-24 text-[14.5px] text-gray-400 bg-[#050505]">
      <div className="w-full max-w-[1152px] mx-auto px-5">
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr] gap-10">
          <div>
            <a href="#topo" className="font-heading font-black text-[17px] text-white uppercase tracking-wider">Genesis Tech</a>
            <p className="mt-3 max-w-[26em]">Engenharia de software e soluções web sob medida.</p>
          </div>
          <div>
            <h3 className="font-extrabold text-[13px] uppercase tracking-[0.08em] text-white mb-4">Contato</h3>
            <ul className="grid gap-2">
              <li><a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-genesis-accent transition-colors">WhatsApp</a></li>
              <li><a href="mailto:contato@genesistech.com.br" className="hover:text-genesis-accent transition-colors">E-mail</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold text-[13px] uppercase tracking-[0.08em] text-white mb-4">Legal</h3>
            <ul className="grid gap-2">
              <li><button type="button" onClick={() => setPrivacyOpen(true)} className="hover:text-genesis-accent transition-colors text-left">Política de Privacidade</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-[13px]">
          © {new Date().getFullYear()} Genesis Tech. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
