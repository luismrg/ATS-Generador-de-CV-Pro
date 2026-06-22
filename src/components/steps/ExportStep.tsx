import { useCV } from '@/store/CVContext';
import { Download, FileText, FileJson, Globe, FileDigit, Upload, ArrowLeftRight, FileType } from 'lucide-react';
import { generateTXT, generateJSON, generateHTML, downloadFile, exportPDF, exportDOCX } from '@/utils/exportUtils';
import { useState } from 'react';
import type { CVData } from '@/types/cv';

export default function ExportStep() {
  const { state, loadData } = useCV();
  const { data } = state;
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const p = data.personalInfo;
  const filename = p.fullName ? `CV_${p.fullName.replace(/\s+/g, '_')}` : 'Mi_CV';

  const exportFormats = [
    {
      icon: FileDigit,
      label: 'PDF',
      desc: 'Formato profesional listo para enviar',
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
      action: async () => {
        setExporting(true);
        try {
          await exportPDF('cv-preview-content', `${filename}.pdf`);
          setMessage('✅ PDF exportado exitosamente');
        } catch {
          setMessage('❌ Error al exportar PDF. Asegúrate de que la vista previa esté visible.');
        }
        setExporting(false);
      },
    },
    {
      icon: FileType,
      label: 'Word (DOCX)',
      desc: 'Documento editable de Microsoft Word',
      color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
      action: async () => {
        setExporting(true);
        try {
          await exportDOCX(data, `${filename}.docx`);
          setMessage('✅ DOCX descargado');
        } catch {
          setMessage('❌ Error al exportar DOCX');
        }
        setExporting(false);
      },
    },
    {
      icon: FileText,
      label: 'TXT (ATS)',
      desc: 'Texto plano optimizado para sistemas ATS',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      action: () => {
        const txt = generateTXT(data);
        downloadFile(txt, `${filename}.txt`, 'text/plain');
        setMessage('✅ TXT descargado');
      },
    },
    {
      icon: Globe,
      label: 'HTML',
      desc: 'Página web para compartir online',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      action: () => {
        const html = generateHTML(data, 'classic');
        downloadFile(html, `${filename}.html`, 'text/html');
        setMessage('✅ HTML descargado');
      },
    },
    {
      icon: FileJson,
      label: 'JSON',
      desc: 'Datos para reutilizar o importar después',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      action: () => {
        const json = generateJSON(data);
        downloadFile(json, `${filename}.json`, 'application/json');
        setMessage('✅ JSON descargado');
      },
    },
  ];

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string) as CVData;
          loadData(imported);
          setMessage('✅ Datos importados exitosamente');
        } catch {
          setMessage('❌ Archivo JSON no válido');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-violet-500" />
          Exportar Currículum
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Descarga tu CV en el formato que necesites.
        </p>
      </div>

      {/* Export formats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exportFormats.map((fmt) => (
          <button
            key={fmt.label}
            onClick={fmt.action}
            disabled={exporting}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-wait ${fmt.color}`}
          >
            <fmt.icon className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm">{fmt.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{fmt.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Import */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
          <ArrowLeftRight className="w-4 h-4" /> Importar / Exportar datos
        </h4>
        <div className="flex gap-3">
          <button
            onClick={importJSON}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Upload className="w-4 h-4" /> Importar JSON
          </button>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.startsWith('✅') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      {exporting && (
        <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          Generando PDF...
        </div>
      )}
    </div>
  );
}
