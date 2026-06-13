import { HomeCta } from '../components/home/HomeCta';
import { HomeFaq } from '../components/home/HomeFaq';
import { HomeFeatures } from '../components/home/HomeFeatures';
import { HomeHero } from '../components/home/HomeHero';
import { HomeNavbar } from '../components/home/HomeLayout';
import { HomeHowItWorks } from '../components/home/HomeHowItWorks';
import { HomePrivacy } from '../components/home/HomePrivacy';
import { HomeProblem } from '../components/home/HomeProblem';

export function HomePage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="fixed inset-x-0 top-4 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <HomeNavbar />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-28">
        <HomeHero />
        <HomeProblem />
        <HomeFeatures />
        <HomeHowItWorks />
        <HomePrivacy />
        <HomeFaq />
        <HomeCta />
      </main>
    </div>
  );
}
