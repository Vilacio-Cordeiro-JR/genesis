import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { getErrorMessage } from '../../lib/errors';
import { projectsService } from '../../services/projects.service';
import type { Project } from '../../types/api';
import { ProjectCard } from './ProjectCard';
import { ProjectFormModal } from './ProjectFormModal';

type EditorState = { open: false } | { open: true; project: Project | null };

export const ProjectsPage = () => {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>({ open: false });
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectsService.listAll();
      if (mountedRef.current) setProjects(data);
    } catch (error) {
      if (mountedRef.current) toast.error(getErrorMessage(error));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    mountedRef.current = true;
    void load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const toggleActive = async (project: Project) => {
    setBusyId(project.id);
    try {
      const updated = await projectsService.update(project.id, { isActive: !project.isActive });
      setProjects((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(updated.isActive ? 'Projeto visível na vitrine.' : 'Projeto ocultado da vitrine.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const onSaved = (saved: Project, created: boolean) => {
    setProjects((current) => (created ? [saved, ...current] : current.map((item) => (item.id === saved.id ? saved : item))));
    setEditor({ open: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mostruário de projetos</h1>
          <p className="mt-1 text-sm text-slate-400">Controle o que aparece na vitrine e no formulário de orçamento.</p>
        </div>
        <button type="button" onClick={() => setEditor({ open: true, project: null })} className="btn-gold">
          <Plus className="size-4" aria-hidden />
          Novo projeto
        </button>
      </div>

      {loading && projects.length === 0 && <p className="py-12 text-center text-slate-400">Carregando projetos...</p>}
      {!loading && projects.length === 0 && (
        <div className="panel border-dashed p-12 text-center text-slate-400">Nenhum projeto cadastrado ainda. Clique em "Novo projeto" para começar.</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} busy={busyId === project.id} onEdit={(item) => setEditor({ open: true, project: item })} onToggle={toggleActive} />
        ))}
      </div>

      {editor.open && <ProjectFormModal project={editor.project} onClose={() => setEditor({ open: false })} onSaved={onSaved} />}
    </div>
  );
};
