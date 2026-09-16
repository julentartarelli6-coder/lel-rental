/**
 * Cliente Supabase mínimo, feito só com `fetch`.
 *
 * Motivo de não usar @supabase/supabase-js: o projeto usa bun.lock e o build
 * roda em runtime edge (Nitro). Uma camada de fetch evita dependência nova,
 * funciona igual no SSR e no navegador, e mantém o bundle pequeno.
 */

const URL_ENV = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const KEY_ENV = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
const SLUG_ENV = import.meta.env["VITE_SITE_SLUG"] as string | undefined;

export const SUPABASE_URL = (URL_ENV ?? "").replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = KEY_ENV ?? "";
export const SITE_SLUG = SLUG_ENV ?? "lel-rental";
export const MEDIA_BUCKET = "site-media";

/** Sem env configurada o site roda 100% nos defaults, sem quebrar. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export class SupabaseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "SupabaseError";
    this.status = status;
  }
}

function baseHeaders(accessToken?: string): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
  };
}

async function readError(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) return `HTTP ${response.status}`;
  try {
    const payload = JSON.parse(text) as {
      message?: string;
      error_description?: string;
      msg?: string;
      error?: string;
    };
    return (
      payload.message ??
      payload.error_description ??
      payload.msg ??
      payload.error ??
      text
    );
  } catch {
    return text;
  }
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new SupabaseError(
      "Supabase não configurado (defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).",
      0,
    );
  }

  const { accessToken, headers, ...rest } = init;
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...rest,
    headers: { ...baseHeaders(accessToken), ...(headers as Record<string, string> | undefined) },
  });

  if (!response.ok) {
    throw new SupabaseError(await readError(response), response.status);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** REST (PostgREST) com corpo JSON. */
export function restRequest<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  return supabaseRequest<T>(`/rest/v1${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers as object) },
  });
}

/** URL pública de um arquivo do bucket de mídia. */
export function publicMediaUrl(objectPath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${objectPath}`;
}
