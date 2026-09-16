import { Fragment, type ReactNode } from "react";

/**
 * Marcações simples que o cliente pode usar em qualquer título ou texto:
 *
 *   **palavra**   -> destaque em degradê azul da marca
 *   {{palavras}}  -> não quebra linha no meio (ex.: {{micro-ônibus}})
 *
 * Nada além disso é interpretado: o texto é sempre renderizado como texto,
 * nunca como HTML.
 */
const TOKEN = /(\*\*[^*]+\*\*|\{\{[^}]+\}\})/g;

export function RichText({ text }: { text: string }): ReactNode {
  if (!text) return null;

  return text.split(TOKEN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={index} className="text-gradient-brand">
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("{{") && part.endsWith("}}")) {
      return (
        <span key={index} className="whitespace-nowrap">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

/** Mesmo texto, sem marcação — para <title>, meta tags e atributos alt. */
export function stripMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
}
