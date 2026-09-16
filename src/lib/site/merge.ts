import { DEFAULT_CONTENT, type SiteContent } from "./content";

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Mescla o que veio do banco sobre os defaults do código.
 *
 * Regras:
 *   - objeto: mescla chave a chave (campo novo no código aparece mesmo em
 *     conteúdo antigo salvo no banco);
 *   - array: o banco vence por inteiro (o cliente pode remover itens);
 *   - valor primitivo de tipo diferente do default: ignorado (o default vence),
 *     para um JSON corrompido nunca derrubar o site.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const out: Plain = { ...(base as Plain) };
    for (const key of Object.keys(base as Plain)) {
      out[key] = deepMerge((base as Plain)[key], override[key]);
    }
    return out as T;
  }

  return (typeof override === typeof base ? override : base) as T;
}

/** Conteúdo pronto para render, com todos os campos garantidos. */
export function mergeContent(stored: unknown): SiteContent {
  return deepMerge(DEFAULT_CONTENT, stored);
}

/** Lê um caminho tipo "hero.title" ou "equipment.items.0.title". */
export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Plain)[key];
  }, source);
}

/** Devolve uma cópia de `source` com `path` trocado por `value` (imutável). */
export function setPath<T>(source: T, path: string, value: unknown): T {
  const [key, ...rest] = path.split(".");
  if (key === undefined) return source;

  if (Array.isArray(source)) {
    const index = Number(key);
    const next = [...source];
    next[index] = rest.length ? setPath(next[index], rest.join("."), value) : value;
    return next as T;
  }

  const current = (source ?? {}) as Plain;
  return {
    ...current,
    [key]: rest.length ? setPath(current[key], rest.join("."), value) : value,
  } as T;
}

/** Id curto e estável para novos itens de lista. */
export function newId(prefix = "item"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
