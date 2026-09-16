import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do site — L&L Rental" },
      // área privada: nunca deve aparecer em busca
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <Toaster position="top-center" />
      <Outlet />
    </div>
  );
}
