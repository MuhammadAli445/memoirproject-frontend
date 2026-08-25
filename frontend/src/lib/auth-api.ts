const API_URL = "/api";

const ACCESS_TOKEN_KEY = "memoir_access_token";

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeAccessToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
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
  fullName: string,
  email: string,
  password: string,
): Promise<{ id: number; full_name: string; email: string }> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: fullName, email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function login(
  email: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  storeAccessToken(data.access_token);
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
  token: string,
  newPassword: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
