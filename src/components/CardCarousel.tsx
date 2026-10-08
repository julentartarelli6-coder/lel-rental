import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function CardCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const total = images.length;
  const go = (d: number) => setI((p) => (p + d + total) % total);

  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden bg-secondary">
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={`Ampliar foto ${i + 1} de ${alt}`}
        className="absolute inset-0 cursor-zoom-in"
      >
        {images.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — foto ${idx + 1}`}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
              idx === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-graphite/70 p-1.5 text-graphite-foreground opacity-100 shadow-sm transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
          <ZoomIn size={16} />
        </span>
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={`Foto anterior de ${alt}`}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-graphite/70 p-1.5 text-graphite-foreground opacity-100 shadow-sm transition-opacity duration-200 hover:bg-graphite/80 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={`Próxima foto de ${alt}`}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-graphite/70 p-1.5 text-graphite-foreground opacity-100 shadow-sm transition-opacity duration-200 hover:bg-graphite/80 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Ver foto ${idx + 1} de ${alt}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === i ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/50",
                )}
              />
            ))}
          </div>
        </>
      )}

      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent
          className="max-w-[calc(100vw-2rem)] gap-0 border-none bg-transparent p-0 shadow-none sm:max-w-5xl [&>button:last-child]:rounded-full [&>button:last-child]:bg-background [&>button:last-child]:p-1.5 [&>button:last-child]:opacity-100"
          onKeyDown={(event) => {
            if (total < 2) return;
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
          }}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">
            Foto {i + 1} de {total}
          </DialogDescription>
          <div className="relative flex items-center justify-center">
            <img
              src={images[i]}
              alt={`${alt} — foto ${i + 1}`}
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-graphite/70 p-2 text-graphite-foreground shadow-sm hover:bg-graphite/80"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-graphite/70 p-2 text-graphite-foreground shadow-sm hover:bg-graphite/80"
                >
                  <ChevronRight size={22} />
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-graphite/70 px-3 py-1 text-xs font-semibold text-graphite-foreground">
                  {i + 1} / {total}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
