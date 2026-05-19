import type { Category } from '../data/products';

function env(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export type CatalogKind = 'products' | 'services' | 'items' | 'both';
export type CatalogItemType = 'product' | 'service';

const catalogLabels = {
  products: {
    singular: 'product',
    plural: 'products',
    title: 'Products',
  },
  services: {
    singular: 'service',
    plural: 'services',
    title: 'Services',
  },
  items: {
    singular: 'item',
    plural: 'items',
    title: 'Items',
  },
  both: {
    singular: 'listing',
    plural: 'products & services',
    title: 'Products & Services',
  },
} as const;

function parseCatalogKind(raw: string): CatalogKind {
  const normalized = raw.toLowerCase();
  if (
    normalized === 'both' ||
    normalized === 'products-and-services' ||
    normalized === 'products_services' ||
    normalized === 'all'
  ) {
    return 'both';
  }
  if (normalized === 'services' || normalized === 'service') return 'services';
  if (normalized === 'items' || normalized === 'item') return 'items';
  return 'products';
}

const catalogKind = parseCatalogKind(env('VITE_CATALOG_LABEL', 'both'));

/** Central shop branding — customize via VITE_* env vars in .env */
export const shop = {
  name: env('VITE_SHOP_NAME', 'TBS Veda'),
  tagline: env('VITE_SHOP_TAGLINE', 'The Best Solution'),
  supportEmail: env('VITE_SHOP_SUPPORT_EMAIL', 'support@tbsveda.com'),
  logo: env('VITE_SHOP_LOGO', '/logo-tbs-veda.png'),
  socialHandle: env('VITE_SHOP_SOCIAL_HANDLE', 'tbsveda'),
  catalogKind,
  catalog: catalogLabels[catalogKind],
  products: catalogLabels.products,
  services: catalogLabels.services,
  get isDualCatalog() {
    return this.catalogKind === 'both';
  },
  get pageTitle() {
    return `${this.name} — ${this.tagline}`;
  },
  get logoAlt() {
    return this.pageTitle;
  },
};

export function catalogCount(count: number, type?: CatalogItemType): string {
  if (type === 'product') {
    const label = count === 1 ? shop.products.singular : shop.products.plural;
    return `${count} ${label}`;
  }
  if (type === 'service') {
    const label = count === 1 ? shop.services.singular : shop.services.plural;
    return `${count} ${label}`;
  }
  const label = count === 1 ? shop.catalog.singular : shop.catalog.plural;
  return `${count} ${label}`;
}

export type NavLink = { name: string; path: string };

/** Primary nav: home, categories, product/service shop links when dual, offers, shop-all */
export function buildNavLinks(categories: Category[]): NavLink[] {
  const links: NavLink[] = [{ name: 'HOME', path: '/' }];

  categories
    .filter((c) => c.showInNav !== false)
    .slice(0, shop.isDualCatalog ? 4 : 5)
    .forEach((category) => {
      const slug = (category.slug || category.name).toLowerCase();
      links.push({ name: category.name.toUpperCase(), path: `/category/${slug}` });
    });

  if (shop.isDualCatalog) {
    links.push(
      { name: 'PRODUCTS', path: '/shop?type=product' },
      { name: 'SERVICES', path: '/shop?type=service' },
    );
  }

  links.push(
    { name: 'NEWLY LAUNCHED', path: '/offers/newly-launched' },
    {
      name: shop.isDualCatalog
        ? 'SHOP ALL'
        : `ALL ${shop.catalog.title.toUpperCase()}`,
      path: '/shop',
    },
  );

  return links;
}

export function categoryPath(category: Category): string {
  return `/category/${(category.slug || category.name).toLowerCase()}`;
}
