import type { Product, Category } from './products';
import type { CatalogItemType } from '../config/shop';

export function getCatalogType(item: Product): CatalogItemType {
  if (item.catalogType === 'service') return 'service';
  if (item.catalogType === 'product') return 'product';
  if (Array.isArray(item.tags) && item.tags.includes('service')) return 'service';
  const cat = item.category;
  const name = (typeof cat === 'string' ? cat : cat?.name || '').toLowerCase();
  if (name.includes('service') || name.includes('consulting') || name.includes('repair')) {
    return 'service';
  }
  return 'product';
}

export function isService(item: Product): boolean {
  return getCatalogType(item) === 'service';
}

export function isProduct(item: Product): boolean {
  return getCatalogType(item) === 'product';
}

export function filterByCatalogType(
  items: Product[],
  type: CatalogItemType | 'all'
): Product[] {
  if (type === 'all') return items;
  return items.filter((item) => getCatalogType(item) === type);
}

export function pickProducts(
  products: Product[],
  predicate: (p: Product) => boolean,
  limit = 8
): Product[] {
  const matched = products.filter(predicate);
  if (matched.length > 0) return matched.slice(0, limit);
  return products.slice(0, limit);
}

export function getPhysicalProducts(products: Product[], limit = 8) {
  const physical = products.filter(isProduct);
  return physical.slice(0, limit);
}

export function getServiceOfferings(products: Product[], limit = 8) {
  const services = products.filter(isService);
  return services.slice(0, limit);
}

export function getBestSellerProducts(products: Product[], limit = 8) {
  return pickProducts(
    filterByCatalogType(products, 'product'),
    (p) => !!p.isBestSeller,
    limit
  );
}

export function getNewArrivalProducts(products: Product[], limit = 8) {
  return pickProducts(products, (p) => !!p.isNewlyLaunched, limit);
}

export function getMegaOfferProducts(products: Product[], limit = 8) {
  return pickProducts(products, (p) => !!p.isMegaOffer, limit);
}

export function getComboProducts(products: Product[], limit = 8) {
  return pickProducts(
    products,
    (p) => !!p.isCombo || (Array.isArray(p.tags) && p.tags.includes('combo')),
    limit
  );
}

export function getFeaturedServices(products: Product[], limit = 8) {
  return pickProducts(
    filterByCatalogType(products, 'service'),
    (p) =>
      !!(p as { isFeatured?: boolean }).isFeatured ||
      !!p.isBestSeller ||
      !!p.isNewlyLaunched ||
      (Array.isArray(p.tags) &&
        (p.tags.includes('featured') || p.tags.includes('bestseller'))),
    limit
  );
}

export function getProductsByCategorySlug(products: Product[], slug: string, limit = 12) {
  const normalized = slug.toLowerCase();
  return pickProducts(products, (p) => {
    const cat = p.category;
    const name = typeof cat === 'string' ? cat : cat?.name || '';
    const catSlug = typeof cat === 'object' ? cat?.slug || name : name;
    return (
      name.toLowerCase() === normalized ||
      String(catSlug).toLowerCase() === normalized ||
      name.toLowerCase().includes(normalized)
    );
  }, limit);
}

export function getCategoryLabel(product: Product): string {
  const cat = product.category;
  if (typeof cat === 'string' && cat.trim()) return cat.trim();
  if (cat && typeof cat === 'object' && cat.name) return String(cat.name).trim();
  return 'Other';
}

export function getCategorySlug(product: Product): string {
  const cat = product.category;
  if (cat && typeof cat === 'object' && cat.slug) {
    return String(cat.slug).toLowerCase();
  }
  return getCategoryLabel(product).toLowerCase().replace(/\s+/g, '-');
}

export type CategoryGroup = {
  key: string;
  name: string;
  slug: string;
  items: Product[];
};

export function groupProductsByCategory(
  items: Product[],
  categoryOrder: Category[] = []
): CategoryGroup[] {
  const orderIndex = new Map<string, number>();
  categoryOrder.forEach((category, index) => {
    orderIndex.set(category.name.toLowerCase(), index);
    if (category.slug) orderIndex.set(category.slug.toLowerCase(), index);
  });

  const groups = new Map<string, CategoryGroup>();
  for (const item of items) {
    const name = getCategoryLabel(item);
    const key = name.toLowerCase();
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name,
        slug: getCategorySlug(item),
        items: [],
      });
    }
    groups.get(key)!.items.push(item);
  }

  return Array.from(groups.values()).sort((a, b) => {
    const ai = orderIndex.has(a.key) ? orderIndex.get(a.key)! : 9999;
    const bi = orderIndex.has(b.key) ? orderIndex.get(b.key)! : 9999;
    if (ai !== bi) return ai - bi;
    return a.name.localeCompare(b.name);
  });
}
