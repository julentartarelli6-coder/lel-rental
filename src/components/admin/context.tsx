import { createContext, useContext, type ReactNode } from "react";

export type AdminContextValue = {
  siteId: string;
  /** Sobe o arquivo e devolve a URL pública já pronta para usar no site. */
  uploadImage: (file: File, folder: string) => Promise<string>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  value,
  children,
}: {
  value: AdminContextValue;
  children: ReactNode;
}) {
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin precisa estar dentro de <AdminProvider>.");
  return context;
}
