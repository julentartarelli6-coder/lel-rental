/**
 * Sessão do painel administrativo (Supabase Auth via fetch).
 *
 * A sessão fica no localStorage do navegador. Isso é seguro aqui porque a
 * autorização de verdade acontece no banco (RLS): mesmo com um token válido,
 * o usuário só consegue gravar no site do qual é membro.
 */

import { supabaseRequest, SUPABASE_ANON_KEY } from "./supabase";

const STORAGE_KEY = "lel.admin.session";

export type AuthUser = { id: string; email: string };

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix (segundos)
  user: AuthUser;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email?: string };
};

type Listener = (session: Session | null) => void;

const listeners = new Set<Listener>();
let cached: Session | null | undefined;

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toSession(payload: TokenResponse): Session {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600),
    user: { id: payload.user.id, email: payload.user.email ?? "" },
  };
}

function persist(session: Session | null) {
  cached = session;
  if (isBrowser()) {
    try {
      if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // modo privado / storage bloqueado: a sessão vale só para esta aba
    }
  }
  listeners.forEach((listener) => listener(session));
}

export function readStoredSession(): Session | null {
  if (cached !== undefined) return cached;
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    cached = null;
  }
  return cached;
}

export function subscribeToSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function signIn(email: string, password: string): Promise<Session> {
  const payload = await supabaseRequest<TokenResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  const session = toSession(payload);
  persist(session);
  return session;
}

export async function signOut(): Promise<void> {
  const session = readStoredSession();
  persist(null);
  if (!session) return;
  try {
    await supabaseRequest("/auth/v1/logout", {
      method: "POST",
      accessToken: session.accessToken,
      headers: { "content-type": "application/json" },
    });
  } catch {
    // token já expirado no servidor: a sessão local já foi limpa, tudo certo
  }
}

async function refresh(session: Session): Promise<Session | null> {
  try {
    const payload = await supabaseRequest<TokenResponse>(
      "/auth/v1/token?grant_type=refresh_token",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      },
    );
    const next = toSession(payload);
    persist(next);
    return next;
  } catch {
    persist(null);
    return null;
  }
}

/** Token válido para chamadas autenticadas — renova sozinho perto de expirar. */
export async function getAccessToken(): Promise<string | null> {
  const session = readStoredSession();
  if (!session) return null;

  const stillValid = session.expiresAt - 60 > Math.floor(Date.now() / 1000);
  if (stillValid) return session.accessToken;

  const refreshed = await refresh(session);
  return refreshed?.accessToken ?? null;
}

/** Garante uma sessão utilizável (ou null) — usado no guard do /admin. */
export async function ensureSession(): Promise<Session | null> {
  const session = readStoredSession();
  if (!session) return null;
  if (session.expiresAt - 60 > Math.floor(Date.now() / 1000)) return session;
  return refresh(session);
}

/** Envia e-mail de redefinição de senha. */
export async function requestPasswordReset(email: string, redirectTo: string): Promise<void> {
  const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  await supabaseRequest(`/auth/v1/recover${query}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
}

/** Define uma nova senha usando um token de recuperação (link do e-mail). */
export async function updatePasswordWithToken(
  accessToken: string,
  password: string,
): Promise<void> {
  await supabaseRequest("/auth/v1/user", {
    method: "PUT",
    accessToken,
    headers: { "content-type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ password }),
  });
}
