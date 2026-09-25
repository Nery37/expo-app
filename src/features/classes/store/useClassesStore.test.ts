import { act } from '@testing-library/react-native';

import { httpClassesRepository } from '../api/classesRepository';
import type { SchoolClass } from '../types';
import { selectFilteredClasses, useClassesStore } from './useClassesStore';

jest.mock('../api/classesRepository', () => ({
  httpClassesRepository: {
    listBySchool: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

const repository = httpClassesRepository as jest.Mocked<typeof httpClassesRepository>;

function makeClass(overrides: Partial<SchoolClass> = {}): SchoolClass {
  return {
    id: '1',
    schoolId: 'escola-1',
    nome: 'Turma A',
    turno: 'manha',
    anoLetivo: 2026,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('useClassesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useClassesStore.setState({
      classesBySchool: {},
      status: 'idle',
      error: null,
      searchTerm: '',
      turnoFilter: 'todos',
    });
  });

  it('busca e armazena as turmas de uma escola específica', async () => {
    const schoolClass = makeClass();
    repository.listBySchool.mockResolvedValue([schoolClass]);

    await act(() => useClassesStore.getState().fetchClasses('escola-1'));

    expect(useClassesStore.getState().classesBySchool['escola-1']).toEqual([schoolClass]);
  });

  it('adiciona uma turma criada à escola correta', async () => {
    const created = makeClass({ id: '2', nome: 'Turma B' });
    repository.create.mockResolvedValue(created);

    await act(() =>
      useClassesStore.getState().createClass('escola-1', { nome: 'Turma B', turno: 'manha', anoLetivo: 2026 }),
    );

    expect(useClassesStore.getState().classesBySchool['escola-1']).toContainEqual(created);
  });

  it('remove uma turma da escola correta', async () => {
    useClassesStore.setState({ classesBySchool: { 'escola-1': [makeClass()] } });
    repository.remove.mockResolvedValue(undefined);

    await act(() => useClassesStore.getState().deleteClass('escola-1', '1'));

    expect(useClassesStore.getState().classesBySchool['escola-1']).toHaveLength(0);
  });

  it('filtra turmas por turno e por nome simultaneamente', () => {
    const state = {
      classesBySchool: {
        'escola-1': [
          makeClass({ id: '1', nome: 'Turma A', turno: 'manha' }),
          makeClass({ id: '2', nome: 'Turma B', turno: 'tarde' }),
          makeClass({ id: '3', nome: 'Turma Especial', turno: 'manha' }),
        ],
      },
      searchTerm: 'turma',
      turnoFilter: 'manha',
    } as unknown as ReturnType<typeof useClassesStore.getState>;

    const filtered = selectFilteredClasses('escola-1')(state);

    expect(filtered.map((c) => c.id)).toEqual(['1', '3']);
  });
});
