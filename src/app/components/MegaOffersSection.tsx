import { ProductGridSection } from './ProductGridSection';
import { useShop } from '../context/ShopContext';
import { getMegaOfferProducts } from '../data/catalogHelpers';
import { shop } from '../config/shop';

export function MegaOffersSection() {
  const { products } = useShop();
  const items = getMegaOfferProducts(products, 8);

  return (
    <ProductGridSection
      label="Deals"
      title="Mega offers"
      subtitle={`Save big on selected ${shop.catalog.plural}`}
      products={items}
      viewAllHref="/offers/mega-offers"
      viewAllLabel="View all deals"
    />
  );
}
