import { useCV } from '@/store/CVContext';
import { Zap, X, Plus } from 'lucide-react';
import { useState } from 'react';

export default function SkillsStep() {
  const { state, setSkillsField } = useCV();
  const { skills } = state.data;
  const [tagInputs, setTagInputs] = useState({
    technical: '',
    soft: '',
    tools: '',
    certifications: '',
  });
  const [langForm, setLangForm] = useState({ language: '', level: 'Básico' });

  const addTag = (category: 'technical' | 'soft' | 'tools' | 'certifications') => {
    const value = tagInputs[category].trim();
    if (!value) return;
    setSkillsField(category, [...skills[category], value]);
    setTagInputs(prev => ({ ...prev, [category]: '' }));
  };

  const removeTag = (category: 'technical' | 'soft' | 'tools' | 'certifications', index: number) => {
    const updated = skills[category].filter((_, i) => i !== index);
    setSkillsField(category, updated);
  };

  const addLanguage = () => {
    if (!langForm.language.trim()) return;
    setSkillsField('languages', [...skills.languages, { ...langForm }]);
    setLangForm({ language: '', level: 'Básico' });
  };

  const removeLanguage = (index: number) => {
    setSkillsField('languages', skills.languages.filter((_, i) => i !== index));
  };

  const tagSection = (
    title: string,
    category: 'technical' | 'soft' | 'tools' | 'certifications',
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {skills[category].map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs">
            {tag}
            <button onClick={() => removeTag(category, i)} className="hover:text-red-500 transition-colors" aria-label={`Eliminar ${tag}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={tagInputs[category]}
          onChange={e => setTagInputs(prev => ({ ...prev, [category]: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(category))}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={placeholder}
        />
        <button onClick={() => addTag(category)} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-violet-900/30 text-gray-600 dark:text-gray-300 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const totalSkills = skills.technical.length + skills.soft.length + skills.tools.length + skills.languages.length + skills.certifications.length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-500" />
          Habilidades
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Añade tus competencias. Presiona Enter para añadir rápidamente.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800">
        <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
          ✅ {totalSkills} habilidades guardadas y visibles en la vista previa
        </span>
        <span className="text-[10px] text-violet-500 dark:text-violet-400">
          Técnicas: {skills.technical.length} • Blandas: {skills.soft.length} • Idiomas: {skills.languages.length} • Herramientas: {skills.tools.length} • Certs: {skills.certifications.length}
        </span>
      </div>

      {/* Panel de confirmación de datos guardados */}
      {totalSkills > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
            📋 Datos actualmente guardados:
          </p>
          <div className="space-y-1 text-xs text-green-700 dark:text-green-400">
            {skills.technical.length > 0 && (
              <p><strong>Técnicas:</strong> {skills.technical.join(', ')}</p>
            )}
            {skills.tools.length > 0 && (
              <p><strong>Herramientas:</strong> {skills.tools.join(', ')}</p>
            )}
            {skills.soft.length > 0 && (
              <p><strong>Blandas:</strong> {skills.soft.join(', ')}</p>
            )}
            {skills.languages.length > 0 && (
              <p><strong>Idiomas:</strong> {skills.languages.map(l => `${l.language} (${l.level})`).join(', ')}</p>
            )}
            {skills.certifications.length > 0 && (
              <p><strong>Certificaciones:</strong> {skills.certifications.join(', ')}</p>
            )}
          </div>
          <p className="text-[10px] text-green-600 dark:text-green-500 mt-2 italic">
            👁️ Estos datos se muestran en tiempo real en la vista previa de la derecha
          </p>
        </div>
      )}

      {totalSkills === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            💡 <strong>Consejo:</strong> Las habilidades son clave para superar los filtros ATS. Añade al menos 3-5 habilidades técnicas para mejorar tu puntuación.
          </p>
        </div>
      )}

      {tagSection('Habilidades Técnicas', 'technical', 'Ej: JavaScript, Python, React...')}
      {tagSection('Habilidades Blandas', 'soft', 'Ej: Liderazgo, Comunicación...')}
      {tagSection('Herramientas', 'tools', 'Ej: Docker, Git, Figma...')}
      {tagSection('Certificaciones', 'certifications', 'Ej: AWS Solutions Architect...')}

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idiomas</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skills.languages.map((l, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              {l.language}: {l.level}
              <button onClick={() => removeLanguage(i)} className="hover:text-red-500 transition-colors" aria-label={`Eliminar ${l.language}`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={langForm.language}
            onChange={e => setLangForm(prev => ({ ...prev, language: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Ej: Inglés"
          />
          <select
            value={langForm.level}
            onChange={e => setLangForm(prev => ({ ...prev, level: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
            <option>Nativo</option>
          </select>
          <button onClick={addLanguage} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-gray-300 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
