import { API_CONFIG } from "../api/api.config";

export type FetchResult<T = any> = {
  data?: T;
  error?: string;
};

export const fetchService = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: any = null,
  token: string | null = null,
  queryParams?: Record<string, string>
): Promise<FetchResult<T>> => {
  try {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += method === 'GET' ? `?${queryString}` : '';
    }

    const headers: Record<string, string> = {};
    if (!(body instanceof FormData) && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method === 'GET' ? null : body instanceof FormData ? body : JSON.stringify(body),
    });

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      return { error: data?.message || 'Something went wrong.' };
    }

    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Something went wrong.' };
  }
};
