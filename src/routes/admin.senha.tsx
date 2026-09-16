import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordWithToken } from "@/lib/site/auth";

export const Route = createFileRoute("/admin/senha")({
  component: NewPasswordPage,
});

/** Destino do link de recuperação enviado por e-mail (token vem no #hash). */
function NewPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setToken(hash.get("access_token"));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || busy) return;

    if (password.length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      toast.error("As senhas não conferem.");
      return;
    }

    setBusy(true);
    try {
      await updatePasswordWithToken(token, password);
      toast.success("Senha atualizada! Faça login com a nova senha.");
      window.location.hash = "";
      void navigate({ to: "/admin/login", replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "O link expirou. Peça um novo no login.",
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
            <KeyRound size={24} />
          </span>
          <h1 className="font-display mt-5 text-3xl font-extrabold italic uppercase tracking-tight">
            Nova senha
          </h1>
        </div>

        {token === null ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Abra esta página pelo link que enviamos no seu e-mail.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
          >
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wide">
                Nova senha
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="mínimo de 8 caracteres"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmation" className="text-xs font-bold uppercase tracking-wide">
                Repita a senha
              </Label>
              <Input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              Salvar nova senha
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
