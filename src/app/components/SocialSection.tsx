import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { shop } from '../config/shop';

const socials = [
  { icon: Instagram, name: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: Facebook, name: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: Youtube, name: 'YouTube', href: 'https://www.youtube.com/' },
  { icon: Twitter, name: 'Twitter', href: 'https://twitter.com/' },
];

export function SocialSection() {
  return (
    <section className="section-pad bg-secondary/60">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <SectionHeader
          label="Community"
          title="Connect with us"
          subtitle={`Follow ${shop.name} for updates and exclusive offers`}
        />

        <div className="flex flex-wrap justify-center gap-4">
          {socials.map(({ icon: Icon, name, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="card-surface flex items-center gap-3 px-6 py-4 hover:border-primary/40 transition-colors group"
            >
              <Icon size={22} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-foreground">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
