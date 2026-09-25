import { useEffect } from 'react';

import { selectFilteredClasses, useClassesStore } from '../store/useClassesStore';

/** Busca as turmas de uma escola ao montar e expõe busca/filtro por turno já aplicados. */
export function useClasses(schoolId: string) {
  const classes = useClassesStore(selectFilteredClasses(schoolId));
  const status = useClassesStore((state) => state.status);
  const error = useClassesStore((state) => state.error);
  const searchTerm = useClassesStore((state) => state.searchTerm);
  const turnoFilter = useClassesStore((state) => state.turnoFilter);
  const setSearchTerm = useClassesStore((state) => state.setSearchTerm);
  const setTurnoFilter = useClassesStore((state) => state.setTurnoFilter);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  useEffect(() => {
    fetchClasses(schoolId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  return {
    classes,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    searchTerm,
    setSearchTerm,
    turnoFilter,
    setTurnoFilter,
    refetch: () => fetchClasses(schoolId),
  };
}
