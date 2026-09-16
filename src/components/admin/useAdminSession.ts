import { useEffect, useState } from "react";

import { ensureSession, subscribeToSession, type Session } from "@/lib/site/auth";

export type AdminSessionState = {
  status: "loading" | "authed" | "anon";
  session: Session | null;
};

/**
 * Estado de login do painel. Resolve sempre no cliente (a sessão vive no
 * localStorage), então no SSR o estado inicial é "loading".
 */
export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({ status: "loading", session: null });

  useEffect(() => {
    let alive = true;

    const unsubscribe = subscribeToSession((session) => {
      if (alive) setState({ status: session ? "authed" : "anon", session });
    });

    void ensureSession().then((session) => {
      if (alive) setState({ status: session ? "authed" : "anon", session });
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return state;
}
