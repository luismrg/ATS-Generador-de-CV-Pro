import type { CVData } from '@/types/cv';

export function generateTXT(data: CVData): string {
  const lines: string[] = [];
  const p = data.personalInfo;
  
  lines.push(p.fullName.toUpperCase());
  lines.push(p.professionalTitle);
  lines.push(`${p.email} | ${p.phone}`);
  lines.push(`${p.city}, ${p.country}`);
  if (p.linkedin) lines.push(`LinkedIn: ${p.linkedin}`);
  if (p.github) lines.push(`GitHub: ${p.github}`);
  if (p.website) lines.push(`Web: ${p.website}`);
  lines.push('');
  
  if (data.professionalProfile.summary) {
    lines.push('PERFIL PROFESIONAL');
    lines.push(data.professionalProfile.summary);
    lines.push('');
  }

  if (data.professionalProfile.objective) {
    lines.push('OBJETIVO LABORAL');
    lines.push(data.professionalProfile.objective);
    lines.push('');
  }
  
  if (data.workExperience.length > 0) {
    lines.push('EXPERIENCIA LABORAL');
    for (const w of data.workExperience) {
      lines.push(`${w.position} en ${w.company} (${w.startDate} - ${w.current ? 'Actualidad' : w.endDate})`);
      if (w.responsibilities) lines.push(`  ${w.responsibilities}`);
      if (w.achievements) lines.push(`  Logros: ${w.achievements}`);
      lines.push('');
    }
  }
  
  if (data.education.length > 0) {
    lines.push('EDUCACIÓN');
    for (const e of data.education) {
      lines.push(`${e.degree} en ${e.field} - ${e.institution} (${e.startDate} - ${e.endDate})`);
      if (e.description) lines.push(`  ${e.description}`);
      lines.push('');
    }
  }
  
  if (data.skills.technical.length > 0) {
    lines.push('HABILIDADES TÉCNICAS');
    lines.push(data.skills.technical.join(', '));
    lines.push('');
  }
  
  if (data.skills.soft.length > 0) {
    lines.push('HABILIDADES BLANDAS');
    lines.push(data.skills.soft.join(', '));
    lines.push('');
  }
  
  if (data.skills.languages.length > 0) {
    lines.push('IDIOMAS');
    lines.push(data.skills.languages.map(l => `${l.language}: ${l.level}`).join(', '));
    lines.push('');
  }
  
  if (data.skills.tools.length > 0) {
    lines.push('HERRAMIENTAS');
    lines.push(data.skills.tools.join(', '));
    lines.push('');
  }
  
  if (data.skills.certifications.length > 0) {
    lines.push('CERTIFICACIONES');
    lines.push(data.skills.certifications.join(', '));
    lines.push('');
  }

  if (data.references.length > 0) {
    lines.push('REFERENCIAS');
    for (const r of data.references) {
      lines.push(`${r.name} — ${r.position}${r.company ? ` (${r.company})` : ''}`);
      if (r.email || r.phone) {
        lines.push(`${r.email ? `Email: ${r.email}` : ''}${r.phone ? ` | Tel: ${r.phone}` : ''}`);
      }
      lines.push('');
    }
  }
  
  return lines.join('\n');
}

export function generateJSON(data: CVData): string {
  return JSON.stringify(data, null, 2);
}

