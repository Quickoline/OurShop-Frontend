// ── Backend-compatible interfaces ────────────────────────

export interface Product {
  _id: string;
  id?: number;
  title: string;
  name?: string;
  slug?: string;
  imgCover?: string;
  image?: string;
  images?: string[];
  description?: string;
  price: number;
  originalPrice?: number;
  priceAfterDiscount?: number;
  discountPercentage?: number;
  discount?: number;
  quantity?: number;
  capacity?: number;
  sold?: number;
  booked?: number;
  duration?: string;
  unit?: string;
  category: any;
  subcategory?: any;
  brand?: any;
  tags?: string[];
  isBestSeller?: boolean;
  isNewlyLaunched?: boolean;
  isMegaOffer?: boolean;
  isCombo?: boolean;
  isFeatured?: boolean;
  ratingAvg?: number;
  rating?: number;
  ratingCount?: number;
  reviews?: any;
  benefits?: string[];
  ingredients?: string[];
  howToUse?: string;
  soldBy?: string;
  useBy?: string;
  aboutItems?: string[];
  specifications?: Array<{
    group?: string;
    key: string;
    value: string;
  }>;
  sizeOptions?: Array<{
    label: string;
    price?: number;
    mrp?: number;
    perUnitPrice?: number | string;
    savingsPercent?: number;
    isDefault?: boolean;
  }>;
  badge?: string;
  catalogType?: 'product' | 'service';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  icon?: string;
  parentCategory?: string | null;
  displayOrder?: number;
  showInNav?: boolean;
  isActive?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
}

const resolveId = (value: any): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && typeof value.$oid === 'string') return value.$oid;
  return String(value);
};

export function normalizeProduct(p: any): Product & {
  displayName: string;
  displayImage: string;
  displayPrice: number;
  displayOriginalPrice?: number;
  displayDiscount?: number;
  displayRating: number;
  displayReviews: number;
  displayId: string;
} {
  const basePrice = Number(p?.price || 0);
  const rawPriceAfterDiscount = Number(p?.priceAfterDiscount);
  const rawDiscountPercentage = Number(p?.discountPercentage ?? p?.discount);

  const hasPad = Number.isFinite(rawPriceAfterDiscount) && rawPriceAfterDiscount > 0;
  const hasPct = Number.isFinite(rawDiscountPercentage) && rawDiscountPercentage > 0;

  let displayPrice = hasPad ? rawPriceAfterDiscount : basePrice;
  let displayDiscount = 0;

  if (hasPad && basePrice > 0 && rawPriceAfterDiscount <= basePrice) {
    displayDiscount = Math.round(((basePrice - rawPriceAfterDiscount) / basePrice) * 100);
  } else if (hasPct && basePrice > 0) {
    displayDiscount = Math.max(0, Math.min(100, rawDiscountPercentage));
    displayPrice = Number((basePrice - (basePrice * displayDiscount) / 100).toFixed(2));
  }

  return {
    ...p,
    displayId: resolveId(p._id || p.id),
    displayName: p.title || p.name || 'Untitled',
    displayImage: p.imgCover || p.image || '',
    displayPrice,
    displayOriginalPrice: basePrice > displayPrice ? basePrice : p.originalPrice,
    displayDiscount,
    displayRating: p.ratingAvg || p.rating || 0,
    displayReviews: p.ratingCount || (typeof p.reviews === 'number' ? p.reviews : 0),
  };
}

/** Static homepage testimonials (no backend model yet). */
const img = (id: string, w = 200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    image: img('1494790108377-be9c29b29330'),
    rating: 5,
    text: 'The earbuds are fantastic — great battery life and the noise cancellation works perfectly on my commute.',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    image: img('1507003211169-0a1dd7228f2d'),
    rating: 5,
    text: 'Ordered a fitness watch and running shoes. Both arrived quickly and quality exceeded expectations.',
  },
  {
    id: 3,
    name: 'Ananya Iyer',
    image: img('1438761681033-6461ffad8d80'),
    rating: 5,
    text: 'Love the skincare gift box! Perfect for gifting. Packaging was beautiful and products feel premium.',
  },
  {
    id: 4,
    name: 'Vikram Patel',
    image: img('1472099645785-5658abf4ff4e'),
    rating: 4,
    text: 'Wide product range at fair prices. The desk lamp and coffee set made my home office setup complete.',
  },
  {
    id: 5,
    name: 'Neha Kapoor',
    image: img('1534528741775-53994a69daeb'),
    rating: 5,
    text: 'Booked home cleaning and AC service — both were professional and on time. Love having products and services in one place.',
  },
];
