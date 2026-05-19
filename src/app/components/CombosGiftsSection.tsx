import { ProductGridSection } from './ProductGridSection';
import { useShop } from '../context/ShopContext';
import { getComboProducts } from '../data/catalogHelpers';
import { shop } from '../config/shop';

export function CombosGiftsSection() {
  const { products } = useShop();
  const items = getComboProducts(products, 4);

  return (
    <ProductGridSection
      label="Bundles"
      title="Combos & gifts"
      subtitle={`Ready-made sets and gift-worthy ${shop.catalog.plural}`}
      products={items}
      viewAllHref="/offers/combos-gifts"
      viewAllLabel="Browse combos"
      className="bg-secondary/40"
      columns="wide"
    />
  );
}
