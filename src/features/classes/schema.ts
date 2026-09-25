import { z } from 'zod';

import { TURNOS } from './types';

export const classFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe o nome da turma.')
    .max(60, 'O nome deve ter no máximo 60 caracteres.'),
  turno: z.enum(TURNOS, { message: 'Selecione o turno da turma.' }),
  anoLetivo: z
    .number({ message: 'Informe o ano letivo.' })
    .int('O ano letivo deve ser um número inteiro.')
    .min(2000, 'Informe um ano letivo válido.')
    .max(2100, 'Informe um ano letivo válido.'),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
