import {
  Wrench,
  Code2,
  Users,
  Compass,
  Palette,
  ChefHat,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '@/types';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  accent: string;
  gradient: string;
  ring: string;
  chipBg: string;
  chipText: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  'life-hack': {
    label: 'Life Hacks',
    icon: Wrench,
    accent: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-400/60',
    chipBg: 'bg-amber-100',
    chipText: 'text-amber-700',
  },
  'tech-work': {
    label: 'Tech & Work',
    icon: Code2,
    accent: 'text-sky-600',
    gradient: 'from-sky-500 to-blue-600',
    ring: 'ring-sky-400/60',
    chipBg: 'bg-sky-100',
    chipText: 'text-sky-700',
  },
  social: {
    label: 'Social',
    icon: Users,
    accent: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-600',
    ring: 'ring-rose-400/60',
    chipBg: 'bg-rose-100',
    chipText: 'text-rose-700',
  },
  survival: {
    label: 'Survival',
    icon: Compass,
    accent: 'text-emerald-700',
    gradient: 'from-emerald-500 to-green-700',
    ring: 'ring-emerald-400/60',
    chipBg: 'bg-emerald-100',
    chipText: 'text-emerald-700',
  },
  creative: {
    label: 'Creative',
    icon: Palette,
    accent: 'text-fuchsia-600',
    gradient: 'from-fuchsia-500 to-pink-600',
    ring: 'ring-fuchsia-400/60',
    chipBg: 'bg-fuchsia-100',
    chipText: 'text-fuchsia-700',
  },
  kitchen: {
    label: 'Kitchen',
    icon: ChefHat,
    accent: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    ring: 'ring-orange-400/60',
    chipBg: 'bg-orange-100',
    chipText: 'text-orange-700',
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES) as [
  Category,
  CategoryMeta,
][];

export function categoryMeta(c: Category): CategoryMeta {
  return CATEGORIES[c];
}
