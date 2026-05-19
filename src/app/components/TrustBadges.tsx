import { motion } from 'motion/react';
import { ShieldCheck, Truck, BadgeCheck, Headphones } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { shop } from '../config/shop';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    description: 'Encrypted checkout and trusted gateways',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
    description: 'Reliable shipping to your doorstep',
  },
  {
    icon: BadgeCheck,
    title: `Verified ${shop.catalog.title.toLowerCase()}`,
    description: `Quality ${shop.catalog.plural} from ${shop.name}`,
  },
  {
    icon: Headphones,
    title: 'Dedicated support',
    description: 'We are here when you need help',
  },
];

export function TrustBadges() {
  return (
    <section className="section-pad bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Why us"
          title={`Why choose ${shop.name}`}
          subtitle="Built for a smooth shopping experience from browse to delivery"
          className="[&_.section-title]:text-white [&_.section-subtitle]:text-slate-400 [&_.section-label]:text-teal-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-white mb-2">{badge.title}</h3>
                <p className="text-sm text-slate-400">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
