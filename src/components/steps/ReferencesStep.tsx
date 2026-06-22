import { useCV } from '@/store/CVContext';
import { Users, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { generateId } from '@/types/cv';
import type { Reference } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';

const empty = (): Reference => ({ id: generateId(), name: '', position: '', company: '', email: '', phone: '' });

export default function ReferencesStep() {
  const { state, addItem, updateItem, removeItem } = useCV();
  const { references } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Reference>(empty());

  const editItem = (r: Reference) => { setFormData({ ...r }); setEditingId(r.id); };

  const saveItem = () => {
    if (!formData.name || !formData.position) return;
    if (editingId) updateItem('references', editingId, formData);
    else addItem('references', { ...formData, id: generateId() });
    setFormData(empty()); setEditingId(null);
  };

  const update = (field: keyof Reference, value: string) => setFormData(p => ({ ...p, [field]: value }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-500" />
          Referencias
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">Opcional</span>
      </div>

      {/* Panel de confirmación - muestra datos guardados en tiempo real */}
      {references.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
            ✅ {references.length} referencia{references.length !== 1 ? 's' : ''} guardada{references.length !== 1 ? 's' : ''} y visibles en la vista previa:
          </p>
          <div className="space-y-1 text-xs text-green-700 dark:text-green-400">
            {references.map((r) => (
              <p key={r.id}>• <strong>{r.name}</strong> — {r.position}{r.company ? ` (${r.company})` : ''}</p>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre *</label>
            <input type="text" value={formData.name} onChange={e => update('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Cargo *</label>
            <input type="text" value={formData.position} onChange={e => update('position', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Cargo de la persona" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Empresa</label>
            <input type="text" value={formData.company} onChange={e => update('company', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Empresa" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => update('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <button onClick={saveItem} disabled={!formData.name || !formData.position}
          className="w-full py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {editingId ? 'Actualizar' : 'Guardar referencia'}
        </button>
      </div>

      <AnimatePresence>
        {references.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">Añade referencias profesionales (opcional)</p>
        ) : (
          <div className="space-y-2">
            {references.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{r.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{r.position}{r.company ? ` • ${r.company}` : ''}</p>
                  {r.email && <p className="text-xs text-gray-400">{r.email}</p>}
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button onClick={() => editItem(r)} className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => removeItem('references', r.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
