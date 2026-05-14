import { useState } from 'react';
import { ViewType } from './types';
import Header, { FilterBar } from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/Views/DashboardView';
import EmbudoView from './components/Views/EmbudoView';
import FormacionView from './components/Views/FormacionView';
import ColocacionView from './components/Views/ColocacionView';
import RetencionView from './components/Views/RetencionView';
import EmpresasView from './components/Views/EmpresasView';
import TraceabilityView from './components/Views/TraceabilityView';
import CalendarioView from './components/Views/CalendarioView';
import { motion, AnimatePresence } from 'motion/react';
import { FilterProvider } from './FilterContext';
import { DataProvider } from './contexts/DataContext';

const VIEW_LABELS: Record<ViewType, string> = {
  dashboard: 'Dashboard',
  embudo: 'Embudo',
  formacion: 'Formación',
  colocacion: 'Colocación',
  retencion: 'Retención',
  empresas: 'Empresas',
  trazabilidad: 'Trazabilidad',
  calendario: 'Calendario',
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':    return <DashboardView />;
      case 'embudo':       return <EmbudoView />;
      case 'formacion':    return <FormacionView />;
      case 'colocacion':   return <ColocacionView />;
      case 'retencion':    return <RetencionView />;
      case 'empresas':     return <EmpresasView />;
      case 'trazabilidad': return <TraceabilityView />;
      case 'calendario':   return <CalendarioView />;
      default:             return <DashboardView />;
    }
  };

  return (
    <DataProvider>
      <FilterProvider>
        <div className="min-h-screen bg-[#f8fafc] flex">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />

          <div className="flex-1 ml-72 flex flex-col">
            <Header />
            <FilterBar />

            <main className="p-8">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {VIEW_LABELS[currentView]}
                  </h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Módulo de gestión · Fondo Quiero Ser Digital
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderView()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </FilterProvider>
    </DataProvider>
  );
}
