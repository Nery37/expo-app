import { Response } from 'miragejs';
import type { Server } from 'miragejs';

import { validateClassAttrs } from '../validation';

// As tipagens do MirageJS só conhecem os atributos de um model quando um
// Registry tipado é configurado (custo alto para uma camada 100% mock,
// substituível por uma API real); os `any` abaixo isolam essa limitação
// aqui dentro, sem vazar para o resto do app.
export function registerClassRoutes(server: Server) {
  server.get('/classes', (schema, request) => {
    const { schoolId } = request.queryParams;
    if (schoolId) {
      return schema.where('class', { schoolId: String(schoolId) } as any);
    }
    return schema.all('class');
  });

  server.get('/classes/:id', (schema, request) => {
    const schoolClass = schema.find('class', request.params.id);
    if (!schoolClass) {
      return new Response(404, {}, { error: 'Turma não encontrada.' });
    }
    return schoolClass;
  });

  server.post('/classes', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
    const errors = validateClassAttrs(attrs);
    if (errors.length > 0) {
      return new Response(422, {}, { error: errors[0], errors });
    }
    const school = schema.find('school', attrs.schoolId);
    if (!school) {
      return new Response(422, {}, { error: 'Escola informada não existe.' });
    }
    const now = new Date().toISOString();
    return schema.create('class', {
      nome: attrs.nome.trim(),
      turno: attrs.turno,
      anoLetivo: Number(attrs.anoLetivo),
      schoolId: attrs.schoolId,
      createdAt: now,
      updatedAt: now,
    } as any);
  });

  server.put('/classes/:id', (schema, request) => {
    const schoolClass = schema.find('class', request.params.id);
    if (!schoolClass) {
      return new Response(404, {}, { error: 'Turma não encontrada.' });
    }
    const attrs = JSON.parse(request.requestBody);
    const errors = validateClassAttrs({ ...attrs, schoolId: (schoolClass as any).schoolId });
    if (errors.length > 0) {
      return new Response(422, {}, { error: errors[0], errors });
    }
    schoolClass.update({
      nome: attrs.nome.trim(),
      turno: attrs.turno,
      anoLetivo: Number(attrs.anoLetivo),
      updatedAt: new Date().toISOString(),
    } as any);
    return schoolClass;
  });

  server.del('/classes/:id', (schema, request) => {
    const schoolClass = schema.find('class', request.params.id);
    if (!schoolClass) {
      return new Response(404, {}, { error: 'Turma não encontrada.' });
    }
    schoolClass.destroy();
    return new Response(204);
  });
}
