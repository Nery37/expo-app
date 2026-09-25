export const TURNOS = ['manha', 'tarde', 'noite', 'integral'] as const;

export type Turno = (typeof TURNOS)[number];

export const TURNO_LABELS: Record<Turno, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
  integral: 'Integral',
};

export interface SchoolClass {
  id: string;
  schoolId: string;
  nome: string;
  turno: Turno;
  anoLetivo: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassInput {
  nome: string;
  turno: Turno;
  anoLetivo: number;
}

/** Factory: valores padrão para um formulário de turma em branco. */
export function createEmptyClassInput(): ClassInput {
  return {
    nome: '',
    turno: 'manha',
    anoLetivo: new Date().getFullYear(),
  };
}
