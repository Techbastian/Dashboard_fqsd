import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const COHORT_ID = '0f89803e-e36a-43a8-aeb6-70a72bc6acce';

export interface CustomAnswers {
  verificacion?: string;
  sisben?: string;
  estrato?: string | null;
  barrio?: string;
  ocupacion?: string;
  tiempo_desempleado?: string;
  perfil_ti?: string;
  perfil_otro?: string;
  tiene_formacion_ti?: string;
  cumple_edad?: string;
  cumple_municipio?: string;
  cumple_empleabilidad?: string;
  cumple_estrato?: string;
  cumple_sisben?: string;
  cumple_formacion?: string;
  cumple_perfil?: string;
  comunicacion_enviada?: string;
  correo_formulario?: string;
  correo_alterno?: string;
  telefono_secundario?: string;
  fecha_registro?: string;
  fecha_expedicion_doc?: string;
  razon_rechazo?: string;
  [key: string]: unknown;
}

export interface CandidateInfo {
  id: string;
  first_name: string;
  last_name: string;
  document_number: string;
  email: string;
}

export interface ApplicationRecord {
  id: string;
  current_step: string;
  status: string;
  notes: string | null;
  custom_answers: CustomAnswers;
  candidates: CandidateInfo | null;
}

interface DataContextValue {
  applications: ApplicationRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('project_applications')
      .select(`
        id,
        current_step,
        status,
        notes,
        custom_answers,
        candidates (
          id,
          first_name,
          last_name,
          document_number,
          email
        )
      `)
      .eq('cohort_id', COHORT_ID);

    if (err) {
      setError(err.message);
    } else {
      setApplications((data ?? []) as unknown as ApplicationRecord[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DataContext.Provider value={{ applications, loading, error, refresh: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
}
