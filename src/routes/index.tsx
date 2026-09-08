import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Handshake,
  Scale,
  TrendingUp,
  HardHat,
  Bus,
  Truck,
  Users,
  Route as RouteIcon,
  CalendarClock,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Reveal } from "@/components/Reveal";
import { Logo } from "@/components/Logo";
import { CardCarousel } from "@/components/CardCarousel";
import heroBus from "@/assets/hero-bus.jpg";
import fleetImg from "@/assets/logo.png";
import munckImg from "@/assets/munck.jpeg";
import van from "@/assets/van.png";
import micro from "@/assets/micro.png";
import onibus from "@/assets/onibus.png";
import vanExterna from "@/assets/vanlado.png";
import vanInterna from "@/assets/vandentro.jpeg";
import microExterno from "@/assets/microlado.png";
import microInterno from "@/assets/microdentro.jpeg";
import onibusExterno from "@/assets/onibuslado.png";
import onibusInterno from "@/assets/onibusdentro.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "L&L Rental — Locação de Veículos" },
      {
        name: "description",
        content:
          "Locação de vans, ônibus, micro-ônibus e munck para grandes obras.",
      },
      { property: "og:title", content: "L&L Rental — Locação de Veículos" },
      {
        property: "og:description",
        content:
          "Locação de vans, ônibus, micro-ônibus e munck para grandes obras.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ll-rental-solutions.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ll-rental-solutions.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "L&L Engenharia e Rental LTDA",
          alternateName: "L&L Rental",
          url: "https://ll-rental-solutions.lovable.app/",
          telephone: "+55 49 99109-1289",
          description:
            "Locação de equipamentos e veículos para transporte de passageiros em obras de infraestrutura, subestações, linhas de transmissão, terraplenagem e rodovias.",
          address: [
            {
              "@type": "PostalAddress",
              streetAddress: "Rua Danilo Lucatel, 52, Jardim Alvorada",
              addressLocality: "São Carlos",
              addressRegion: "SC",
              postalCode: "89885-000",
              addressCountry: "BR",
            },
            {
              "@type": "PostalAddress",
              streetAddress: "Av. Paissandu, 776, Zona 3",
              addressLocality: "Maringá",
              addressRegion: "PR",
              postalCode: "87050-130",
              addressCountry: "BR",
            },
          ],
        }),
      },
    ],
  }),

  component: Index,
});

