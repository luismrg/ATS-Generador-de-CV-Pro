import { CVProvider, useCV } from '@/store/CVContext';
import WizardProgress from '@/components/WizardProgress';
import CVPreview from '@/components/CVPreview';
import ThemeToggle from '@/components/ThemeToggle';
import PersonalInfoStep from '@/components/steps/PersonalInfoStep';
import ProfessionalProfileStep from '@/components/steps/ProfessionalProfileStep';
import ExperienceStep from '@/components/steps/ExperienceStep';
import EducationStep from '@/components/steps/EducationStep';
import SkillsStep from '@/components/steps/SkillsStep';
import ProjectsStep from '@/components/steps/ProjectsStep';
import CoursesStep from '@/components/steps/CoursesStep';
import AwardsStep from '@/components/steps/AwardsStep';
import ReferencesStep from '@/components/steps/ReferencesStep';
import PreviewStep from '@/components/steps/PreviewStep';
import ExportStep from '@/components/steps/ExportStep';
import { WIZARD_STEPS } from '@/types/cv';
import type { WizardStep } from '@/types/cv';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2, Save, Menu, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState, useCallback } from 'react';

const stepComponents: Record<WizardStep, React.ComponentType> = {
  personal: PersonalInfoStep,
  profile: ProfessionalProfileStep,
  experience: ExperienceStep,
  education: EducationStep,
  skills: SkillsStep,
  projects: ProjectsStep,
  courses: CoursesStep,
  awards: AwardsStep,
  references: ReferencesStep,
  preview: PreviewStep,
  export: ExportStep,
};

function CVBuilder() {
  const { state, setStep, resetAll, saveStatus, forceSave, lastSaved, hasSavedData } = useCV();
  const { currentStep } = state;
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const currentIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === WIZARD_STEPS.length - 1;

  const goNext = useCallback(() => {
    if (!isLast) setStep(WIZARD_STEPS[currentIndex + 1].key);
  }, [currentIndex, isLast, setStep]);

  const goPrev = useCallback(() => {
    if (!isFirst) setStep(WIZARD_STEPS[currentIndex - 1].key);
  }, [currentIndex, isFirst, setStep]);

  const handleReset = () => {
    resetAll();
    setShowConfirmReset(false);
  };

  const StepComponent = stepComponents[currentStep];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 z-20">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-fuchsia-200/50">
                <span className="text-white font-bold text-lg leading-none">D</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">Digloff CV Builder Pro</h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Optimizado para ATS & IA</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile preview toggle */}
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
              aria-label={showMobilePreview ? 'Mostrar formulario' : 'Mostrar vista previa'}
            >
              {showMobilePreview ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Reset button */}
            {showConfirmReset ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-red-500 dark:text-red-400">¿Confirmar?</span>
                <button onClick={handleReset} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors">
                  Sí, limpiar
                </button>
                <button onClick={() => setShowConfirmReset(false)} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Limpiar todos los datos"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}

            <ThemeToggle />

            {/* Save indicator */}
            <button
              onClick={() => saveStatus !== 'saving' && forceSave()}
              className="flex items-center gap-1 text-xs transition-colors"
              title={
                saveStatus === 'saving' ? 'Guardando...' :
                saveStatus === 'saved' ? `Guardado ${lastSaved ? `a las ${lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : ''}` :
                saveStatus === 'error' ? 'Error al guardar' :
                hasSavedData ? 'Haz clic para guardar ahora' : 'Los datos se guardan automáticamente'
              }
              aria-label="Guardar datos"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' && (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-amber-600 dark:text-amber-400 hidden sm:inline">Guardando...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400 hidden sm:inline">✓ Guardado</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-500 hidden sm:inline">Error</span>
                </>
              )}
              {saveStatus === 'idle' && (
                <>
                  <Save className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-violet-500 transition-colors" />
                  <span className="text-gray-400 dark:text-gray-500 hidden sm:inline hover:text-violet-500 transition-colors">
                    {hasSavedData ? 'Auto-guardado' : 'Guardar'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Wizard Progress */}
        <WizardProgress />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className={`${
          showMobilePreview ? 'hidden lg:flex' : 'flex'
        } flex-col w-full lg:w-1/2 xl:w-[45%] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <span className="text-xs text-gray-400 dark:text-gray-500">
              Paso {currentIndex + 1} de {WIZARD_STEPS.length}
            </span>

            <button
              onClick={goNext}
              disabled={isLast}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-violet-500 hover:bg-violet-600 text-white"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className={`${
          showMobilePreview ? 'flex' : 'hidden lg:flex'
        } flex-col w-full lg:w-1/2 xl:w-[55%] bg-gray-100 dark:bg-gray-900`}>
          <CVPreview />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CVProvider>
      <CVBuilder />
    </CVProvider>
  );
}
