import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { STATUS_LABEL, StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../lib/errors';
import { formatDateTime } from '../../lib/format';
import { quotesService } from '../../services/quotes.service';
import { QUOTE_STATUSES, type Quote, type QuoteStatus } from '../../types/api';

interface LeadDetailModalProps {
  quote: Quote;
  presetTitle?: string;
  onClose: () => void;
  onSaved: (quote: Quote) => void;
}

const Info = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="label">{label}</dt>
    <dd className="text-sm break-words text-slate-100">{children}</dd>
  </div>
);

export const LeadDetailModal = ({ quote, presetTitle, onClose, onSaved }: LeadDetailModalProps) => {
  const toast = useToast();
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [notes, setNotes] = useState(quote.notes ?? '');
  const [saving, setSaving] = useState(false);

  const currentIndex = QUOTE_STATUSES.indexOf(status);
  const nextStatus = QUOTE_STATUSES[currentIndex + 1];
  const dirty = status !== quote.status || notes.trim() !== (quote.notes ?? '');

  const save = async () => {
    setSaving(true);
    try {
      const updated = await quotesService.updateStatus(quote.id, status, notes.trim());
      toast.success('Orçamento atualizado.');
      onSaved(updated);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Detalhes do orçamento" onClose={onClose} wide>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">Recebido em {formatDateTime(quote.createdAt)}</p>
          <StatusBadge status={quote.status} />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <Info label="Cliente">{quote.clientName}</Info>
          <Info label="E-mail">
            <a href={`mailto:${quote.clientEmail}`} className="text-accent hover:underline">
              {quote.clientEmail}
            </a>
          </Info>
          <Info label="Empresa">{quote.companyName || '—'}</Info>
          <Info label="Como conheceu">{quote.howDidYouKnow}</Info>
          <Info label="Solução desejada">{quote.solutionType}</Info>
          <Info label="Estilo selecionado">{quote.selectedPresetId ? (presetTitle ?? quote.selectedPresetId) : '—'}</Info>
          <div className="sm:col-span-2">
            <Info label="Descrição do projeto">
              <span className="whitespace-pre-wrap">{quote.projectDescription}</span>
            </Info>
          </div>
        </dl>

        <fieldset className="space-y-3 border-t border-white/10 pt-5">
          <legend className="label">Status do lead</legend>
          <div className="flex flex-wrap items-center gap-2">
            {QUOTE_STATUSES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={`rounded-lg border px-3.5 py-2 text-sm font-semibold transition-colors ${
                  status === value ? 'border-accent bg-accent/15 text-accent' : 'border-white/15 text-slate-300 hover:bg-white/5'
                }`}
              >
                {STATUS_LABEL[value]}
              </button>
            ))}
            {nextStatus && (
              <button type="button" onClick={() => setStatus(nextStatus)} className="btn-ghost ml-auto">
                Avançar para {STATUS_LABEL[nextStatus]}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
          </div>
        </fieldset>

        <div>
          <label htmlFor="notes" className="label">Notas internas</label>
          <textarea id="notes" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} className="field resize-y" placeholder="Registre contatos, valores combinados, próximos passos..." />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Fechar</button>
          <button type="button" onClick={save} disabled={!dirty || saving} className="btn-gold">
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Salvar alterações
          </button>
        </div>
      </div>
    </Modal>
  );
};
