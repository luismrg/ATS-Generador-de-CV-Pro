import { useCV } from '@/store/CVContext';
import { BookOpen, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '@/types/cv';
import type { Course } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';

const empty = (): Course => ({ id: generateId(), name: '', institution: '', year: '', certificateUrl: '' });

export default function CoursesStep() {
  const { state, addItem, updateItem, removeItem } = useCV();
  const { courses } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Course>(empty());

  const editItem = (c: Course) => { setFormData({ ...c }); setEditingId(c.id); };

  const saveItem = () => {
    if (!formData.name || !formData.institution) return;
    if (editingId) updateItem('courses', editingId, formData);
    else addItem('courses', { ...formData, id: generateId() });
    setFormData(empty()); setEditingId(null);
  };

  const update = (field: keyof Course, value: string) => setFormData(p => ({ ...p, [field]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-500" />
          Cursos
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">Opcional</span>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre del curso *</label>
            <input type="text" value={formData.name} onChange={e => update('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Nombre del curso" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Institución *</label>
            <input type="text" value={formData.institution} onChange={e => update('institution', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Plataforma o institución" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Año *</label>
            <input type="text" value={formData.year} onChange={e => update('year', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="2024" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">URL Certificado</label>
            <input type="url" value={formData.certificateUrl} onChange={e => update('certificateUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="https://..." />
          </div>
        </div>
        <button onClick={saveItem} disabled={!formData.name || !formData.institution}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {editingId ? 'Actualizar' : 'Guardar curso'}
        </button>
      </div>

      <AnimatePresence>
        {courses.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">Añade cursos relevantes para tu perfil profesional</p>
        ) : (
          <div className="space-y-2">
            {courses.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{c.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{c.institution} • {c.year}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => editItem(c)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => removeItem('courses', c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
