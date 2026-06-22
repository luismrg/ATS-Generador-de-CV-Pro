export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  linkedin: string;
  website: string;
  github: string;
  photo: string | null;
}

export interface ProfessionalProfile {
  summary: string;
  objective: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  achievements: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillCategory {
  technical: string[];
  soft: string[];
  languages: { language: string; level: string }[];
  tools: string[];
  certifications: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  year: string;
  certificateUrl: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export type TemplateKey = 'classic' | 'modern' | 'executive';

export interface CVData {
  personalInfo: PersonalInfo;
  professionalProfile: ProfessionalProfile;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory;
  projects: Project[];
  courses: Course[];
  awards: Award[];
  references: Reference[];
}

export interface ATSScore {
  overall: number;
  keywords: number;
  formatting: number;
  content: number;
  suggestions: string[];
  keywordSuggestions: string[];
  actionVerbs: string[];
  weakSections: string[];
}

export type WizardStep = 
  | 'personal'
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'courses'
  | 'awards'
  | 'references'
  | 'preview'
  | 'export';

export const WIZARD_STEPS: { key: WizardStep; label: string; icon: string }[] = [
  { key: 'personal', label: 'Datos Personales', icon: 'User' },
  { key: 'profile', label: 'Perfil Profesional', icon: 'FileText' },
  { key: 'experience', label: 'Experiencia', icon: 'Briefcase' },
  { key: 'education', label: 'Educación', icon: 'GraduationCap' },
  { key: 'skills', label: 'Habilidades', icon: 'Zap' },
  { key: 'projects', label: 'Proyectos', icon: 'FolderGit2' },
  { key: 'courses', label: 'Cursos', icon: 'BookOpen' },
  { key: 'awards', label: 'Premios', icon: 'Trophy' },
  { key: 'references', label: 'Referencias', icon: 'Users' },
  { key: 'preview', label: 'Vista Previa', icon: 'Eye' },
  { key: 'export', label: 'Exportar', icon: 'Download' },
];

export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    linkedin: '',
    website: '',
    github: '',
    photo: null,
  },
  professionalProfile: {
    summary: '',
    objective: '',
  },
  workExperience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    tools: [],
    certifications: [],
  },
  projects: [],
  courses: [],
  awards: [],
  references: [],
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
