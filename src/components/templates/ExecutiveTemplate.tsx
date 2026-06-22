import type { CVData } from '@/types/cv';

export default function ExecutiveTemplate({ data }: { data: CVData }) {
  const p = data.personalInfo;

  return (
    <div className="bg-white text-gray-900 max-w-[210mm] mx-auto p-8" style={{ fontSize: '10.5pt' }}>
      {/* Executive Header */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 gap-4">
        <div className="flex items-start gap-4 flex-1">
          {p.photo && (
            <img
              src={p.photo}
              alt="Foto"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
            />
          )}
          <div>
            <h1 className="text-2xl font-light tracking-tight text-gray-900">{p.fullName || 'Tu Nombre'}</h1>
            <p className="text-sm text-blue-600 font-medium mt-1">{p.professionalTitle || 'Cargo Profesional'}</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 space-y-1 flex-shrink-0">
          {p.email && <p>{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {(p.city || p.country) && <p>{[p.city, p.country].filter(Boolean).join(', ')}</p>}
          {p.linkedin && <p className="text-blue-500">LinkedIn</p>}
          {p.github && <p className="text-blue-500">GitHub</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content - spans 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Professional Summary */}
          {data.professionalProfile.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Resumen Ejecutivo</h2>
              <p className="text-sm leading-relaxed text-gray-700">{data.professionalProfile.summary}</p>
            </div>
          )}

          {/* Objective */}
          {data.professionalProfile.objective && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Objetivo Profesional</h2>
              <p className="text-sm leading-relaxed text-gray-700 italic border-l-2 border-blue-500 pl-3">
                {data.professionalProfile.objective}
              </p>
            </div>
          )}

          {/* Experience */}
          {data.workExperience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Experiencia Profesional</h2>
              <div className="space-y-4">
                {data.workExperience.map((w) => (
                  <div key={w.id} className="relative pl-4 border-l border-gray-200">
                    <div className="flex justify-between items-baseline mb-1">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{w.position}</h3>
                        <p className="text-sm text-blue-600">{w.company}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{w.startDate} - {w.current ? 'Presente' : w.endDate}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{w.responsibilities}</p>
                    {w.achievements && (
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold text-gray-700">🏆 Logros clave:</span> {w.achievements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Formación Académica</h2>
              <div className="space-y-3">
                {data.education.map((e) => (
                  <div key={e.id} className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{e.degree} en {e.field}</h3>
                      <p className="text-sm text-gray-500">{e.institution}</p>
                      {e.description && <p className="text-xs text-gray-600 mt-1">{e.description}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{e.startDate} - {e.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Proyectos Destacados</h2>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="font-semibold text-sm">
                      {proj.name}
                      {proj.url && <a href={proj.url} className="text-blue-500 font-normal text-xs ml-2">🔗</a>}
                    </h3>
                    <p className="text-xs text-gray-600">{proj.description}</p>
                    {proj.technologies && <p className="text-xs text-gray-400 mt-0.5">Stack: {proj.technologies}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - SOLO muestra las categorías que TIENEN datos */}
        <div className="space-y-5">
          {/* Competencias Técnicas */}
          {data.skills.technical.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Competencias Técnicas</h2>
              <div className="space-y-1">
                {data.skills.technical.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Herramientas */}
          {data.skills.tools.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Herramientas</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.tools.map((s, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {data.skills.soft.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Soft Skills</h2>
              <div className="space-y-1">
                {data.skills.soft.map((s, i) => (
                  <p key={i} className="text-xs text-gray-600">• {s}</p>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {data.skills.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Idiomas</h2>
              {data.skills.languages.map((l, i) => (
                <div key={i} className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">{l.language}</span>
                  <span className="text-gray-400">{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certificaciones */}
          {data.skills.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Certificaciones</h2>
              {data.skills.certifications.map((c, i) => (
                <p key={i} className="text-xs text-gray-700 mb-1">📜 {c}</p>
              ))}
            </div>
          )}

          {/* Cursos */}
          {data.courses.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Cursos</h2>
              {data.courses.map((c, i) => (
                <p key={i} className="text-xs text-gray-700 mb-1">
                  <strong>{c.name}</strong><br />
                  <span className="text-gray-400">{c.institution}, {c.year}</span>
                </p>
              ))}
            </div>
          )}

          {/* Premios */}
          {data.awards.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Premios</h2>
              {data.awards.map((a, i) => (
                <p key={i} className="text-xs text-gray-700 mb-1">
                  🏆 <strong>{a.title}</strong><br />
                  <span className="text-gray-400">{a.issuer}, {a.year}</span>
                </p>
              ))}
            </div>
          )}

          {/* Referencias */}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Referencias</h2>
              {data.references.map((r, i) => (
                <p key={i} className="text-xs text-gray-700 mb-2">
                  <strong>{r.name}</strong><br />
                  <span className="text-gray-500">{r.position}{r.company ? ` — ${r.company}` : ''}</span><br />
                  {r.email && <span className="text-gray-400">✉ {r.email}{r.phone ? ` | ☎ ${r.phone}` : ''}</span>}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
