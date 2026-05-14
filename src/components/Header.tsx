import { useFilters } from '../FilterContext';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-md">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="Buscar participantes, empresas o indicadores..." 
          className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-qsd-blue/10 transition-all outline-none text-slate-600"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-qsd-pink rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

export function FilterBar() {
  const { filters, setFilters, applyFilters, clearFilters } = useFilters();

  const comunas = ['Todas', 'C.1', 'C.2', 'C.3', 'C.6', 'C.7', 'C.13', 'C.14', 'C.15', 'C.16', 'C.18', 'C.20', 'C.21', 'C.22'];
  const estratos = ['Todos', '1', '2', '3', '4+'];
  const edades = ['Todas', '18-20', '21-24', '25-28', '29-35'];
  const generos = ['Todos', 'Femenino', 'Masculino', 'No binario'];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-wrap items-center gap-4 shadow-sm relative z-40">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desde</label>
        <input 
          type="date" 
          value={filters.fechaDesde}
          onChange={e => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hasta</label>
        <input 
          type="date" 
          value={filters.fechaHasta}
          onChange={e => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Comuna</label>
        <select 
          value={filters.comuna}
          onChange={e => setFilters(prev => ({ ...prev, comuna: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          {comunas.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estrato</label>
        <select 
          value={filters.estrato}
          onChange={e => setFilters(prev => ({ ...prev, estrato: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          {estratos.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Edad</label>
        <select 
          value={filters.rangoEdad}
          onChange={e => setFilters(prev => ({ ...prev, rangoEdad: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          {edades.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Género</label>
        <select 
          value={filters.genero}
          onChange={e => setFilters(prev => ({ ...prev, genero: e.target.value }))}
          className="border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary bg-white"
        >
          {generos.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex items-end gap-2 h-full mt-auto mb-1">
        <button 
          onClick={applyFilters}
          className="bg-primary text-white px-4 py-2 rounded font-bold text-xs hover:opacity-90 transition-all active:scale-95"
        >
          Aplicar filtros
        </button>
        <button 
          onClick={clearFilters}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded font-bold text-xs hover:bg-gray-200 transition-all active:scale-95"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
