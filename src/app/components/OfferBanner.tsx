import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { shop } from '../config/shop';

export function OfferBanner() {
  return (
    <section className="section-pad">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-600 to-indigo-600 p-8 sm:p-12 lg:p-14"
        >
          <div className="mesh-blob w-64 h-64 bg-white top-0 right-0 opacity-20" />
          <div className="relative z-10 max-w-xl">
            <span className="badge-pill bg-white/20 text-white border border-white/30 mb-4">
              <Tag size={14} className="inline mr-1" />
              Limited offer
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Up to 60% off selected{' '}
              {shop.isDualCatalog ? 'products & services' : shop.catalog.plural}
            </h2>
            <p className="mt-4 text-white/85 text-lg">
              Don&apos;t miss exclusive deals on products and bookable services at {shop.name}.
            </p>
            <Link
              to="/offers/mega-offers"
              className="inline-flex items-center gap-2 mt-8 rounded-xl bg-white text-foreground font-bold px-8 py-3.5 hover:bg-white/90 transition-all shadow-lg"
            >
              View offers
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
