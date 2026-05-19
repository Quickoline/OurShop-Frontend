import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { normalizeProduct, Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { productApi, serviceApi } from '../services/api';
import { shop, catalogCount } from '../config/shop';

const COLLECTIONS: Record<string, { title: string; query: string }> = {
  electronics: { title: 'Electronics', query: 'electronics' },
  fashion: { title: 'Fashion', query: 'fashion' },
  home: { title: 'Home & Living', query: 'home' },
  beauty: { title: 'Beauty', query: 'beauty' },
  sports: { title: 'Sports', query: 'sports' },
  books: { title: 'Books', query: 'books' },
  'daily-essentials': { title: 'Daily Essentials', query: 'bottle essentials' },
  'gift-ideas': { title: 'Gift Ideas', query: 'gift combo' },
};

export function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const collection = useMemo(() => (slug ? COLLECTIONS[slug] : undefined), [slug]);
  const { products: contextProducts } = useShop();

  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const q = collection?.query || '';

      try {
        if (q) {
          const [productRes, serviceRes] = await Promise.all([
            productApi.search(q, 50),
            serviceApi.search(q, 50).catch(() => ({ success: false, data: [] })),
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
        // fall back
      }

      if (!q) {
        setDisplayProducts(contextProducts);
        setLoading(false);
        return;
      }

      setDisplayProducts(
        contextProducts.filter((p) => {
          const np = normalizeProduct(p);
          const catName =
            typeof p.category === 'string' ? p.category : p.category?.name || '';
          return (
            np.displayName.toLowerCase().includes(q.toLowerCase()) ||
            catName.toLowerCase().includes(q.toLowerCase())
          );
        })
      );
      setLoading(false);
    };

    run();
  }, [collection, contextProducts]);

  if (!collection) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Collection not found</h1>
        <p className="text-muted-foreground mt-2">
          This collection doesn’t exist. Please choose a valid category.
        </p>
        <div className="mt-6">
          <Link to="/shop" className="text-primary font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-8">
        <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">{collection.title}</h1>
        <p className="text-muted-foreground text-lg">
          {loading ? 'Loading...' : `${catalogCount(displayProducts.length)} found`}
        </p>
      </div>

      {displayProducts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No {shop.catalog.plural} found</p>
          <Link to="/shop" className="text-primary hover:underline font-medium block mt-3">
            Browse all {shop.catalog.plural} →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
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

