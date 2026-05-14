import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Mail, Phone, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useData, ApplicationRecord } from '../../contexts/DataContext';

type StatusFilter = 'todos' | 'habilitados' | 'no_admitidos';

const CRITERIA = [
  { key: 'cumple_edad',          label: 'Edad' },
  { key: 'cumple_municipio',     label: 'Municipio' },
  { key: 'cumple_empleabilidad', label: 'Empleabilidad' },
  { key: 'cumple_estrato',       label: 'Estrato' },
  { key: 'cumple_sisben',        label: 'Sisbén' },
  { key: 'cumple_formacion',     label: 'Formación TI' },
];

function fullName(app: ApplicationRecord) {
  return `${app.candidates?.first_name ?? ''} ${app.candidates?.last_name ?? ''}`.trim() || '—';
}


export default function TrazabilidadView() {
  const { applications, loading, error } = useData();
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState<StatusFilter>('todos');
  const [selected, setSelected]       = useState<ApplicationRecord | null>(null);

  const filtered = useMemo(() => {
    return applications
      .filter(a => {
        if (filter === 'habilitados')  return a.status === 'active';
        if (filter === 'no_admitidos') return a.status === 'rejected';
        return true;
      })
      .filter(a => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        const name = fullName(a).toLowerCase();
        const doc  = a.candidates?.document_number ?? '';
        return name.includes(q) || doc.includes(q);
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        return fullName(a).localeCompare(fullName(b));
      });
  }, [applications, search, filter]);

  const total      = applications.length;
  const habilitados = applications.filter(a => a.status === 'active').length;
  const noAdmitidos = total - habilitados;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-qsd-blue" />
        <p className="text-sm font-bold uppercase tracking-widest">Cargando participantes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 border-l-4 border-red-400">
        <p className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">Error de conexión</p>
        <p className="text-xs text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total registrados</span>
          <p className="text-3xl font-black text-slate-800 mt-1">{total.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-emerald-400">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Habilitados</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{habilitados.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-red-300">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No admitidos</span>
          <p className="text-3xl font-black text-slate-400 mt-1">{noAdmitidos.toLocaleString()}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Buscar por nombre o número de documento…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-qsd-blue transition-colors shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          {(['todos', 'habilitados', 'no_admitidos'] as StatusFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? 'bg-qsd-blue text-white shadow-lg shadow-qsd-blue/20'
                  : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600 shadow-sm'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'habilitados' ? 'Habilitados' : 'No admitidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Participante</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Perfil TIC</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Barrio</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map(app => {
                const isActive  = app.status === 'active';
                const name      = fullName(app);
                const doc       = app.candidates?.document_number ?? '—';
                const perfil    = (app.custom_answers?.perfil_ti  as string) ?? '—';
                const barrio    = (app.custom_answers?.barrio      as string) ?? '—';
                const fecha     = (app.custom_answers?.fecha_registro as string) ?? '—';
                const initials  = name !== '—' ? name.split(' ').slice(0, 2).map(w => w[0]).join('') : '?';

                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelected(app)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black group-hover:bg-qsd-blue group-hover:text-white transition-all shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-none mb-1">{name}</p>
                          <p className="text-[10px] font-bold text-slate-400 font-mono">{doc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-qsd-blue border border-blue-100 uppercase tracking-tight">
                        {perfil}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-600">{barrio}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-50 text-red-400'
                      }`}>
                        {isActive ? 'Habilitado' : 'No admitido'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {fecha !== '—' ? fecha.split('T')[0] : '—'}
                      </p>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                    No se encontraron participantes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-slate-50">
          <p className="text-[10px] font-bold text-slate-400">
            Mostrando {filtered.length} de {total} registros
          </p>
        </div>
      </div>

      {/* ── Panel de detalle ── */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-xl h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-qsd-blue text-white flex items-center justify-center text-xl font-black">
                    {fullName(selected).split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{fullName(selected)}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 font-mono">{selected.candidates?.document_number ?? '—'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* Estado de admisión */}
                {(() => {
                  const isActive = selected.status === 'active';
                  const razon = selected.custom_answers?.razon_rechazo as string;
                  return (
                    <section className={`p-6 rounded-3xl flex items-start gap-4 ${isActive ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-red-400'}`}>
                        {isActive ? <CheckCircle size={24} /> : <XCircle size={24} />}
                      </div>
                      <div>
                        <p className={`text-base font-black ${isActive ? 'text-emerald-700' : 'text-red-600'}`}>
                          {isActive ? 'Perfil Habilitado' : 'No Admitido'}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-1">
                          {isActive
                            ? 'Cumple los criterios de elegibilidad del programa'
                            : razon || 'No cumple los criterios de elegibilidad'}
                        </p>
                      </div>
                    </section>
                  );
                })()}

                {/* Criterios de admisión */}
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Criterios de elegibilidad</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {CRITERIA.map(c => {
                      const cumple = selected.custom_answers?.[c.key] === true;
                      return (
                        <div
                          key={c.key}
                          className={`flex items-center gap-3 p-4 rounded-2xl border ${
                            cumple ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                          }`}
                        >
                          {cumple
                            ? <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            : <XCircle size={16} className="text-red-400 shrink-0" />}
                          <span className={`text-xs font-black ${cumple ? 'text-emerald-700' : 'text-red-500'}`}>
                            {c.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Info del participante */}
                <section className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Barrio',    val: selected.custom_answers?.barrio      as string },
                    { label: 'Estrato',   val: selected.custom_answers?.estrato     as string },
                    { label: 'Sisbén',    val: selected.custom_answers?.sisben      as string },
                    { label: 'Ocupación', val: selected.custom_answers?.ocupacion   as string },
                    { label: 'Perfil TIC',val: selected.custom_answers?.perfil_ti   as string },
                    { label: 'Sisbén verificado', val: selected.custom_answers?.verificacion as string },
                  ].map(({ label, val }) => (
                    <div key={label} className="border border-slate-100 p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-xs font-bold text-slate-700">{val || '—'}</p>
                    </div>
                  ))}
                </section>

                {/* Contacto */}
                <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Contacto</h4>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
                    <Mail size={16} className="text-qsd-blue shrink-0" />
                    <p className="text-sm font-bold text-slate-700 break-all">
                      {selected.candidates?.email || (selected.custom_answers?.correo_formulario as string) || '—'}
                    </p>
                  </div>
                  {selected.custom_answers?.telefono_secundario && (
                    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
                      <Phone size={16} className="text-qsd-blue shrink-0" />
                      <p className="text-sm font-bold text-slate-700">
                        {selected.custom_answers.telefono_secundario as string}
                      </p>
                    </div>
                  )}
                </section>

              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <a
                  href={`mailto:${selected.candidates?.email ?? ''}`}
                  className="flex-1 bg-qsd-blue text-white py-4 rounded-2xl font-black shadow-lg shadow-qsd-blue/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Mail size={18} /> Contactar
                </a>
                {selected.custom_answers?.telefono_secundario && (
                  <a
                    href={`tel:${selected.custom_answers.telefono_secundario}`}
                    className="bg-slate-900 text-white px-5 rounded-2xl font-black shadow-lg hover:opacity-90 transition-all flex items-center justify-center"
                  >
                    <Phone size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
