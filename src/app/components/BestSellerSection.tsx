import { ProductGridSection } from './ProductGridSection';
import { useShop } from '../context/ShopContext';
import { getBestSellerProducts } from '../data/catalogHelpers';
import { shop } from '../config/shop';

export function BestSellerSection() {
  const { products } = useShop();
  const items = getBestSellerProducts(products, 8);

  return (
    <ProductGridSection
      label="Popular"
      title="Best sellers"
      subtitle={
        shop.isDualCatalog
          ? `Top-rated ${shop.products.plural} our customers love`
          : `Top-rated ${shop.catalog.plural} our customers love`
      }
      products={items}
      viewAllHref="/offers/bestsellers"
      viewAllLabel="See all best sellers"
    />
  );
}
