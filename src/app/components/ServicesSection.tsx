import { useEffect, useState } from 'react';
import { ProductGridSection } from './ProductGridSection';
import { useShop } from '../context/ShopContext';
import { getFeaturedServices } from '../data/catalogHelpers';
import { shop } from '../config/shop';
import { serviceApi } from '../services/api';
import type { Product } from '../data/products';

export function ServicesSection() {
  const { products } = useShop();
  const [items, setItems] = useState<Product[]>(() => getFeaturedServices(products, 8));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await serviceApi.getFeatured(8);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(
            res.data.map((item: Product) => ({ ...item, catalogType: 'service' as const }))
          );
          return;
        }
      } catch {
        // use merged catalog from context
      }
      setItems(getFeaturedServices(products, 8));
    };
    load();
  }, [products]);

  if (!shop.isDualCatalog && shop.catalogKind !== 'services') {
    return null;
  }

  if (items.length === 0) return null;

  return (
    <ProductGridSection
      label="Services"
      title="Book a service"
      subtitle={`Expert ${shop.services.plural} — home, professional, wellness, and more`}
      products={items}
      viewAllHref="/shop?type=service"
      viewAllLabel={`All ${shop.services.title.toLowerCase()}`}
      className="bg-gradient-to-b from-primary/5 to-transparent"
    />
  );
}
