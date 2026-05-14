import { kpis, empresas } from '../../data';
import { KPICard } from '../Common';
import { Building2 } from 'lucide-react';

export default function EmpresasView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard label="Empresas aliadas" value={kpis.empresasAliadas} meta={kpis.metaEmpresas} />
        <KPICard label="Vacantes activas" value={kpis.vacantesActivas} />
        <KPICard label="Puestos cubiertos" value={kpis.puestosCubiertos} />
        <KPICard label="MdE firmados" value={kpis.mdeFirmados} />
        <KPICard label="Satisfacción Empresa" value="-" color="text-slate-400" />
      </div>

      <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center">
          <Building2 size={32} />
        </div>
        <div className="max-w-xs">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Sin empresas vinculadas</h3>
          <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest mt-2">
            Aún no se han registrado empresas aliadas en esta etapa del proyecto. Los datos se actualizarán automáticamente al iniciar la fase de intermediación.
          </p>
        </div>
        <button className="mt-4 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-qsd-blue transition-all">
          Gestionar Alianzas
        </button>
      </div>
    </div>
  );
}