const WHATSAPP = "https://wa.me/5549991091289";
const WHATSAPP_MSG = "Olá! Vim pelo site da L&L Rental e gostaria de solicitar um orçamento.";
const WHATSAPP_LINK = `${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const valores = [
  {
    icon: ShieldCheck,
    title: "Integridade e Sinceridade",
    desc: "Agir com transparência e ética em todas as situações, mantendo a confiança de nossos clientes e parceiros;",
  },
  {
    icon: Handshake,
    title: "Respeito ao Cliente",
    desc: "Valorizar e considerar as opiniões e sentimentos dos nossos clientes, estabelecendo relacionamentos de confiança e parceria;",
  },
  {
    icon: Scale,
    title: "Justiça e Equidade",
    desc: "Tratar todos os clientes de forma justa e imparcial, garantindo um atendimento igualitário e respeitoso;",
  },
  {
    icon: TrendingUp,
    title: "Melhoria Contínua",
    desc: "Buscar sempre a evolução, oferecendo soluções que atendam aos mais altos padrões de qualidade e que entreguem resultados 4 excepcionais;",
  },
  {
    icon: HardHat,
    title: "Segurança e Conformidade",
    desc: "Cumprir rigorosamente as normativas e métodos de segurança do trabalho, garantindo a integridade de nossos colaboradores e a segurança em todas as operações.",
  },
];

const ofertas = [
  {
    n: "01",
    title: "Equipamentos Modernos e Diversificados",
    desc: "Oferecemos uma ampla gama de equipamentos de alta performance, sempre atualizados para atender às necessidades específicas de cada projeto.",
  },
  {
    n: "02",
    title: "Logística Eficiente",
    desc: "Garantimos um atendimento ágil e pontual em todo o território nacional, com soluções logísticas que atendem às exigências de grandes obras.",
  },
  {
    n: "03",
    title: "Equipe Técnica Qualificada",
    desc: "Contamos com profissionais altamente capacitados, prontos para fornecer suporte técnico especializado diretamente no campo, assegurando a eficiência das operações.",
  },
  {
    n: "04",
    title: "Experiência em Grandes Obras",
    desc: "Temos vasta experiência em projetos de grande porte, com alto desempenho operacional, sempre focados em resultados que superam as expectativas dos nossos clientes.",
  },
];

const equipamentos = [
  {
    title: "Caminhão Munck",
    cap: "Cesto aéreo NR12",
    desc: "Com controle de rádio frequência e cesto aéreo conforme NR12.",
    imgs: [munckImg],
    msg: "Olá! Gostaria de solicitar um orçamento de locação de Caminhão Munck com cesto aéreo (NR12).",
  },
  {
    title: "Vans",
    cap: "15 lugares",
    desc: "Agilidade para equipes técnicas, supervisão e deslocamentos rápidos.",
    imgs: [van, vanExterna, vanInterna],
    msg: "Olá! Gostaria de solicitar um orçamento de locação de Van (15 lugares) para equipe técnica.",
  },
  {
    title: "Micro-ônibus",
    cap: "30 lugares",
    desc: "Ideal para transporte diário de equipes entre alojamento e frente de trabalho.",
    imgs: [micro, microExterno, microInterno],
    msg: "Olá! Gostaria de solicitar um orçamento de locação de Micro-ônibus (30 lugares) para transporte de equipes.",
  },
  {
    title: "Ônibus",
    cap: "48 lugares",
    desc: "Alta capacidade para grandes contingentes e traslados de longa distância.",
    imgs: [onibus, onibusExterno, onibusInterno],
    msg: "Olá! Gostaria de solicitar um orçamento de locação de Ônibus (48 lugares) para traslado de equipes.",
  },
];

const areas = [
  { icon: Building2, title: "Transporte corporativo e de equipes" },
  { icon: HardHat, title: "Obras e frentes de trabalho" },
  { icon: Users, title: "Eventos e logística de passageiros" },
  { icon: RouteIcon, title: "Traslados e viagens programadas" },
  { icon: CalendarClock, title: "FROTA : CAMINHÃO MUNCK, VANS, MICRO-ÔNIBUS E ÔNIBUS" },
];

function Index() {
  const [sending, setSending] = useState(false);

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
    window.open(`${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    toast.success("Mensagem preparada! Finalize o envio pelo WhatsApp.");
    form.reset();
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-6">
            <a
              href="#quem-somos"
              className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary lg:inline"
            >
              Quem somos
            </a>
            <a
              href="#equipamentos"
              className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary lg:inline"
            >
              Equipamentos
            </a>
            <a
              href="#atuacao"
              className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary lg:inline"
            >
              Atuação
            </a>
            <a
              href="#contato"
              className="bg-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-105"
            >
              Fale conosco
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroBus}
          alt="Micro-ônibus da L&L Rental em obra de infraestrutura"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--graphite)_18%,color-mix(in_oklab,var(--primary-deep)_88%,transparent)_58%,transparent_100%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:py-36 lg:py-44">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-graphite-foreground/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-graphite-foreground text-center">
              LOCAÇÃO DE EQUIPAMENTOS E VEÍCULOS PARA TRANSPORTE EM GRANDES OBRAS
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[0.95] text-graphite-foreground sm:text-6xl lg:text-7xl">
              Locação de vans, ônibus, <span className="whitespace-nowrap">micro-ônibus</span> e munck para grandes obras
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 max-w-xl text-base text-graphite-foreground/80 sm:text-lg">
              Locação de equipamentos e veículos pra transporte de passageiros em obras de infra estrutura de subestação de energia, linhas de transmissão, terraplenagens, rodovias e construção civil em geral.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contato"
                className="bg-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:scale-105"
              >
                Solicitar orçamento <ArrowRight size={18} />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-graphite-foreground/35 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-graphite-foreground transition-colors hover:bg-graphite-foreground/10"
              >
                <MessageCircle size={18} /> Fale conosco
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
              Quem somos
            </p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-5xl">
              L&amp;L Engenharia e <span className="text-gradient-brand">Rental LTDA</span>
            </h2>
            <div className="mt-6 text-muted-foreground space-y-4">
              <p>
                A L&L Engenharia e Rental LTDA foi fundada em 2020 pelos irmãos Lênon e Leonardo, com o propósito de trazer inovação, eficiência e qualidade ao mercado de locação de equipamentos para grandes obras.
              </p>
              <p>
                Nossa atuação se concentra em setores estratégicos, como subestações e transmissão de energia elétrica, terraplenagem, rodovias e projetos de infraestrutura pesada.
              </p>
              <p>
                Comprometidos com a excelência, nos dedicamos a entregar soluções completas e garantir a máxima comodidade para nossos parceiros, sempre com foco na segurança, no cumprimento de prazos e na satisfação dos nossos clientes.
              </p>
              <p>
                A L&L Engenharia e Rental se destaca por ser uma empresa que entende as necessidades do setor e oferece suporte de alta qualidade para projetos de grande porte.
              </p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Fundada em 2020", "Gestão familiar e próxima", "Cumprimento de prazos", "Segurança em primeiro lugar"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 size={18} className="shrink-0 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <div className="card-cut overflow-hidden">
              <img
                src={fleetImg}
                alt="Frota de vans e ônibus da L&L Rental"
                loading="lazy"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
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
                Missão
              </p>
              <h3 className="mt-4 text-2xl text-graphite-foreground sm:text-3xl uppercase">
                FORNECER SOLUÇÕES CONFIÁVEIS E DE ALTA QUALIDADE NA LOCAÇÃO DE EQUIPAMENTOS
              </h3>
              <div className="mt-4 text-graphite-foreground/75 space-y-2">
                <p>
                  Priorizando agilidade, segurança e um suporte técnico especializado.
                </p>
                <p>
                  Buscamos contribuir para o sucesso dos projetos de nossos clientes, sempre com foco no desenvolvimento sustentável e no atendimento das demandas mais exigentes do mercado.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="card-cut-alt h-full bg-graphite-foreground/[0.06] p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary-light">
                Visão
              </p>
              <h3 className="mt-4 text-2xl text-graphite-foreground sm:text-3xl">
                Referência nacional no setor
              </h3>
              <p className="mt-4 text-graphite-foreground/75">
                Temos como visão nos tornar uma referência nacional em locação de equipamentos para obras de infraestrutura, sendo reconhecidos pela excelência dos serviços prestados, pela constante inovação e pelo compromisso com os resultados de nossos clientes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EQUIPAMENTOS */}
      <section id="equipamentos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Equipamentos disponíveis
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
            Frota pronta para <span className="text-gradient-brand">operar</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipamentos.map((e, i) => (
            <Reveal key={e.title} delay={i * 100}>
              <article className="card-cut flex h-full flex-col overflow-hidden border border-border bg-card transition-transform duration-300 hover:-translate-y-1">
                <CardCarousel images={e.imgs} alt={e.title} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-primary">
                    {e.title === "Caminhão Munck" ? <Truck size={18} /> : <Bus size={18} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{e.cap}</span>
                  </div>
                  <h3 className="mt-2 text-lg">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
                  <a
                    href={`${WHATSAPP}?text=${encodeURIComponent(e.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Solicitar orçamento de ${e.title} pelo WhatsApp`}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-sm font-bold uppercase tracking-wide text-whatsapp-foreground transition-all duration-200 hover:brightness-105 hover:-translate-y-0.5"
                  >
                    <MessageCircle size={18} />
                    Orçamento no WhatsApp
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p className="card-cut-alt mt-8 flex items-start gap-3 border border-primary/25 bg-accent p-6 text-sm font-semibold text-accent-foreground">
            <ShieldCheck size={22} className="shrink-0 text-primary" />
            Todos os equipamentos atendem às normativas e premissas de segurança, com laudos
            técnicos, planos de manutenção e ART.
          </p>
        </Reveal>
      </section>

      {/* VALORES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Nossos valores
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
            O que sustenta cada <span className="text-gradient-brand">operação</span>
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valores.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 90}>
              <div className="card-cut h-full border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="bg-brand mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground">
                  <v.icon size={22} />
                </div>
                <h3 className="text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* O QUE OFERECEMOS */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              O que oferecemos
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl">
              Estrutura completa para sua <span className="text-gradient-brand">obra</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ofertas.map((o, i) => (
              <Reveal key={o.n} delay={i * 100}>
                <div className="card-cut-alt h-full bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
                  <span className="text-gradient-brand font-display text-5xl font-extrabold italic">
                    {o.n}
                  </span>
                  <h3 className="mt-4 text-lg leading-tight">{o.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{o.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ÁREAS DE ATUAÇÃO */}
      <section id="atuacao" className="bg-secondary py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="relative max-w-3xl">
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-primary/20 -z-10 clip-diag-accent" />
              <div className="border-l-4 border-primary py-2 pl-6 sm:pl-8">
                <h2 className="font-display block text-sm font-bold uppercase tracking-[0.25em] text-primary">
                  Áreas de atuação
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-snug text-black sm:text-lg">
                  A L&L Rental é especializada em locação de equipamentos e veículos pra transporte de passageiros em obras e empreendimentos, oferecendo <span className="font-display border-b-2 border-primary/40 font-bold italic text-primary">agilidade, segurança e conforto</span> em cada operação.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="bg-brand-line h-0.5 w-12" />
                </div>
              </div>
              <div className="bg-brand-line-reverse absolute -bottom-4 -right-4 h-1 w-32" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <div className="card-cut flex h-full items-center gap-4 bg-card p-6">
                  <span className="bg-brand inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                    <a.icon size={22} />
                  </span>
                  <h3 className="min-w-0 text-base leading-tight">{a.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <footer id="contato" className="diagonal-top bg-graphite pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary-light">
                Contato
              </p>
              <h2 className="mt-4 text-3xl text-graphite-foreground sm:text-5xl">
                Vamos falar sobre a sua obra
              </h2>
              <p className="mt-5 max-w-md text-graphite-foreground/75">
                Solicite um orçamento e receba a melhor solução em locação de equipamentos e transporte corporativo para suas obras.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-graphite-foreground">
                  <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                    <Users size={18} />
                  </span>
                  <span className="font-semibold">Lênon Pagliari Casanova</span>
                </li>
                <li>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-graphite-foreground transition-colors hover:text-primary-light"
                  >
                    <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Phone size={18} />
                    </span>
                    <span className="font-semibold">(49) 99109-1289</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:casanovaeng49@gmail.com"
                    className="flex items-center gap-3 text-graphite-foreground transition-colors hover:text-primary-light"
                  >
                    <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <Mail size={18} />
                    </span>
                    <span className="font-semibold break-all">casanovaeng49@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-graphite-foreground">
                  <span className="bg-brand inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                    <MapPin size={18} />
                  </span>
                  <div className="text-sm leading-snug">
                    <p><strong>Matriz:</strong> Rua Danilo Lucatel, nº 52, Bairro Jardim Alvorada, São Carlos/SC, CEP 89885-000</p>
                    <p className="mt-1"><strong>Filial:</strong> Av. Paissandu, n° 776, zona 3, Maringá/PR, CEP 87050-130</p>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <form
                onSubmit={handleSubmit}
                className="card-cut-alt bg-graphite-foreground/[0.06] p-7 md:p-9"
              >
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="nome" className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70">
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
                      <label htmlFor="telefone" className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70">
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
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70">
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
                    <label htmlFor="mensagem" className="text-xs font-bold uppercase tracking-widest text-graphite-foreground/70">
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
                    Enviar mensagem <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 border-t border-graphite-foreground/15 pt-8 text-center">
            <Logo inverted />
            <p className="font-display text-sm italic uppercase tracking-wide text-primary-light">
              Construindo o futuro com inovação e confiança
            </p>
            <p className="text-xs text-graphite-foreground/50">
              © {new Date().getFullYear()} L&amp;L Engenharia e Rental LTDA. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a
        href={WHATSAPP_LINK}
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
