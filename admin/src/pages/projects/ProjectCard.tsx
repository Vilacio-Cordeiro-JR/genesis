import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { Project } from '../../types/api';

interface ProjectCardProps {
  project: Project;
  busy: boolean;
  onEdit: (project: Project) => void;
  onToggle: (project: Project) => void;
}

export const ProjectCard = ({ project, busy, onEdit, onToggle }: ProjectCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className={`panel flex flex-col overflow-hidden transition-opacity ${project.isActive ? '' : 'opacity-70'}`}>
      <div className="relative aspect-[16/10] bg-gradient-to-br from-panel to-ink">
        {project.thumbnailUrl && !imageFailed ? (
          <img src={project.thumbnailUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} className="size-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center px-4 text-center text-sm font-extrabold tracking-wide text-accent uppercase">{project.category}</span>
        )}
        {project.isPreset && <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-ink">Preset</span>}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold text-accent">{project.category}</p>
          <h3 className="mt-1 text-base leading-snug font-bold text-white">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-200">
            <button
              type="button"
              role="switch"
              aria-checked={project.isActive}
              aria-label={`${project.isActive ? 'Desativar' : 'Ativar'} ${project.title}`}
              disabled={busy}
              onClick={() => onToggle(project)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${project.isActive ? 'bg-accent' : 'bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-ink transition-transform ${project.isActive ? 'translate-x-5' : ''}`} />
            </button>
            {project.isActive ? 'Ativo' : 'Inativo'}
          </label>
          <button type="button" onClick={() => onEdit(project)} className="btn-ghost !min-h-9 !px-3">
            <Pencil className="size-4" aria-hidden />
            Editar
          </button>
        </div>
      </div>
    </article>
  );
};
