/**
 * Ícones disponíveis para os cards editáveis.
 * Para oferecer um ícone novo no painel, basta adicionar uma entrada aqui.
 */
import {
  Bus,
  Truck,
  Users,
  Building2,
  HardHat,
  CalendarClock,
  Route as RouteIcon,
  ShieldCheck,
  Handshake,
  Scale,
  TrendingUp,
  Wrench,
  Star,
  Clock,
  MapPin,
  Phone,
  Car,
  Package,
  type LucideIcon,
} from "lucide-react";

export const SITE_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  bus: { label: "Ônibus", Icon: Bus },
  truck: { label: "Caminhão", Icon: Truck },
  car: { label: "Carro / Van", Icon: Car },
  users: { label: "Pessoas", Icon: Users },
  building: { label: "Prédio", Icon: Building2 },
  hardhat: { label: "Capacete de obra", Icon: HardHat },
  calendar: { label: "Agenda", Icon: CalendarClock },
  route: { label: "Rota", Icon: RouteIcon },
  shield: { label: "Escudo / Segurança", Icon: ShieldCheck },
  handshake: { label: "Aperto de mão", Icon: Handshake },
  scale: { label: "Balança / Justiça", Icon: Scale },
  trending: { label: "Crescimento", Icon: TrendingUp },
  wrench: { label: "Manutenção", Icon: Wrench },
  star: { label: "Estrela", Icon: Star },
  clock: { label: "Relógio", Icon: Clock },
  pin: { label: "Localização", Icon: MapPin },
  phone: { label: "Telefone", Icon: Phone },
  package: { label: "Equipamento", Icon: Package },
};

export const ICON_OPTIONS = Object.entries(SITE_ICONS).map(([value, { label }]) => ({
  value,
  label,
}));

export function resolveIcon(name: string | undefined, fallback: LucideIcon = Bus): LucideIcon {
  if (!name) return fallback;
  return SITE_ICONS[name]?.Icon ?? fallback;
}
