const EmptySection = () => (
  <div className="py-8 flex flex-col items-center text-center">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin datos disponibles</p>
    <p className="text-[10px] text-slate-300 mt-1">Los datos se cargarán desde Supabase</p>
  </div>
);

export default function FormacionView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Horas técnicas promedio', 'Horas inglés promedio', 'Horas socio-emocional', '% Mejora Inglés'].map(label => (
          <div key={label} className="glass-card p-4 flex flex-col space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-3xl font-black text-slate-300">—</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Formaciones técnicas más cursadas
          </h3>
          <EmptySection />
        </div>

        <div className="glass-card p-6 space-y-6 flex flex-col">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-gray-100 pb-2">
            Inglés: entrada vs salida
          </h3>
          <EmptySection />
        </div>
      </div>
    </div>
  );
}
