import { participantes } from '../../data';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Search, X, User, Mail, MapPin, GraduationCap, Phone } from 'lucide-react';
import { StatusBadge } from '../Common';
import { useState } from 'react';
import { Participant } from '../../types';

export default function TrazabilidadView() {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipantes = participantes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.perfilTI.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-qsd-blue text-white flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <p className="text-sm font-bold text-slate-700 leading-relaxed">
          Módulo de trazabilidad. Haz clic en cualquier participante para ver su perfil completo y criterios de admisión evaluados.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o perfil..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-qsd-blue/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Participante</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Barrio (Cali)</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Perfil Aspirado</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredParticipantes.map((p) => (
                <tr 
                  key={p.id}
                  onClick={() => setSelectedParticipant(p)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-qsd-blue group-hover:text-white transition-all transform group-hover:scale-105">
                        {p.nombre ? p.nombre.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{p.nombre || 'Sin nombre'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          ID: {p.id} · {p.edad} años · Estrato {p.estrato}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <p className="text-xs font-bold text-slate-700">{p.comuna}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Cali, Valle</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-qsd-blue border border-blue-100 uppercase tracking-tight">
                      {p.perfilTI}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <StatusBadge status={p.estado} />
                      {p.razonCaida && (
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100 w-fit uppercase">
                          {p.razonCaida}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                        {p.ultimaActualizacion.split(' ')[0]}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Registrado</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedParticipant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xl h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-[2rem] bg-qsd-blue text-white flex items-center justify-center text-2xl font-black">
                     {selectedParticipant.nombre.charAt(0)}
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedParticipant.nombre}</h3>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">ID: {selectedParticipant.id}00000{selectedParticipant.id}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedParticipant(null)}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all"
                >
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <User size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Información Personal</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">Edad: <span className="font-black text-slate-900">{selectedParticipant.edad} años</span></p>
                    <p className="text-sm font-bold text-slate-700">Género: <span className="font-black text-slate-900">{selectedParticipant.genero}</span></p>
                    <p className="text-sm font-bold text-slate-700">Estrato: <span className="font-black text-slate-900">{selectedParticipant.estrato}</span></p>
                    <p className="text-sm font-bold text-slate-700">Sisbén: <span className="font-black text-slate-900">{selectedParticipant.sisben}</span></p>
                    <p className="text-sm font-bold text-slate-700">Educación: <span className="font-black text-slate-900">{selectedParticipant.nivelEducativo}</span></p>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Ubicación</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">Municipio: <span className="font-black text-slate-900">{selectedParticipant.municipio || 'Cali'}</span></p>
                    <p className="text-sm font-bold text-slate-700">Barrio: <span className="font-black text-slate-900">{selectedParticipant.barrio || selectedParticipant.comuna}</span></p>
                    <p className="text-sm font-bold text-slate-700">Dirección: <span className="font-black text-slate-900">{selectedParticipant.direccion || 'No registrada'}</span></p>
                  </div>
                </section>

                <section className="bg-blue-50 p-6 rounded-3xl space-y-4 border border-blue-100">
                  <div className="flex items-center gap-2 text-qsd-blue mb-2">
                    <Mail size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Contacto Directo</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                      <div className="w-8 h-8 rounded-lg bg-qsd-blue/10 text-qsd-blue flex items-center justify-center">
                        <Mail size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Correo Electrónico</p>
                        <p className="text-sm font-bold text-slate-800">{selectedParticipant.correo || 'sin-correo@disruptia.co'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                      <div className="w-8 h-8 rounded-lg bg-qsd-blue/10 text-qsd-blue flex items-center justify-center">
                        <span className="text-xs font-black">TEL</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Celular / WhatsApp</p>
                        <p className="text-sm font-bold text-slate-800">{selectedParticipant.celular || '300 000 0000'}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Estatus de Admisión</h4>
                  <div className={`p-6 rounded-3xl flex items-center justify-between ${selectedParticipant.estado === 'Activo' ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${selectedParticipant.estado === 'Activo' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {selectedParticipant.estado === 'Activo' ? '✓' : '✕'}
                      </div>
                      <div>
                        <p className={`text-lg font-black ${selectedParticipant.estado === 'Activo' ? 'text-emerald-700' : 'text-red-700'}`}>
                          {selectedParticipant.estado === 'Activo' ? 'Perfil Habilitado' : 'No Admitido'}
                        </p>
                        <p className="text-xs font-bold text-slate-500">Evaluado el {selectedParticipant.ultimaActualizacion}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-6">
                  <div className="bg-blue-50 p-6 rounded-3xl space-y-4 border border-blue-100">
                    <div className="flex items-center gap-2 text-qsd-blue mb-2">
                      <GraduationCap size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Formación de Interés</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                      <span className="text-sm font-black text-slate-800">{selectedParticipant.perfilTI}</span>
                      <span className="text-[10px] font-black bg-blue-100 text-qsd-blue px-2 py-1 rounded-lg">CALI 2026</span>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 p-4 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ocupación</p>
                     <p className="text-xs font-bold text-slate-700">{selectedParticipant.ocupacion}</p>
                  </div>
                  <div className="border border-slate-100 p-4 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Criterio Final</p>
                     <p className={`text-xs font-black ${selectedParticipant.estado === 'Activo' ? 'text-emerald-500' : 'text-red-500'}`}>
                       {selectedParticipant.estado === 'Activo' ? 'Habilitada' : 'No Admitida'}
                     </p>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <a 
                  href={`mailto:${selectedParticipant.correo || 'soporte@disruptia.co'}`}
                  className="flex-1 bg-qsd-blue text-white py-4 rounded-2xl font-black shadow-lg shadow-qsd-blue/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={18} /> Contactar Beneficiario
                </a>
                <a 
                  href={`tel:${selectedParticipant.celular}`}
                  className="bg-slate-900 text-white p-4 rounded-2xl font-black shadow-lg shadow-slate-900/20 hover:opacity-90 transition-all flex items-center justify-center"
                >
                  <Phone size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
