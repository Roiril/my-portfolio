"use client";

import { Hero } from '@/features/hero';
import { About } from '@/features/about';
import { Works } from '@/features/works';
import { Contact } from '@/features/contact';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen text-gray-900 font-sans bg-white">
      <div className="relative z-10">
        <Hero />
        <About />
        <Works />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
