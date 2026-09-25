import { useEffect } from 'react';

import { selectFilteredSchools, useSchoolsStore } from '../store/useSchoolsStore';

/** Busca a lista de escolas ao montar e expõe busca/estado já filtrados. */
export function useSchools() {
  const schools = useSchoolsStore(selectFilteredSchools);
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
