import { kpis } from '../../data';
import { KPICard } from '../Common';

const EmptySection = () => (
  <div className="py-8 flex flex-col items-center text-center">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin datos disponibles</p>
    <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán desde Supabase</p>
  </div>
);

export default function ColocacionView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Colocados" value={kpis.colocados.toString()} subtext="Total colocados" />
        <KPICard label="Salario promedio" value={kpis.salarioPromedio > 0 ? `$${kpis.salarioPromedio.toLocaleString()}` : '—'} color="text-emerald-700" />
        <KPICard label="Mujeres colocadas" value={kpis.mujeresColocadas.toString()} />
        <KPICard label="Afro colocados" value={kpis.afroColocados.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Tipo de gestión de vacante
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Tipo de contrato
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Modalidad de trabajo
          </h3>
          <EmptySection />
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
          Sector de empresa de colocación
        </h3>
        <EmptySection />
      </div>
    </div>
  );
}
