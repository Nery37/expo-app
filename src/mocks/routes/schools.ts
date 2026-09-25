import { Response } from 'miragejs';
import type { Server } from 'miragejs';

import { validateSchoolAttrs } from '../validation';

export function registerSchoolRoutes(server: Server) {
  server.get('/schools', (schema) => {
    return schema.all('school');
  });

  server.get('/schools/:id', (schema, request) => {
    const school = schema.find('school', request.params.id);
    if (!school) {
      return new Response(404, {}, { error: 'Escola não encontrada.' });
    }
    return school;
  });

  server.post('/schools', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
    const errors = validateSchoolAttrs(attrs);
    if (errors.length > 0) {
      return new Response(422, {}, { error: errors[0], errors });
    }
    const now = new Date().toISOString();
    // As tipagens do MirageJS só conhecem os atributos de um model quando um
    // Registry tipado é configurado (custo alto para uma camada 100% mock,
    // substituível por uma API real); os `any` abaixo isolam essa limitação
    // aqui dentro, sem vazar para o resto do app.
    return schema.create('school', {
      nome: attrs.nome.trim(),
      endereco: attrs.endereco.trim(),
      createdAt: now,
      updatedAt: now,
    } as any);
  });

  server.put('/schools/:id', (schema, request) => {
    const school = schema.find('school', request.params.id);
    if (!school) {
      return new Response(404, {}, { error: 'Escola não encontrada.' });
    }
    const attrs = JSON.parse(request.requestBody);
    const errors = validateSchoolAttrs(attrs);
    if (errors.length > 0) {
      return new Response(422, {}, { error: errors[0], errors });
    }
    school.update({
      nome: attrs.nome.trim(),
      endereco: attrs.endereco.trim(),
      updatedAt: new Date().toISOString(),
    } as any);
    return school;
  });

  server.del('/schools/:id', (schema, request) => {
    const school = schema.find('school', request.params.id);
    if (!school) {
      return new Response(404, {}, { error: 'Escola não encontrada.' });
    }
    // Exclusão em cascata: remove também as turmas vinculadas à escola.
    (school as any).classes.models.forEach((schoolClass: any) => schoolClass.destroy());
    school.destroy();
    return new Response(204);
  });
}
