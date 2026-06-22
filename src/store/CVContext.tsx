import { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef, type ReactNode } from 'react';
import type { CVData, TemplateKey, WizardStep } from '@/types/cv';
import { DEFAULT_CV_DATA } from '@/types/cv';

interface CVState {
  data: CVData;
  template: TemplateKey;
  currentStep: WizardStep;
}

type CVAction =
  | { type: 'SET_DATA'; payload: Partial<CVData> }
  | { type: 'SET_FIELD'; section: keyof CVData; field: string; value: unknown }
  | { type: 'SET_SKILLS_FIELD'; field: 'technical' | 'soft' | 'languages' | 'tools' | 'certifications'; value: unknown }
  | { type: 'RESET_ALL' }
  | { type: 'SET_TEMPLATE'; payload: TemplateKey }
  | { type: 'SET_STEP'; payload: WizardStep }
  | { type: 'LOAD_DATA'; payload: CVData }
  | { type: 'ADD_ITEM'; section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references'; payload: unknown }
  | { type: 'UPDATE_ITEM'; section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references'; id: string; payload: unknown }
  | { type: 'REMOVE_ITEM'; section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references'; id: string };

const STORAGE_KEY = 'digloff-cv-builder-data';
const TEMPLATE_KEY = 'digloff-cv-builder-template';
const STEP_KEY = 'digloff-cv-builder-step';
const SAVE_DEBOUNCE_MS = 500;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function loadFromStorage(): { data: CVData; template: TemplateKey; step: WizardStep } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedTemplate = localStorage.getItem(TEMPLATE_KEY);
    const storedStep = localStorage.getItem(STEP_KEY);
    if (stored) {
      return {
        data: JSON.parse(stored),
        template: (storedTemplate as TemplateKey) || 'classic',
        step: (storedStep as WizardStep) || 'personal',
      };
    }
  } catch (err) {
    console.error('Error al cargar datos guardados:', err);
  }
  return null;
}

function saveToStorage(data: CVData, template: TemplateKey, step: WizardStep): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(TEMPLATE_KEY, template);
    localStorage.setItem(STEP_KEY, step);
    return true;
  } catch (err) {
    console.error('Error al guardar:', err);
    return false;
  }
}

function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };

    case 'SET_FIELD': {
      const section = state.data[action.section];
      if (typeof section === 'object' && section !== null && !Array.isArray(section)) {
        return {
          ...state,
          data: {
            ...state.data,
            [action.section]: { ...section, [action.field]: action.value },
          },
        };
      }
      return state;
    }

    // Caso ESPECÍFICO para habilidades — más robusto y fiable
    case 'SET_SKILLS_FIELD': {
      return {
        ...state,
        data: {
          ...state.data,
          skills: {
            ...state.data.skills,
            [action.field]: action.value,
          },
        },
      };
    }

    case 'ADD_ITEM': {
      const currentItems = state.data[action.section] as Array<unknown>;
      return {
        ...state,
        data: {
          ...state.data,
          [action.section]: [...currentItems, action.payload],
        },
      };
    }

    case 'UPDATE_ITEM': {
      const items = state.data[action.section] as Array<{ id: string }>;
      return {
        ...state,
        data: {
          ...state.data,
          [action.section]: items.map(item =>
            item.id === action.id ? { ...item, ...(action.payload as object) } : item
          ),
        },
      };
    }

    case 'REMOVE_ITEM': {
      const currentItems = state.data[action.section] as Array<{ id: string }>;
      return {
        ...state,
        data: {
          ...state.data,
          [action.section]: currentItems.filter(item => item.id !== action.id),
        },
      };
    }

    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'RESET_ALL':
      return { data: DEFAULT_CV_DATA, template: 'classic', currentStep: 'personal' };

    case 'LOAD_DATA':
      return { ...state, data: action.payload };

    default:
      return state;
  }
}

