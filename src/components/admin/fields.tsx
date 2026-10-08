import { useRef, useState, type ChangeEvent } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ICON_OPTIONS, resolveIcon } from "@/lib/site/icons";
import { getPath, newId, setPath } from "@/lib/site/merge";
import type { FieldDef } from "@/lib/site/admin-schema";
import type { GalleryImage } from "@/lib/site/content";
import { useAdmin } from "./context";

/** Um campo lê/escreve em `value` pelo caminho relativo do FieldDef. */
type FieldProps = {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
};

function FieldShell({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string | undefined;
  htmlFor?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ imagem */

function ImageUploadButton({
  folder,
  multiple = false,
  label,
  onUploaded,
}: {
  folder: string;
  multiple?: boolean;
  label: string;
  onUploaded: (urls: string[], files: File[]) => void;
}) {
  const { uploadImage } = useAdmin();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`"${file.name}" tem mais de 10 MB. Reduza a imagem e tente de novo.`);
          continue;
        }
        urls.push(await uploadImage(file, folder));
      }
      if (urls.length > 0) {
        onUploaded(urls, files);
        toast.success(urls.length > 1 ? `${urls.length} imagens enviadas.` : "Imagem enviada.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleFiles}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        {busy ? "Enviando…" : label}
      </Button>
    </>
  );
}

function ImageField({ field, value, onChange }: FieldProps) {
  if (field.kind !== "image") return null;
  const url = typeof value === "string" ? value : "";

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <div className="flex flex-wrap items-start gap-4 rounded-xl border border-border bg-muted/30 p-3">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus size={22} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-[12rem] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <ImageUploadButton
              folder={field.folder}
              label={url ? "Trocar imagem" : "Enviar imagem"}
              onUploaded={(urls) => onChange(urls[0])}
            />
            {url ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <Trash2 size={16} /> Remover
              </Button>
            ) : null}
          </div>
          <Input
            value={url}
            onChange={(event) => onChange(event.target.value)}
            placeholder="ou cole o link da imagem"
            className="text-xs"
          />
        </div>
      </div>
    </FieldShell>
  );
}

