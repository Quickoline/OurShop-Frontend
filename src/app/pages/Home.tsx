import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { BestSellerSection } from '../components/BestSellerSection';
import { ServicesSection } from '../components/ServicesSection';
import { NewArrivalsSection } from '../components/NewArrivalsSection';
import { MegaOffersSection } from '../components/MegaOffersSection';
import { OfferBanner } from '../components/OfferBanner';
import { CombosGiftsSection } from '../components/CombosGiftsSection';
import { TrustBadges } from '../components/TrustBadges';
import { LifestyleSection } from '../components/LifestyleSection';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { SocialSection } from '../components/SocialSection';
import { Newsletter } from '../components/Newsletter';

export function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <BestSellerSection />
      <ServicesSection />
      <NewArrivalsSection />
      <MegaOffersSection />
      <OfferBanner />
      <CombosGiftsSection />
      <TrustBadges />
      <LifestyleSection />
      <TestimonialSlider />
      <SocialSection />
      <Newsletter />
    </main>
  );
}