interface CVContextType {
  state: CVState;
  dispatch: React.Dispatch<CVAction>;
  setField: (section: keyof CVData, field: string, value: unknown) => void;
  addItem: (section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', payload: unknown) => void;
  updateItem: (section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', id: string, payload: unknown) => void;
  removeItem: (section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', id: string) => void;
  resetAll: () => void;
  setTemplate: (t: TemplateKey) => void;
  setStep: (s: WizardStep) => void;
  loadData: (d: CVData) => void;
  setSkillsField: (field: 'technical' | 'soft' | 'languages' | 'tools' | 'certifications', value: unknown) => void;
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  forceSave: () => void;
  hasSavedData: boolean;
}

const CVContext = createContext<CVContextType | null>(null);

export function CVProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, null, () => {
    const saved = loadFromStorage();
    return {
      data: saved?.data || DEFAULT_CV_DATA,
      template: saved?.template || 'classic',
      currentStep: saved?.step || 'personal',
    };
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(() => {
    const saved = loadFromStorage();
    return saved ? new Date() : null;
  });
  const [hasSavedData, setHasSavedData] = useState<boolean>(() => {
    return loadFromStorage() !== null;
  });

  const debounceRef = useRef<number | null>(null);

  // Guardado automático con debounce
  useEffect(() => {
    const isEmpty =
      !state.data.personalInfo.fullName &&
      state.data.workExperience.length === 0 &&
      state.data.education.length === 0;
    if (isEmpty) return;

    setSaveStatus('saving');

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      const success = saveToStorage(state.data, state.template, state.currentStep);
      if (success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setHasSavedData(true);
        setTimeout(() => setSaveStatus(prev => (prev === 'saved' ? 'idle' : prev)), 2500);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state.data, state.template, state.currentStep]);

  // Guardar antes de cerrar la pestaña
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage(state.data, state.template, state.currentStep);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.data, state.template, state.currentStep]);

  const setField = useCallback((section: keyof CVData, field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', section, field, value });
  }, []);

  const addItem = useCallback((section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', payload: unknown) => {
    dispatch({ type: 'ADD_ITEM', section, payload });
  }, []);

  const updateItem = useCallback((section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', id: string, payload: unknown) => {
    dispatch({ type: 'UPDATE_ITEM', section, id, payload });
  }, []);

  const removeItem = useCallback((section: 'workExperience' | 'education' | 'projects' | 'courses' | 'awards' | 'references', id: string) => {
    dispatch({ type: 'REMOVE_ITEM', section, id });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TEMPLATE_KEY);
      localStorage.removeItem(STEP_KEY);
      setHasSavedData(false);
      setLastSaved(null);
    } catch {
      // ignore
    }
  }, []);

  const setTemplate = useCallback((t: TemplateKey) => {
    dispatch({ type: 'SET_TEMPLATE', payload: t });
  }, []);

  const setStep = useCallback((s: WizardStep) => {
    dispatch({ type: 'SET_STEP', payload: s });
  }, []);

  const loadData = useCallback((d: CVData) => {
    dispatch({ type: 'LOAD_DATA', payload: d });
  }, []);

  const setSkillsField = useCallback((field: 'technical' | 'soft' | 'languages' | 'tools' | 'certifications', value: unknown) => {
    dispatch({ type: 'SET_SKILLS_FIELD', field, value });
  }, []);

  const forceSave = useCallback(() => {
    setSaveStatus('saving');
    const success = saveToStorage(state.data, state.template, state.currentStep);
    if (success) {
      setSaveStatus('saved');
      setLastSaved(new Date());
      setHasSavedData(true);
      setTimeout(() => setSaveStatus('idle'), 2500);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [state.data, state.template, state.currentStep]);

  return (
    <CVContext.Provider
      value={{
        state,
        dispatch,
        setField,
        addItem,
        updateItem,
        removeItem,
        resetAll,
        setTemplate,
        setStep,
        loadData,
        setSkillsField,
        saveStatus,
        lastSaved,
        forceSave,
        hasSavedData,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within CVProvider');
  return ctx;
}
