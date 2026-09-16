import { useState, type FormEvent } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Reveal } from "@/components/Reveal";
import { CardCarousel } from "@/components/CardCarousel";
import { SiteLogo } from "@/components/site/SiteLogo";
import { RichText } from "@/components/site/RichText";
import type { SiteContent } from "@/lib/site/content";
import { resolveIcon } from "@/lib/site/icons";

function digitsOnly(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

function whatsappLink(number: string, message: string): string {
  const base = `https://wa.me/${digitsOnly(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Landing page da L&L, inteiramente montada a partir do conteúdo editável.
 * É a mesma árvore usada no site público e na prévia do painel — o que o
 * cliente vê na prévia é exatamente o que vai ao ar.
 */
export function Landing({
  content,
  withToaster = true,
}: {
  content: SiteContent;
  /** A prévia do painel já tem o seu próprio Toaster. */
  withToaster?: boolean;
}) {
  const [sending, setSending] = useState(false);
  const { contact } = content;
  const waNumber = digitsOnly(contact.whatsappNumber);
  const heroWhatsapp = whatsappLink(contact.whatsappNumber, contact.whatsappMessage);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "").trim();
    const telefone = String(data.get("telefone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();

    if (!nome || nome.length > 100) {
      toast.error("Informe um nome válido.");
      return;
    }
    if (!telefone || telefone.length > 30) {
      toast.error("Informe um telefone válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    if (!mensagem || mensagem.length > 1000) {
      toast.error("Escreva uma mensagem de até 1000 caracteres.");
      return;
    }

    setSending(true);
    const texto = `Olá, sou ${nome}. Telefone: ${telefone}. E-mail: ${email}. ${mensagem}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    toast.success("Mensagem preparada! Finalize o envio pelo WhatsApp.");
    form.reset();
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-background">
      {withToaster ? <Toaster /> : null}

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <SiteLogo brand={content.brand} />
          <nav className="flex items-center gap-6">
            {content.nav.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary lg:inline"
              >
                {link.label}
              </a>
            ))}
            <a
              href={content.nav.ctaHref}
              className="bg-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-105"
            >
              {content.nav.ctaLabel}
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {content.hero.imageUrl ? (
          <img
            src={content.hero.imageUrl}
            alt={content.hero.imageAlt}
            width={1600}
            height={1008}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--graphite)_18%,color-mix(in_oklab,var(--primary-deep)_88%,transparent)_58%,transparent_100%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:py-36 lg:py-44">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-graphite-foreground/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-graphite-foreground text-center">
              {content.hero.badge}
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 max-w-3xl text-3xl leading-[0.95] text-graphite-foreground sm:text-6xl lg:text-7xl">
              <RichText text={content.hero.title} />
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-base text-graphite-foreground/80 sm:text-lg">
              {content.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={content.hero.primaryCtaHref}
                className="bg-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-105"
              >
                {content.hero.primaryCtaLabel} <ArrowRight size={18} />
              </a>
              <a
                href={heroWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-graphite-foreground/35 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-graphite-foreground transition-colors hover:bg-graphite-foreground/10"
              >
                <MessageCircle size={18} /> {content.hero.secondaryCtaLabel}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              {content.about.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-5xl">
              <RichText text={content.about.title} />
            </h2>
            <div className="mt-6 text-muted-foreground space-y-4">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph.id}>{paragraph.text}</p>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {content.about.bullets.map((bullet) => (
                <li key={bullet.id} className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  {bullet.text}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <div className="card-cut overflow-hidden">
              {content.about.imageUrl ? (
                <img
                  src={content.about.imageUrl}
                  alt={content.about.imageAlt}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSÃO / VISÃO */}
      <section className="diagonal-top bg-graphite py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2">
          <Reveal>
            <div className="card-cut h-full bg-graphite-foreground/[0.06] p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary-light">
                {content.mission.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl text-graphite-foreground sm:text-3xl uppercase">
                {content.mission.title}
              </h3>
              <div className="mt-4 text-graphite-foreground/75 space-y-2">
                {content.mission.paragraphs.map((paragraph) => (
                  <p key={paragraph.id}>{paragraph.text}</p>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="card-cut-alt h-full bg-graphite-foreground/[0.06] p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary-light">
                {content.vision.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl text-graphite-foreground sm:text-3xl">
                {content.vision.title}
              </h3>
              <div className="mt-4 text-graphite-foreground/75 space-y-2">
                {content.vision.paragraphs.map((paragraph) => (
                  <p key={paragraph.id}>{paragraph.text}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EQUIPAMENTOS */}
      <section id="equipamentos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            {content.equipment.eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
            <RichText text={content.equipment.title} />
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.equipment.items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            const images = item.images.map((image) => image.url).filter(Boolean);
            return (
              <Reveal key={item.id} delay={i * 100}>
                <article className="card-cut flex h-full flex-col overflow-hidden border border-border bg-card transition-transform duration-300 hover:-translate-y-1">
                  {images.length > 0 ? (
                    <CardCarousel images={images} alt={item.title} />
                  ) : (
                    <div className="h-44 w-full bg-secondary" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {item.capacity}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                    <a
                      href={whatsappLink(contact.whatsappNumber, item.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Solicitar orçamento de ${item.title} pelo WhatsApp`}
                      className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-bold uppercase tracking-wide text-whatsapp-foreground transition-all duration-200 hover:brightness-105 hover:-translate-y-0.5"
                    >
                      <MessageCircle size={18} />
                      Orçamento no WhatsApp
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        {content.equipment.note ? (
          <Reveal delay={120}>
            <p className="card-cut-alt mt-8 flex items-start gap-3 border border-primary/25 bg-accent p-6 text-sm font-semibold text-accent-foreground">
              <ShieldCheck size={22} className="shrink-0 text-primary" />
              {content.equipment.note}
            </p>
          </Reveal>
        ) : null}
      </section>

      {/* GALERIA (opcional) */}
      {content.gallery.enabled && content.gallery.images.length > 0 ? (
        <section id="galeria" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              {content.gallery.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
              <RichText text={content.gallery.title} />
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.gallery.images.map((image, i) => (
              <Reveal key={image.id} delay={i * 80}>
                <div className="card-cut overflow-hidden border border-border bg-card">
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* VALORES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            {content.values.eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
            <RichText text={content.values.title} />
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.values.items.map((value, i) => {
            const Icon = resolveIcon(value.icon, ShieldCheck);
            return (
              <Reveal as="li" key={value.id} delay={i * 90}>
                <div className="card-cut h-full border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="bg-brand mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* O QUE OFERECEMOS */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              {content.offers.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
              <RichText text={content.offers.title} />
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.offers.items.map((offer, i) => (
              <Reveal key={offer.id} delay={i * 100}>
                <div className="card-cut-alt h-full bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
                  <span className="text-gradient-brand font-display text-5xl font-extrabold italic">
                    {offer.number}
                  </span>
                  <h3 className="mt-4 text-lg leading-tight">{offer.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{offer.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS (opcional) */}
      {content.testimonials.enabled && content.testimonials.items.length > 0 ? (
        <section id="depoimentos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              {content.testimonials.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
              <RichText text={content.testimonials.title} />
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.items.map((item, i) => (
              <Reveal as="li" key={item.id} delay={i * 90}>
                <figure className="card-cut flex h-full flex-col border border-border bg-card p-6">
                  <Quote size={26} className="text-primary" />
                  <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        loading="lazy"
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="bg-brand inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary-foreground">
                        <Users size={18} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ÁREAS DE ATUAÇÃO */}
      <section id="atuacao" className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="relative max-w-3xl">
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-primary/20 -z-10 clip-diag-accent" />
              <div className="border-l-4 border-primary py-2 pl-6 sm:pl-8">
                <h2 className="font-display block text-sm font-bold uppercase tracking-[0.25em] text-primary">
                  {content.areas.eyebrow}
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-snug text-black sm:text-lg">
                  <AreasDescription text={content.areas.description} />
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="bg-brand-line h-0.5 w-12" />
                </div>
              </div>
              <div className="bg-brand-line-reverse absolute -bottom-4 -right-4 h-1 w-32" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.areas.items.map((area, i) => {
              const Icon = resolveIcon(area.icon);
              return (
                <Reveal key={area.id} delay={i * 90}>
                  <div className="card-cut flex h-full items-center gap-4 bg-card p-6">
                    <span className="bg-brand inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Icon size={22} />
                    </span>
                    <h3 className="min-w-0 text-base leading-tight">{area.title}</h3>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <footer id="contato" className="diagonal-top bg-graphite pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary-light">
                {contact.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl text-graphite-foreground sm:text-5xl">
                {contact.title}
              </h2>
              <p className="mt-5 max-w-md text-graphite-foreground/75">{contact.description}</p>
              <ul className="mt-8 space-y-4">
                {contact.contactName ? (
                  <li className="flex items-center gap-3 text-graphite-foreground">
                    <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Users size={18} />
                    </span>
                    <span className="font-semibold">{contact.contactName}</span>
                  </li>
                ) : null}
                {contact.phoneDisplay ? (
                  <li>
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-graphite-foreground transition-colors hover:text-primary-light"
                    >
                      <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                        <Phone size={18} />
                      </span>
                      <span className="font-semibold">{contact.phoneDisplay}</span>
                    </a>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-graphite-foreground transition-colors hover:text-primary-light"
                    >
                      <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                        <Mail size={18} />
                      </span>
                      <span className="font-semibold break-all">{contact.email}</span>
                    </a>
                  </li>
                ) : null}
                {contact.hours ? (
                  <li className="flex items-start gap-3 text-graphite-foreground">
                    <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Clock size={18} />
                    </span>
                    <span className="text-sm leading-snug whitespace-pre-line">{contact.hours}</span>
                  </li>
                ) : null}
                {contact.addresses.length > 0 ? (
                  <li className="flex items-start gap-3 text-graphite-foreground">
                    <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <MapPin size={18} />
                    </span>
                    <div className="text-sm leading-snug">
                      {contact.addresses.map((address, i) => (
                        <p key={address.id} className={i > 0 ? "mt-1" : undefined}>
                          {address.label ? <strong>{address.label}:</strong> : null}{" "}
                          {address.text}
                        </p>
                      ))}
                    </div>
                  </li>
                ) : null}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <form
                onSubmit={handleSubmit}
                className="card-cut-alt bg-graphite-foreground/[0.06] p-7 md:p-9"
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="nome"
                      className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70"
                    >
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      maxLength={100}
                      required
                      className="rounded-lg border border-graphite-foreground/20 bg-graphite-foreground/5 px-4 py-3 text-graphite-foreground outline-none transition-colors placeholder:text-graphite-foreground/40 focus:border-primary-light"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label
                        htmlFor="telefone"
                        className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70"
                      >
                        Telefone
                      </label>
                      <input
                        id="telefone"
                        name="telefone"
                        maxLength={30}
                        required
                        className="rounded-lg border border-graphite-foreground/20 bg-graphite-foreground/5 px-4 py-3 text-graphite-foreground outline-none transition-colors placeholder:text-graphite-foreground/40 focus:border-primary-light"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70"
                      >
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        maxLength={255}
                        required
                        className="rounded-lg border border-graphite-foreground/20 bg-graphite-foreground/5 px-4 py-3 text-graphite-foreground outline-none transition-colors placeholder:text-graphite-foreground/40 focus:border-primary-light"
                        placeholder="voce@empresa.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="mensagem"
                      className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={4}
                      maxLength={1000}
                      required
                      className="resize-none rounded-lg border border-graphite-foreground/20 bg-graphite-foreground/5 px-4 py-3 text-graphite-foreground outline-none transition-colors placeholder:text-graphite-foreground/40 focus:border-primary-light"
                      placeholder="Conte sobre a sua demanda"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-brand mt-2 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-[1.03] disabled:opacity-60"
                  >
                    {contact.formButtonLabel} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 border-t border-graphite-foreground/15 pt-8 text-center">
            <SiteLogo brand={content.brand} inverted />
            <p className="font-display text-sm italic uppercase tracking-wide text-primary-light">
              {content.footer.tagline}
            </p>
            <p className="text-xs text-graphite-foreground/50">
              © {new Date().getFullYear()} {content.footer.legalName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a
        href={heroWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform duration-200 hover:scale-110"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}

/** O destaque das áreas de atuação usa itálico + sublinhado, não o degradê. */
function AreasDescription({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span
            key={index}
            className="font-display border-b-2 border-primary/40 font-bold italic text-primary"
          >
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
