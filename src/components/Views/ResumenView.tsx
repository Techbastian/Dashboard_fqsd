import { kpis, embudo, hitos, distribucionPerfiles, distribucionBarrios } from '../../data';
import { KPICard, HorizontalBar } from '../Common';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

const EmptyState = ({ text = 'Sin datos disponibles' }: { text?: string }) => (
  <div className="py-8 flex flex-col items-center text-center">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{text}</p>
    <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán desde Supabase</p>
  </div>
);

export default function ResumenView() {
  const inscritos = embudo.find(e => e.fase === 'INS')?.cantidad ?? 0;
  const totalPre = embudo[0]?.cantidad ?? 0;
  const hasEmbudoData = totalPre > 0;

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          label="Beneficiarios"
          value={kpis.atendidos.toLocaleString()}
          color="text-qsd-pink"
        />
        <KPICard
          label="Inscritos"
          value={inscritos.toString()}
          color="text-qsd-blue"
          subtext="En proceso de inscripción"
        />
        <KPICard
          label="Colocados"
          value={kpis.colocados.toString()}
          color="text-qsd-pink"
          subtext="0% del total"
        />
        <KPICard
          label="Empresas vinculadas"
          value={kpis.empresasAliadas.toString()}
          color="text-qsd-blue"
        />
        <KPICard
          label="Inversión ejecutada"
          value="0"
          prefix="$"
          suffix="M"
          color="text-qsd-purple"
          subtext="Inicio de proyecto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Beneficiarios por Barrio (Cali)</h3>
          {distribucionBarrios.length > 0 ? (
            <div className="space-y-6">
              {distribucionBarrios.map(c => (
                <HorizontalBar
                  key={c.label}
                  label={c.label}
                  value={c.value}
                  maxValue={Math.max(...distribucionBarrios.map(b => b.value))}
                  color="bg-qsd-blue"
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        <div className="glass-card p-8 flex flex-col">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Embudo del proyecto</h3>
          {hasEmbudoData ? (
            <div className="flex-1 flex flex-col justify-between py-4">
              {embudo.map((step, idx) => (
                <div key={step.fase} className="flex items-center gap-4">
                  <div className="w-16 text-right">
                    <span className="text-[10px] font-bold text-slate-400">{step.nombre}</span>
                  </div>
                  <div className="flex-1 relative h-10 group">
                    <div
                      className={`h-full flex items-center justify-center text-white text-[10px] font-black rounded-lg shadow-sm transition-all group-hover:scale-[1.02] ${
                        idx === 0 ? 'bg-qsd-blue' : idx === 1 ? 'bg-qsd-pink' : idx === 2 ? 'bg-qsd-purple' : idx === 3 ? 'bg-qsd-orange' : 'bg-qsd-teal'
                      }`}
                      style={{ width: `${(step.cantidad / totalPre) * 100}%`, margin: '0 auto', minWidth: '2rem' }}
                    >
                      {step.cantidad}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Distribución por Perfil TIC</h3>
          {distribucionPerfiles.length > 0 ? (
            <div className="space-y-6">
              {distribucionPerfiles.map((r, idx) => (
                <HorizontalBar
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  maxValue={Math.max(...distribucionPerfiles.map(p => p.value))}
                  suffix=""
                  color={idx === 0 ? 'bg-qsd-blue' : idx === 1 ? 'bg-qsd-pink' : idx === 2 ? 'bg-qsd-blue' : idx === 3 ? 'bg-qsd-purple' : 'bg-qsd-teal'}
                  subtitle={r.perc}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Contractual Status */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Avance vs hitos contractuales GOYN</h3>
           <span className="text-xs font-bold text-qsd-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Estado: En Tiempo Normal</span>
        </div>
        {hitos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {hitos.map(h => (
              <div key={h.id} className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{h.id}</span>
                  <span className="text-xs font-black text-slate-700 leading-tight h-8">{h.nombre}</span>
                </div>
                <div className="relative pt-1">
                  <div className="text-[10px] font-black text-slate-900 mb-1">{h.avance}%</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${h.completado ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${h.avance}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="Sin hitos contractuales registrados" />
        )}
      </div>
    </div>
  );
}
