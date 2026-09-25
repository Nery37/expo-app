import { httpClient } from '@/src/services/http/httpClient';

import type { ClassInput, SchoolClass } from '../types';

export interface ClassesRepository {
  listBySchool(schoolId: string): Promise<SchoolClass[]>;
  create(schoolId: string, input: ClassInput): Promise<SchoolClass>;
  update(id: string, input: ClassInput): Promise<SchoolClass>;
  remove(id: string): Promise<void>;
}

export const httpClassesRepository: ClassesRepository = {
  listBySchool: (schoolId) =>
    httpClient.get<SchoolClass[]>(`/classes?schoolId=${encodeURIComponent(schoolId)}`),
  create: (schoolId, input) => httpClient.post<SchoolClass>('/classes', { ...input, schoolId }),
  update: (id, input) => httpClient.put<SchoolClass>(`/classes/${id}`, input),
  remove: (id) => httpClient.delete(`/classes/${id}`),
};
