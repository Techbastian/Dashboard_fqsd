import { Participant, Empresa, Actividad, KPI, EmbudoStep, RetencionMes, Hito } from './types';

export const participantes: Participant[] = [];

export const distribucionPerfiles: { label: string; value: number; perc: string }[] = [];

export const distribucionBarrios: { label: string; value: number }[] = [];

export const empresas: Empresa[] = [];

export const actividades: Actividad[] = [];

export const kpis: KPI = {
  atendidos: 0,
  metaAtendidos: 1500,
  colocados: 0,
  metaColocados: 800,
  permanencia6m: 0,
  metaPermanencia: 600,
  mujeresColocadas: 0,
  metaMujeres: 500,
  afroColocados: 0,
  metaAfro: 200,
  salarioPromedio: 0,
  empresasAliadas: 0,
  metaEmpresas: 150,
  vacantesActivas: 0,
  puestosCubiertos: 0,
  mdeFirmados: 0,
};

export const embudo: EmbudoStep[] = [
  { fase: "PRE", nombre: "Pre-inscripción", cantidad: 0, color: "blue" },
  { fase: "INS", nombre: "Inscripción", cantidad: 0, color: "green" },
  { fase: "VER", nombre: "Verificación", cantidad: 0, color: "amber" },
  { fase: "FOR", nombre: "Formación", cantidad: 0, color: "purple" },
  { fase: "INT", nombre: "Intermediación", cantidad: 0, color: "coral" },
  { fase: "COL", nombre: "Colocación", cantidad: 0, color: "teal" },
  { fase: "RET", nombre: "Retención 6m", cantidad: 0, color: "pink" },
];

export const retencion: RetencionMes[] = [];
export const hitos: Hito[] = [];
