const TOKEN_KEY = "alfood.accessToken";

/** Reads the stored admin JWT, or null when the user is not logged in. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Persists the admin JWT returned by the login endpoint. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Removes the stored admin JWT (logout / expired session). */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Whether an admin JWT is currently stored. */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
