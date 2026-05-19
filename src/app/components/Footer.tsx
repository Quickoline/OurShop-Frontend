import { useState } from 'react';
import { Heart, Mail, Instagram, Facebook } from 'lucide-react';
import { newsletterApi } from '../services/api';
import { useShop } from '../context/ShopContext';
import { shop, categoryPath } from '../config/shop';

export function Footer() {
  const { categories } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    null | { type: 'success' | 'error'; message: string }
  >(null);
  const [newsletterPreviewUrl, setNewsletterPreviewUrl] = useState<string | null>(null);

  const shopAllLinks =
    categories.length > 0
      ? categories.map((category) => ({
          label: category.name,
          href: categoryPath(category),
        }))
      : [
          { label: `All ${shop.catalog.title}`, href: '/shop' },
          { label: 'Categories', href: '/category' },
        ];

  const footerLinks = {
    shopAll: shopAllLinks,
    discover: [
      { label: 'About Us', href: '/discover/about-us' },
      { label: 'Our Doctors', href: '/discover/our-doctors' },
      { label: 'Our Whitepapers', href: '/discover/our-whitepapers' },
      { label: 'Our Blogs', href: '/discover/our-blogs' },
      { label: 'Our Media Center', href: '/discover/our-media-center' },
      { label: 'Careers', href: '/discover/careers' },
    ],
    offers: [
      { label: 'Mega Offers', href: '/offers/mega-offers' },
      { label: 'Combos & Gifts', href: '/offers/combos-gifts' },
      { label: 'Bestsellers', href: '/offers/bestsellers' },
      { label: 'Newly Launched', href: '/offers/newly-launched' },
    ],
    bottom: [
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Shipping', href: '/policy/shipping' },
      { label: 'Refund & Cancellation', href: '/policy/refund-cancellation' },
    ],
  };

  return (
    <footer className="bg-foreground text-slate-300 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 pt-10 sm:pt-12">
        {/* Top grid (like screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Shop All</h4>
            <ul className="space-y-2.5">
              {footerLinks.shopAll.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-400 hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {footerLinks.discover.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-400 hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Offers</h4>
            <ul className="space-y-2.5">
              {footerLinks.offers.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-400 hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + contact + social */}
          <div className="lg:pl-6">
            <h4 className="text-sm font-bold text-white mb-3">Join our newsletter</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = newsletterEmail.trim();
                if (!email || !email.includes('@')) {
                  setNewsletterStatus({
                    type: 'error',
                    message: 'Please enter a valid email address.',
                  });
                  return;
                }
                try {
                  const res = await newsletterApi.subscribe(email);
                  setNewsletterPreviewUrl(res?.previewUrl || null);
                  setNewsletterStatus({
                    type: 'success',
                    message:
                      res?.message ||
                      'Confirmation email sent. Please check your inbox to confirm you want to receive email marketing.',
                  });
                  setNewsletterEmail('');
                } catch (err: any) {
                  setNewsletterPreviewUrl(null);
                  setNewsletterStatus({
                    type: 'error',
                    message: err?.message || 'Failed to subscribe. Please try again.',
                  });
                }
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Email Address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus) setNewsletterStatus(null);
                  if (newsletterPreviewUrl) setNewsletterPreviewUrl(null);
                }}
                className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-slate-500 outline-none focus:border-primary transition-colors text-sm"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold tracking-[0.12em] text-xs hover:bg-primary/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            {newsletterStatus && (
              <p
                className={`mt-3 text-sm font-medium ${
                  newsletterStatus.type === 'success'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
            {newsletterPreviewUrl && (
              <a
                href={newsletterPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Open confirmation email (preview)
              </a>
            )}

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-foreground/70" />
                <a
                  href={`mailto:${shop.supportEmail}`}
                  className="break-all hover:text-primary transition-colors"
                >
                  {shop.supportEmail}
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-white mb-3">Follow us</h4>
              <div className="flex items-center gap-4 text-slate-400">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={22} />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium tracking-[0.12em] uppercase hover:text-primary transition-colors"
                >
                  @{shop.socialHandle}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10" />

        {/* Bottom links row */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-slate-500">
          {footerLinks.bottom.map((l, idx) => (
            <div key={l.label} className="flex items-center gap-3">
              <a href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
              {idx !== footerLinks.bottom.length - 1 && (
                <span className="hidden sm:inline text-gray-300">•</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </footer>
  );
}
