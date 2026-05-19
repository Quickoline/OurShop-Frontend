import { ProductGridSection } from './ProductGridSection';
import { useShop } from '../context/ShopContext';
import { getNewArrivalProducts } from '../data/catalogHelpers';
import { shop } from '../config/shop';

export function NewArrivalsSection() {
  const { products } = useShop();
  const items = getNewArrivalProducts(products, 8);

  return (
    <ProductGridSection
      label="Just in"
      title="New arrivals"
      subtitle={`Fresh ${shop.catalog.plural} added to our catalog`}
      products={items}
      viewAllHref="/offers/newly-launched"
      viewAllLabel="Shop new arrivals"
      className="bg-card/50"
    />
  );
}
