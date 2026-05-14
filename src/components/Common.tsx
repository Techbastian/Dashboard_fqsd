import { PhaseCode, ParticipantStatus } from '../types';

export function PhaseBadge({ phase }: { phase: PhaseCode }) {
  const config: Record<PhaseCode, { label: string; bg: string; text: string }> = {
    PRE: { label: 'Pre-ins', bg: 'bg-phase-pre', text: 'text-phase-pre-text' },
    INS: { label: 'Inscripción', bg: 'bg-phase-ins', text: 'text-phase-ins-text' },
    VER: { label: 'Verificación', bg: 'bg-phase-ver', text: 'text-phase-ver-text' },
    FOR: { label: 'Formación', bg: 'bg-phase-for', text: 'text-phase-for-text' },
    INT: { label: 'Intermed.', bg: 'bg-phase-int', text: 'text-phase-int-text' },
    COL: { label: 'Colocación', bg: 'bg-phase-col', text: 'text-phase-col-text' },
    RET: { label: 'Retención', bg: 'bg-phase-ret', text: 'text-phase-ret-text' },
  };

  const { label, bg, text } = config[phase];
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: ParticipantStatus }) {
  const config: Record<ParticipantStatus, { bg: string; text: string }> = {
    Activo: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Caída: { bg: 'bg-red-100', text: 'text-red-700' },
    'Re-col.': { bg: 'bg-amber-100', text: 'text-amber-700' },
    Completado: { bg: 'bg-gray-200', text: 'text-gray-700' },
  };

  const { bg, text } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bg} ${text}`}>
      {status}
    </span>
  );
}

export function KPICard({ label, value, meta, subtext, color = 'text-slate-900', prefix = '', suffix = '', percentageChange }: { 
  label: string; 
  value: string | number; 
  meta?: string | number;
  subtext?: string;
  color?: string;
  prefix?: string;
  suffix?: string;
  percentageChange?: { value: string, positive: boolean };
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:shadow-md transition-all">
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-[2rem] font-black tracking-tighter ${color}`}>{prefix}{value}{suffix}</span>
        </div>
        {(subtext || meta) && (
          <div className="mt-1">
            {meta && <p className="text-[10px] font-bold text-slate-400 italic">Meta: {meta}</p>}
            {subtext && <p className="text-[11px] font-bold text-qsd-blue leading-none">{subtext}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/10 ${color.replace('text-', 'bg-').split(' ')[0]}`}>
           {String(value).slice(0, 1)}
        </div>
        {percentageChange && (
          <span className={`text-[10px] font-black ${percentageChange.positive ? 'text-emerald-500' : 'text-red-500'} bg-slate-50 px-2 py-0.5 rounded-full`}>
            {percentageChange.positive ? '+' : ''}{percentageChange.value} vs mes anterior
          </span>
        )}
      </div>
    </div>
  );
}

export function HorizontalBar({ label, value, maxValue, color = 'bg-qsd-blue', subtitle, suffix = '' }: { 
  label: string; 
  value: number; 
  maxValue: number; 
  color?: string;
  subtitle?: string;
  suffix?: string;
  [key: string]: any;
}) {
  const percentage = Math.min((value / (maxValue || 1)) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-600">{label}</span>
          {subtitle && <span className="text-[9px] text-slate-400 italic font-medium">{subtitle}</span>}
        </div>
        <span className="text-xs font-black text-slate-800">{value}{suffix}</span>
      </div>
      <div className="relative pt-1">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
