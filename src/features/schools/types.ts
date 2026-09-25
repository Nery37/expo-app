import type { SchoolClass } from '../classes/types';

export interface School {
  id: string;
  nome: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
  /** Embutido pela API quando a escola é retornada (GET /schools, /schools/:id). */
  turmas?: SchoolClass[];
}

export interface SchoolInput {
  nome: string;
  endereco: string;
}

/** Factory: valores padrão para um formulário de escola em branco. */
export function createEmptySchoolInput(): SchoolInput {
  return { nome: '', endereco: '' };
}
