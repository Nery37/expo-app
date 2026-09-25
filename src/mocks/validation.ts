import { TURNOS } from '../features/classes/types';

/** Validações "de servidor" do backend simulado — nunca confiar só no client. */
export function validateSchoolAttrs(attrs: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (typeof attrs.nome !== 'string' || !attrs.nome.trim()) {
    errors.push('O nome da escola é obrigatório.');
  }
  if (typeof attrs.endereco !== 'string' || !attrs.endereco.trim()) {
    errors.push('O endereço da escola é obrigatório.');
  }
  return errors;
}

export function validateClassAttrs(attrs: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (typeof attrs.nome !== 'string' || !attrs.nome.trim()) {
    errors.push('O nome da turma é obrigatório.');
  }
  if (typeof attrs.turno !== 'string' || !TURNOS.includes(attrs.turno as (typeof TURNOS)[number])) {
    errors.push('Selecione um turno válido.');
  }
  const anoLetivo = Number(attrs.anoLetivo);
  if (!Number.isInteger(anoLetivo) || anoLetivo < 2000 || anoLetivo > 2100) {
    errors.push('Informe um ano letivo válido.');
  }
  if (!attrs.schoolId) {
    errors.push('A turma precisa estar vinculada a uma escola.');
  }
  return errors;
}
