/**
 * api.js
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
async function getAuthHeader() {
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

/**
 * Sends an HTTP request to the backend and returns the parsed response data.
 *
 * Automatically:
 * - Attaches Content-Type and Authorization headers.
 * - Serialises the request body to JSON (skipped for GET requests).
 * - Throws a descriptive Error if the server returns a non-2xx status,
 *   using the message field from the JSON body when available.
 *
 * @param {string} method - HTTP verb (GET, POST, PUT, PATCH, DELETE)
 * @param {string} path   - API path relative to BASE_URL (e.g. '/auth/login')
 * @param {object} [body] - Request payload (only sent for non-GET methods)
 * @returns {{ data: object, status: number }}
 */
async function request(method, path, body) {
  const authHeader = await getAuthHeader();

  const headers = {
    'Content-Type': 'application/json',
    ...authHeader,
  };

  const init = { method, headers };

  // Only attach a body for mutating requests — GET has no body.
  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, init);

  // Attempt to parse JSON; fall back to an empty object for empty responses.
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Throw a meaningful error so callers can display it in the UI.
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { data, status: response.status };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convenience wrappers around `request()`.
 * Import `api` when you need a one-off call not covered by the named exports.
 */
const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};

export default api;

// ─── Auth APIs ────────────────────────────────────────────────────────────────

/**
 * Logs in using email and password credentials.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<object>} Response data including token and user info
 */
export async function loginWithEmail(payload) {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

/**
 * Fetches the list of institutes and their roles that the logged-in user
 * belongs to. Normalises the institute_type field since the API can return
 * it under either 'institute_type' or 'type'.
 * @returns {Promise<object[]>} Array of institute objects with roles
 */
export async function fetchMyInstitutes() {
  const res = await api.get('/auth/my-institutes-roles');
  return (res.data?.data || []).map(item => ({
    ...item,
    institute_type: item.institute_type || item.type || 'N/A',
  }));
}

/**
 * Selects an institute + role context and returns a scoped access token.
 * This token grants access to the specific institute's dashboard and data.
 * @param {string|number} tenantId     - Tenant identifier
 * @param {string|number} instituteId  - Institute identifier
 * @param {string|number} roleId       - Role identifier
 * @returns {Promise<object>} Response data including scoped access_token
 */
export async function selectContext(tenantId, instituteId, roleId) {
  const res = await api.post('/auth/select-context', {
    tenant_id: tenantId,
    institute_id: instituteId,
    role_id: roleId,
  });
  return res.data;
}