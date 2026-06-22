import { useCV } from '@/store/CVContext';
import { GraduationCap, Plus, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '@/types/cv';
import type { Education } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';

const emptyEdu = (): Education => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
});

export default function EducationStep() {
  const { state, addItem, updateItem, removeItem } = useCV();
  const { education } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>(emptyEdu());

  const startNew = () => { setFormData(emptyEdu()); setEditingId(null); };
  const editItem = (e: Education) => { setFormData({ ...e }); setEditingId(e.id); };

  const saveItem = () => {
    if (!formData.institution || !formData.degree) return;
    if (editingId) {
      updateItem('education', editingId, formData);
    } else {
      addItem('education', { ...formData, id: generateId() });
    }
    setFormData(emptyEdu());
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-violet-500" />
          Educación
        </h2>
        <button onClick={startNew} className="flex items-center gap-1.5 px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Institución *</label>
            <input type="text" value={formData.institution} onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Universidad / Instituto" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título *</label>
            <input type="text" value={formData.degree} onChange={e => setFormData(p => ({ ...p, degree: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Licenciatura, Máster, etc." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Campo de estudio *</label>
            <input type="text" value={formData.field} onChange={e => setFormData(p => ({ ...p, field: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Ej: Ingeniería Informática" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Inicio</label>
              <input type="month" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fin</label>
              <input type="month" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción (opcional)</label>
          <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Logros académicos, honores..." />
        </div>
        <button onClick={saveItem} disabled={!formData.institution || !formData.degree}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {editingId ? 'Actualizar' : 'Guardar educación'}
        </button>
      </div>

      <AnimatePresence>
        {education.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-gray-400 py-6">
            Añade tu formación académica
          </motion.p>
        ) : (
          <div className="space-y-2">
            {education.map((e) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{e.degree} en {e.field}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{e.institution} • {e.startDate} - {e.endDate}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => editItem(e)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => removeItem('education', e.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
