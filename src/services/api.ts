/**
 * api.ts
 *
 * Centralised HTTP layer for all backend communication.
 *
 * Provides:
 * - A private `request()` function that attaches auth headers, sends the
 *   fetch call, parses the JSON response, and throws a readable error on
 *   non-2xx status codes.
 * - A public `api` object with convenience methods (get, post, put, patch,
 *   delete) so call sites don't need to pass the HTTP method manually.
 * - Named exports for each API operation (loginWithEmail, fetchMyInstitutes,
 *   selectContext) so screens import only the functions they need.
 */

import { getString } from '../utils/storage';

// Base URL for all API requests — update this when switching environments.
const BASE_URL = 'https://schoolcoreosb.onrender.com';

// ─── Auth Header ──────────────────────────────────────────────────────────────

/**
 * Builds the Authorization header from the tokens stored in MMKV.
 * Prefers a fully resolved access_token; falls back to pre_context_token
 * which is issued before the user selects their institute and role.
 * Returns an empty object if no token is found so calls can still proceed.
 */
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const accessToken     = await getString('access_token');
    const preContextToken = await getString('pre_context_token');

    const token = accessToken || preContextToken;
    if (!token) return {};

    return { Authorization: `Bearer ${token}` };
  } catch (e) {
    console.warn('getAuthHeader error:', e);
    return {};
  }
}

// ─── Core Request ─────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

/**
 * Sends an HTTP request to the backend and returns the parsed response data.
 *
 * Automatically:
 * - Attaches Content-Type and Authorization headers.
 * - Serialises the request body to JSON (skipped for GET requests).
 * - Throws a descriptive Error if the server returns a non-2xx status,
 *   using the message field from the JSON body when available.
 */
async function request<T = unknown>(
  method: HttpMethod,
  path: string,
  body?: object,
): Promise<ApiResponse<T>> {
  const authHeader = await getAuthHeader();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader,
  };

  const init: RequestInit = { method, headers };

  // Only attach a body for mutating requests — GET has no body.
  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, init);

  // Attempt to parse JSON; fall back to an empty object for empty responses.
  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Throw a meaningful error so callers can display it in the UI.
  if (!response.ok) {
    const message =
      (data?.message as string) ||
      (data?.error as string)   ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { data: data as T, status: response.status };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convenience wrappers around `request()`.
 * Import `api` when you need a one-off call not covered by the named exports.
 */
const api = {
  get:    <T = unknown>(path: string)               => request<T>('GET',    path),
  post:   <T = unknown>(path: string, body: object)  => request<T>('POST',   path, body),
  put:    <T = unknown>(path: string, body: object)  => request<T>('PUT',    path, body),
  patch:  <T = unknown>(path: string, body: object)  => request<T>('PATCH',  path, body),
  delete: <T = unknown>(path: string)               => request<T>('DELETE', path),
};

export default api;

// ─── API Response Types ───────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  pre_context_token?: string;
  token?: string;
  access_token?: string;
  user?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface InstituteRole {
  role_id: number | string;
  role_name: string;
  [key: string]: unknown;
}

export interface Institute {
  institute_id: number | string;
  institute_name: string;
  institute_location?: string;
  institute_type?: string;
  type?: string;
  image_url?: string;
  tenant_id: number | string;
  roles: InstituteRole[];
  [key: string]: unknown;
}

interface MyInstitutesResponse {
  data?: Institute[];
  [key: string]: unknown;
}

export interface SelectContextResponse {
  access_token: string;
  [key: string]: unknown;
}

// ─── Auth APIs ────────────────────────────────────────────────────────────────

/**
 * Logs in using email and password credentials.
 */
export async function loginWithEmail(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', payload);
  return res.data;
}

/**
 * Fetches the list of institutes and their roles that the logged-in user
 * belongs to. Normalises the institute_type field since the API can return
 * it under either 'institute_type' or 'type'.
 */
export async function fetchMyInstitutes(): Promise<Institute[]> {
  const res = await api.get<MyInstitutesResponse>('/auth/my-institutes-roles');
  return (res.data?.data || []).map((item: Institute) => ({
    ...item,
    institute_type: item.institute_type || item.type || 'N/A',
  }));
}

/**
 * Selects an institute + role context and returns a scoped access token.
 * This token grants access to the specific institute's dashboard and data.
 */
export async function selectContext(
  tenantId: number | string,
  instituteId: number | string,
  roleId: number | string,
): Promise<SelectContextResponse> {
  const res = await api.post<SelectContextResponse>('/auth/select-context', {
    tenant_id:    tenantId,
    institute_id: instituteId,
    role_id:      roleId,
  });
  return res.data;
}