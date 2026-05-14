import { retencion } from '../../data';

export default function RetencionView() {
  return (
    <div className="space-y-6">
      {retencion.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {retencion.map(r => (
            <div key={r.mes} className="glass-card p-4 flex flex-col space-y-2 border-b-4 border-b-emerald-500">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retención Mes {r.mes}</span>
              <span className={`text-4xl font-black tracking-tight ${r.porcentaje >= 80 ? 'text-emerald-600' : r.porcentaje >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {r.porcentaje}%
              </span>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${r.porcentaje >= 80 ? 'bg-emerald-500' : r.porcentaje >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${r.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin datos de retención</p>
          <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán cuando haya participantes colocados con seguimiento activo</p>
        </div>
      )}
    </div>
  );
}
