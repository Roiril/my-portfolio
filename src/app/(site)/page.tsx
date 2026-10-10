import { Hero } from '@/features/hero';
import { About } from '@/features/about';
import { Works } from '@/features/works';
import { Links } from '@/features/links';
import SiteHeader from '@/components/layout/SiteHeader';
import Footer from '@/components/layout/Footer';
import PatternPlayground from '@/features/play/components/PatternPlayground';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <PatternPlayground />
        <Works />
        <About />
        <Links />
      </main>
      <Footer />
    </>
  );
}
