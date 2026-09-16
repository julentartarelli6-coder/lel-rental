/**
 * Documento de conteúdo do site.
 *
 * Tudo que o cliente edita no /admin vive aqui. O site público sempre renderiza
 * DEFAULT_CONTENT mesclado com o que veio do banco, então:
 *   - se o banco estiver vazio, o site aparece exatamente como foi entregue;
 *   - se um campo novo for adicionado neste arquivo, sites antigos continuam
 *     funcionando (o default entra no lugar).
 *
 * Para adicionar um campo editável:
 *   1. adicione no tipo + no DEFAULT_CONTENT abaixo;
 *   2. adicione uma linha no ADMIN_SCHEMA (src/lib/site/admin-schema.ts);
 *   3. use o campo no componente da seção (src/components/site/*).
 */

import heroBus from "@/assets/hero-bus.jpg";
import fleetImg from "@/assets/logo.png";
import logoLenon from "@/assets/logolenon.png";
import munckImg from "@/assets/munck.jpeg";
import van from "@/assets/van.png";
import vanExterna from "@/assets/vanlado.png";
import vanInterna from "@/assets/vandentro.jpeg";
import micro from "@/assets/micro.png";
import microExterno from "@/assets/microlado.png";
import microInterno from "@/assets/microdentro.jpeg";
import onibus from "@/assets/onibus.png";
import onibusExterno from "@/assets/onibuslado.png";
import onibusInterno from "@/assets/onibusdentro.jpeg";

/** Todo item de lista editável carrega um id estável (chave de render + reordenação). */
export type WithId = { id: string };

export type NavLink = WithId & { label: string; href: string };
export type Bullet = WithId & { text: string };
export type Paragraph = WithId & { text: string };
export type GalleryImage = WithId & { url: string; alt: string };

export type EquipmentItem = WithId & {
  title: string;
  capacity: string;
  description: string;
  icon: string;
  images: GalleryImage[];
  whatsappMessage: string;
};

export type ValueItem = WithId & { icon: string; title: string; description: string };
export type OfferItem = WithId & { number: string; title: string; description: string };
export type AreaItem = WithId & { icon: string; title: string };
export type Testimonial = WithId & {
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
};
export type AddressItem = WithId & { label: string; text: string };

