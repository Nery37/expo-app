import { useSchoolsStore } from '../store/useSchoolsStore';

/** Lê uma escola específica já carregada na store (lista/cache offline). */
export function useSchool(id: string | undefined) {
  return useSchoolsStore((state) => state.schools.find((school) => school.id === id));
}
