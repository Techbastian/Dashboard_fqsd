import { embudo } from '../../data';
import { PhaseBadge } from '../Common';
import { Info } from 'lucide-react';

export default function EmbudoView() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-blue-800 leading-relaxed">
          Las tasas de conversión entre fases detectan cuellos de botella. La mayor caída ocurre en PRE→INS (elegibilidad) y en INT→COL (match con vacantes).
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fase</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Etapa</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">% Conversión</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {embudo.map((step, idx) => {
              const prev = idx > 0 ? embudo[idx - 1].cantidad : null;
              const perc = idx === 0 ? 100 : (prev && prev > 0 ? Math.round((step.cantidad / prev) * 100) : 0);
              const barWidth = embudo[0].cantidad > 0 ? (step.cantidad / embudo[0].cantidad) * 100 : 0;
              return (
                <tr key={step.fase} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><PhaseBadge phase={step.fase} /></td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{step.nombre}</td>
                  <td className="px-6 py-4 text-xs font-black text-slate-900">{step.cantidad}</td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-600">{perc}%</td>
                  <td className="px-6 py-4">
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${barWidth}%` }}></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
