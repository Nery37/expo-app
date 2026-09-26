import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { selectFilteredSchools, useSchoolsStore } from '../store/useSchoolsStore';

/** Busca a lista de escolas ao montar e expõe busca/estado já filtrados. */
export function useSchools() {
  // selectFilteredSchools cria um array novo a cada chamada (filter()); sem
  // useShallow, o useSyncExternalStore do Zustand nunca vê a mesma
  // referência entre renders e entra em loop de re-render.
  const schools = useSchoolsStore(useShallow(selectFilteredSchools));
  const status = useSchoolsStore((state) => state.status);
  const error = useSchoolsStore((state) => state.error);
  const searchTerm = useSchoolsStore((state) => state.searchTerm);
  const setSearchTerm = useSchoolsStore((state) => state.setSearchTerm);
  const fetchSchools = useSchoolsStore((state) => state.fetchSchools);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return {
    schools,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchSchools,
  };
}
