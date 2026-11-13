import { X } from 'lucide-react';
import { useEscapeKey } from '../../hooks';
import { useSecurity } from '../../contexts/SecurityContext';

export default function PrivacyModal() {
  const { isPrivacyOpen, setPrivacyOpen } = useSecurity();
  const close = () => setPrivacyOpen(false);
  useEscapeKey(isPrivacyOpen, close);
  if (!isPrivacyOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-modal="true" aria-labelledby="privacy-title" className="bg-[#0e2a2b] border border-genesis-accent/30 w-full max-w-2xl max-h-[85vh] rounded-[24px] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#070707]/50">
          <h2 id="privacy-title" className="text-white font-heading font-black uppercase text-lg md:text-xl">Política de Privacidade e Cookies</h2>
          <button onClick={close} aria-label="Fechar" className="text-gray-400 hover:text-white transition"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 text-[14.5px] leading-relaxed custom-scrollbar">
          <h3 className="text-genesis-accent font-bold mb-2">1. Coleta de Dados</h3>
          <p className="mb-4">Coletamos informações fornecidas ativamente por você através de nossos formulários para fins de contato comercial.</p>
          <h3 className="text-genesis-accent font-bold mb-2">2. Segurança (LGPD)</h3>
          <p className="mb-4">Seus dados são armazenados de forma segura e criptografada. Não compartilhamos informações com terceiros.</p>
          <h3 className="text-genesis-accent font-bold mb-2">3. Uso de Cookies</h3>
          <p className="mb-4">Utilizamos cookies para manter o estado de segurança e lembrar seu aceite a este termo.</p>
        </div>
        <div className="p-5 border-t border-white/10 bg-[#070707]/50 flex justify-end">
          <button autoFocus onClick={close} className="px-6 py-2.5 rounded-xl bg-genesis-accent text-genesis-surface font-extrabold text-[14px]">Entendi</button>
        </div>
      </div>
    </div>
  );
}
