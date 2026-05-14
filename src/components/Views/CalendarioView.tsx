import { actividades } from '../../data';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarioView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Calendario de Actividades</h3>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><ChevronLeft size={20} /></button>
              <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <CalendarIcon size={40} className="text-slate-200 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">Sin actividades programadas</p>
            <p className="text-[10px] mt-1 text-slate-300">Las actividades se agregarán desde la plataforma</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4 border-qsd-blue">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Próxima Actividad</h4>
          {actividades.length > 0 ? (
            <div className="space-y-6">
              {actividades.map(act => (
                <div key={act.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-qsd-blue flex items-center justify-center shrink-0">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{act.nombre}</p>
                      <p className="text-[10px] font-bold text-qsd-blue uppercase tracking-widest">{act.fecha}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} className="text-qsd-blue" />
                      <span className="text-[10px] font-bold uppercase">{act.hora}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="text-qsd-blue" />
                      <span className="text-[10px] font-bold uppercase">{act.lugar}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={14} className="text-qsd-blue" />
                      <span className="text-[10px] font-bold uppercase">{act.asistentes} Perfilados</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-qsd-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-qsd-blue/20 hover:opacity-90 transition-all">
                    Ver Lista de Asistencia
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin actividades</p>
              <p className="text-[10px] text-slate-300 mt-1">No hay actividades programadas</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6 bg-slate-900 text-white border-none">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Métricas del mes</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase">Ejecución eventos</p>
                <p className="text-sm font-black text-slate-400">0/0</p>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-qsd-pink h-full w-0"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase">Asistencia prom.</p>
                <p className="text-sm font-black text-slate-400">—</p>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-qsd-teal h-full w-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
