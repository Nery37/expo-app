import { createServer, Server } from 'miragejs';

import { API_BASE_URL } from '../services/http/config';
import { models } from './models';
import { factories } from './factories';
import { serializers } from './serializers';
import { seed } from './seeds';
import { registerSchoolRoutes } from './routes/schools';
import { registerClassRoutes } from './routes/classes';

let mockServer: Server | undefined;

interface StartMockServerOptions {
  environment?: 'development' | 'test';
}

/**
 * Sobe o backend simulado (MirageJS) por cima do fetch/XHR nativo do RN.
 * Idempotente: chamadas repetidas (ex.: Fast Refresh) reaproveitam a
 * instância já criada em vez de duplicar o servidor.
 */
export function startMockServer({ environment = 'development' }: StartMockServerOptions = {}) {
  if (mockServer) {
    return mockServer;
  }

  mockServer = createServer({
    environment,
    models,
    factories,
    serializers,
    seeds: seed,
    routes() {
      // Sem "página atual" como no navegador, o RN sempre faz fetch com URL
      // absoluta (ver httpClient). O Mirage/Pretender agrupa rotas por host
      // internamente, então o urlPrefix precisa casar com a base usada lá.
      this.urlPrefix = API_BASE_URL;
      this.namespace = '';
      this.timing = environment === 'test' ? 0 : 350;

      registerSchoolRoutes(this);
      registerClassRoutes(this);

      // Qualquer requisição para outro host (Metro, dev tools do Expo, etc.)
      // segue normalmente para a rede real em vez de ser interceptada.
      // Precisa ser uma função com essa checagem: `this.passthrough()` sem
      // argumentos aplica o urlPrefix ao path e só libera requisições para o
      // MESMO host do mock; e uma função que sempre retorna `true` libera
      // literalmente tudo, inclusive as próprias rotas de /schools e
      // /classes registradas acima.
      this.passthrough((request) => !request.url.startsWith(API_BASE_URL));
    },
  });

  return mockServer;
}

export function shutdownMockServer() {
  mockServer?.shutdown();
  mockServer = undefined;
}
