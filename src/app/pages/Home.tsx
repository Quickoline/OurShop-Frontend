import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { TrustBadges } from '../components/TrustBadges';
import { shop } from '../config/shop';

export function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      
      {/* About QuickoShop & Application Purpose (Required for Public Verification & Compliance) */}
      <section className="bg-slate-50 py-16 border-t border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="inline-block bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              Open Marketplace &amp; Public Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              About QuickoShop
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-4">
              <strong>QuickoShop</strong> is an open e-commerce platform that connects local customers with neighborhood stores, everyday groceries, fresh produce, and trusted home and professional services. With transparent pricing, flexible payment methods, and fast doorstep delivery, our mission is to make daily shopping seamless.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong>Open Public Access:</strong> No account or login is required to browse products, explore categories, inspect pricing, or view service details on QuickoShop.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Google API Services User Data Policy &amp; AI NCII Non-Use Declaration
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              QuickoShop integrates with Google APIs, specifically the <strong>Google Drive API</strong>, exclusively for store administrators and authorized merchants to upload, store, and stream product catalog images and service promotional media.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              <strong>Strict AI NCII Commitment:</strong> QuickoShop does <strong>NOT</strong> use Google APIs, user data, or Google Drive storage to create, train, process, generate, host, or distribute Artificial Intelligence (AI) models, synthetic media, or AI-generated Non-Consensual Intimate Imagery (AI NCII). All usage strictly complies with the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium underline"
              >
                Google API Services User Data Policy
              </a>
              , including Limited Use requirements.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 text-sm font-semibold">
              <Link to="/shop" className="text-primary hover:underline">
                Explore Catalog &rarr;
              </Link>
              <Link to="/privacy-policy" className="text-slate-600 hover:text-slate-900">
                Privacy Policy &rarr;
              </Link>
              <Link to="/terms-and-conditions" className="text-slate-600 hover:text-slate-900">
                Terms of Service &rarr;
              </Link>
              <Link to="/download-app" className="text-slate-600 hover:text-slate-900">
                Download App &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />
    </main>
  );
}
