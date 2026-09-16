import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  LogOut,
  RotateCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminProvider } from "@/components/admin/context";
import { FieldRenderer } from "@/components/admin/fields";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { ADMIN_SCHEMA } from "@/lib/site/admin-schema";
import { fetchMemberships, fetchSiteRecord, saveSiteContent, uploadSiteImage } from "@/lib/site/api";
import type { SiteContent } from "@/lib/site/content";
import { getPath, setPath } from "@/lib/site/merge";
import { getAccessToken, signOut } from "@/lib/site/auth";
import { isSupabaseConfigured } from "@/lib/site/supabase";

export const DRAFT_KEY = "lel.admin.draft";

export const Route = createFileRoute("/admin/")({
  loader: () => fetchSiteRecord(),
  component: AdminEditor,
});

function readDraft(): SiteContent | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SiteContent) : null;
  } catch {
    return null;
  }
}

function writeDraft(content: SiteContent | null) {
  try {
    if (content) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage indisponível: a prévia usa o conteúdo publicado
  }
}

function AdminEditor() {
  const site = Route.useLoaderData();
  const navigate = useNavigate();
  const { status, session } = useAdminSession();

  const [published, setPublished] = useState<SiteContent>(site.content);
  const [draft, setDraft] = useState<SiteContent>(site.content);
  const [activeSection, setActiveSection] = useState(ADMIN_SCHEMA[0].id);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState<boolean | null>(null);
  const [recovered, setRecovered] = useState(false);
  const restored = useRef(false);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(published),
    [draft, published],
  );

  // Sem sessão -> login.
  useEffect(() => {
    if (status === "anon") void navigate({ to: "/admin/login", replace: true });
  }, [status, navigate]);

  // Confere no banco se esta conta é membro deste site (o RLS é quem manda,
  // isto só antecipa a mensagem de erro).
  useEffect(() => {
    if (status !== "authed" || !site.id) return;
    let alive = true;

    void (async () => {
      const token = await getAccessToken();
      if (!token) return;
      try {
        const memberships = await fetchMemberships(token);
        if (alive) setCanEdit(memberships.some((m) => m.site_id === site.id));
      } catch {
        if (alive) setCanEdit(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [status, site.id]);

  // Recupera rascunho não salvo (ex.: voltou da prévia ou recarregou a aba).
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const stored = readDraft();
    if (stored && JSON.stringify(stored) !== JSON.stringify(site.content)) {
      setDraft(stored);
      setRecovered(true);
    }
  }, [site.content]);

  useEffect(() => {
    if (dirty) writeDraft(draft);
  }, [dirty, draft]);

  // Evita fechar a aba com alteração pendente.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const uploadImage = useCallback(
    async (file: File, folder: string) => {
      const token = await getAccessToken();
      if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
      return uploadSiteImage(site.id, folder, file, token);
    },
    [site.id],
  );

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
      await saveSiteContent(site.id, draft, token);
      setPublished(draft);
      writeDraft(null);
      setRecovered(false);
      toast.success("Alterações publicadas! O site já está atualizado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    if (!window.confirm("Descartar todas as alterações não salvas?")) return;
    setDraft(published);
    writeDraft(null);
    setRecovered(false);
  }

  function handlePreview() {
    writeDraft(draft);
    void navigate({ to: "/admin/preview" });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }
  if (status === "anon") return null;

  const section = ADMIN_SCHEMA.find((item) => item.id === activeSection) ?? ADMIN_SCHEMA[0];

  return (
    <AdminProvider value={{ siteId: site.id, uploadImage }}>
      <div className="min-h-screen">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
            <div className="mr-auto min-w-0">
              <p className="font-display truncate text-lg font-extrabold italic uppercase leading-none tracking-tight">
                Painel do site
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {session?.user.email}
                {dirty ? " · alterações não salvas" : " · tudo publicado"}
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} /> Ver site
              </a>
            </Button>

            {dirty ? (
              <Button variant="ghost" size="sm" onClick={handleDiscard}>
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Descartar</span>
              </Button>
            ) : null}

            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye size={16} /> Prévia
            </Button>

            <Button size="sm" onClick={handleSave} disabled={saving || !dirty || canEdit === false}>
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : dirty ? (
                <Save size={16} />
              ) : (
                <Check size={16} />
              )}
              {saving ? "Salvando…" : dirty ? "Salvar" : "Salvo"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Sair"
              onClick={async () => {
                if (dirty && !window.confirm("Você tem alterações não salvas. Sair mesmo assim?")) {
                  return;
                }
                writeDraft(null);
                await signOut();
                void navigate({ to: "/admin/login", replace: true });
              }}
            >
              <LogOut size={16} />
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Avisos */}
          {!isSupabaseConfigured ? (
            <Banner tone="danger">
              Banco de dados não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
            </Banner>
          ) : null}
          {!site.fromDatabase && isSupabaseConfigured ? (
            <Banner tone="danger">
              Não foi possível carregar o conteúdo salvo. Você está vendo o conteúdo padrão —
              salvar agora pode sobrescrever o que está no ar. Recarregue a página antes de editar.
            </Banner>
          ) : null}
          {canEdit === false ? (
            <Banner tone="danger">
              Sua conta não tem permissão para editar este site. Fale com o responsável pelo
              painel.
            </Banner>
          ) : null}
          {recovered ? (
            <Banner tone="info">
              Recuperamos um rascunho que você não chegou a salvar. Clique em “Salvar” para
              publicar ou em “Descartar” para voltar ao que está no ar.
            </Banner>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
            {/* Navegação das seções */}
            <nav className="lg:sticky lg:top-24 lg:self-start">
              <ul className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
                {ADMIN_SCHEMA.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === section.id;
                  return (
                    <li key={item.id} className="shrink-0 lg:shrink">
                      <button
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                          active
                            ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                            : "bg-card text-muted-foreground hover:bg-card hover:text-foreground lg:bg-transparent",
                        )}
                      >
                        <Icon size={17} className="shrink-0" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Campos da seção ativa */}
            <main className="min-w-0">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-7">
                <div className="mb-6 border-b border-border pb-5">
                  <h2 className="font-display text-2xl font-extrabold italic uppercase tracking-tight">
                    {section.label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                </div>

                <div className="grid gap-7">
                  {section.fields.map((field) => (
                    <FieldRenderer
                      key={field.path}
                      field={field}
                      value={getPath(draft, field.path)}
                      onChange={(next) => setDraft((current) => setPath(current, field.path, next))}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                As alterações só aparecem no site depois de clicar em{" "}
                <strong className="text-foreground">Salvar</strong>.
              </p>
            </main>
          </div>
        </div>

        {/* Barra fixa de salvar no mobile */}
        {dirty ? (
          <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handlePreview}>
                <Eye size={16} /> Prévia
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || canEdit === false}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Salvar
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </AdminProvider>
  );
}

function Banner({ tone, children }: { tone: "danger" | "info"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "mb-5 flex items-start gap-2.5 rounded-xl border p-4 text-sm",
        tone === "danger"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-primary/30 bg-accent text-accent-foreground",
      )}
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
