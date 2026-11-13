import { useSecurity } from '../../contexts/SecurityContext';

export default function CookieBanner() {
  const { cookieConsent, acceptCookies, rejectCookies, setPrivacyOpen } = useSecurity();
  if (cookieConsent !== null) return null;
  return (
    <div role="region" aria-label="Aviso de cookies" className="fixed bottom-0 left-0 right-0 z-[100] bg-[#070707]/95 backdrop-blur-xl border-t border-genesis-accent/30 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="w-full max-w-[1152px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-300 text-[14px]">
          Nós utilizamos cookies e tecnologias de segurança para melhorar sua experiência. Ao continuar, você concorda com nossa{' '}
          <button onClick={() => setPrivacyOpen(true)} className="text-genesis-accent hover:underline font-bold">Política de Privacidade</button>.
        </p>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <button onClick={rejectCookies} className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-white/20 text-white font-semibold text-[13px] hover:bg-white/10 transition">Recusar</button>
          <button onClick={acceptCookies} className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-genesis-accent text-genesis-surface font-extrabold text-[13px] hover:bg-genesis-accentHover transition shadow-[0_0_15px_rgba(31,181,188,0.3)]">Aceitar Todos</button>
        </div>
      </div>
    </div>
  );
}