function ImagesField({ field, value, onChange }: FieldProps) {
  if (field.kind !== "images") return null;
  const images: GalleryImage[] = Array.isArray(value) ? (value as GalleryImage[]) : [];
  const limitReached = field.max !== undefined && images.length >= field.max;

  function update(index: number, patch: Partial<GalleryImage>) {
    onChange(images.map((image, i) => (i === index ? { ...image, ...patch } : image)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    const current = images[index];
    const swapped = images[target];
    if (!current || !swapped) return;
    const next = [...images];
    next[index] = swapped;
    next[target] = current;
    onChange(next);
  }

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <div className="grid gap-3">
        {images.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <li key={image.id} className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex gap-3">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Input
                      value={image.alt ?? ""}
                      onChange={(event) => update(index, { alt: event.target.value })}
                      placeholder="Descrição da foto"
                      className="h-8 text-xs"
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        aria-label="Mover para trás"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ChevronUp size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        aria-label="Mover para frente"
                        disabled={index === images.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ChevronDown size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-destructive"
                        aria-label="Remover foto"
                        onClick={() => onChange(images.filter((_, i) => i !== index))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Nenhuma foto ainda.
          </p>
        )}

        {limitReached ? (
          <p className="text-xs text-muted-foreground">Limite de {field.max} fotos atingido.</p>
        ) : (
          <div>
            <ImageUploadButton
              folder={field.folder}
              multiple
              label="Enviar fotos"
              onUploaded={(urls, files) => {
                const added = urls.map((url, i) => ({
                  id: newId("img"),
                  url,
                  alt: files[i]?.name.replace(/\.[^.]+$/, "") ?? "",
                }));
                const room = field.max === undefined ? added.length : field.max - images.length;
                if (added.length > room) {
                  toast.warning(`Só cabem ${field.max} fotos. As ${added.length - room} últimas foram ignoradas.`);
                }
                onChange([...images, ...added.slice(0, room)]);
              }}
            />
          </div>
        )}
      </div>
    </FieldShell>
  );
}

/* -------------------------------------------------------------------- icone */

function IconField({ field, value, onChange }: FieldProps) {
  if (field.kind !== "icon") return null;
  const current = typeof value === "string" ? value : "";

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/30 p-3">
        {ICON_OPTIONS.map((option) => {
          const Icon = resolveIcon(option.value);
          const selected = option.value === current;
          return (
            <button
              key={option.value}
              type="button"
              title={option.label}
              aria-label={option.label}
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* --------------------------------------------------------------------- lista */

function ListField({ field, value, onChange }: FieldProps) {
  // Hooks antes de qualquer return: a ordem precisa ser estável entre renders.
  const [openId, setOpenId] = useState<string | null>(null);
  if (field.kind !== "list") return null;

  const items: Record<string, unknown>[] = Array.isArray(value)
    ? (value as Record<string, unknown>[])
    : [];
  const limitReached = field.max !== undefined && items.length >= field.max;

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    const current = items[index];
    const swapped = items[target];
    if (!current || !swapped) return;
    const next = [...items];
    next[index] = swapped;
    next[target] = current;
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-bold uppercase tracking-wide">{field.label}</Label>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </div>
      {field.hint ? <p className="-mt-2 text-xs text-muted-foreground">{field.hint}</p> : null}

      <ul className="grid gap-2">
        {items.map((item, index) => {
          const id = String(item["id"] ?? index);
          const title = String(getPath(item, field.titlePath) ?? "").trim();
          const open = openId === id;

          return (
            <li key={id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-1 p-2">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : id)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-semibold hover:bg-muted"
                  aria-expanded={open}
                >
                  <ChevronDown
                    size={16}
                    className={cn(
                      "shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-180",
                    )}
                  />
                  <span className="truncate">{title || `Item ${index + 1}`}</span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Mover para cima"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Mover para baixo"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  aria-label="Excluir item"
                  onClick={() => {
                    if (!window.confirm(`Excluir "${title || `Item ${index + 1}`}"?`)) return;
                    onChange(items.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              {open ? (
                <div className="grid gap-5 border-t border-border bg-muted/20 p-4">
                  {field.fields.map((child) => (
                    <FieldRenderer
                      key={child.path}
                      field={child}
                      value={getPath(item, child.path)}
                      onChange={(next) =>
                        onChange(
                          items.map((entry, i) =>
                            i === index ? setPath(entry, child.path, next) : entry,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {limitReached ? (
        <p className="text-xs text-muted-foreground">Limite de {field.max} itens atingido.</p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            const item = field.template();
            onChange([...items, item]);
            setOpenId(String(item["id"]));
          }}
        >
          <Plus size={16} /> {field.addLabel}
        </Button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- renderer */

export function FieldRenderer({ field, value, onChange }: FieldProps) {
  const id = `field-${field.path.replace(/\./g, "-")}`;

  switch (field.kind) {
    case "text":
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <Input
            id={id}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        </FieldShell>
      );

    case "textarea":
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <Textarea
            id={id}
            rows={field.rows ?? 3}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        </FieldShell>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4">
          <div className="grid gap-1">
            <Label htmlFor={id} className="text-sm font-bold">
              {field.label}
            </Label>
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
          </div>
          <Switch id={id} checked={value === true} onCheckedChange={onChange} />
        </div>
      );

    case "image":
      return <ImageField field={field} value={value} onChange={onChange} />;

    case "images":
      return <ImagesField field={field} value={value} onChange={onChange} />;

    case "icon":
      return <IconField field={field} value={value} onChange={onChange} />;

    case "list":
      return <ListField field={field} value={value} onChange={onChange} />;

    default:
      return null;
  }
}
