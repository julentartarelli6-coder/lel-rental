import { mergeContent } from "./merge";
import { DEFAULT_CONTENT, type SiteContent } from "./content";
import {
  isSupabaseConfigured,
  MEDIA_BUCKET,
  publicMediaUrl,
  restRequest,
  SITE_SLUG,
  supabaseRequest,
  SupabaseError,
} from "./supabase";

export type SiteRecord = {
  id: string;
  name: string;
  content: SiteContent;
  /** false quando caiu no conteúdo padrão (sem banco configurado ou fora do ar). */
  fromDatabase: boolean;
};

type SiteRow = { id: string; name: string; content: unknown };

const FALLBACK: SiteRecord = {
  id: "",
  name: DEFAULT_CONTENT.footer.legalName,
  content: DEFAULT_CONTENT,
  fromDatabase: false,
};

/**
 * Conteúdo do site público. Roda no SSR e no navegador.
 * Nunca lança: se o banco falhar, o site continua no ar com o conteúdo padrão.
 */
export async function fetchSiteRecord(slug: string = SITE_SLUG): Promise<SiteRecord> {
  if (!isSupabaseConfigured) return FALLBACK;

  try {
    const rows = await restRequest<SiteRow[]>(
      `/sites?slug=eq.${encodeURIComponent(slug)}&select=id,name,content&limit=1`,
    );
    const row = rows?.[0];
    if (!row) return FALLBACK;

    return {
      id: row.id,
      name: row.name,
      content: mergeContent(row.content),
      fromDatabase: true,
    };
  } catch (error) {
    console.error("[site] falha ao carregar conteúdo do Supabase:", error);
    return FALLBACK;
  }
}

/** Grava o conteúdo. Só funciona para quem é membro do site (RLS). */
export async function saveSiteContent(
  siteId: string,
  content: SiteContent,
  accessToken: string,
): Promise<void> {
  const updated = await restRequest<SiteRow[]>(`/sites?id=eq.${encodeURIComponent(siteId)}`, {
    method: "PATCH",
    accessToken,
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ content }),
  });

  // RLS devolve 200 com lista vazia quando a linha não é visível para escrita.
  if (!updated || updated.length === 0) {
    throw new SupabaseError(
      "Sua conta não tem permissão para editar este site. Faça login novamente.",
      403,
    );
  }
}

export type Membership = { site_id: string; role: string };

/** Sites que o usuário logado pode editar. */
export function fetchMemberships(accessToken: string): Promise<Membership[]> {
  return restRequest<Membership[]>("/site_members?select=site_id,role", { accessToken });
}

function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > -1 ? name.slice(dot + 1).toLowerCase() : "jpg";
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .toLowerCase();
  return `${base || "imagem"}-${Date.now().toString(36)}.${ext.replace(/[^a-z0-9]/g, "") || "jpg"}`;
}

/**
 * Sobe uma imagem para <siteId>/<pasta>/ e devolve a URL pública.
 * O caminho começando pelo id do site é o que as policies do Storage checam.
 */
export async function uploadSiteImage(
  siteId: string,
  folder: string,
  file: File,
  accessToken: string,
): Promise<string> {
  const objectPath = `${siteId}/${folder}/${safeFileName(file.name)}`;

  await supabaseRequest(`/storage/v1/object/${MEDIA_BUCKET}/${objectPath}`, {
    method: "POST",
    accessToken,
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-upsert": "true",
      "cache-control": "31536000",
    },
    body: file,
  });

  return publicMediaUrl(objectPath);
}
