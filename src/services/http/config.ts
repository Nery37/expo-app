/**
 * React Native não tem "origem de página" como o navegador, então `fetch`
 * exige URLs absolutas. Este host é fictício: o MirageJS intercepta a
 * chamada antes de qualquer requisição de rede real ser feita. O mesmo
 * valor é usado como `urlPrefix` do servidor simulado (src/mocks/server.ts)
 * para que as duas pontas casem.
 */
export const API_BASE_URL = 'https://mock.gestao-escolas.local';
