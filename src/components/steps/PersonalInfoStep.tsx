import { useCV } from '@/store/CVContext';
import { User, Mail, Phone, MapPin, Link2, Globe, Code2, Camera } from 'lucide-react';
import { useState } from 'react';
import { personalInfoSchema } from '@/utils/validation';

export default function PersonalInfoStep() {
  const { state, setField } = useCV();
  const { personalInfo: p } = state.data;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(p.photo);

  const update = (field: string, value: string) => {
    setField('personalInfo', field, value);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setPhotoPreview(result);
        setField('personalInfo', 'photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (field: string, value: string) => {
    const partial = { ...p, [field]: value };
    const result = personalInfoSchema.safeParse(partial);
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldError = result.error.issues.find((e: any) => e.path[0] === field);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError.message }));
      }
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-violet-500" />
          Información Personal
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Completa tus datos de contacto. El nombre y correo son obligatorios.
        </p>
      </div>

      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
            {photoPreview ? (
              <img src={photoPreview} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Subir fotografía"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fotografía (opcional)</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">JPEG o PNG. Recomendado: 400x400px</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre completo *</label>
          <input
            type="text"
            value={p.fullName}
            onChange={e => update('fullName', e.target.value)}
            onBlur={() => validateField('fullName', p.fullName)}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors ${
              errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-violet-500'
            } focus:outline-none focus:ring-2`}
            placeholder="Ej: María García López"
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo profesional *</label>
          <input
            type="text"
            value={p.professionalTitle}
            onChange={e => update('professionalTitle', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            placeholder="Ej: Desarrollador Full Stack Senior"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Mail className="w-3.5 h-3.5 inline mr-1" />
            Correo electrónico *
          </label>
          <input
            type="email"
            value={p.email}
            onChange={e => update('email', e.target.value)}
            onBlur={() => validateField('email', p.email)}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors ${
              errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-violet-500'
            } focus:outline-none focus:ring-2`}
            placeholder="maria@ejemplo.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Phone className="w-3.5 h-3.5 inline mr-1" />
            Teléfono *
          </label>
          <input
            type="tel"
            value={p.phone}
            onChange={e => update('phone', e.target.value)}
            onBlur={() => validateField('phone', p.phone)}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors ${
              errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus:ring-violet-500'
            } focus:outline-none focus:ring-2`}
            placeholder="+34 612 345 678"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            Ciudad *
          </label>
          <input
            type="text"
            value={p.city}
            onChange={e => update('city', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            placeholder="Ej: Madrid"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            País *
          </label>
          <input
            type="text"
            value={p.country}
            onChange={e => update('country', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            placeholder="Ej: España"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección (opcional)</label>
          <input
            type="text"
            value={p.address}
            onChange={e => update('address', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            placeholder="Calle, número, código postal"
          />
        </div>

        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Link2 className="w-3.5 h-3.5 inline mr-1" />
              LinkedIn
            </label>
            <input
              type="url"
              value={p.linkedin}
              onChange={e => update('linkedin', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              placeholder="https://linkedin.com/in/usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Globe className="w-3.5 h-3.5 inline mr-1" />
              Portafolio / Web
            </label>
            <input
              type="url"
              value={p.website}
              onChange={e => update('website', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              placeholder="https://miportafolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Code2 className="w-3.5 h-3.5 inline mr-1" />
              GitHub / opcional
            </label>
            <input
              type="url"
              value={p.github}
              onChange={e => update('github', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
              placeholder="https://github.com/usuario"
            />
          </div>
        </div>
      </div>

      {/* Field counter */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {Object.values(p).filter(v => v && v !== '').length} de {Object.keys(p).length} campos completados
      </div>
    </div>
  );
}
