import { Mail } from 'lucide-react';
import { shop } from '../config/shop';

const quickLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/category' },
  { label: 'About', href: '/discover/about-us' },
  { label: 'Mega Offers', href: '/offers/mega-offers' },
  { label: 'Contact', href: '/contact' },
  { label: '📱 Download App', href: '/download-app' },
  { label: '📢 महत्वपूर्ण सूचना (Important Notice)', href: '/important-notice' },
];

const policyLinks = [
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Shipping', href: '/policy/shipping' },
  { label: 'Refund & Cancellation', href: '/policy/refund-cancellation' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-slate-300 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="max-w-md">
            <p className="text-lg font-bold text-white">{shop.name}</p>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {shop.tagline}. Shop products and book services in one place.
            </p>
            <a
              href={`mailto:${shop.supportEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-colors"
            >
              <Mail size={16} className="shrink-0" />
              <span>{shop.supportEmail}</span>
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Quick links</h4>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-slate-500">
          {policyLinks.map((link, idx) => (
            <div key={link.href} className="flex items-center gap-3">
              <a href={link.href} className="hover:text-primary transition-colors">
                {link.label}
              </a>
              {idx !== policyLinks.length - 1 && (
                <span className="hidden sm:inline text-slate-600">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Google API & Application Purpose Disclosure */}
        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 leading-relaxed text-left max-w-4xl mx-auto">
          <p className="font-semibold text-slate-300">
            About {shop.name} &amp; Google API Compliance:
          </p>
          <p className="mt-1">
            {shop.name} is an e-commerce platform that allows users to shop daily essentials, groceries, and trusted local services with transparent pricing. Google Drive APIs are used solely by authorized store merchants and administrators for cloud storage and management of product and service catalog media (photos and videos).
          </p>
          <p className="mt-1">
            {shop.name} does not use Google APIs to create, process, generate, host, or distribute Artificial Intelligence (AI) content or AI-generated Non-Consensual Intimate Imagery (AI NCII). All use of Google user data adheres strictly to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </div>
      </div>
    </footer>
  );
}
