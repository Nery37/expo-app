/// <reference types="jest" />
import { httpSchoolsRepository } from '../features/schools/api/schoolsRepository';
import { httpClassesRepository } from '../features/classes/api/classesRepository';
import { ApiError } from '../services/http/httpClient';
import { seed } from './seeds';
import { startMockServer, shutdownMockServer } from './server';

describe('backend simulado (MirageJS)', () => {
  beforeEach(() => {
    startMockServer({ environment: 'test' });
  });

  afterEach(() => {
    shutdownMockServer();
  });

  it('lista escolas com turmas embutidas em /schools', async () => {
    // O MirageJS não roda `seeds` automaticamente em ambiente "test" (de
    // propósito, para cada teste começar com um banco limpo), então
    // criamos os dados aqui em vez de depender do seed de desenvolvimento.
    const school = await httpSchoolsRepository.create({
      nome: 'Escola Seed',
      endereco: 'Rua Seed, 1',
    });
    await httpClassesRepository.create(school.id, {
      nome: 'Turma A',
      turno: 'manha',
      anoLetivo: 2026,
    });

    const schools = await httpSchoolsRepository.list();

    expect(schools).toHaveLength(1);
    expect(schools[0].turmas).toHaveLength(1);
  });

  it('cria, edita e remove uma escola via /schools', async () => {
    const created = await httpSchoolsRepository.create({
      nome: 'Escola de Teste',
      endereco: 'Rua dos Testes, 123',
    });
    expect(created.id).toBeTruthy();
    expect(created.nome).toBe('Escola de Teste');

    const updated = await httpSchoolsRepository.update(created.id, {
      nome: 'Escola de Teste Atualizada',
      endereco: created.endereco,
    });
    expect(updated.nome).toBe('Escola de Teste Atualizada');

    await httpSchoolsRepository.remove(created.id);
    await expect(httpSchoolsRepository.get(created.id)).rejects.toBeInstanceOf(ApiError);
  });

  it('rejeita escola sem endereço com erro 422', async () => {
    await expect(
      httpSchoolsRepository.create({ nome: 'Sem Endereço', endereco: '' }),
    ).rejects.toMatchObject({ status: 422 });
  });

  it('cria turma vinculada a uma escola e filtra por schoolId em /classes', async () => {
    const school = await httpSchoolsRepository.create({
      nome: 'Escola com Turmas',
      endereco: 'Av. Principal, 456',
    });

    const schoolClass = await httpClassesRepository.create(school.id, {
      nome: 'Turma A',
      turno: 'manha',
      anoLetivo: 2026,
    });
    expect(schoolClass.schoolId).toBe(school.id);

    const classes = await httpClassesRepository.listBySchool(school.id);
    expect(classes).toHaveLength(1);
    expect(classes[0].nome).toBe('Turma A');
  });

  it('exclui a escola em cascata com suas turmas', async () => {
    const school = await httpSchoolsRepository.create({
      nome: 'Escola Cascata',
      endereco: 'Rua Cascata, 1',
    });
    const schoolClass = await httpClassesRepository.create(school.id, {
      nome: 'Turma Única',
      turno: 'tarde',
      anoLetivo: 2026,
    });

    await httpSchoolsRepository.remove(school.id);

    await expect(httpClassesRepository.update(schoolClass.id, {
      nome: 'Turma Única',
      turno: 'tarde',
      anoLetivo: 2026,
    })).rejects.toBeInstanceOf(ApiError);
  });

  it('popula o servidor de desenvolvimento com escolas e turmas via seed()', async () => {
    const server = startMockServer({ environment: 'test' });
    seed(server);

    const schools = await httpSchoolsRepository.list();

    expect(schools.length).toBeGreaterThan(0);
    schools.forEach((school) => {
      expect(school.turmas && school.turmas.length).toBeGreaterThan(0);
    });
  });
});
