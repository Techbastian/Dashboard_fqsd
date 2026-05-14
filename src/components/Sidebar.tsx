import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Filter, 
  BookOpen, 
  Briefcase, 
  RefreshCw, 
  Building2, 
  ClipboardList, 
  Calendar as CalendarIcon,
  HelpCircle,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems: { id: ViewType; label: string; icon: any }[] = [
    { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { id: 'trazabilidad', label: 'Trazabilidad', icon: ClipboardList },
    { id: 'formacion',    label: 'Formación',    icon: BookOpen },
    { id: 'colocacion',   label: 'Colocación',   icon: Briefcase },
    { id: 'retencion',    label: 'Retención',    icon: RefreshCw },
    { id: 'empresas',     label: 'Empresas',     icon: Building2 },
    { id: 'calendario',   label: 'Calendario',   icon: CalendarIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="p-8 pb-4">
        <img 
          src="https://upkvrgncduvxzjvtxbpv.supabase.co/storage/v1/object/public/Imagenes%20Disruptia/Disruptia%20%20Banner%20(QSD).png" 
          alt="Quiero Ser Digital" 
          className="w-full object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group ${
                isActive 
                  ? 'bg-blue-50 text-qsd-blue shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-qsd-blue' : 'text-slate-300 group-hover:text-slate-500'} />
              <span className={`text-sm font-bold tracking-tight ${isActive ? 'font-black' : ''}`}>{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1.5 h-6 bg-qsd-blue rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="flex flex-col gap-1 px-2">
          <button className="flex items-center gap-3 text-slate-400 py-2 hover:text-slate-600 transition-colors">
            <HelpCircle size={18} />
            <span className="text-xs font-bold">Ayuda</span>
          </button>
          <button className="flex items-center gap-3 text-slate-400 py-2 hover:text-slate-600 transition-colors">
            <Settings size={18} />
            <span className="text-xs font-bold">Configuración</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
