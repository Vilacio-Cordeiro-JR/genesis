import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../lib/errors';
import { slugify, splitLines, splitTags } from '../../lib/format';
import { projectsService } from '../../services/projects.service';
import { PROJECT_CATEGORIES, type Project, type ProjectCategory, type ProjectInput } from '../../types/api';

interface FormState {
  title: string;
  slug: string;
  category: ProjectCategory;
  thumbnailUrl: string;
  description: string;
  tags: string;
  features: string;
  demoUrl: string;
  isActive: boolean;
  isPreset: boolean;
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  category: 'Landing Page',
  thumbnailUrl: '',
  description: '',
  tags: '',
  features: '',
  demoUrl: '',
  isActive: true,
  isPreset: false,
};

const fromProject = (project: Project): FormState => ({
  title: project.title,
  slug: project.slug,
  category: project.category,
  thumbnailUrl: project.thumbnailUrl,
  description: project.description,
  tags: project.tags.join(', '),
  features: project.features.join('\n'),
  demoUrl: project.demoUrl ?? '',
  isActive: project.isActive,
  isPreset: project.isPreset,
});

interface ProjectFormModalProps {
  project: Project | null;
  onClose: () => void;
  onSaved: (project: Project, created: boolean) => void;
}

export const ProjectFormModal = ({ project, onClose, onSaved }: ProjectFormModalProps) => {
  const toast = useToast();
  const [form, setForm] = useState<FormState>(project ? fromProject(project) : emptyForm);
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const onTitleChange = (title: string) => setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const demoUrl = form.demoUrl.trim();
    const payload: ProjectInput = {
      title: form.title.trim(),
      slug: slugify(form.slug),
      category: form.category,
      thumbnailUrl: form.thumbnailUrl.trim(),
      description: form.description.trim(),
      tags: splitTags(form.tags),
      features: splitLines(form.features),
      isActive: form.isActive,
      isPreset: form.isPreset,
      ...(demoUrl ? { demoUrl } : {}),
    };

    setSaving(true);
    try {
      const saved = project ? await projectsService.update(project.id, payload) : await projectsService.create(payload);
      toast.success(project ? 'Projeto atualizado.' : 'Projeto criado.');
      onSaved(saved, !project);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={project ? 'Editar projeto' : 'Novo projeto'} onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-title" className="label">Título</label>
            <input id="p-title" required minLength={3} maxLength={160} value={form.title} onChange={(e) => onTitleChange(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="p-slug" className="label">Slug</label>
            <input
              id="p-slug"
              required
              maxLength={100}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Use letras minúsculas, números e hífens"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="p-category" className="label">Categoria</label>
            <select id="p-category" value={form.category} onChange={(e) => set('category', e.target.value as ProjectCategory)} className="field">
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="p-thumb" className="label">URL da imagem</label>
            <input id="p-thumb" required maxLength={500} value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)} placeholder="https://..." className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="p-desc" className="label">Descrição</label>
          <textarea id="p-desc" required minLength={10} maxLength={2000} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className="field resize-y" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-tags" className="label">Tags (separadas por vírgula)</label>
            <input id="p-tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="tailwind, mobile-first" className="field" />
          </div>
          <div>
            <label htmlFor="p-demo" className="label">URL de demo (opcional)</label>
            <input id="p-demo" type="url" maxLength={500} value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://..." className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="p-features" className="label">Features (uma por linha)</label>
          <textarea id="p-features" rows={4} value={form.features} onChange={(e) => set('features', e.target.value)} className="field resize-y" />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-4 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="size-4 accent-[#64ffda]" />
            Visível na vitrine
          </label>
          <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
            <input type="checkbox" checked={form.isPreset} onChange={(e) => set('isPreset', e.target.checked)} className="size-4 accent-[#d4af37]" />
            Disponível como preset no formulário
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-gold">
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {project ? 'Salvar projeto' : 'Criar projeto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
