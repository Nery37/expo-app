import { act } from '@testing-library/react-native';

import { httpSchoolsRepository } from '../api/schoolsRepository';
import type { School } from '../types';
import { selectFilteredSchools, useSchoolsStore } from './useSchoolsStore';

jest.mock('../api/schoolsRepository', () => ({
  httpSchoolsRepository: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

const repository = httpSchoolsRepository as jest.Mocked<typeof httpSchoolsRepository>;

function makeSchool(overrides: Partial<School> = {}): School {
  return {
    id: '1',
    nome: 'Escola A',
    endereco: 'Rua A',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('useSchoolsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSchoolsStore.setState({ schools: [], status: 'idle', error: null, searchTerm: '' });
  });

  it('busca e armazena a lista de escolas', async () => {
    const school = makeSchool();
    repository.list.mockResolvedValue([school]);

    await act(() => useSchoolsStore.getState().fetchSchools());

    expect(useSchoolsStore.getState().schools).toEqual([school]);
    expect(useSchoolsStore.getState().status).toBe('success');
  });

  it('marca status de erro quando a busca falha', async () => {
    repository.list.mockRejectedValue(new Error('falhou'));

    await act(() => useSchoolsStore.getState().fetchSchools());

    expect(useSchoolsStore.getState().status).toBe('error');
    expect(useSchoolsStore.getState().error).toBeTruthy();
  });

  it('adiciona uma escola criada à lista', async () => {
    const created = makeSchool({ id: '2', nome: 'Escola Nova' });
    repository.create.mockResolvedValue(created);

    await act(() => useSchoolsStore.getState().createSchool({ nome: 'Escola Nova', endereco: 'Rua B' }));

    expect(useSchoolsStore.getState().schools).toContainEqual(created);
  });

  it('atualiza uma escola existente na lista', async () => {
    useSchoolsStore.setState({ schools: [makeSchool()] });
    const updated = makeSchool({ nome: 'Escola Atualizada' });
    repository.update.mockResolvedValue(updated);

    await act(() => useSchoolsStore.getState().updateSchool('1', { nome: 'Escola Atualizada', endereco: 'Rua A' }));

    expect(useSchoolsStore.getState().schools[0].nome).toBe('Escola Atualizada');
  });

  it('remove uma escola da lista', async () => {
    useSchoolsStore.setState({ schools: [makeSchool()] });
    repository.remove.mockResolvedValue(undefined);

    await act(() => useSchoolsStore.getState().deleteSchool('1'));

    expect(useSchoolsStore.getState().schools).toHaveLength(0);
  });

  it('filtra escolas pelo termo de busca (nome ou endereço)', () => {
    const state = {
      schools: [
        makeSchool({ id: '1', nome: 'Escola Central', endereco: 'Av. Brasil' }),
        makeSchool({ id: '2', nome: 'Colégio Norte', endereco: 'Rua das Flores' }),
      ],
      searchTerm: 'flores',
    } as unknown as ReturnType<typeof useSchoolsStore.getState>;

    const filtered = selectFilteredSchools(state);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });
});
