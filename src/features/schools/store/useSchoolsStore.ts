import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ApiError } from '@/src/services/http/httpClient';

import { httpSchoolsRepository, type SchoolsRepository } from '../api/schoolsRepository';
import type { School, SchoolInput } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface SchoolsState {
  schools: School[];
  status: Status;
  error: string | null;
  searchTerm: string;
  fetchSchools: () => Promise<void>;
  createSchool: (input: SchoolInput) => Promise<School>;
  updateSchool: (id: string, input: SchoolInput) => Promise<School>;
  deleteSchool: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/** Repository injetado no módulo — troque aqui para apontar a store a outra origem de dados (ex.: em testes). */
const repository: SchoolsRepository = httpSchoolsRepository;

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      schools: [],
      status: 'idle',
      error: null,
      searchTerm: '',

      fetchSchools: async () => {
        set({ status: 'loading', error: null });
        try {
          const schools = await repository.list();
          set({ schools, status: 'success' });
        } catch (error) {
          set({ status: 'error', error: toErrorMessage(error) });
        }
      },

      createSchool: async (input) => {
        const created = await repository.create(input);
        set({ schools: [...get().schools, created] });
        return created;
      },

      updateSchool: async (id, input) => {
        const updated = await repository.update(id, input);
        set({
          schools: get().schools.map((school) =>
            school.id === id ? { ...school, ...updated } : school,
          ),
        });
        return updated;
      },

      deleteSchool: async (id) => {
        await repository.remove(id);
        set({ schools: get().schools.filter((school) => school.id !== id) });
      },

      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: 'gestao-escolas/schools',
      storage: createJSONStorage(() => AsyncStorage),
      // Só o dado persiste offline; status/erro são sempre transitórios.
      partialize: (state) => ({ schools: state.schools }),
    },
  ),
);

export function selectFilteredSchools(state: SchoolsState): School[] {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return state.schools;
  return state.schools.filter(
    (school) =>
      school.nome.toLowerCase().includes(term) || school.endereco.toLowerCase().includes(term),
  );
}
