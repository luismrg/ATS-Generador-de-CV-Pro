import type { CVData } from '@/types/cv';

export default function ClassicTemplate({ data }: { data: CVData }) {
  const p = data.personalInfo;

  // Helper para verificar si una sección tiene datos
  const hasData = {
    summary: !!data.professionalProfile.summary,
    objective: !!data.professionalProfile.objective,
    experience: data.workExperience.length > 0,
    education: data.education.length > 0,
    skills: data.skills.technical.length > 0 || data.skills.tools.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0 || data.skills.certifications.length > 0,
    projects: data.projects.length > 0,
    courses: data.courses.length > 0,
    awards: data.awards.length > 0,
    references: data.references.length > 0,
  };

  return (
    <div 
      className="bg-white text-gray-800 font-serif max-w-[210mm] mx-auto p-5" 
      style={{ 
        fontSize: '9.5pt',
        lineHeight: '1.35',
      }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-2.5 mb-3.5">
        {p.photo && (
          <img
            src={p.photo}
            alt="Foto"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-gray-300 shadow-sm"
          />
        )}
        <h1 className="text-xl font-bold tracking-wide uppercase mb-0.5">{p.fullName || 'Tu Nombre'}</h1>
        <p className="text-sm text-gray-600 mb-1.5">{p.professionalTitle || 'Cargo Profesional'}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[10pt] text-gray-600">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>☎ {p.phone}</span>}
          {(p.city || p.country) && <span>📍 {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>🔗 linkedin.com</span>}
          {p.github && <span>⌨ github.com</span>}
        </div>
      </div>

      {/* Summary */}
      {hasData.summary && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Resumen Profesional</h2>
          <p className="text-[10pt] leading-relaxed">{data.professionalProfile.summary}</p>
        </div>
      )}

      {/* Objective */}
      {hasData.objective && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Objetivo Laboral</h2>
          <p className="text-[10pt] leading-relaxed italic text-gray-600">{data.professionalProfile.objective}</p>
        </div>
      )}

      {/* Experience */}
      {hasData.experience && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Experiencia Laboral</h2>
          {data.workExperience.map((w) => (
            <div key={w.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10pt]">{w.position}</span>
                <span className="text-[10pt] text-gray-500">{w.startDate} - {w.current ? 'Actualidad' : w.endDate}</span>
              </div>
              <p className="text-[10pt] italic text-gray-600">{w.company}</p>
              <p className="text-[10pt] mt-0.5">{w.responsibilities}</p>
              {w.achievements && <p className="text-[10pt] mt-0.5"><span className="font-semibold">Logros:</span> {w.achievements}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {hasData.education && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Educación</h2>
          {data.education.map((e) => (
            <div key={e.id} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10pt]">{e.degree} en {e.field}</span>
                <span className="text-[10pt] text-gray-500">{e.startDate} - {e.endDate}</span>
              </div>
              <p className="text-[10pt] italic text-gray-600">{e.institution}</p>
              {e.description && <p className="text-[10pt] mt-0.5">{e.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {hasData.skills && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Habilidades y Competencias</h2>
          {data.skills.technical.length > 0 && (
            <p className="text-[10pt] mb-1"><span className="font-semibold text-gray-700">Técnicas:</span> {data.skills.technical.join(' • ')}</p>
          )}
          {data.skills.tools.length > 0 && (
            <p className="text-[10pt] mb-1"><span className="font-semibold text-gray-700">Herramientas:</span> {data.skills.tools.join(' • ')}</p>
          )}
          {data.skills.soft.length > 0 && (
            <p className="text-[10pt] mb-1"><span className="font-semibold text-gray-700">Blandas:</span> {data.skills.soft.join(' • ')}</p>
          )}
          {data.skills.languages.length > 0 && (
            <p className="text-[10pt] mb-1"><span className="font-semibold text-gray-700">Idiomas:</span> {data.skills.languages.map(l => `${l.language} (${l.level})`).join(' • ')}</p>
          )}
          {data.skills.certifications.length > 0 && (
            <p className="text-[10pt]"><span className="font-semibold text-gray-700">Certificaciones:</span> {data.skills.certifications.join(' • ')}</p>
          )}
        </div>
      )}

      {/* Projects */}
      {hasData.projects && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Proyectos</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-1.5">
              <span className="font-bold text-[10pt]">{proj.name}</span>
              {proj.url && <span className="text-[10pt] text-blue-600 ml-2">{proj.url}</span>}
              <p className="text-[10pt]">{proj.description}</p>
              {proj.technologies && <p className="text-[10pt] text-gray-500">Tecnologías: {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Courses */}
      {hasData.courses && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Cursos</h2>
          {data.courses.map((c) => (
            <div key={c.id} className="mb-0.5">
              <span className="font-bold text-[10pt]">{c.name}</span>
              <span className="text-[10pt] italic text-gray-600"> — {c.institution}</span>
              <span className="text-[10pt] text-gray-500 ml-2">({c.year})</span>
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {hasData.awards && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Premios y Reconocimientos</h2>
          {data.awards.map((a) => (
            <div key={a.id} className="mb-0.5">
              <span className="font-bold text-[10pt]">{a.title}</span>
              <span className="text-[10pt] italic"> — {a.issuer}</span>
              <span className="text-[10pt] text-gray-500 ml-2">({a.year})</span>
            </div>
          ))}
        </div>
      )}

      {/* References */}
      {hasData.references && (
        <div className="mb-3.5">
          <h2 className="text-[11pt] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">Referencias</h2>
          {data.references.map((r) => (
            <div key={r.id} className="mb-2">
              <p className="font-bold text-[10pt]">{r.name}</p>
              <p className="text-[10pt] italic text-gray-600">{r.position}{r.company ? ` — ${r.company}` : ''}</p>
              {r.email && <p className="text-[10pt] text-gray-500">✉ {r.email}{r.phone ? ` | ☎ ${r.phone}` : ''}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
