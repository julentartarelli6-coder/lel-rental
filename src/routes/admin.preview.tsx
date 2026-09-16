import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { Landing } from "@/components/site/Landing";
import { fetchSiteRecord } from "@/lib/site/api";
import { mergeContent } from "@/lib/site/merge";
import type { SiteContent } from "@/lib/site/content";

const DRAFT_KEY = "lel.admin.draft";

export const Route = createFileRoute("/admin/preview")({
  loader: () => fetchSiteRecord(),
  component: PreviewPage,
});

/**
 * Prévia das alterações ainda não publicadas: é a landing page de verdade,
 * alimentada pelo rascunho que o editor guardou na sessão do navegador.
 */
function PreviewPage() {
  const site = Route.useLoaderData();
  const navigate = useNavigate();
  const { status } = useAdminSession();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    if (status === "anon") void navigate({ to: "/admin/login", replace: true });
  }, [status, navigate]);

  useEffect(() => {
    let stored: unknown = null;
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }
    setIsDraft(stored !== null);
    setContent(stored ? mergeContent(stored) : site.content);
  }, [site.content]);

  if (status === "loading" || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }
  if (status === "anon") return null;

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-[60] flex flex-wrap items-center gap-3 border-b border-primary/30 bg-accent px-4 py-2.5 text-accent-foreground sm:px-6">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
          <Eye size={16} />
          {isDraft ? "Prévia — alterações ainda não publicadas" : "Prévia do site publicado"}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto bg-background"
          onClick={() => navigate({ to: "/admin" })}
        >
          <ArrowLeft size={16} /> Voltar ao editor
        </Button>
      </div>

      <Landing content={content} withToaster={false} />
    </div>
  );
}
