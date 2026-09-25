/**
 * Adapter: normaliza a API nativa `fetch` (respostas, erros, JSON) para uma
 * interface única que o resto do app consome, sem conhecer detalhes de
 * transporte HTTP. Trocar o backend simulado (MirageJS) por uma API real
 * não deve exigir mudanças fora desta camada.
 */
import { API_BASE_URL } from './config';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: string[];

  constructor(message: string, status: number, fieldErrors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => undefined)
    : undefined;

  if (!response.ok) {
    const message =
      (payload && (payload.error as string)) ??
      'Não foi possível completar a requisição. Tente novamente.';
    throw new ApiError(message, response.status, payload?.errors);
  }

  return payload as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' }),
};
