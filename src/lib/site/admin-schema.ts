/**
 * Descrição declarativa do painel.
 *
 * O formulário inteiro do /admin é gerado a partir daqui. Para expor um campo
 * novo ao cliente, acrescente uma entrada nesta lista — nenhum componente
 * precisa ser alterado.
 *
 * `path` é o caminho dentro do SiteContent ("hero.title"). Dentro de uma lista,
 * o caminho é relativo ao item ("title").
 */
import {
  BadgeCheck,
  Building2,
  Contact,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  MessageSquareQuote,
  Sparkles,
  Star,
  Target,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { newId } from "./merge";

export type FieldDef =
  | { kind: "text"; path: string; label: string; hint?: string; placeholder?: string }
  | {
      kind: "textarea";
      path: string;
      label: string;
      rows?: number;
      hint?: string;
      placeholder?: string;
    }
  | { kind: "image"; path: string; label: string; folder: string; hint?: string }
  | { kind: "images"; path: string; label: string; folder: string; hint?: string; max?: number }
  | { kind: "icon"; path: string; label: string; hint?: string }
  | { kind: "switch"; path: string; label: string; hint?: string }
  | {
      kind: "list";
      path: string;
      label: string;
      addLabel: string;
      /** campo do item usado como título do acordeão */
      titlePath: string;
      fields: FieldDef[];
      template: () => Record<string, unknown>;
      max?: number;
      hint?: string;
    };

export type SectionDef = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  fields: FieldDef[];
};

const RICH_HINT = "Use **palavra** para destacar em azul e {{palavras}} para não quebrar a linha.";

