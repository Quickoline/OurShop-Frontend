import { Link, useSearchParams } from 'react-router-dom';
import { shop } from '../config/shop';

type CatalogTypeTabsProps = {
  basePath?: string;
};

export function CatalogTypeTabs({ basePath = '/shop' }: CatalogTypeTabsProps) {
  const [searchParams] = useSearchParams();
  const current = searchParams.get('type') || 'all';
  const q = searchParams.get('q');

  const buildHref = (type: string) => {
    const params = new URLSearchParams();
    if (type !== 'all') params.set('type', type);
    if (q) params.set('q', q);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  if (!shop.isDualCatalog) return null;

  const tabs = [
    { id: 'all', label: `All` },
    { id: 'product', label: shop.products.title },
    { id: 'service', label: shop.services.title },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={buildHref(tab.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            current === tab.id
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
