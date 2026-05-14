export type ViewType =
  | 'dashboard'
  | 'embudo'
  | 'formacion'
  | 'colocacion'
  | 'retencion'
  | 'empresas'
  | 'trazabilidad'
  | 'calendario';

export type PhaseCode = 'PRE' | 'INS' | 'VER' | 'FOR' | 'INT' | 'COL' | 'RET';
export type ParticipantStatus = 'Activo' | 'Caída' | 'Re-col.' | 'Completado';

export interface Participant {
  id: number;
  nombre: string;
  edad: number;
  genero: string;
  comuna: string;
  estrato: number;
  sisben: string;
  ocupacion: string;
  nivelEducativo: string;
  perfilTI: string;
  celular: string;
  correo: string;
  direccion: string;
  municipio: string;
  barrio: string;
  faseActual: PhaseCode;
  estado: ParticipantStatus;
  razonCaida: string | null;
  fechaPreInscripcion: string;
  fechaColocacion?: string;
  salario?: number;
  empresa?: string;
  tipoContrato?: string;
  modalidad?: string;
  ultimaActualizacion: string;
  horasTecnicas?: number;
  horasIngles?: number;
  horasSocioemocional?: number;
  nivelInglesEntrada?: string;
  nivelInglesSalida?: string;
}

export interface Empresa {
  nombre: string;
  sector: string;
  tamano: string;
  vacantesActivas: number;
  colocados: number;
  perfiles: string[];
  contacto: string;
  satisfaccion: number;
}

export interface Actividad {
  id: number;
  fecha: string;
  nombre: string;
  tipo: 'taller' | 'empresa' | 'checkin' | 'familia';
  hora: string;
  lugar: string;
  asistentes: number;
  evidenciaUrl: string | null;
}

export interface KPI {
  atendidos: number;
  metaAtendidos: number;
  colocados: number;
  metaColocados: number;
  permanencia6m: number;
  metaPermanencia: number;
  mujeresColocadas: number;
  metaMujeres: number;
  afroColocados: number;
  metaAfro: number;
  salarioPromedio: number;
  empresasAliadas: number;
  metaEmpresas: number;
  vacantesActivas: number;
  puestosCubiertos: number;
  mdeFirmados: number;
}

export interface EmbudoStep {
  fase: PhaseCode;
  nombre: string;
  cantidad: number;
  color: string;
}

export interface RetencionMes {
  mes: number;
  porcentaje: number;
}

export interface Hito {
  id: string;
  nombre: string;
  mes: number;
  meta: string;
  avance: number;
  completado: boolean;
}