export const ADMIN_SCHEMA: [SectionDef, ...SectionDef[]] = [
  {
    id: "identidade",
    label: "Identidade",
    description: "Logo, nome da marca, menu e endereço do site.",
    icon: BadgeCheck,
    fields: [
      { kind: "image", path: "brand.logoUrl", label: "Logo", folder: "marca" },
      {
        kind: "text",
        path: "brand.logoAlt",
        label: "Descrição da logo",
        hint: "Texto lido por leitores de tela e pelo Google.",
      },
      { kind: "text", path: "brand.wordmarkLead", label: "Nome — parte escura" },
      { kind: "text", path: "brand.wordmarkHighlight", label: "Nome — parte azul" },
      {
        kind: "list",
        path: "nav.links",
        label: "Links do menu",
        addLabel: "Adicionar link",
        titlePath: "label",
        max: 6,
        template: () => ({ id: newId("nav"), label: "Nova seção", href: "#" }),
        fields: [
          { kind: "text", path: "label", label: "Texto" },
          {
            kind: "text",
            path: "href",
            label: "Destino",
            hint: "Use #quem-somos, #equipamentos, #atuacao, #contato ou um link completo.",
          },
        ],
      },
      { kind: "text", path: "nav.ctaLabel", label: "Botão do menu — texto" },
      { kind: "text", path: "nav.ctaHref", label: "Botão do menu — destino" },
      { kind: "text", path: "footer.tagline", label: "Frase do rodapé" },
      { kind: "text", path: "footer.legalName", label: "Razão social (rodapé)" },
      { kind: "text", path: "seo.title", label: "Título no Google / aba do navegador" },
      {
        kind: "textarea",
        path: "seo.description",
        label: "Descrição no Google",
        rows: 3,
        hint: "Máximo recomendado: 160 caracteres.",
      },
      { kind: "text", path: "seo.siteUrl", label: "Endereço do site" },
    ],
  },
  {
    id: "hero",
    label: "Topo (Hero)",
    description: "A primeira tela que o visitante vê.",
    icon: LayoutTemplate,
    fields: [
      {
        kind: "image",
        path: "hero.imageUrl",
        label: "Foto principal",
        folder: "hero",
        hint: "Imagem larga (paisagem). Ideal 1600×1000px.",
      },
      { kind: "text", path: "hero.imageAlt", label: "Descrição da foto" },
      { kind: "text", path: "hero.badge", label: "Faixa acima do título" },
      { kind: "textarea", path: "hero.title", label: "Título", rows: 3, hint: RICH_HINT },
      { kind: "textarea", path: "hero.subtitle", label: "Subtítulo", rows: 4 },
      { kind: "text", path: "hero.primaryCtaLabel", label: "Botão principal — texto" },
      { kind: "text", path: "hero.primaryCtaHref", label: "Botão principal — destino" },
      {
        kind: "text",
        path: "hero.secondaryCtaLabel",
        label: "Botão do WhatsApp — texto",
      },
    ],
  },
  {
    id: "quem-somos",
    label: "Quem somos",
    description: "Texto institucional e foto da empresa.",
    icon: Building2,
    fields: [
      { kind: "text", path: "about.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "about.title", label: "Título", hint: RICH_HINT },
      {
        kind: "list",
        path: "about.paragraphs",
        label: "Parágrafos",
        addLabel: "Adicionar parágrafo",
        titlePath: "text",
        template: () => ({ id: newId("about"), text: "" }),
        fields: [{ kind: "textarea", path: "text", label: "Texto", rows: 4 }],
      },
      {
        kind: "list",
        path: "about.bullets",
        label: "Destaques com ✓",
        addLabel: "Adicionar destaque",
        titlePath: "text",
        template: () => ({ id: newId("bullet"), text: "" }),
        fields: [{ kind: "text", path: "text", label: "Texto" }],
      },
      { kind: "image", path: "about.imageUrl", label: "Foto da seção", folder: "quem-somos" },
      { kind: "text", path: "about.imageAlt", label: "Descrição da foto" },
    ],
  },
  {
    id: "missao-visao",
    label: "Missão e Visão",
    description: "Os dois cards sobre fundo escuro.",
    icon: Target,
    fields: [
      { kind: "text", path: "mission.eyebrow", label: "Missão — rótulo" },
      { kind: "textarea", path: "mission.title", label: "Missão — título", rows: 3 },
      {
        kind: "list",
        path: "mission.paragraphs",
        label: "Missão — parágrafos",
        addLabel: "Adicionar parágrafo",
        titlePath: "text",
        template: () => ({ id: newId("mission"), text: "" }),
        fields: [{ kind: "textarea", path: "text", label: "Texto", rows: 3 }],
      },
      { kind: "text", path: "vision.eyebrow", label: "Visão — rótulo" },
      { kind: "textarea", path: "vision.title", label: "Visão — título", rows: 2 },
      {
        kind: "list",
        path: "vision.paragraphs",
        label: "Visão — parágrafos",
        addLabel: "Adicionar parágrafo",
        titlePath: "text",
        template: () => ({ id: newId("vision"), text: "" }),
        fields: [{ kind: "textarea", path: "text", label: "Texto", rows: 3 }],
      },
    ],
  },
  {
    id: "equipamentos",
    label: "Equipamentos",
    description: "Cards da frota, com fotos e mensagem de orçamento.",
    icon: Truck,
    fields: [
      { kind: "text", path: "equipment.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "equipment.title", label: "Título", hint: RICH_HINT },
      {
        kind: "list",
        path: "equipment.items",
        label: "Veículos e equipamentos",
        addLabel: "Adicionar equipamento",
        titlePath: "title",
        template: () => ({
          id: newId("eq"),
          title: "Novo equipamento",
          capacity: "",
          description: "",
          icon: "bus",
          images: [],
          whatsappMessage: "Olá! Gostaria de solicitar um orçamento.",
        }),
        fields: [
          { kind: "text", path: "title", label: "Nome" },
          {
            kind: "text",
            path: "capacity",
            label: "Etiqueta (capacidade)",
            hint: "Ex.: 30 lugares, Cesto aéreo NR12.",
          },
          { kind: "textarea", path: "description", label: "Descrição", rows: 3 },
          { kind: "icon", path: "icon", label: "Ícone" },
          {
            kind: "images",
            path: "images",
            label: "Fotos",
            folder: "equipamentos",
            max: 15,
            hint: "A primeira foto é a capa. Com 2 ou mais, o card vira carrossel.",
          },
          {
            kind: "textarea",
            path: "whatsappMessage",
            label: "Mensagem do botão WhatsApp",
            rows: 3,
          },
        ],
      },
      { kind: "textarea", path: "equipment.note", label: "Aviso em destaque", rows: 3 },
    ],
  },
  {
    id: "valores",
    label: "Valores",
    description: "Cards de valores da empresa.",
    icon: Star,
    fields: [
      { kind: "text", path: "values.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "values.title", label: "Título", hint: RICH_HINT },
      {
        kind: "list",
        path: "values.items",
        label: "Valores",
        addLabel: "Adicionar valor",
        titlePath: "title",
        template: () => ({ id: newId("val"), icon: "shield", title: "Novo valor", description: "" }),
        fields: [
          { kind: "icon", path: "icon", label: "Ícone" },
          { kind: "text", path: "title", label: "Título" },
          { kind: "textarea", path: "description", label: "Descrição", rows: 3 },
        ],
      },
    ],
  },
  {
    id: "ofertas",
    label: "O que oferecemos",
    description: "Os quatro blocos numerados.",
    icon: ListChecks,
    fields: [
      { kind: "text", path: "offers.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "offers.title", label: "Título", hint: RICH_HINT },
      {
        kind: "list",
        path: "offers.items",
        label: "Blocos",
        addLabel: "Adicionar bloco",
        titlePath: "title",
        template: () => ({ id: newId("off"), number: "05", title: "Novo bloco", description: "" }),
        fields: [
          { kind: "text", path: "number", label: "Número" },
          { kind: "text", path: "title", label: "Título" },
          { kind: "textarea", path: "description", label: "Descrição", rows: 3 },
        ],
      },
    ],
  },
  {
    id: "atuacao",
    label: "Áreas de atuação",
    description: "Texto de abertura e cards com ícone.",
    icon: Sparkles,
    fields: [
      { kind: "text", path: "areas.eyebrow", label: "Rótulo da seção" },
      {
        kind: "textarea",
        path: "areas.description",
        label: "Texto de abertura",
        rows: 4,
        hint: "Use **palavra** para destacar em azul e itálico.",
      },
      {
        kind: "list",
        path: "areas.items",
        label: "Áreas",
        addLabel: "Adicionar área",
        titlePath: "title",
        template: () => ({ id: newId("area"), icon: "building", title: "Nova área" }),
        fields: [
          { kind: "icon", path: "icon", label: "Ícone" },
          { kind: "text", path: "title", label: "Título" },
        ],
      },
    ],
  },
  {
    id: "galeria",
    label: "Galeria",
    description: "Seção extra de fotos. Fica escondida enquanto estiver desligada.",
    icon: ImageIcon,
    fields: [
      { kind: "switch", path: "gallery.enabled", label: "Mostrar a galeria no site" },
      { kind: "text", path: "gallery.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "gallery.title", label: "Título", hint: RICH_HINT },
      {
        kind: "images",
        path: "gallery.images",
        label: "Fotos da galeria",
        folder: "galeria",
        max: 24,
      },
    ],
  },
  {
    id: "depoimentos",
    label: "Depoimentos",
    description: "Opiniões de clientes. Fica escondida enquanto estiver desligada.",
    icon: MessageSquareQuote,
    fields: [
      { kind: "switch", path: "testimonials.enabled", label: "Mostrar depoimentos no site" },
      { kind: "text", path: "testimonials.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "testimonials.title", label: "Título", hint: RICH_HINT },
      {
        kind: "list",
        path: "testimonials.items",
        label: "Depoimentos",
        addLabel: "Adicionar depoimento",
        titlePath: "name",
        template: () => ({
          id: newId("dep"),
          name: "Nome do cliente",
          role: "",
          quote: "",
          avatarUrl: "",
        }),
        fields: [
          { kind: "text", path: "name", label: "Nome" },
          { kind: "text", path: "role", label: "Cargo / empresa" },
          { kind: "textarea", path: "quote", label: "Depoimento", rows: 4 },
          { kind: "image", path: "avatarUrl", label: "Foto (opcional)", folder: "depoimentos" },
        ],
      },
    ],
  },
  {
    id: "contato",
    label: "Contato",
    description: "WhatsApp, telefone, e-mail, endereços e horário.",
    icon: Contact,
    fields: [
      { kind: "text", path: "contact.eyebrow", label: "Rótulo da seção" },
      { kind: "text", path: "contact.title", label: "Título" },
      { kind: "textarea", path: "contact.description", label: "Texto de apoio", rows: 3 },
      { kind: "text", path: "contact.contactName", label: "Pessoa de contato" },
      {
        kind: "text",
        path: "contact.whatsappNumber",
        label: "WhatsApp (só números, com DDI)",
        placeholder: "5549991091289",
        hint: "55 + DDD + número. É o número usado em todos os botões de WhatsApp do site.",
      },
      {
        kind: "text",
        path: "contact.phoneDisplay",
        label: "Telefone como aparece no site",
        placeholder: "(49) 99109-1289",
      },
      {
        kind: "textarea",
        path: "contact.whatsappMessage",
        label: "Mensagem automática do WhatsApp",
        rows: 3,
      },
      { kind: "text", path: "contact.email", label: "E-mail" },
      {
        kind: "textarea",
        path: "contact.hours",
        label: "Horário de funcionamento",
        rows: 3,
        hint: "Deixe em branco para não mostrar. Uma linha por dia funciona bem.",
      },
      {
        kind: "list",
        path: "contact.addresses",
        label: "Endereços",
        addLabel: "Adicionar endereço",
        titlePath: "label",
        template: () => ({ id: newId("addr"), label: "Filial", text: "" }),
        fields: [
          { kind: "text", path: "label", label: "Rótulo", hint: "Ex.: Matriz, Filial." },
          { kind: "textarea", path: "text", label: "Endereço completo", rows: 2 },
        ],
      },
      { kind: "text", path: "contact.formButtonLabel", label: "Botão do formulário" },
    ],
  },
];
