import { useData } from '../../contexts/DataContext';
import { KPICard, HorizontalBar, PhaseBadge } from '../Common';
import { Loader2 } from 'lucide-react';
import type { PhaseCode } from '../../types';

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

  const total    = applications.length;
  const activos  = applications.filter(a => a.status === 'active').length;
  const rechazados = total - activos;
  const tasaEleg = pct(activos, total);

  const embudoSteps: { fase: PhaseCode; nombre: string; cantidad: number }[] = [
    { fase: 'PRE', nombre: 'Pre-inscripción',  cantidad: total },
    { fase: 'INS', nombre: 'Inscripción',       cantidad: activos },
    { fase: 'VER', nombre: 'Verificación',      cantidad: 0 },
    { fase: 'FOR', nombre: 'Formación',         cantidad: 0 },
    { fase: 'INT', nombre: 'Intermediación',    cantidad: 0 },
    { fase: 'COL', nombre: 'Colocación',        cantidad: 0 },
    { fase: 'RET', nombre: 'Retención 6m',      cantidad: 0 },
  ];

  const perfiles   = groupBy(applications, 'perfil_ti');
  const barrios    = groupBy(applications, 'barrio').slice(0, 8);
  const estratos   = groupBy(applications, 'estrato').map(e => ({
    ...e,
    label: e.label === 'zona_rural' ? 'Zona rural' : `Estrato ${e.label}`,
  }));
  const sisben     = groupBy(applications, 'sisben');
  const ocupaciones = groupBy(applications, 'ocupacion');

  const COLORS = ['bg-qsd-blue', 'bg-qsd-pink', 'bg-qsd-purple', 'bg-qsd-teal', 'bg-qsd-orange'];

  return (
    <div className="space-y-8">

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <KPICard label="Total registrados"  value={total.toLocaleString()}       color="text-qsd-blue" />
        <KPICard label="Habilitados"         value={activos.toString()}            color="text-emerald-600" subtext="Avanzan a inscripción" />
        <KPICard label="No admitidos"        value={rechazados.toString()}         color="text-slate-400" />
        <KPICard label="Tasa elegibilidad"   value={tasaEleg.toString()} suffix="%" color="text-qsd-purple" />
        <KPICard label="Empresas aliadas"    value="0" meta={150}                  color="text-qsd-teal" />
      </div>

      {/* ── Embudo completo ── */}
      <div className="glass-card overflow-hidden">
        <div className="px-8 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Embudo del proyecto</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fase</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Etapa</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">% Conversión</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">Visual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {embudoSteps.map((step, idx) => {
              const prev = idx > 0 ? embudoSteps[idx - 1].cantidad : null;
              const conv = idx === 0
                ? '100%'
                : prev && prev > 0
                  ? `${Math.round((step.cantidad / prev) * 100)}%`
                  : '—';
              const barW = total > 0 ? pct(step.cantidad, total) : 0;
              return (
                <tr key={step.fase} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4"><PhaseBadge phase={step.fase} /></td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{step.nombre}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{step.cantidad.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-600">{conv}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-qsd-blue h-full rounded-full transition-all duration-500" style={{ width: `${barW}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Perfil TIC | Barrios ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <HorizontalBar key={e.label} label={e.label} value={e.value}
              maxValue={estratos[0].value} color="bg-qsd-blue"
              subtitle={`${pct(e.value, total)}%`} />
          )) : <EmptySection />}
        </div>

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Sisbén
          </h3>
          {sisben.length > 0 ? sisben.map(s => (
            <HorizontalBar key={s.label} label={s.label} value={s.value}
              maxValue={sisben[0].value} color="bg-qsd-teal"
              subtitle={`${pct(s.value, total)}%`} />
          )) : <EmptySection />}
        </div>

        <div className="glass-card p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Ocupación actual
          </h3>
          {ocupaciones.length > 0 ? ocupaciones.map(o => (
            <HorizontalBar key={o.label} label={o.label} value={o.value}
              maxValue={ocupaciones[0].value} color="bg-qsd-pink"
              subtitle={`${pct(o.value, total)}%`} />
          )) : <EmptySection />}
        </div>
      </div>

    </div>
  );
}
