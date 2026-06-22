import { useCV } from '@/store/CVContext';
import { Briefcase, Plus, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '@/types/cv';
import type { WorkExperience } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';

const emptyExperience = (): WorkExperience => ({
  id: generateId(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  responsibilities: '',
  achievements: '',
});

export default function ExperienceStep() {
  const { state, addItem, updateItem, removeItem } = useCV();
  const { workExperience } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkExperience>(emptyExperience());

  const startNew = () => {
    setFormData(emptyExperience());
    setEditingId(null);
  };

  const editItem = (w: WorkExperience) => {
    setFormData({ ...w });
    setEditingId(w.id);
  };

  const saveItem = () => {
    if (!formData.company || !formData.position) return;
    if (editingId) {
      updateItem('workExperience', editingId, formData);
    } else {
      addItem('workExperience', { ...formData, id: generateId() });
    }
    setFormData(emptyExperience());
    setEditingId(null);
  };

  const updateForm = (field: keyof WorkExperience, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'current' && value === true) {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-violet-500" />
          Experiencia Laboral
        </h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-lg transition-colors"
          aria-label="Añadir experiencia"
        >
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {/* Form */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Empresa *</label>
            <input
              type="text"
              value={formData.company}
              onChange={e => updateForm('company', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Nombre de la empresa"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cargo *</label>
            <input
              type="text"
              value={formData.position}
              onChange={e => updateForm('position', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Tu cargo"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha inicio</label>
            <input
              type="month"
              value={formData.startDate}
              onChange={e => updateForm('startDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha fin</label>
            <input
              type="month"
              value={formData.endDate}
              onChange={e => updateForm('endDate', e.target.value)}
              disabled={formData.current}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={formData.current}
            onChange={e => updateForm('current', e.target.checked)}
            className="rounded border-gray-300 text-violet-500 focus:ring-violet-500"
          />
          Trabajo actualmente aquí
        </label>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Funciones realizadas</label>
          <textarea
            value={formData.responsibilities}
            onChange={e => updateForm('responsibilities', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Describe tus responsabilidades principales..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Logros obtenidos</label>
          <textarea
            value={formData.achievements}
            onChange={e => updateForm('achievements', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Logros cuantificables (ej: Aumenté ventas un 30%)"
          />
        </div>
        <button
          onClick={saveItem}
          disabled={!formData.company || !formData.position}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {editingId ? 'Actualizar experiencia' : 'Guardar experiencia'}
        </button>
      </div>

      {/* List */}
      <AnimatePresence>
        {workExperience.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-400 py-6"
          >
            Aún no has añadido experiencia laboral. ¡Añade tu primera!
          </motion.p>
        ) : (
          <div className="space-y-2">
            {workExperience.map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{w.position}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{w.company} • {w.startDate} - {w.current ? 'Actualidad' : w.endDate}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => editItem(w)}
                    className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem('workExperience', w.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
