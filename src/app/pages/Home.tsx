import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { TrustBadges } from '../components/TrustBadges';

export function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <TrustBadges />
    </main>
  );
}