export type SiteContent = {
  brand: {
    logoUrl: string;
    logoAlt: string;
    wordmarkLead: string;
    wordmarkHighlight: string;
  };
  nav: { links: NavLink[]; ctaLabel: string; ctaHref: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    imageAlt: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: Paragraph[];
    bullets: Bullet[];
    imageUrl: string;
    imageAlt: string;
  };
  mission: { eyebrow: string; title: string; paragraphs: Paragraph[] };
  vision: { eyebrow: string; title: string; paragraphs: Paragraph[] };
  equipment: { eyebrow: string; title: string; note: string; items: EquipmentItem[] };
  values: { eyebrow: string; title: string; items: ValueItem[] };
  offers: { eyebrow: string; title: string; items: OfferItem[] };
  areas: { eyebrow: string; description: string; items: AreaItem[] };
  gallery: { enabled: boolean; eyebrow: string; title: string; images: GalleryImage[] };
  testimonials: { enabled: boolean; eyebrow: string; title: string; items: Testimonial[] };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    contactName: string;
    phoneDisplay: string;
    whatsappNumber: string;
    whatsappMessage: string;
    email: string;
    hours: string;
    addresses: AddressItem[];
    formButtonLabel: string;
  };
  footer: { tagline: string; legalName: string };
  seo: { title: string; description: string; siteUrl: string };
};

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    logoUrl: logoLenon,
    logoAlt: "L&L Rental - locação de veículos para transporte de passageiros",
    wordmarkLead: "L&L",
    wordmarkHighlight: "Rental",
  },
  nav: {
    links: [
      { id: "nav-1", label: "Quem somos", href: "#quem-somos" },
      { id: "nav-2", label: "Equipamentos", href: "#equipamentos" },
      { id: "nav-3", label: "Atuação", href: "#atuacao" },
    ],
    ctaLabel: "Fale conosco",
    ctaHref: "#contato",
  },
  hero: {
    badge: "LOCAÇÃO DE EQUIPAMENTOS E VEÍCULOS PARA TRANSPORTE EM GRANDES OBRAS",
    title: "Locação de vans, {{ônibus, micro-ônibus}} e munck para grandes obras",
    subtitle:
      "Locação de equipamentos e veículos pra transporte de passageiros em obras de infra estrutura de subestação de energia, linhas de transmissão, terraplenagens, rodovias e construção civil em geral.",
    imageUrl: heroBus,
    imageAlt: "Micro-ônibus da L&L Rental em obra de infraestrutura",
    primaryCtaLabel: "Solicitar orçamento",
    primaryCtaHref: "#contato",
    secondaryCtaLabel: "Fale conosco",
  },
  about: {
    eyebrow: "Quem somos",
    title: "L&L Engenharia e **Rental LTDA**",
    paragraphs: [
      {
        id: "about-1",
        text: "A L&L Engenharia e Rental LTDA foi fundada em 2020 pelos irmãos Lênon e Leonardo, com o propósito de trazer inovação, eficiência e qualidade ao mercado de locação de equipamentos para grandes obras.",
      },
      {
        id: "about-2",
        text: "Nossa atuação se concentra em setores estratégicos, como subestações e transmissão de energia elétrica, terraplenagem, rodovias e projetos de infraestrutura pesada.",
      },
      {
        id: "about-3",
        text: "Comprometidos com a excelência, nos dedicamos a entregar soluções completas e garantir a máxima comodidade para nossos parceiros, sempre com foco na segurança, no cumprimento de prazos e na satisfação dos nossos clientes.",
      },
      {
        id: "about-4",
        text: "A L&L Engenharia e Rental se destaca por ser uma empresa que entende as necessidades do setor e oferece suporte de alta qualidade para projetos de grande porte.",
      },
    ],
    bullets: [
      { id: "bullet-1", text: "Fundada em 2020" },
      { id: "bullet-2", text: "Gestão familiar e próxima" },
      { id: "bullet-3", text: "Cumprimento de prazos" },
      { id: "bullet-4", text: "Segurança em primeiro lugar" },
    ],
    imageUrl: fleetImg,
    imageAlt: "Frota de vans e ônibus da L&L Rental",
  },
  mission: {
    eyebrow: "Missão",
    title: "FORNECER SOLUÇÕES CONFIÁVEIS E DE ALTA QUALIDADE NA LOCAÇÃO DE EQUIPAMENTOS",
    paragraphs: [
      {
        id: "mission-1",
        text: "Priorizando agilidade, segurança e um suporte técnico especializado.",
      },
      {
        id: "mission-2",
        text: "Buscamos contribuir para o sucesso dos projetos de nossos clientes, sempre com foco no desenvolvimento sustentável e no atendimento das demandas mais exigentes do mercado.",
      },
    ],
  },
  vision: {
    eyebrow: "Visão",
    title: "Referência nacional no setor",
    paragraphs: [
      {
        id: "vision-1",
        text: "Temos como visão nos tornar uma referência nacional em locação de equipamentos para obras de infraestrutura, sendo reconhecidos pela excelência dos serviços prestados, pela constante inovação e pelo compromisso com os resultados de nossos clientes.",
      },
    ],
  },
  equipment: {
    eyebrow: "Equipamentos disponíveis",
    title: "Frota pronta para **operar**",
    note: "Todos os equipamentos atendem às normativas e premissas de segurança, com laudos técnicos, planos de manutenção e ART.",
    items: [
      {
        id: "eq-munck",
        title: "Caminhão Munck",
        capacity: "Cesto aéreo NR12",
        description: "Com controle de rádio frequência e cesto aéreo conforme NR12.",
        icon: "truck",
        images: [{ id: "eq-munck-1", url: munckImg, alt: "Caminhão Munck" }],
        whatsappMessage:
          "Olá! Gostaria de solicitar um orçamento de locação de Caminhão Munck com cesto aéreo (NR12).",
      },
      {
        id: "eq-van",
        title: "Vans",
        capacity: "15 lugares",
        description: "Agilidade para equipes técnicas, supervisão e deslocamentos rápidos.",
        icon: "bus",
        images: [
          { id: "eq-van-1", url: van, alt: "Van" },
          { id: "eq-van-2", url: vanExterna, alt: "Van vista lateral" },
          { id: "eq-van-3", url: vanInterna, alt: "Interior da van" },
        ],
        whatsappMessage:
          "Olá! Gostaria de solicitar um orçamento de locação de Van (15 lugares) para equipe técnica.",
      },
      {
        id: "eq-micro",
        title: "Micro-ônibus",
        capacity: "30 lugares",
        description:
          "Ideal para transporte diário de equipes entre alojamento e frente de trabalho.",
        icon: "bus",
        images: [
          { id: "eq-micro-1", url: micro, alt: "Micro-ônibus" },
          { id: "eq-micro-2", url: microExterno, alt: "Micro-ônibus vista lateral" },
          { id: "eq-micro-3", url: microInterno, alt: "Interior do micro-ônibus" },
        ],
        whatsappMessage:
          "Olá! Gostaria de solicitar um orçamento de locação de Micro-ônibus (30 lugares) para transporte de equipes.",
      },
      {
        id: "eq-onibus",
        title: "Ônibus",
        capacity: "48 lugares",
        description: "Alta capacidade para grandes contingentes e traslados de longa distância.",
        icon: "bus",
        images: [
          { id: "eq-onibus-1", url: onibus, alt: "Ônibus" },
          { id: "eq-onibus-2", url: onibusExterno, alt: "Ônibus vista lateral" },
          { id: "eq-onibus-3", url: onibusInterno, alt: "Interior do ônibus" },
        ],
        whatsappMessage:
          "Olá! Gostaria de solicitar um orçamento de locação de Ônibus (48 lugares) para traslado de equipes.",
      },
    ],
  },
  values: {
    eyebrow: "Nossos valores",
    title: "O que sustenta cada **operação**",
    items: [
      {
        id: "val-1",
        icon: "shield",
        title: "Integridade e Sinceridade",
        description:
          "Agir com transparência e ética em todas as situações, mantendo a confiança de nossos clientes e parceiros;",
      },
      {
        id: "val-2",
        icon: "handshake",
        title: "Respeito ao Cliente",
        description:
          "Valorizar e considerar as opiniões e sentimentos dos nossos clientes, estabelecendo relacionamentos de confiança e parceria;",
      },
      {
        id: "val-3",
        icon: "scale",
        title: "Justiça e Equidade",
        description:
          "Tratar todos os clientes de forma justa e imparcial, garantindo um atendimento igualitário e respeitoso;",
      },
      {
        id: "val-4",
        icon: "trending",
        title: "Melhoria Contínua",
        description:
          "Buscar sempre a evolução, oferecendo soluções que atendam aos mais altos padrões de qualidade e que entreguem resultados excepcionais;",
      },
      {
        id: "val-5",
        icon: "hardhat",
        title: "Segurança e Conformidade",
        description:
          "Cumprir rigorosamente as normativas e métodos de segurança do trabalho, garantindo a integridade de nossos colaboradores e a segurança em todas as operações.",
      },
    ],
  },
  offers: {
    eyebrow: "O que oferecemos",
    title: "Estrutura completa para sua **obra**",
    items: [
      {
        id: "off-1",
        number: "01",
        title: "Equipamentos Modernos e Diversificados",
        description:
          "Oferecemos uma ampla gama de equipamentos de alta performance, sempre atualizados para atender às necessidades específicas de cada projeto.",
      },
      {
        id: "off-2",
        number: "02",
        title: "Logística Eficiente",
        description:
          "Garantimos um atendimento ágil e pontual em todo o território nacional, com soluções logísticas que atendem às exigências de grandes obras.",
      },
      {
        id: "off-3",
        number: "03",
        title: "Equipe Técnica Qualificada",
        description:
          "Contamos com profissionais altamente capacitados, prontos para fornecer suporte técnico especializado diretamente no campo, assegurando a eficiência das operações.",
      },
      {
        id: "off-4",
        number: "04",
        title: "Experiência em Grandes Obras",
        description:
          "Temos vasta experiência em projetos de grande porte, com alto desempenho operacional, sempre focados em resultados que superam as expectativas dos nossos clientes.",
      },
    ],
  },
  areas: {
    eyebrow: "Áreas de atuação",
    description:
      "A L&L Rental é especializada em locação de equipamentos e veículos pra transporte de passageiros em obras e empreendimentos, oferecendo **agilidade, segurança e conforto** em cada operação.",
    items: [
      { id: "area-1", icon: "building", title: "Transporte corporativo e de equipes" },
      { id: "area-2", icon: "hardhat", title: "Obras e frentes de trabalho" },
      { id: "area-3", icon: "users", title: "Eventos e logística de passageiros" },
      { id: "area-4", icon: "route", title: "Traslados e viagens programadas" },
      {
        id: "area-5",
        icon: "calendar",
        title: "FROTA : CAMINHÃO MUNCK, VANS, MICRO-ÔNIBUS E ÔNIBUS",
      },
    ],
  },
  gallery: {
    enabled: false,
    eyebrow: "Galeria",
    title: "Nossa frota em **operação**",
    images: [],
  },
  testimonials: {
    enabled: false,
    eyebrow: "Depoimentos",
    title: "Quem já trabalhou **com a gente**",
    items: [],
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos falar sobre a sua obra",
    description:
      "Solicite um orçamento e receba a melhor solução em locação de equipamentos e transporte corporativo para suas obras.",
    contactName: "Lênon Pagliari Casanova",
    phoneDisplay: "(49) 99109-1289",
    whatsappNumber: "5549991091289",
    whatsappMessage: "Olá! Vim pelo site da L&L Rental e gostaria de solicitar um orçamento.",
    email: "casanovaeng49@gmail.com",
    hours: "",
    addresses: [
      {
        id: "addr-1",
        label: "Matriz",
        text: "Rua Danilo Lucatel, nº 52, Bairro Jardim Alvorada, São Carlos/SC, CEP 89885-000",
      },
      {
        id: "addr-2",
        label: "Filial",
        text: "Av. Paissandu, n° 776, zona 3, Maringá/PR, CEP 87050-130",
      },
    ],
    formButtonLabel: "Enviar mensagem",
  },
  footer: {
    tagline: "Construindo o futuro com inovação e confiança",
    legalName: "L&L Engenharia e Rental LTDA",
  },
  seo: {
    title: "L&L Rental — Locação de Veículos",
    description: "Locação de vans, ônibus, micro-ônibus e munck para grandes obras.",
    siteUrl: "https://www.lelrental.com.br/",
  },
};