export function generateHTML(data: CVData, _templateName: string): string {
  const p = data.personalInfo;
  
  const skillsList = [
    ...data.skills.technical.map(s => `<span class="skill-tag">${s}</span>`),
    ...data.skills.tools.map(s => `<span class="skill-tag">${s}</span>`),
  ].join('');

  const langList = data.skills.languages.map(l => 
    `<span class="skill-tag">${l.language}: ${l.level}</span>`
  ).join('');

  const softList = data.skills.soft.map(s =>
    `<span class="skill-tag soft">${s}</span>`  
  ).join('');

  const certsList = data.skills.certifications.map(c =>
    `<span class="skill-tag cert">${c}</span>`
  ).join('');

  const experienceHTML = data.workExperience.map(w => `
    <div class="entry">
      <div class="entry-header">
        <strong>${w.position}</strong> — ${w.company}
        <span class="date">${w.startDate} - ${w.current ? 'Actualidad' : w.endDate}</span>
      </div>
      <p>${w.responsibilities}</p>
      ${w.achievements ? `<p><em>Logros: ${w.achievements}</em></p>` : ''}
    </div>
  `).join('');

  const educationHTML = data.education.map(e => `
    <div class="entry">
      <div class="entry-header">
        <strong>${e.degree} en ${e.field}</strong> — ${e.institution}
        <span class="date">${e.startDate} - ${e.endDate}</span>
      </div>
      ${e.description ? `<p>${e.description}</p>` : ''}
    </div>
  `).join('');

  const projectsHTML = data.projects.map(proj => `
    <div class="entry">
      <div class="entry-header">
        <strong>${proj.name}</strong>
        ${proj.url ? `<a href="${proj.url}">🔗 Ver proyecto</a>` : ''}
      </div>
      <p>${proj.description}</p>
      ${proj.technologies ? `<p><em>Tecnologías: ${proj.technologies}</em></p>` : ''}
    </div>
  `).join('');

  const coursesHTML = data.courses.map(c => `
    <div class="entry">
      <strong>${c.name}</strong> — ${c.institution} (${c.year})
    </div>
  `).join('');

  const awardsHTML = data.awards.map(a => `
    <div class="entry">
      <strong>${a.title}</strong> — ${a.issuer} (${a.year})
      ${a.description ? `<p>${a.description}</p>` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${p.fullName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #1e3a5f; flex-shrink: 0; }
    h1 { font-size: 24pt; color: #1e3a5f; margin-bottom: 2px; }
    h2 { font-size: 14pt; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; margin-top: 18px; margin-bottom: 10px; padding-bottom: 3px; }
    .subtitle { font-size: 13pt; color: #555; margin-bottom: 12px; }
    .contact { font-size: 10pt; color: #666; margin-bottom: 15px; }
    .contact span { margin-right: 15px; }
    .entry { margin-bottom: 12px; }
    .entry-header { margin-bottom: 3px; }
    .date { color: #777; font-size: 10pt; margin-left: 8px; }
    .skill-tag { display: inline-block; background: #e8f0fe; color: #1e3a5f; padding: 2px 8px; border-radius: 3px; margin: 2px; font-size: 9pt; }
    .skill-tag.soft { background: #f0fdf4; color: #166534; }
    .skill-tag.cert { background: #fef3c7; color: #92400e; }
    a { color: #2563eb; text-decoration: none; }
    p { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="header">
    ${p.photo ? `<img src="${p.photo}" alt="Foto" class="photo" />` : ''}
    <div>
      <h1>${p.fullName}</h1>
      <div class="subtitle">${p.professionalTitle}</div>
    </div>
  </div>
  <div class="contact">
    <span>📧 ${p.email}</span>
    <span>📱 ${p.phone}</span>
    <span>📍 ${p.city}, ${p.country}</span>
    ${p.linkedin ? `<span>🔗 <a href="${p.linkedin}">LinkedIn</a></span>` : ''}
    ${p.github ? `<span>💻 <a href="${p.github}">GitHub</a></span>` : ''}
  </div>

  ${data.professionalProfile.summary ? `
  <h2>Perfil Profesional</h2>
  <p>${data.professionalProfile.summary}</p>
  ` : ''}

  ${data.professionalProfile.objective ? `
  <h2>Objetivo Laboral</h2>
  <p><em>${data.professionalProfile.objective}</em></p>
  ` : ''}

  ${data.workExperience.length > 0 ? `
  <h2>Experiencia Laboral</h2>
  ${experienceHTML}
  ` : ''}

  ${data.education.length > 0 ? `
  <h2>Educación</h2>
  ${educationHTML}
  ` : ''}

  ${skillsList ? `
  <h2>Habilidades Técnicas y Herramientas</h2>
  <div>${skillsList}</div>
  ` : ''}

  ${softList ? `
  <h2>Habilidades Blandas</h2>
  <div>${softList}</div>
  ` : ''}

  ${langList ? `
  <h2>Idiomas</h2>
  <div>${langList}</div>
  ` : ''}

  ${certsList ? `
  <h2>Certificaciones</h2>
  <div>${certsList}</div>
  ` : ''}

  ${data.projects.length > 0 ? `
  <h2>Proyectos Destacados</h2>
  ${projectsHTML}
  ` : ''}

  ${data.courses.length > 0 ? `
  <h2>Cursos</h2>
  ${coursesHTML}
  ` : ''}

  ${data.awards.length > 0 ? `
  <h2>Premios y Reconocimientos</h2>
  ${awardsHTML}
  ` : ''}

  ${data.references.length > 0 ? `
  <h2>Referencias</h2>
  ${data.references.map((r) => `
    <div class="entry">
      <strong>${r.name}</strong>
      <p><em>${r.position}${r.company ? ` — ${r.company}` : ''}</em></p>
      ${r.email || r.phone ? `<p class="contact">${r.email ? `✉ ${r.email}` : ''}${r.phone ? ` | ☎ ${r.phone}` : ''}</p>` : ''}
    </div>
  `).join('')}
  ` : ''}
</body>
</html>`;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportPDF(elementId: string, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');
  
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 10;
  
  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;
  
  while (heightLeft > 0) {
    position = - (imgHeight - heightLeft) + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }
  
  pdf.save(filename);
}

export async function exportDOCX(data: CVData, filename: string) {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = docx;
  
  const p = data.personalInfo;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // Photo (if available)
  if (p.photo) {
    try {
      const base64Data = p.photo.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageOptions: any = {
        data: imageBuffer,
        transformation: { width: 100, height: 100 },
      };
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new ImageRun(imageOptions)],
        })
      );
    } catch {
      // ignore photo errors
    }
  }

  // Header
  children.push(
    new Paragraph({
      text: p.fullName,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: p.professionalTitle,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `${p.email} | ${p.phone} | ${p.city}, ${p.country}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );
  
  if (p.linkedin || p.github) {
    const links = [p.linkedin ? `LinkedIn: ${p.linkedin}` : '', p.github ? `GitHub: ${p.github}` : ''].filter(Boolean).join(' | ');
    children.push(new Paragraph({ text: links, alignment: AlignmentType.CENTER, spacing: { after: 300 } }));
  }
  
  // Summary
  if (data.professionalProfile.summary) {
    children.push(
      new Paragraph({ text: 'Perfil Profesional', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
      new Paragraph({ text: data.professionalProfile.summary, spacing: { after: 200 } })
    );
  }

  // Objective
  if (data.professionalProfile.objective) {
    children.push(
      new Paragraph({ text: 'Objetivo Laboral', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
      new Paragraph({
        children: [new TextRun({ text: data.professionalProfile.objective, italics: true })],
        spacing: { after: 200 },
      })
    );
  }
  
  // Experience
  if (data.workExperience.length > 0) {
    children.push(new Paragraph({ text: 'Experiencia Laboral', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }));
    for (const w of data.workExperience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: w.position, bold: true }),
            new TextRun({ text: ` — ${w.company} (${w.startDate} - ${w.current ? 'Actualidad' : w.endDate})` }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({ text: w.responsibilities, spacing: { after: 50 } })
      );
      if (w.achievements) {
        children.push(new Paragraph({ text: `Logros: ${w.achievements}`, spacing: { after: 100 } }));
      }
    }
  }
  
  // Education
  if (data.education.length > 0) {
    children.push(new Paragraph({ text: 'Educación', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }));
    for (const e of data.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${e.degree} en ${e.field}`, bold: true }),
            new TextRun({ text: ` — ${e.institution} (${e.startDate} - ${e.endDate})` }),
          ],
          spacing: { after: 50 },
        })
      );
    }
  }
  
  // Skills
  if (data.skills.technical.length > 0 || data.skills.tools.length > 0) {
    children.push(new Paragraph({ text: 'Habilidades Técnicas', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }));
    children.push(new Paragraph({
      text: [...data.skills.technical, ...data.skills.tools].join(', '),
      spacing: { after: 100 },
    }));
  }
  
  if (data.skills.soft.length > 0) {
    children.push(new Paragraph({ text: 'Habilidades Blandas', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: data.skills.soft.join(', '), spacing: { after: 100 } }));
  }
  
  if (data.skills.languages.length > 0) {
    children.push(new Paragraph({ text: 'Idiomas', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({
      text: data.skills.languages.map(l => `${l.language}: ${l.level}`).join(', '),
      spacing: { after: 100 },
    }));
  }
  
  if (data.skills.certifications.length > 0) {
    children.push(new Paragraph({ text: 'Certificaciones', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: data.skills.certifications.join(', '), spacing: { after: 100 } }));
  }

  // References
  if (data.references.length > 0) {
    children.push(new Paragraph({ text: 'Referencias', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }));
    for (const r of data.references) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: r.name, bold: true })],
          spacing: { before: 100 },
        })
      );
      children.push(
        new Paragraph({
          text: `${r.position}${r.company ? ` — ${r.company}` : ''}`,
          spacing: { after: 50 },
        })
      );
      if (r.email || r.phone) {
        children.push(
          new Paragraph({
            text: `${r.email ? `Email: ${r.email}` : ''}${r.phone ? ` | Tel: ${r.phone}` : ''}`,
            spacing: { after: 100 },
          })
        );
      }
    }
  }
  
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
