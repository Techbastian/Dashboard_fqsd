import { useData } from '../../contexts/DataContext';
import { KPICard, HorizontalBar } from '../Common';
import { Loader2 } from 'lucide-react';

type DistItem = { label: string; value: number };

function groupBy(
  items: { custom_answers: Record<string, unknown> }[],
  key: string,
): DistItem[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const raw = item.custom_answers?.[key];
    const label = typeof raw === 'string' && raw.trim() ? raw.trim() : 'Sin datos';
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function EmptySection() {
  return (
    <div className="py-8 flex flex-col items-center text-center">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin datos disponibles</p>
      <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán desde Supabase</p>
    </div>
  );
}

export default function DashboardView() {
  const { applications, loading, error } = useData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-qsd-blue" />
        <p className="text-sm font-bold uppercase tracking-widest">Cargando datos desde Supabase…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 border-l-4 border-red-400">
        <p className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">Error de conexión</p>
        <p className="text-xs text-slate-500">{error}</p>
        <p className="text-[10px] text-slate-400 mt-3">Verifica que las políticas RLS de Supabase permiten lectura con el anon key.</p>
      </div>
    );
  }

  const total = applications.length;
  const activos = applications.filter(a => a.status === 'active').length;
  const rechazados = applications.filter(a => a.status === 'rejected').length;
  const tasaEleg = pct(activos, total);

  const perfiles = groupBy(applications, 'perfil_ti');
  const barrios = groupBy(applications, 'barrio').slice(0, 8);
  const estratos = groupBy(applications, 'estrato').map(e => ({
    ...e,
    label: e.label === 'zona_rural' ? 'Zona rural' : `Estrato ${e.label}`,
  }));
  const sisben = groupBy(applications, 'sisben');
  const ocupaciones = groupBy(applications, 'ocupacion');

  const COLORS = ['bg-qsd-blue', 'bg-qsd-pink', 'bg-qsd-purple', 'bg-qsd-teal', 'bg-qsd-orange'];

  return (
    <div className="space-y-8">

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <KPICard label="Total registrados" value={total.toLocaleString()} color="text-qsd-blue" />
        <KPICard label="Habilitados" value={activos.toString()} color="text-emerald-600" subtext="Avanzan a inscripción" />
        <KPICard label="No admitidos" value={rechazados.toString()} color="text-slate-400" />
        <KPICard label="Tasa elegibilidad" value={tasaEleg.toString()} suffix="%" color="text-qsd-purple" />
        <KPICard label="Empresas aliadas" value="0" meta={150} color="text-qsd-teal" />
      </div>

      {/* ── Perfil TIC | Embudo | Barrio ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="glass-card p-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Distribución por Perfil TIC</h3>
          {perfiles.length > 0 ? (
            <div className="space-y-5">
              {perfiles.map((p, idx) => (
                <HorizontalBar
                  key={p.label}
                  label={p.label}
                  value={p.value}
                  maxValue={perfiles[0].value}
                  color={COLORS[idx % COLORS.length]}
                  subtitle={`${p.value} · ${pct(p.value, total)}%`}
                />
              ))}
            </div>
          ) : <EmptySection />}
        </div>

        <div className="glass-card p-8 flex flex-col">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Embudo del proyecto</h3>
          {total > 0 ? (
            <div className="flex-1 flex flex-col justify-center gap-5">
              {[
                { label: 'Pre-inscripción', value: total, color: 'bg-qsd-blue' },
                { label: 'Habilitados', value: activos, color: 'bg-emerald-500' },
              ].map(step => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="w-28 text-right text-[10px] font-bold text-slate-400 shrink-0">{step.label}</span>
                  <div className="flex-1">
                    <div
                      className={`h-10 flex items-center justify-center text-white text-[10px] font-black rounded-lg transition-all ${step.color}`}
                      style={{ width: `${pct(step.value, total)}%`, minWidth: '2.5rem' }}
                    >
                      {step.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptySection />}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Beneficiarios por Barrio</h3>
          {barrios.length > 0 ? (
            <div className="space-y-5">
              {barrios.map(b => (
                <HorizontalBar
                  key={b.label}
                  label={b.label}
                  value={b.value}
                  maxValue={barrios[0].value}
                  color="bg-qsd-blue"
                  subtitle={`${pct(b.value, total)}%`}
                />
              ))}
            </div>
          ) : <EmptySection />}
        </div>

      </div>

      {/* ── Caracterización ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Estrato socioeconómico
          </h3>
          {estratos.length > 0 ? estratos.map(e => (
            <HorizontalBar
              key={e.label}
              label={e.label}
              value={e.value}
              maxValue={estratos[0].value}
              color="bg-qsd-blue"
              subtitle={`${pct(e.value, total)}%`}
            />
          )) : <EmptySection />}
        </div>

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Sisbén
          </h3>
          {sisben.length > 0 ? sisben.map(s => (
            <HorizontalBar
              key={s.label}
              label={s.label}
              value={s.value}
              maxValue={sisben[0].value}
              color="bg-qsd-teal"
              subtitle={`${pct(s.value, total)}%`}
            />
          )) : <EmptySection />}
        </div>

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Ocupación actual
          </h3>
          {ocupaciones.length > 0 ? ocupaciones.map(o => (
            <HorizontalBar
              key={o.label}
              label={o.label}
              value={o.value}
              maxValue={ocupaciones[0].value}
              color="bg-qsd-pink"
              subtitle={`${pct(o.value, total)}%`}
            />
          )) : <EmptySection />}
        </div>

      </div>
    </div>
  );
}
