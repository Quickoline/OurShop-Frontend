import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { SectionHeader } from './SectionHeader';

type ProductGridSectionProps = {
  label: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  columns?: 'default' | 'wide';
};

export function ProductGridSection({
  label,
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = 'View all',
  className = '',
  columns = 'default',
}: ProductGridSectionProps) {
  if (products.length === 0) return null;

  const gridClass =
    columns === 'wide'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6';

  return (
    <section className={`section-pad ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <SectionHeader
            label={label}
            title={title}
            subtitle={subtitle}
            align="left"
            className="mb-0"
          />
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
            >
              {viewAllLabel}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className={gridClass}>
          {products.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
