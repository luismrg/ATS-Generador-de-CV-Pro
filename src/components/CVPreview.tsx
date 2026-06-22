import { useCV } from '@/store/CVContext';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import { Eye, Monitor, Palette, Layout } from 'lucide-react';
import type { TemplateKey } from '@/types/cv';

const templates: { key: TemplateKey; label: string; icon: typeof Eye }[] = [
  { key: 'classic', label: 'Clásico', icon: Layout },
  { key: 'modern', label: 'Moderno', icon: Palette },
  { key: 'executive', label: 'Ejecutivo', icon: Monitor },
];

export default function CVPreview() {
  const { state, setTemplate } = useCV();
  const { data, template } = state;

  const TemplateComponent = 
    template === 'modern' ? ModernTemplate :
    template === 'executive' ? ExecutiveTemplate :
    ClassicTemplate;

  return (
    <div className="h-full flex flex-col">
      {/* Template selector */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Vista Previa</span>
        </div>
        <div className="flex gap-1">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => setTemplate(t.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                template === t.key
                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              aria-label={`Plantilla ${t.label}`}
              title={t.label}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4 flex justify-start items-start">
        {/* El key en el componente principal fuerza la recreación completa cuando cambian los datos */}
        {/* Eliminamos overflow-hidden para permitir múltiples páginas */}
        <div 
          id="cv-preview-content"
          key={`${template}-${data.personalInfo.fullName}-${data.workExperience.length}-${data.education.length}-${data.skills.technical.length}-${data.skills.soft.length}-${data.skills.tools.length}-${data.skills.languages.length}-${data.skills.certifications.length}-${data.projects.length}-${data.courses.length}-${data.awards.length}-${data.references.length}`}
          className="w-full max-w-[210mm] bg-white shadow-xl rounded-lg transition-all duration-300"
        >
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}
