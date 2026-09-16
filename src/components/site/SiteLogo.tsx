import type { SiteContent } from "@/lib/site/content";

export function SiteLogo({
  brand,
  inverted = false,
}: {
  brand: SiteContent["brand"];
  inverted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {brand.logoUrl ? (
        <img
          src={brand.logoUrl}
          alt={brand.logoAlt}
          className="h-10 w-auto shrink-0 object-contain"
          loading="eager"
        />
      ) : null}
      <span
        className={`font-display text-xl font-extrabold italic uppercase tracking-tight ${
          inverted ? "text-graphite-foreground" : "text-foreground"
        }`}
      >
        {brand.wordmarkLead} <span className="text-gradient-brand">{brand.wordmarkHighlight}</span>
      </span>
    </div>
  );
}
