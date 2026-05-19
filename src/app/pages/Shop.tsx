import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { CatalogTypeTabs } from '../components/CatalogTypeTabs';
import { useShop } from '../context/ShopContext';
import { normalizeProduct, Product } from '../data/products';
import { filterByCatalogType } from '../data/catalogHelpers';
import { productApi, serviceApi } from '../services/api';
import { shop, catalogCount } from '../config/shop';
import type { CatalogItemType } from '../config/shop';

function parseTypeParam(raw: string | null): CatalogItemType | 'all' {
  if (raw === 'product' || raw === 'service') return raw;
  return 'all';
}

export function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeFilter = parseTypeParam(searchParams.get('type'));
  const { products: contextProducts } = useShop();
  const [displayProducts, setDisplayProducts] = useState<Product[]>(contextProducts);
  const [loading, setLoading] = useState(false);

  const filteredByType = useMemo(
    () => filterByCatalogType(displayProducts, typeFilter),
    [displayProducts, typeFilter]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const listParams = { limit: '200', isActive: 'true' };
      try {
        if (query) {
          const searches = await Promise.all([
            productApi.search(query, 50),
            serviceApi.search(query, 50).catch(() => ({ success: false, data: [] })),
          ]);
          const merged = [
            ...(searches[0].success && Array.isArray(searches[0].data)
              ? searches[0].data.map((p: Product) => ({ ...p, catalogType: 'product' as const }))
              : []),
            ...(searches[1].success && Array.isArray(searches[1].data)
              ? searches[1].data.map((p: Product) => ({ ...p, catalogType: 'service' as const }))
              : []),
          ];
          if (merged.length > 0) {
            setDisplayProducts(merged);
            setLoading(false);
            return;
          }
        } else if (typeFilter === 'service') {
          const res = await serviceApi.getAll(listParams);
          if (res.success && res.data?.length > 0) {
            setDisplayProducts(
              res.data.map((p: Product) => ({ ...p, catalogType: 'service' as const }))
            );
            setLoading(false);
            return;
          }
        } else if (typeFilter === 'product') {
          const res = await productApi.getAll(listParams);
          if (res.success && res.data?.length > 0) {
            setDisplayProducts(
              res.data.map((p: Product) => ({ ...p, catalogType: 'product' as const }))
            );
            setLoading(false);
            return;
          }
        } else {
          const [productRes, serviceRes] = await Promise.all([
            productApi.getAll(listParams),
            serviceApi.getAll(listParams).catch(() => ({ success: false, data: [] })),
          ]);
          const merged = [
            ...(productRes.success && Array.isArray(productRes.data)
              ? productRes.data.map((p: Product) => ({ ...p, catalogType: 'product' as const }))
              : []),
            ...(serviceRes.success && Array.isArray(serviceRes.data)
              ? serviceRes.data.map((p: Product) => ({ ...p, catalogType: 'service' as const }))
              : []),
          ];
          if (merged.length > 0) {
            setDisplayProducts(merged);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to context/fallback
      }

      if (query) {
        setDisplayProducts(
          contextProducts.filter((p) => {
            const np = normalizeProduct(p);
            const catName = typeof p.category === 'string' ? p.category : p.category?.name || '';
            return (
              np.displayName.toLowerCase().includes(query.toLowerCase()) ||
              catName.toLowerCase().includes(query.toLowerCase())
            );
          })
        );
      } else {
        setDisplayProducts(contextProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query, contextProducts]);

  const pageTitle = useMemo(() => {
    if (query) return `Results for "${query}"`;
    if (typeFilter === 'product') return `All ${shop.products.title}`;
    if (typeFilter === 'service') return `All ${shop.services.title}`;
    return shop.isDualCatalog ? shop.catalog.title : `All ${shop.catalog.title}`;
  }, [query, typeFilter]);

  const countLabel = useMemo(() => {
    if (loading) return 'Loading...';
    const type = typeFilter === 'all' ? undefined : typeFilter;
    return `${catalogCount(filteredByType.length, type)} found`;
  }, [loading, filteredByType.length, typeFilter]);

  return (
    <main className="page-shell">
      <div className="mb-6">
        <span className="section-label">{shop.name}</span>
        <h1 className="section-title">{pageTitle}</h1>
        <p className="section-subtitle mt-2">{countLabel}</p>
      </div>

      <CatalogTypeTabs />

      {filteredByType.length === 0 && !loading ? (
        <div className="text-center py-20 card-surface">
          <p className="text-xl text-muted-foreground">
            No {typeFilter === 'service' ? shop.services.plural : typeFilter === 'product' ? shop.products.plural : shop.catalog.plural} found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredByType.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
