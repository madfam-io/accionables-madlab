import { Task, teamMembers, tasks as allTasks, getProjectStats } from '../data/projectData';
import { translations, Language } from '../data/translations';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'txt';
  scope: 'all' | 'filtered';
  language: Language;
  includeFields: {
    id: boolean;
    name: boolean;
    assignee: boolean;
    hours: boolean;
    difficulty: boolean;
    dependencies: boolean;
    phase: boolean;
    section: boolean;
  };
}

const defaultFields = {
  id: true,
  name: true,
  assignee: true,
  hours: true,
  difficulty: true,
  dependencies: true,
  phase: true,
  section: true
};

export const exportTasks = (
  tasks: Task[], 
  options: Partial<ExportOptions> = {}
): void => {
  const opts: ExportOptions = {
    format: 'csv',
    scope: 'all',
    language: 'es',
    includeFields: { ...defaultFields, ...options.includeFields },
    ...options
  };

  const t = translations[opts.language];
  const stats = getProjectStats();
  
  switch (opts.format) {
    case 'csv':
      downloadCSV(tasks, opts, t);
      break;
    case 'json':
      downloadJSON(tasks, opts, t, stats);
      break;
    case 'txt':
      downloadTXT(tasks, opts, t, stats);
      break;
    case 'pdf':
      downloadPDF(tasks, opts, t, stats);
      break;
    default:
      throw new Error(`Unsupported export format: ${opts.format}`);
  }
};

