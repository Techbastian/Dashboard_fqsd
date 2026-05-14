import { Participant, Empresa, EmbudoStep, KPI } from '../types';

/**
 * DataService: Handles all data fetching for the dashboard.
 * Currently uses mock data, but structure allows easy integration with Google Sheets or Supabase.
 */
export const DataService = {
  getMetrics: (): KPI => ({
    atendidos: 87,
    metaAtendidos: 100,
    colocados: 42,
    metaColocados: 60,
    permanencia6m: 29,
    metaPermanencia: 40,
    mujeresColocadas: 25,
    metaMujeres: 30,
    afroColocados: 12,
    metaAfro: 15,
    salarioPromedio: 1800000,
    empresasAliadas: 15,
    metaEmpresas: 20,
    vacantesActivas: 25,
    puestosCubiertos: 42,
    mdeFirmados: 18,
  }),

  getParticipants: (): Participant[] => [],

  getCompanies: (): Empresa[] => [],

  getFunnelSteps: (): EmbudoStep[] => [],
};
