import { OctagonAlert } from 'lucide-react';
import { useEscapeKey } from '../../hooks';
import { useSecurity } from '../../contexts/SecurityContext';

export default function ErrorModal() {
  const { errorMsg, clearError } = useSecurity();
  useEscapeKey(Boolean(errorMsg), clearError);
  if (!errorMsg) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div role="alertdialog" aria-modal="true" aria-labelledby="error-title" aria-describedby="error-desc" className="bg-[#1a0f0f] border border-red-500/30 w-full max-w-md rounded-[24px] p-6 flex flex-col shadow-[0_15px_50px_rgba(239,68,68,0.2)] text-center items-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4"><OctagonAlert size={32} aria-hidden="true" /></div>
        <h3 id="error-title" className="text-white font-heading font-black text-xl mb-2">Falha na Operação</h3>
        <p id="error-desc" className="text-red-200/80 text-[15px] mb-6">{errorMsg}</p>
        <button autoFocus onClick={clearError} className="w-full py-3 rounded-xl bg-red-500 text-white font-extrabold text-[15px] hover:bg-red-600 transition">Fechar e tentar novamente</button>
      </div>
    </div>
  );
}