const downloadCSV = (tasks: Task[], options: ExportOptions, t: any): void => {
  const headers: string[] = [];
  const fields = options.includeFields;
  
  if (fields.id) headers.push(t.taskId);
  if (fields.name) headers.push(t.taskName);
  if (fields.assignee) headers.push(t.assignedTo);
  if (fields.hours) headers.push(t.duration + ' (h)');
  if (fields.difficulty) headers.push(t.difficulty);
  if (fields.phase) headers.push(t.phase);
  if (fields.section) headers.push(t.section);
  if (fields.dependencies) headers.push(t.dependencies);

  const rows = tasks.map(task => {
    const row: string[] = [];
    if (fields.id) row.push(task.id);
    if (fields.name) row.push(`"${options.language === 'es' ? task.name : task.nameEn}"`);
    if (fields.assignee) row.push(task.assignee);
    if (fields.hours) row.push(task.hours.toString());
    if (fields.difficulty) row.push(task.difficulty.toString());
    if (fields.phase) row.push(task.phase.toString());
    if (fields.section) row.push(`"${options.language === 'es' ? task.section : task.sectionEn}"`);
    if (fields.dependencies) row.push(`"${task.dependencies.join(', ')}"`);
    return row.join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, `madlab-tasks-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

const downloadJSON = (tasks: Task[], options: ExportOptions, _t: any, stats: any): void => {
  const exportData = {
    metadata: {
      project: 'MADLAB',
      exportDate: new Date().toISOString(),
      language: options.language,
      scope: options.scope,
      totalTasks: tasks.length,
      totalHours: tasks.reduce((sum, t) => sum + t.hours, 0)
    },
    projectStats: stats,
    tasks: tasks.map(task => {
      const exportTask: any = {};
      if (options.includeFields.id) exportTask.id = task.id;
      if (options.includeFields.name) {
        exportTask.name = options.language === 'es' ? task.name : task.nameEn;
      }
      if (options.includeFields.assignee) exportTask.assignee = task.assignee;
      if (options.includeFields.hours) exportTask.hours = task.hours;
      if (options.includeFields.difficulty) exportTask.difficulty = task.difficulty;
      if (options.includeFields.phase) exportTask.phase = task.phase;
      if (options.includeFields.section) {
        exportTask.section = options.language === 'es' ? task.section : task.sectionEn;
      }
      if (options.includeFields.dependencies) exportTask.dependencies = task.dependencies;
      return exportTask;
    })
  };
  
  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, `madlab-tasks-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
};

const downloadTXT = (tasks: Task[], options: ExportOptions, t: any, stats: any): void => {
  const lines: string[] = [];
  lines.push('MADLAB - ' + t.projectTasks);
  lines.push('='.repeat(50));
  lines.push(`${t.exportDate}: ${new Date().toLocaleDateString()}`);
  lines.push(`${t.totalTasks}: ${tasks.length}`);
  lines.push(`${t.showing} ${tasks.length} ${t.of} ${stats.totalTasks} ${t.tasks}`);
  lines.push('');

  // Group by phase
  const tasksByPhase = [1, 2, 3, 4, 5].map(phase => ({
    phase,
    tasks: tasks.filter(t => t.phase === phase)
  })).filter(p => p.tasks.length > 0);

  tasksByPhase.forEach(({ phase, tasks: phaseTasks }) => {
    lines.push(`${t.phase} ${phase}:`);
    lines.push('-'.repeat(30));
    
    phaseTasks.forEach(task => {
      const taskName = options.language === 'es' ? task.name : task.nameEn;
      lines.push(`[${task.id}] ${taskName}`);
      lines.push(`  ${t.assignedTo}: ${task.assignee}`);
      lines.push(`  ${t.duration}: ${task.hours}h`);
      lines.push(`  ${t.difficulty}: ${task.difficulty}/5`);
      if (task.dependencies.length > 0) {
        lines.push(`  ${t.dependencies}: ${task.dependencies.join(', ')}`);
      }
      lines.push('');
    });
  });

  lines.push('');
  lines.push(t.teamSummary);
  lines.push('-'.repeat(30));
  teamMembers.forEach(member => {
    const memberTasks = allTasks.filter(task => task.assignee === member.name);
    const memberHours = memberTasks.reduce((sum, task) => sum + task.hours, 0);
    lines.push(`${member.name}: ${memberTasks.length} ${t.tasks}, ${memberHours} ${t.hours}`);
  });

  const txtContent = lines.join('\n');
  downloadFile(txtContent, `madlab-tasks-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
};

const downloadPDF = (tasks: Task[], options: ExportOptions, t: any, stats: any): void => {
  // For PDF generation, we'll create an HTML document and use the browser's print to PDF
  const html = generatePDFHTML(tasks, options, t, stats);
  
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

const generatePDFHTML = (tasks: Task[], options: ExportOptions, t: any, stats: any): string => {
  const tasksByPhase = [1, 2, 3, 4, 5].map(phase => ({
    phase,
    tasks: tasks.filter(t => t.phase === phase)
  })).filter(p => p.tasks.length > 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MADLAB - ${t.projectTasks}</title>
  <style>
    @media print { @page { margin: 1in; } }
    body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    .stats { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .phase { margin: 25px 0; page-break-inside: avoid; }
    .phase-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
    .task { margin: 10px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px; page-break-inside: avoid; }
    .task-header { font-weight: bold; margin-bottom: 5px; }
    .task-details { font-size: 14px; color: #666; }
    .team-summary { margin-top: 30px; }
    .team-member { margin: 5px 0; padding: 8px; background: #f9fafb; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>MADLAB - ${t.projectTasks}</h1>
    <p>${t.exportDate}: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="stats">
    <p><strong>${t.totalTasks}:</strong> ${tasks.length}</p>
    <p><strong>${t.showing}:</strong> ${tasks.length} ${t.of} ${stats.totalTasks} ${t.tasks}</p>
  </div>

  ${tasksByPhase.map(({ phase, tasks: phaseTasks }) => `
    <div class="phase">
      <div class="phase-title">${t.phase} ${phase}</div>
      ${phaseTasks.map(task => `
        <div class="task">
          <div class="task-header">[${task.id}] ${options.language === 'es' ? task.name : task.nameEn}</div>
          <div class="task-details">
            ${t.assignedTo}: ${task.assignee} | 
            ${t.duration}: ${task.hours}h | 
            ${t.difficulty}: ${task.difficulty}/5
            ${task.dependencies.length > 0 ? `<br>${t.dependencies}: ${task.dependencies.join(', ')}` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="team-summary">
    <h2>${t.teamSummary}</h2>
    ${teamMembers.map(member => {
      const memberTasks = allTasks.filter(task => task.assignee === member.name);
      const memberHours = memberTasks.reduce((sum, task) => sum + task.hours, 0);
      return `
      <div class="team-member">
        <strong>${member.name}:</strong> ${memberTasks.length} ${t.tasks}, ${memberHours} ${t.hours}
      </div>
    `}).join('')}
  </div>
</body>
</html>`;
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};