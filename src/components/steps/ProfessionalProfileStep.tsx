import { useCV } from '@/store/CVContext';
import { FileText, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { professionalProfileSchema } from '@/utils/validation';

export default function ProfessionalProfileStep() {
  const { state, setField } = useCV();
  const { professionalProfile: pp } = state.data;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setField('professionalProfile', field, value);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateField = (field: string, value: string) => {
    const partial = { ...pp, [field]: value };
    const result = professionalProfileSchema.safeParse(partial);
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldError = result.error.issues.find((e: any) => e.path[0] === field);
      if (fieldError) setErrors(prev => ({ ...prev, [field]: fieldError.message }));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-500" />
          Perfil Profesional
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Un buen resumen puede captar la atención del reclutador en segundos.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resumen profesional *
          <span className="text-gray-400 ml-2 font-normal">({pp.summary.length}/500)</span>
        </label>
        <textarea
          value={pp.summary}
          onChange={e => update('summary', e.target.value)}
          onBlur={() => validateField('summary', pp.summary)}
          rows={5}
          maxLength={500}
          className={`w-full px-3 py-3 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors resize-none ${
            errors.summary ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-violet-500'
          } focus:outline-none focus:ring-2`}
          placeholder="Profesional con más de 8 años de experiencia en desarrollo de software, especializado en arquitecturas cloud y liderazgo de equipos ágiles. Apasionado por la innovación tecnológica y la mejora continua de procesos..."
        />
        {errors.summary && <p className="text-xs text-red-500 mt-1">{errors.summary}</p>}
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pp.summary.length < 50 ? 'bg-red-400 w-1/4' :
                pp.summary.length < 100 ? 'bg-yellow-400 w-1/2' :
                'bg-green-400 w-full'
              }`}
              style={{ width: `${Math.min((pp.summary.length / 200) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {pp.summary.length < 50 ? 'Muy corto' : pp.summary.length < 100 ? 'Mejorable' : 'Buen tamaño'}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
          Objetivo laboral *
          <span className="text-gray-400 ml-2 font-normal">({pp.objective.length}/300)</span>
        </label>
        <textarea
          value={pp.objective}
          onChange={e => update('objective', e.target.value)}
          onBlur={() => validateField('objective', pp.objective)}
          rows={3}
          maxLength={300}
          className={`w-full px-3 py-3 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors resize-none ${
            errors.objective ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-violet-500'
          } focus:outline-none focus:ring-2`}
          placeholder="Busco integrarme en una empresa innovadora donde pueda aplicar mis conocimientos en desarrollo full stack y contribuir al crecimiento del equipo..."
        />
        {errors.objective && <p className="text-xs text-red-500 mt-1">{errors.objective}</p>}
      </div>

      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-violet-800 dark:text-violet-300 mb-2">💡 Consejos ATS</h4>
        <ul className="text-xs text-violet-700 dark:text-violet-400 space-y-1">
          <li>• Usa verbos de acción: lideré, desarrollé, implementé, optimicé</li>
          <li>• Incluye palabras clave de tu industria</li>
          <li>• Menciona resultados cuantificables (% de mejora, equipos, presupuestos)</li>
          <li>• Mantén un tono profesional y directo</li>
          <li>• Recomendado: 100-300 caracteres para el resumen</li>
        </ul>
      </div>
    </div>
  );
}
