export default function CaracterizacionView() {
  const EmptySection = () => (
    <div className="py-8 flex flex-col items-center text-center">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin datos disponibles</p>
      <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán desde Supabase</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Edad promedio', '% Estrato 1-2', '% Con Sisbén', '% Migrantes', '% Dependientes'].map(label => (
          <div key={label} className="glass-card p-4 flex flex-col space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-3xl font-black text-slate-300">—</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Distribución por comuna (Cali)
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Nivel educativo
          </h3>
          <EmptySection />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Género
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Ocupación actual
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 flex flex-col space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Poblaciones diferenciales
          </h3>
          <EmptySection />
        </div>
      </div>
    </div>
  );
}
