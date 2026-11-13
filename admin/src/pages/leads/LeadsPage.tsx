import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { StatusBadge, STATUS_LABEL } from '../../components/ui/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../lib/errors';
import { formatDate } from '../../lib/format';
import { projectsService } from '../../services/projects.service';
import { quotesService, type QuoteMetrics, type QuotesPage } from '../../services/quotes.service';
import { QUOTE_STATUSES, type Quote, type QuoteStatus } from '../../types/api';
import { LeadDetailModal } from './LeadDetailModal';

const MetricCard = ({ label, value, accent }: { label: string; value: number | null; accent: string }) => (
  <div className="panel p-5">
    <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
    <p className={`mt-2 text-3xl font-extrabold ${accent}`}>{value ?? '—'}</p>
  </div>
);

export const LeadsPage = () => {
  const toast = useToast();
  const [status, setStatus] = useState<QuoteStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<QuotesPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<QuoteMetrics | null>(null);
  const [presetTitles, setPresetTitles] = useState<Map<string, string>>(new Map());
  const [selected, setSelected] = useState<Quote | null>(null);
  const requestId = useRef(0);

  const loadList = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const result = await quotesService.list(status, page);
      if (id === requestId.current) setData(result);
    } catch (error) {
      if (id === requestId.current) toast.error(getErrorMessage(error));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [status, page, toast]);

  const loadMetrics = useCallback(async () => {
    try {
      setMetrics(await quotesService.metrics());
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [toast]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadMetrics();
    projectsService
      .listAll()
      .then((projects) => setPresetTitles(new Map(projects.map((project) => [project.id, project.title]))))
      .catch(() => undefined);
  }, [loadMetrics]);

  const changeFilter = (next: QuoteStatus | undefined) => {
    setStatus(next);
    setPage(1);
  };

  const onSaved = (updated: Quote) => {
    setSelected(null);
    void loadList();
    void loadMetrics();
    toast.info(`Status atual: ${STATUS_LABEL[updated.status]}`);
  };

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Leads e orçamentos</h1>
        <p className="mt-1 text-sm text-slate-400">Solicitações recebidas pela vitrine.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Métricas">
        <MetricCard label="Total de leads" value={metrics?.total ?? null} accent="text-white" />
        <MetricCard label="Pendentes" value={metrics?.pending ?? null} accent="text-yellow-300" />
        <MetricCard label="Contatados neste mês" value={metrics?.contactedThisMonth ?? null} accent="text-accent" />
      </section>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
        {[undefined, ...QUOTE_STATUSES].map((value) => (
          <button
            key={value ?? 'ALL'}
            type="button"
            aria-pressed={status === value}
            onClick={() => changeFilter(value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              status === value ? 'border-accent bg-accent text-ink' : 'border-white/15 text-slate-300 hover:bg-white/5'
            }`}
          >
            {value ? STATUS_LABEL[value] : 'Todos'}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-white/10 bg-panel/60 text-xs tracking-wide text-slate-400 uppercase">
              <tr>
                {['Data', 'Cliente', 'Empresa', 'Solução', 'Estilo', 'Status', ''].map((heading, index) => (
                  <th key={index} scope="col" className="px-4 py-3 font-semibold">
                    {heading || <span className="sr-only">Ações</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">Carregando orçamentos...</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">Nenhum orçamento encontrado.</td>
                </tr>
              )}
              {items.map((quote) => (
                <tr key={quote.id} className={`transition-colors hover:bg-white/[0.03] ${loading ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">{formatDate(quote.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{quote.clientName}</p>
                    <p className="text-xs text-slate-400">{quote.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3">{quote.companyName || '—'}</td>
                  <td className="px-4 py-3">{quote.solutionType}</td>
                  <td className="max-w-[200px] truncate px-4 py-3">{quote.selectedPresetId ? (presetTitles.get(quote.selectedPresetId) ?? 'Estilo removido') : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={quote.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setSelected(quote)} className="btn-ghost !min-h-9 !px-3" aria-label={`Ver detalhes de ${quote.clientName}`}>
                      <Eye className="size-4" aria-hidden />
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-slate-400">
            <span>
              Página {page} de {data.totalPages} · {data.total} orçamentos
            </span>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost !min-h-9 !px-3" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} aria-label="Página anterior">
                <ChevronLeft className="size-4" />
              </button>
              <button type="button" className="btn-ghost !min-h-9 !px-3" disabled={page >= data.totalPages || loading} onClick={() => setPage((value) => value + 1)} aria-label="Próxima página">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <LeadDetailModal
          quote={selected}
          {...(selected.selectedPresetId && presetTitles.has(selected.selectedPresetId) ? { presetTitle: presetTitles.get(selected.selectedPresetId) as string } : {})}
          onClose={() => setSelected(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
};
