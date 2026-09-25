import { z } from 'zod';

export const schoolFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe o nome da escola.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
  endereco: z
    .string()
    .trim()
    .min(1, 'Informe o endereço da escola.')
    .max(200, 'O endereço deve ter no máximo 200 caracteres.'),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;
