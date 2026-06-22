import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  professionalTitle: z.string().min(3, 'El cargo debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico no válido'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]{7,15}$/, 'Teléfono no válido'),
  address: z.string().optional().default(''),
  city: z.string().min(2, 'Ciudad requerida'),
  country: z.string().min(2, 'País requerido'),
  linkedin: z.string().url('URL de LinkedIn no válida').optional().or(z.literal('')),
  website: z.string().url('URL no válida').optional().or(z.literal('')),
  github: z.string().url('URL de GitHub no válida').optional().or(z.literal('')),
  photo: z.string().nullable().optional(),
});

export const professionalProfileSchema = z.object({
  summary: z.string().min(50, 'El resumen debe tener al menos 50 caracteres').max(500, 'Máximo 500 caracteres'),
  objective: z.string().min(30, 'El objetivo debe tener al menos 30 caracteres').max(300, 'Máximo 300 caracteres'),
});

export const workExperienceSchema = z.object({
  company: z.string().min(2, 'Empresa requerida'),
  position: z.string().min(2, 'Cargo requerido'),
  startDate: z.string().min(4, 'Fecha de inicio requerida'),
  endDate: z.string().optional().default(''),
  current: z.boolean().default(false),
  responsibilities: z.string().min(20, 'Describe al menos las funciones principales'),
  achievements: z.string().optional().default(''),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institución requerida'),
  degree: z.string().min(2, 'Título requerido'),
  field: z.string().min(2, 'Campo de estudio requerido'),
  startDate: z.string().min(4, 'Fecha de inicio requerida'),
  endDate: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export const skillsSchema = z.object({
  technical: z.array(z.string()),
  soft: z.array(z.string()),
  languages: z.array(z.object({ language: z.string(), level: z.string() })),
  tools: z.array(z.string()),
  certifications: z.array(z.string()),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Nombre del proyecto requerido'),
  description: z.string().min(10, 'Descripción requerida'),
  url: z.string().url('URL no válida').optional().or(z.literal('')),
  technologies: z.string().optional().default(''),
});

export const courseSchema = z.object({
  name: z.string().min(2, 'Nombre del curso requerido'),
  institution: z.string().min(2, 'Institución requerida'),
  year: z.string().min(4, 'Año requerido'),
  certificateUrl: z.string().optional().default(''),
});

export const awardSchema = z.object({
  title: z.string().min(2, 'Título del premio requerido'),
  issuer: z.string().min(2, 'Otorgante requerido'),
  year: z.string().min(4, 'Año requerido'),
  description: z.string().optional().default(''),
});

export const referenceSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  position: z.string().min(2, 'Cargo requerido'),
  company: z.string().min(2, 'Empresa requerida'),
  email: z.string().email('Correo no válido').optional().or(z.literal('')),
  phone: z.string().optional().default(''),
});
