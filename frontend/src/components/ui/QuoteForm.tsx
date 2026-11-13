import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { projectService, quoteService } from '../../services/api';
import type { Project, QuotePayload } from '../../types';
import { sanitizeInput } from '../../utils/security';
import { useSecurity } from '../../contexts/SecurityContext';

type FormData = Record<'clientName' | 'clientEmail' | 'companyName' | 'solutionType' | 'howDidYouKnow' | 'projectDescription' | 'selectedPresetId', string>;

const initialForm: FormData = {
  clientName: '',
  clientEmail: '',
  companyName: '',
  solutionType: '',
  howDidYouKnow: '',
  projectDescription: '',
  selectedPresetId: '',
};

const inputClass = 'w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-genesis-accent outline-none text-[15px] transition-colors';
const labelClass = 'font-bold text-[13px] text-white';

export default function QuoteForm() {
  const { setLoading } = useSecurity();
  const [form, setForm] = useState<FormData>(initialForm);
  const [presets, setPresets] = useState<Project[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    projectService.getPresets().then(setPresets).catch(() => setPresets([]));
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setLocalError('');
    setSuccess(false);

    const clean = {
      clientName: sanitizeInput(form.clientName),
      clientEmail: sanitizeInput(form.clientEmail),
      companyName: sanitizeInput(form.companyName),
      solutionType: sanitizeInput(form.solutionType),
      howDidYouKnow: sanitizeInput(form.howDidYouKnow),
      projectDescription: sanitizeInput(form.projectDescription),
    };

    if (clean.clientName.length < 2 || !clean.clientEmail || !clean.solutionType || !clean.howDidYouKnow || clean.projectDescription.length < 10) {
      setLocalError('Preencha os campos obrigatórios. Os detalhes do projeto precisam ter ao menos 10 caracteres.');
      return;
    }

    const payload: QuotePayload = {
      clientName: clean.clientName,
      clientEmail: clean.clientEmail,
      solutionType: clean.solutionType,
      howDidYouKnow: clean.howDidYouKnow,
      projectDescription: clean.projectDescription,
      ...(clean.companyName ? { companyName: clean.companyName } : {}),
      ...(form.selectedPresetId ? { selectedPresetId: form.selectedPresetId } : {}),
    };

    setSubmitting(true);
    setLoading(true);
    try {
      await quoteService.submitQuote(payload);
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setSuccess(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-genesis-surface/55 border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col gap-4 shadow-2xl">
      <h3 className="text-xl font-heading font-black uppercase text-white mb-2">Solicitar Orçamento</h3>
      {localError && <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-[14px]">{localError}</div>}
      {success && <div role="status" className="bg-genesis-accent/10 border border-genesis-accent/30 text-genesis-accentHover p-3 rounded-xl text-[14px]">Pedido enviado com sucesso! Entraremos em contato.</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="clientName" className={labelClass}>Nome completo *</label>
          <input id="clientName" required type="text" name="clientName" autoComplete="name" value={form.clientName} onChange={handleChange} minLength={2} maxLength={100} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="clientEmail" className={labelClass}>E-mail *</label>
          <input id="clientEmail" required type="email" name="clientEmail" autoComplete="email" value={form.clientEmail} onChange={handleChange} maxLength={100} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="companyName" className={labelClass}>Empresa</label>
        <input id="companyName" type="text" name="companyName" autoComplete="organization" value={form.companyName} onChange={handleChange} maxLength={100} className={inputClass} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="solutionType" className={labelClass}>Solução desejada *</label>
          <select id="solutionType" required name="solutionType" value={form.solutionType} onChange={handleChange} className={`${inputClass} text-gray-200`}>
            <option value="">Selecione...</option>
            <option value="Landing Page">Landing Page</option>
            <option value="Sistema Web">Sistema Web</option>
            <option value="API / Integração">API / Integração</option>
            <option value="Consultoria">Consultoria</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="howDidYouKnow" className={labelClass}>Como nos conheceu? *</label>
          <select id="howDidYouKnow" required name="howDidYouKnow" value={form.howDidYouKnow} onChange={handleChange} className={`${inputClass} text-gray-200`}>
            <option value="">Selecione...</option>
            <option value="Google">Google</option>
            <option value="Indicação">Indicação</option>
            <option value="Redes Sociais">Redes Sociais</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="selectedPresetId" className={labelClass}>Estilo de referência (opcional)</label>
          <select id="selectedPresetId" name="selectedPresetId" value={form.selectedPresetId} onChange={handleChange} className={`${inputClass} text-gray-200`}>
            <option value="">Nenhum</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>{preset.title}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="projectDescription" className={labelClass}>Detalhes do projeto *</label>
        <textarea id="projectDescription" required name="projectDescription" value={form.projectDescription} onChange={handleChange} rows={3} minLength={10} maxLength={1000} placeholder="Evite inserir dados sensíveis..." className={`${inputClass} resize-y`}></textarea>
      </div>

      <button type="submit" disabled={submitting} className="mt-2 w-full h-12 rounded-xl bg-genesis-accent text-genesis-surface font-extrabold text-[15px] hover:bg-genesis-accentHover transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        Enviar solicitação
      </button>
    </form>
  );
}
