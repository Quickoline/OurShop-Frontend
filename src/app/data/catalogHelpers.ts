import type { Product } from './products';
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
