const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ACCESS_TOKEN_KEY = "memoir_access_token";
const REFRESH_TOKEN_KEY = "memoir_refresh_token";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  is_oauth_user: boolean;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeTokens(tokens: AuthTokens): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail[0]?.msg) {
      return body.detail[0].msg;
    }
  } catch {
    // fall through
  }
  return `Request failed (${res.status})`;
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const tokens = (await res.json()) as AuthTokens;
  storeTokens(tokens);
  return tokens;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const tokens = (await res.json()) as AuthTokens;
  storeTokens(tokens);
  return tokens;
}

export async function fetchProfile(): Promise<UserProfile> {
  const token = getAccessToken();
  if (!token) throw new Error("Not signed in");
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Session expired");
  return (await res.json()) as UserProfile;
}

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(async (res) => {
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  });
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password: newPassword }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const tokens = (await res.json()) as AuthTokens;
  storeTokens(tokens);
  return tokens;
}

/** Sends the browser to the backend's Google consent entry point. */
export function beginGoogleSignIn(): void {
  window.location.href = `${API_URL}/auth/google/login`;
}

/**
 * Reads OAuth tokens from the URL fragment the backend redirects to
 * (#access_token=...&refresh_token=...), stores them, and cleans the URL.
 */
export function consumeOAuthFragment(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;
  const tokens = { access_token: accessToken, refresh_token: refreshToken };
  storeTokens(tokens);
  window.history.replaceState(null, "", window.location.pathname);
  return tokens;
}
