import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SectionHeader } from './SectionHeader';
import { shop, categoryPath } from '../config/shop';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1642425777032-0b2249756797?w=800';

export function LifestyleSection() {
  const navigate = useNavigate();
  const { categories } = useShop();

  const cards =
    categories.length > 0
      ? categories.slice(0, 4).map((category, index) => ({
          id: category._id || category.id || index,
          title: category.name,
          image: category.image || FALLBACK_IMAGE,
          link: categoryPath(category),
        }))
      : [
          {
            id: 'shop',
            title: `All ${shop.catalog.title}`,
            image: FALLBACK_IMAGE,
            link: '/shop',
          },
        ];

  return (
    <section className="section-pad">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Collections"
          title="Explore more"
          subtitle={`Curated ${shop.catalog.plural} for every need`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              onClick={() => navigate(card.link)}
              className="group relative rounded-2xl overflow-hidden h-48 sm:h-56 text-left"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
                  {card.title}
                </h3>
                <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
