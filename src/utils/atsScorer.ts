import type { CVData, ATSScore } from '@/types/cv';

const ACTION_VERBS = [
  'lideré', 'gestioné', 'desarrollé', 'implementé', 'optimicé', 'diseñé',
  'coordiné', 'supervisé', 'analicé', 'creé', 'dirigí', 'aumenté',
  'reduje', 'mejoré', 'automaticé', 'organicé', 'logré', 'establecí',
  'negocié', 'resolví', 'transformé', 'impulsé', 'ejecuté', 'planifiqué',
  'lideré', 'administré', 'consolidé', 'modernicé', 'fortalecí', 'expandí',
  'managed', 'developed', 'implemented', 'designed', 'led', 'coordinated',
  'supervised', 'analyzed', 'created', 'directed', 'increased', 'reduced',
  'improved', 'automated', 'organized', 'achieved', 'established',
  'negotiated', 'resolved', 'transformed', 'driven', 'executed',
];

const INDUSTRY_KEYWORDS = [
  'liderazgo', 'gestión', 'estrategia', 'innovación', 'resultados',
  'eficiencia', 'optimización', 'metodología', 'ágil', 'scrum',
  'digital', 'transformación', 'análisis', 'datos', 'KPI',
  'ROI', 'presupuesto', 'equipo', 'stakeholders', 'proyectos',
  'javascript', 'python', 'react', 'node', 'cloud', 'AWS',
  'Azure', 'SQL', 'NoSQL', 'API', 'DevOps', 'CI/CD',
  'machine learning', 'data science', 'blockchain', 'ciberseguridad',
  'marketing digital', 'SEO', 'SEM', 'CRM', 'ERP', 'SaaS',
  'metodologías ágiles', 'design thinking', 'lean', 'six sigma',
  'comunicación', 'negociación', 'resolución de problemas',
  'pensamiento crítico', 'trabajo en equipo', 'adaptabilidad',
];

const MEASURABLE_RESULTS = [
  '%', 'porcentaje', 'millones', 'miles', 'dólares', 'euros',
  'personas', 'equipos', 'meses', 'semanas', 'años',
  'incremento', 'reducción', 'mejora', 'crecimiento',
];

export function scoreATS(data: CVData): ATSScore {
  const suggestions: string[] = [];
  const keywordSuggestions: string[] = [];
  const weakSections: string[] = [];

  // Check personal info completeness
  let personalInfoScore = 0;
  if (data.personalInfo.fullName) personalInfoScore += 10;
  if (data.personalInfo.email) personalInfoScore += 10;
  if (data.personalInfo.phone) personalInfoScore += 10;
  if (data.personalInfo.linkedin) personalInfoScore += 5;
  if (data.personalInfo.city && data.personalInfo.country) personalInfoScore += 5;
  if (data.personalInfo.professionalTitle) personalInfoScore += 10;
  if (!data.personalInfo.photo) {
    suggestions.push('Considera añadir una foto profesional (opcional según país).');
  }

  // Check professional summary
  let summaryScore = 0;
  const summary = data.professionalProfile.summary.toLowerCase();
  if (summary.length >= 100) summaryScore += 15;
  else if (summary.length >= 50) summaryScore += 8;
  else {
    weakSections.push('Resumen profesional demasiado corto (mínimo 100 caracteres recomendado).');
  }
  
  // Check for action verbs in summary
  const foundActionVerbs = ACTION_VERBS.filter(verb => summary.includes(verb.toLowerCase()));
  if (foundActionVerbs.length >= 3) summaryScore += 10;
  else if (foundActionVerbs.length > 0) summaryScore += 5;
  else {
    suggestions.push('Usa verbos de acción en tu resumen profesional (ej: "Lideré", "Desarrollé", "Implementé").');
  }

  // Check keywords
  let keywordScore = 0;
  const objective = data.professionalProfile.objective.toLowerCase();
  const allText = summary + ' ' + objective + ' ' +
    data.workExperience.map(w => w.responsibilities + ' ' + w.achievements).join(' ') + ' ' +
    data.skills.technical.join(' ') + ' ' + data.skills.soft.join(' ') + ' ' +
    data.skills.tools.join(' ');

  // Bonus for having an objective
  if (objective.length >= 30) summaryScore += 5;

  const foundKeywords = INDUSTRY_KEYWORDS.filter(kw => allText.toLowerCase().includes(kw.toLowerCase()));
  const keywordRatio = foundKeywords.length / INDUSTRY_KEYWORDS.length;
  if (keywordRatio > 0.15) keywordScore = 25;
  else if (keywordRatio > 0.08) keywordScore = 15;
  else {
    keywordScore = 5;
    keywordSuggestions.push('Añade más palabras clave relevantes como: gestión de proyectos, análisis de datos, liderazgo.');
  }

  // Check work experience
  let experienceScore = 0;
  if (data.workExperience.length === 0) {
    weakSections.push('Añade al menos una experiencia laboral.');
  } else {
    experienceScore = Math.min(data.workExperience.length * 8, 25);
    
    const hasMeasurable = data.workExperience.some(w => {
      const text = (w.responsibilities + ' ' + w.achievements).toLowerCase();
      return MEASURABLE_RESULTS.some(mr => text.includes(mr.toLowerCase()));
    });
    
    if (!hasMeasurable) {
      suggestions.push('Incluye resultados medibles en tu experiencia (ej: "Aumenté las ventas en un 25%").');
    }
    
    const hasActionVerbs = data.workExperience.some(w => {
      const text = (w.responsibilities + ' ' + w.achievements).toLowerCase();
      return ACTION_VERBS.some(av => text.includes(av.toLowerCase()));
    });
    
    if (!hasActionVerbs) {
      suggestions.push('Usa verbos de acción al describir tu experiencia laboral.');
    }
  }

  // Check education
  let educationScore = 0;
  if (data.education.length === 0) {
    weakSections.push('Añade tu formación académica.');
  } else {
    educationScore = Math.min(data.education.length * 5, 15);
  }

  // Check skills
  let skillsScore = 0;
  if (data.skills.technical.length < 3) {
    weakSections.push('Añade más habilidades técnicas (mínimo 3-5 recomendadas).');
  } else {
    skillsScore += 10;
  }
  if (data.skills.soft.length < 2) {
    suggestions.push('Añade habilidades blandas como comunicación, trabajo en equipo o liderazgo.');
  } else {
    skillsScore += 5;
  }
  if (data.skills.languages.length === 0) {
    suggestions.push('Añade los idiomas que dominas.');
  } else {
    skillsScore += 5;
  }

  // Calculate overall
  const formatting = 80; // Base formatting score (templates are ATS-friendly)
  
  const contentScore = Math.min(
    personalInfoScore + summaryScore + experienceScore + educationScore + skillsScore,
    100
  );

  const overall = Math.round((contentScore * 0.5) + (keywordScore * 1.2) + (formatting * 0.3));
  const normalizedOverall = Math.min(overall, 100);

  const actionVerbsList = foundActionVerbs.slice(0, 5);

  // Remove duplicates
  const uniqueSuggestions = [...new Set(suggestions)];
  const uniqueKeywordSuggestions = [...new Set(keywordSuggestions)];
  const uniqueWeakSections = [...new Set(weakSections)];

  return {
    overall: normalizedOverall,
    keywords: Math.min(Math.round(keywordScore * 1.2), 100),
    formatting,
    content: contentScore,
    suggestions: uniqueSuggestions,
    keywordSuggestions: uniqueKeywordSuggestions,
    actionVerbs: actionVerbsList,
    weakSections: uniqueWeakSections,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Regular';
  return 'Necesita mejoras';
}
