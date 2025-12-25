"use client";
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
