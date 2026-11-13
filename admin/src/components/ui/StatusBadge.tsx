import type { QuoteStatus } from '../../types/api';

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  PENDING: 'Pendente',
  CONTACTED: 'Contatado',
  ARCHIVED: 'Arquivado',
};

const STYLE: Record<QuoteStatus, string> = {
  PENDING: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30',
  CONTACTED: 'bg-green-400/15 text-green-300 border-green-400/30',
  ARCHIVED: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
};

export const StatusBadge = ({ status }: { status: QuoteStatus }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${STYLE[status]}`}>{STATUS_LABEL[status]}</span>
);
