import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ApiError } from '@/src/services/http/httpClient';

import { httpClassesRepository, type ClassesRepository } from '../api/classesRepository';
import type { ClassInput, SchoolClass, Turno } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';
export type TurnoFilter = Turno | 'todos';

interface ClassesState {
  classesBySchool: Record<string, SchoolClass[]>;
  status: Status;
  error: string | null;
  searchTerm: string;
  turnoFilter: TurnoFilter;
  fetchClasses: (schoolId: string) => Promise<void>;
  createClass: (schoolId: string, input: ClassInput) => Promise<SchoolClass>;
  updateClass: (schoolId: string, id: string, input: ClassInput) => Promise<SchoolClass>;
  deleteClass: (schoolId: string, id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setTurnoFilter: (turno: TurnoFilter) => void;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

const repository: ClassesRepository = httpClassesRepository;

export const useClassesStore = create<ClassesState>()(
  persist(
    (set, get) => ({
      classesBySchool: {},
      status: 'idle',
      error: null,
      searchTerm: '',
      turnoFilter: 'todos',

      fetchClasses: async (schoolId) => {
        set({ status: 'loading', error: null });
        try {
          const classes = await repository.listBySchool(schoolId);
          set({
            classesBySchool: { ...get().classesBySchool, [schoolId]: classes },
            status: 'success',
          });
        } catch (error) {
          set({ status: 'error', error: toErrorMessage(error) });
        }
      },

      createClass: async (schoolId, input) => {
        const created = await repository.create(schoolId, input);
        const current = get().classesBySchool[schoolId] ?? [];
        set({
          classesBySchool: { ...get().classesBySchool, [schoolId]: [...current, created] },
        });
        return created;
      },

      updateClass: async (schoolId, id, input) => {
        const updated = await repository.update(id, input);
        const current = get().classesBySchool[schoolId] ?? [];
        set({
          classesBySchool: {
            ...get().classesBySchool,
            [schoolId]: current.map((schoolClass) =>
              schoolClass.id === id ? { ...schoolClass, ...updated } : schoolClass,
            ),
          },
        });
        return updated;
      },

      deleteClass: async (schoolId, id) => {
        await repository.remove(id);
        const current = get().classesBySchool[schoolId] ?? [];
        set({
          classesBySchool: {
            ...get().classesBySchool,
            [schoolId]: current.filter((schoolClass) => schoolClass.id !== id),
          },
        });
      },

      setSearchTerm: (term) => set({ searchTerm: term }),
      setTurnoFilter: (turno) => set({ turnoFilter: turno }),
    }),
    {
      name: 'gestao-escolas/classes',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ classesBySchool: state.classesBySchool }),
    },
  ),
);

export function selectFilteredClasses(schoolId: string) {
  return (state: ClassesState): SchoolClass[] => {
    const all = state.classesBySchool[schoolId] ?? [];
    const term = state.searchTerm.trim().toLowerCase();

    return all.filter((schoolClass) => {
      const matchesTurno = state.turnoFilter === 'todos' || schoolClass.turno === state.turnoFilter;
      const matchesTerm = !term || schoolClass.nome.toLowerCase().includes(term);
      return matchesTurno && matchesTerm;
    });
  };
}
