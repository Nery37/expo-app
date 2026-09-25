import type { Server } from 'miragejs';

/** Popula o servidor simulado com escolas e turmas de exemplo. */
export function seed(server: Server) {
  const schools = server.createList('school', 6);

  schools.forEach((school) => {
    const quantidadeTurmas = 2 + Math.floor(Math.random() * 4); // 2 a 5 turmas
    server.createList('class', quantidadeTurmas, { school } as any);
  });
}
