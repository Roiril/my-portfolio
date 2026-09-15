import { Hero } from '@/features/hero';
import { About } from '@/features/about';
import { Works } from '@/features/works';
import { Links } from '@/features/links';
import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Works />
        <About />
        <Links />
      </main>
      <Footer />
    </>
  );
}
