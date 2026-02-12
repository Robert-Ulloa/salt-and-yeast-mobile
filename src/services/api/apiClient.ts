import { ApiError } from './types';

const API_TIMEOUT_MS = 8000;

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const normalizedBaseUrl = rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl.replace(/\/$/, '') : null;

export function getApiBaseUrl(): string | null {
  return normalizedBaseUrl;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError('Missing EXPO_PUBLIC_API_URL');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? API_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const rawText = await response.text();
    const payload = rawText ? tryParseJson(rawText) : null;

    if (!response.ok) {
      const message =
        (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
          ? payload.message
          : null) ?? `Request failed with status ${response.status}`;
      throw new ApiError(message, { status: response.status });
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out');
    }

    throw new ApiError('Network request failed');
  } finally {
    clearTimeout(timeoutId);
  }
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body });
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('Invalid JSON response');
  }
}
