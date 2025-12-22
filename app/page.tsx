"use client";
import { useState, useRef, useEffect } from 'react';
import FloatingChars from './components/FloatingChars';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Contact from './components/Contact';
import Footer from './components/Footer';

type DragState = {
  type: 'ui';
  id: string;
  startPageX: number;
  startPageY: number;
  initialX: number;
  initialY: number;
};

export default function Home() {
  const [uiPositions, setUiPositions] = useState<Record<string, { x: number; y: number }>>({});
  const draggingRef = useRef<DragState | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const getClientPos = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if ('changedTouches' in e && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      if (e.cancelable) e.preventDefault();

      const { x, y } = getClientPos(e);
      const pageX = x + window.scrollX;
      const pageY = y + window.scrollY;

      isDraggingRef.current = true;

      const { id, startPageX, startPageY, initialX, initialY } = draggingRef.current;
      const dx = pageX - startPageX;
      const dy = pageY - startPageY;

      setUiPositions((prev) => ({
        ...prev,
        [id]: { x: initialX + dx, y: initialY + dy }
      }));
    };

    const handleEnd = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        document.body.style.cursor = 'auto';
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const handleUiStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    isDraggingRef.current = false;

    let clientX, clientY;
    if ('touches' in e.nativeEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const startPageX = clientX + window.scrollX;
    const startPageY = clientY + window.scrollY;

    const currentPos = uiPositions[id] || { x: 0, y: 0 };

    draggingRef.current = {
      type: 'ui',
      id,
      startPageX,
      startPageY,
      initialX: currentPos.x,
      initialY: currentPos.y
    };

    document.body.style.cursor = 'grabbing';
  };

  const handleUiClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getUiStyle = (id: string) => {
    const pos = uiPositions[id] || { x: 0, y: 0 };
    return {
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      cursor: 'grab',
      touchAction: 'none' as const
    };
  };

  return (
    <main className="relative min-h-screen text-gray-900 font-sans overflow-hidden bg-white">
      <FloatingChars />

      <div className="relative z-10 pointer-events-none">
        <Hero
          uiPositions={uiPositions}
          onUiStart={handleUiStart}
          onUiClick={handleUiClick}
          getUiStyle={getUiStyle}
        />
        <About />
        <Works />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
