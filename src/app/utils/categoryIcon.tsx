import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  Dumbbell,
  Flower2,
  Grid3x3,
  HeartPulse,
  Home,
  Layers,
  Package,
  Shirt,
  Smartphone,
  Sparkles,
  Tag,
  Wrench,
} from 'lucide-react';

type CategoryLike = {
  name: string;
  slug?: string;
};

type CategoryVisual = {
  Icon: LucideIcon;
  gradient: string;
  iconClass: string;
};

const GRADIENTS = [
  {
    gradient: 'from-teal-500/20 via-emerald-100/60 to-white',
    iconClass: 'text-teal-700',
  },
  {
    gradient: 'from-indigo-500/20 via-indigo-100/60 to-white',
    iconClass: 'text-indigo-700',
  },
  {
    gradient: 'from-amber-500/20 via-amber-100/60 to-white',
    iconClass: 'text-amber-700',
  },
  {
    gradient: 'from-rose-500/20 via-rose-100/60 to-white',
    iconClass: 'text-rose-700',
  },
  {
    gradient: 'from-sky-500/20 via-sky-100/60 to-white',
    iconClass: 'text-sky-700',
  },
  {
    gradient: 'from-violet-500/20 via-violet-100/60 to-white',
    iconClass: 'text-violet-700',
  },
];

const FALLBACK_ICONS: LucideIcon[] = [Package, Grid3x3, Tag, Layers];

const SLUG_ICON_RULES: Array<{ match: RegExp; Icon: LucideIcon }> = [
  { match: /electronic|phone|gadget|tech|audio/, Icon: Smartphone },
  { match: /fashion|cloth|apparel|wear/, Icon: Shirt },
  { match: /home(?!-service)|living|decor|kitchen|furniture/, Icon: Home },
  { match: /beauty|skin|makeup|care|cosmetic/, Icon: Sparkles },
  { match: /sport|fitness|outdoor|gym/, Icon: Dumbbell },
  { match: /book|read|media/, Icon: BookOpen },
  { match: /home-service|clean|repair|plumb|install/, Icon: Wrench },
  { match: /professional|business|consult|design|legal/, Icon: Briefcase },
  { match: /wellness|spa|health|train|yoga/, Icon: HeartPulse },
  { match: /service|book/, Icon: Wrench },
  { match: /gift|combo|bundle/, Icon: Flower2 },
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeKey = (category: CategoryLike) =>
  `${category.slug || category.name}`.trim().toLowerCase();

const pickIcon = (key: string): LucideIcon => {
  for (const rule of SLUG_ICON_RULES) {
    if (rule.match.test(key)) return rule.Icon;
  }
  return FALLBACK_ICONS[hashString(key) % FALLBACK_ICONS.length];
};

export const getCategoryVisual = (category: CategoryLike): CategoryVisual => {
  const key = normalizeKey(category);
  const palette = GRADIENTS[hashString(key) % GRADIENTS.length];
  return {
    Icon: pickIcon(key),
    gradient: palette.gradient,
    iconClass: palette.iconClass,
  };
};

type CategoryIconProps = {
  category: CategoryLike;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'xl' | 'full' | '2xl';
  className?: string;
};

const SIZE_MAP = {
  sm: { box: 'h-12 w-12', icon: 22 },
  md: { box: 'h-16 w-16', icon: 28 },
  lg: { box: 'h-20 w-20 sm:h-24 sm:w-24', icon: 36 },
};

export function CategoryIcon({
  category,
  size = 'lg',
  rounded = '2xl',
  className = '',
}: CategoryIconProps) {
  const { Icon, gradient, iconClass } = getCategoryVisual(category);
  const dims = SIZE_MAP[size];
  const roundClass =
    rounded === 'full' ? 'rounded-full' : rounded === 'xl' ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${roundClass} ${dims.box} ${className}`}
      aria-hidden="true"
    >
      <Icon size={dims.icon} className={iconClass} strokeWidth={1.75} />
    </div>
  );
}
