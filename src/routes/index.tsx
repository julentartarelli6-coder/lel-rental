import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "@/components/site/Landing";
import { stripMarkers } from "@/components/site/RichText";
import { fetchSiteRecord } from "@/lib/site/api";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/site/content";

export const Route = createFileRoute("/")({
  // O conteúdo vem do Supabase no SSR: o HTML já sai pronto para o Google.
  loader: () => fetchSiteRecord(),

  head: ({ loaderData }) => {
    const content: SiteContent = loaderData?.content ?? DEFAULT_CONTENT;
    const { seo, contact, footer } = content;

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo.siteUrl },
        ...(content.hero.imageUrl
          ? [{ property: "og:image", content: content.hero.imageUrl }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],

      links: [{ rel: "canonical", href: seo.siteUrl }],

      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: footer.legalName,
            alternateName: `${content.brand.wordmarkLead} ${content.brand.wordmarkHighlight}`,
            url: seo.siteUrl,
            telephone: contact.phoneDisplay,
            email: contact.email,
            description: stripMarkers(seo.description),
            ...(contact.hours ? { openingHours: contact.hours } : {}),
            address: contact.addresses.map((address) => ({
              "@type": "PostalAddress",
              streetAddress: address.text,
              addressCountry: "BR",
            })),
          }),
        },
      ],
    };
  },

  component: Index,
});

function Index() {
  const site = Route.useLoaderData();
  return <Landing content={site.content} />;
}
