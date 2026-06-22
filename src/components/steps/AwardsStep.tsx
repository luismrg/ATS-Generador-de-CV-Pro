import { useCV } from '@/store/CVContext';
import { Trophy, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '@/types/cv';
import type { Award } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';

const empty = (): Award => ({ id: generateId(), title: '', issuer: '', year: '', description: '' });

export default function AwardsStep() {
  const { state, addItem, updateItem, removeItem } = useCV();
  const { awards } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Award>(empty());

  const editItem = (a: Award) => { setFormData({ ...a }); setEditingId(a.id); };

  const saveItem = () => {
    if (!formData.title || !formData.issuer) return;
    if (editingId) updateItem('awards', editingId, formData);
    else addItem('awards', { ...formData, id: generateId() });
    setFormData(empty()); setEditingId(null);
  };

  const update = (field: keyof Award, value: string) => setFormData(p => ({ ...p, [field]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-violet-500" />
          Premios y Reconocimientos
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">Opcional</span>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título *</label>
            <input type="text" value={formData.title} onChange={e => update('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Empleado del mes, Premio innovación..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Otorgante *</label>
            <input type="text" value={formData.issuer} onChange={e => update('issuer', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Empresa, institución..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Año *</label>
            <input type="text" value={formData.year} onChange={e => update('year', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="2024" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción</label>
          <textarea value={formData.description} onChange={e => update('description', e.target.value)} rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" placeholder="Describe el premio..." />
        </div>
        <button onClick={saveItem} disabled={!formData.title || !formData.issuer}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {editingId ? 'Actualizar' : 'Guardar premio'}
        </button>
      </div>

      <AnimatePresence>
        {awards.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">Destaca tus logros y reconocimientos profesionales</p>
        ) : (
          <div className="space-y-2">
            {awards.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">🏆 {a.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{a.issuer} • {a.year}</p>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => editItem(a)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => removeItem('awards', a.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
