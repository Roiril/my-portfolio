"use client";
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Works from '@/components/sections/Works';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

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
