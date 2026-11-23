import { motion } from 'motion/react';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { shop } from '../config/shop';

export function HeroSection() {
  return (
    <section className="relative mt-[4.5rem] sm:mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-foreground">
        <div className="mesh-blob w-96 h-96 bg-primary top-0 -left-32" />
        <div className="mesh-blob w-80 h-80 bg-indigo-500 bottom-0 right-0 opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(12_18_34/0.92)_0%,rgb(15_118_110/0.75)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-16 items-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="badge-pill bg-white/10 text-teal-200 border border-white/20 mb-6">
              <Sparkles size={14} className="mr-1.5 inline" />
              {shop.name}
            </span>

            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              {shop.tagline}
              <span className="block mt-2 bg-gradient-to-r from-teal-300 to-emerald-200 bg-clip-text text-transparent">
                {shop.isDualCatalog ? 'Products & services' : shop.catalog.title.toLowerCase()}
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {shop.isDualCatalog
                ? 'Shop physical products with fast delivery, or book trusted services for home, business, and wellness — all in one place.'
                : `Browse our ${shop.catalog.plural} with secure checkout and reliable support.`}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {shop.isDualCatalog ? (
                <>
                  <Link to="/shop?type=product" className="btn-primary text-base px-8 py-3.5">
                    Shop {shop.products.title}
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/download-app"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 backdrop-blur-sm hover:bg-white/10 transition-all"
                  >
                    <Download size={18} />
                    Download App
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/shop" className="btn-primary text-base px-8 py-3.5">
                    Explore {shop.catalog.title}
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/download-app"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 text-white font-semibold px-8 py-3.5 backdrop-blur-sm hover:bg-white/10 transition-all"
                  >
                    <Download size={18} />
                    Download App
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
