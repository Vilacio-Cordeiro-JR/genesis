import { useSecurity } from '../../contexts/SecurityContext';

export default function GlobalLoading() {
  const { isLoading } = useSecurity();
  if (!isLoading) return null;
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-genesis-accent border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true"></div>
        <span className="text-genesis-accent font-bold tracking-widest uppercase text-[12px]">Processando...</span>
      </div>
    </div>
  );
}
