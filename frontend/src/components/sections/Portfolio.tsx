import { useEffect, useState } from 'react';
import { projectService } from '../../services/api';
import type { Project } from '../../types';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectService
      .getProjects()
      .then(setProjects)
      .catch(() => setError('Erro ao carregar projetos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="portfolio" className="py-20 md:py-24">
      <div className="w-full max-w-[1152px] mx-auto px-5">
        <div className="max-w-[680px] mx-auto mb-12 text-center">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white uppercase mb-3">Projetos e <span className="text-genesis-accent">casos de sucesso</span></h2>
        </div>
        {loading && <p role="status" className="text-center text-genesis-accent">Carregando catálogo...</p>}
        {error && <p role="alert" className="text-center text-red-400">{error}</p>}
        {!loading && !error && projects.length === 0 && <p className="text-center text-gray-500">Nenhum projeto disponível no momento.</p>}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article key={project.id} className="bg-genesis-surface/55 border border-white/10 rounded-[24px] p-4 flex flex-col gap-3 hover:border-genesis-accent/50 transition-colors">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-genesis-surface to-genesis-petro flex items-center justify-center">
                  <span className="font-heading font-black text-[13px] uppercase text-genesis-accent px-3 text-center">{project.category}</span>
                </div>
                <div className="px-1.5 flex flex-col flex-grow gap-2">
                  <h3 className="text-[1.02rem] uppercase font-extrabold leading-tight text-white">{project.title}</h3>
                  <p className="text-gray-400 text-[14.5px] line-clamp-3">{project.description}</p>
                  {project.tags.length > 0 && (
                    <ul className="mt-auto flex flex-wrap gap-2 pt-1">
                      {project.tags.slice(0, 4).map((tag) => (
                        <li key={tag} className="text-[12px] font-semibold text-genesis-accentHover border border-white/10 rounded-full px-2.5 py-1 bg-black/40">{tag}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
