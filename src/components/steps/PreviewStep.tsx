import { useCV } from '@/store/CVContext';
import { Eye, Sparkles, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { scoreATS, getScoreColor, getScoreLabel } from '@/utils/atsScorer';

export default function PreviewStep() {
  const { state, setStep } = useCV();
  const { data } = state;
  const scores = useMemo(() => scoreATS(data), [data]);

  const scoreColor = getScoreColor(scores.overall);
  const scoreLabel = getScoreLabel(scores.overall);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-violet-500" />
          Vista Previa y Análisis ATS
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Revisa tu CV y verifica la compatibilidad con sistemas ATS antes de exportar.
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
            <circle
              cx="56" cy="56" r="48" fill="none"
              stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - scores.overall / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: scoreColor }}>{scores.overall}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">/100</span>
          </div>
        </div>
        <p className="text-lg font-semibold mt-2" style={{ color: scoreColor }}>{scoreLabel}</p>
        <p className="text-xs text-gray-400 mt-1">Puntuación de compatibilidad ATS</p>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Contenido', score: scores.content, icon: Sparkles },
          { label: 'Keywords', score: scores.keywords, icon: TrendingUp },
          { label: 'Formato', score: scores.formatting, icon: CheckCircle2 },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 text-center">
            <item.icon className="w-4 h-4 mx-auto mb-1 text-violet-500" />
            <div className="text-lg font-bold" style={{ color: getScoreColor(item.score) }}>{item.score}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {scores.suggestions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Sugerencias de mejora
          </h4>
          <ul className="space-y-1.5">
            {scores.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <span className="mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weak sections */}
      {scores.weakSections.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-sm text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> Secciones a mejorar
          </h4>
          <ul className="space-y-1.5">
            {scores.weakSections.map((s, i) => (
              <li key={i} className="text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                <span className="mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword suggestions */}
      {scores.keywordSuggestions.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" /> Palabras clave sugeridas
          </h4>
          <div className="flex flex-wrap gap-2">
            {['gestión de proyectos', 'análisis de datos', 'liderazgo', 'metodologías ágiles', 'mejora continua', 'trabajo en equipo', 'resolución de problemas', 'comunicación efectiva'].map((kw, i) => (
              <span key={i} className="text-xs bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setStep('export')}
        className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
      >
        Continuar a Exportación →
      </button>
    </div>
  );
}
