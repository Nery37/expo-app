import { httpClient } from '@/src/services/http/httpClient';

import type { School, SchoolInput } from '../types';

/**
 * Repository: isola o resto do app da origem dos dados. Hoje aponta para o
 * backend simulado (MirageJS); trocar por uma API real é só escrever outra
 * implementação desta interface.
 */
export interface SchoolsRepository {
  list(): Promise<School[]>;
  get(id: string): Promise<School>;
  create(input: SchoolInput): Promise<School>;
  update(id: string, input: SchoolInput): Promise<School>;
  remove(id: string): Promise<void>;
}

export const httpSchoolsRepository: SchoolsRepository = {
  list: () => httpClient.get<School[]>('/schools'),
  get: (id) => httpClient.get<School>(`/schools/${id}`),
  create: (input) => httpClient.post<School>('/schools', input),
  update: (id, input) => httpClient.put<School>(`/schools/${id}`, input),
  remove: (id) => httpClient.delete(`/schools/${id}`),
};
