import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { SectionHeader } from './SectionHeader';
import { shop, categoryPath } from '../config/shop';

export function CategorySection() {
  const navigate = useNavigate();
  const { categories } = useShop();

  return (
    <section className="section-pad bg-card/50">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Browse"
          title="Shop by category"
          subtitle={
            shop.isDualCatalog
              ? `Products to buy and services to book — all at ${shop.name}`
              : `Find the right ${shop.catalog.plural} for you at ${shop.name}`
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((category, index) => (
            <motion.button
              key={category._id || category.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(categoryPath(category))}
              className="group text-left card-surface-hover overflow-hidden p-0"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
