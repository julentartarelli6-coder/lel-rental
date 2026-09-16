import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { requestPasswordReset, signIn } from "@/lib/site/auth";
import { isSupabaseConfigured } from "@/lib/site/supabase";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { status } = useAdminSession();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "authed") void navigate({ to: "/admin", replace: true });
  }, [status, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    try {
      if (mode === "reset") {
        const redirectTo = `${window.location.origin}/admin/senha`;
        await requestPasswordReset(email, redirectTo);
        toast.success("Se este e-mail estiver cadastrado, o link de redefinição chegará em instantes.");
        setMode("login");
      } else {
        await signIn(email, password);
        toast.success("Bem-vindo de volta!");
        void navigate({ to: "/admin", replace: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível entrar.";
      toast.error(
        /invalid login credentials/i.test(message) ? "E-mail ou senha incorretos." : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="bg-brand inline-flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]">
            <Lock size={24} />
          </span>
          <h1 className="font-display mt-5 text-3xl font-extrabold italic uppercase tracking-tight">
            Painel do site
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre para editar textos, fotos e contatos do seu site.
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <p className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            O painel ainda não está conectado ao banco de dados. Configure as variáveis
            VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel.
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">
              E-mail
            </Label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@empresa.com"
                className="pl-9"
              />
            </div>
          </div>

          {mode === "login" ? (
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wide">
                Senha
              </Label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enviaremos um link para você cadastrar uma nova senha.
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="animate-spin" size={16} /> : null}
            {mode === "login" ? "Entrar" : "Enviar link"}
            {!busy ? <ArrowRight size={16} /> : null}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "reset" : "login")}
            className="text-center text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
          </button>
        </form>
      </div>
    </div>
  );
}
