import type { CVData } from '@/types/cv';

export default function ModernTemplate({ data }: { data: CVData }) {
  const p = data.personalInfo;
  
  return (
    <div className="bg-white text-gray-800 max-w-[210mm] mx-auto" style={{ fontSize: '10pt' }}>
      {/* Header with sidebar */}
      <div className="flex">
        {/* Left colored sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-violet-700 to-indigo-800 text-white p-6">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold overflow-hidden border-2 border-white/30 shadow-lg">
              {p.photo ? (
                <img src={p.photo} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  {p.fullName ? p.fullName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <h1 className="text-lg font-bold text-center">{p.fullName || 'Tu Nombre'}</h1>
            <p className="text-sm text-center text-violet-200">{p.professionalTitle || 'Cargo'}</p>
          </div>

          {/* Contact */}
          <div className="mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Contacto</h3>
            <div className="space-y-1.5 text-xs">
              {p.email && <p>✉ {p.email}</p>}
              {p.phone && <p>☎ {p.phone}</p>}
              {(p.city || p.country) && <p>📍 {[p.city, p.country].filter(Boolean).join(', ')}</p>}
              {p.linkedin && <p>🔗 LinkedIn</p>}
              {p.github && <p>⌨ GitHub</p>}
              {p.website && <p>🌐 {p.website}</p>}
            </div>
          </div>

          {/* Skills - SOLO muestra las categorías que TIENEN datos */}
          {data.skills.technical.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Técnicas</h3>
              <div className="flex flex-wrap gap-1">
                {data.skills.technical.map((s, i) => (
                  <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {data.skills.tools.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Herramientas</h3>
              <div className="flex flex-wrap gap-1">
                {data.skills.tools.map((s, i) => (
                  <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {data.skills.soft.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Blandas</h3>
              <div className="space-y-1">
                {data.skills.soft.map((s, i) => (
                  <p key={i} className="text-xs">• {s}</p>
                ))}
              </div>
            </div>
          )}

          {data.skills.languages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Idiomas</h3>
              {data.skills.languages.map((l, i) => (
                <p key={i} className="text-xs flex justify-between">
                  <span>{l.language}</span>
                  <span className="text-white/70">{l.level}</span>
                </p>
              ))}
            </div>
          )}

          {data.skills.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2">Certificaciones</h3>
              {data.skills.certifications.map((c, i) => (
                <p key={i} className="text-xs mb-1">• {c}</p>
              ))}
            </div>
          )}
        </div>

        {/* Right content */}
        <div className="w-2/3 p-6">
          {data.professionalProfile.summary && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Perfil</h2>
              <p className="text-xs leading-relaxed text-gray-700">{data.professionalProfile.summary}</p>
            </div>
          )}

          {data.professionalProfile.objective && (
            <div className="mb-5 pl-3 border-l-2 border-violet-300 bg-violet-50/40 p-3 rounded-r-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-1">🎯 Objetivo</h3>
              <p className="text-xs leading-relaxed text-gray-700 italic">{data.professionalProfile.objective}</p>
            </div>
          )}

          {data.workExperience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Experiencia</h2>
              {data.workExperience.map((w) => (
                <div key={w.id} className="mb-3 pl-3 border-l-2 border-violet-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{w.position}</span>
                    <span className="text-xs text-gray-400">{w.startDate} - {w.current ? 'Actualidad' : w.endDate}</span>
                  </div>
                  <p className="text-xs text-violet-600">{w.company}</p>
                  <p className="text-xs mt-1 text-gray-600">{w.responsibilities}</p>
                  {w.achievements && <p className="text-xs mt-1 text-gray-600"><strong>Logros:</strong> {w.achievements}</p>}
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Educación</h2>
              {data.education.map((e) => (
                <div key={e.id} className="mb-2 pl-3 border-l-2 border-violet-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{e.degree} en {e.field}</span>
                    <span className="text-xs text-gray-400">{e.startDate} - {e.endDate}</span>
                  </div>
                  <p className="text-xs text-violet-600">{e.institution}</p>
                  {e.description && <p className="text-xs mt-1 text-gray-600">{e.description}</p>}
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Proyectos</h2>
              {data.projects.map((proj) => (
                <div key={proj.id} className="mb-2">
                  <span className="font-bold text-xs">{proj.name}</span>
                  {proj.url && <span className="text-xs text-blue-500 ml-2">{proj.url}</span>}
                  <p className="text-xs text-gray-600">{proj.description}</p>
                  {proj.technologies && <p className="text-xs text-gray-400">Tecnologías: {proj.technologies}</p>}
                </div>
              ))}
            </div>
          )}

          {data.awards.length > 0 && (
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Premios</h2>
              {data.awards.map((a) => (
                <div key={a.id} className="mb-1 flex justify-between text-xs">
                  <span><strong>{a.title}</strong> — {a.issuer}</span>
                  <span className="text-gray-400">{a.year}</span>
                </div>
              ))}
            </div>
          )}

          {data.courses.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Cursos</h2>
              {data.courses.map((c) => (
                <div key={c.id} className="mb-1 flex justify-between text-xs">
                  <span><strong>{c.name}</strong> — {c.institution}</span>
                  <span className="text-gray-400">{c.year}</span>
                </div>
              ))}
            </div>
          )}

          {data.references.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-700 border-b-2 border-violet-200 pb-1 mb-2">Referencias</h2>
              {data.references.map((r) => (
                <div key={r.id} className="mb-3 pl-3 border-l-2 border-violet-300">
                  <p className="font-semibold text-xs text-gray-800">{r.name}</p>
                  <p className="text-xs text-violet-600 italic">{r.position}{r.company ? ` — ${r.company}` : ''}</p>
                  {r.email && <p className="text-xs text-gray-500">✉ {r.email}{r.phone ? ` | ☎ ${r.phone}` : ''}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
