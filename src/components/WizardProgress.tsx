import { useCV } from '@/store/CVContext';
import { WIZARD_STEPS } from '@/types/cv';
import {
  User, FileText, Briefcase, GraduationCap, Zap, FolderGit2,
  BookOpen, Trophy, Users, Eye, Download, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, typeof User> = {
  User, FileText, Briefcase, GraduationCap, Zap, FolderGit2,
  BookOpen, Trophy, Users, Eye, Download,
};

export default function WizardProgress() {
  const { state, setStep } = useCV();
  const { currentStep } = state;

  const currentIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);
  const progress = ((currentIndex + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-700">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Steps */}
      <div className="px-4 py-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {WIZARD_STEPS.map((step, idx) => {
            const Icon = iconMap[step.icon];
            const isActive = step.key === currentStep;
            const isPast = idx < currentIndex;

            return (
              <button
                key={step.key}
                onClick={() => setStep(step.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                    : isPast
                    ? 'text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
                aria-label={`Paso ${idx + 1}: ${step.label}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isPast ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
