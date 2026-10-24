import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../utils/categoryIcon';
import { useScrollRestoration } from '../utils/scroll';

export function CategoryList() {
  const { categories } = useShop();
  useScrollRestoration(false);

  return (
    <main className="container mx-auto px-4 pt-36 pb-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">Shop by Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id || category.id}
            to={`/category/${(category.slug || category.name).toLowerCase()}`}
            className="group block"
          >
            <div className="flex justify-center mb-4">
              <CategoryIcon category={category} size="lg" rounded="full" />
            </div>
            <h3 className="text-center text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
