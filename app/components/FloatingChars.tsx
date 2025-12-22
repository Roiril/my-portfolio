"use client";
import { useEffect, useState, useRef } from 'react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const hiraganaChars = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

type Square = {
  id: number;
  side: 'left' | 'right';
  initialLeft?: string;
  initialRight?: string;
  size: string;
  opacity: number;
  duration: string;
  delay: string;
  char: string;
  fixedX?: number;
  fixedY?: number;
};

export default function FloatingChars() {
  const [squares, setSquares] = useState<Square[]>([]);
  const draggingRef = useRef<{ id: number; side: 'left' | 'right'; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const count = Math.max(10, Math.floor(width / 30));

    const generateSquares = (side: 'left' | 'right') => {
      return Array.from({ length: count }).map((_, i) => {
        const sizeVal = random(20, 100);
        const durationVal = sizeVal * 0.6 + 20;

        return {
          id: i,
          side: side,
          [side === 'left' ? 'initialLeft' : 'initialRight']: `${random(0, 25)}%`,
          size: `${sizeVal}px`,
          opacity: random(0.3, 0.7),
          duration: `${durationVal}s`,
          delay: `-${random(0, durationVal)}s`,
          char: hiraganaChars[Math.floor(random(0, hiraganaChars.length))],
        } as Square;
      });
    };

    setSquares([...generateSquares('left'), ...generateSquares('right')]);
  }, []);

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

      const { id, side, offsetX, offsetY } = draggingRef.current;
      const newX = pageX - offsetX;
      const newY = pageY - offsetY;

      setSquares((prev) => prev.map(sq => {
        if (sq.id === id && sq.side === side) {
          return { ...sq, fixedX: newX, fixedY: newY };
        }
        return sq;
      }));
    };

    const handleEnd = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        document.body.style.cursor = 'auto';
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

  const handleStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    square: Square
  ) => {
    e.stopPropagation();
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    let clientX, clientY;
    if ('touches' in e.nativeEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    draggingRef.current = {
      id: square.id,
      side: square.side,
      offsetX,
      offsetY
    };

    const currentX = rect.left + window.scrollX;
    const currentY = rect.top + window.scrollY;
    setSquares((prev) => prev.map(sq => {
      if (sq.id === square.id && sq.side === square.side) {
        return { ...sq, fixedX: currentX, fixedY: currentY };
      }
      return sq;
    }));

    document.body.style.cursor = 'grabbing';
  };

  return (
    <>
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -10%;
            transform: rotate(0deg);
          }
          100% {
            top: 110%;
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none h-full overflow-hidden grayscale">
        {squares.map((sq) => {
          const isFixed = sq.fixedX !== undefined && sq.fixedY !== undefined;
          return (
            <div
              key={`${sq.side}-${sq.id}`}
              className="absolute bg-black/10 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-800 font-bold select-none pointer-events-auto cursor-grab active:cursor-grabbing hover:bg-black/20 hover:shadow-md hover:scale-105 transition-colors duration-200"
              style={{
                width: sq.size,
                height: sq.size,
                opacity: sq.opacity,
                borderRadius: '8px',
                fontSize: `calc(${sq.size} * 0.6)`,
                touchAction: 'none',
                ...(isFixed ? {
                  position: 'absolute',
                  left: sq.fixedX,
                  top: sq.fixedY,
                  right: 'auto',
                  transform: 'rotate(0deg)',
                  animation: 'none',
                  zIndex: 50,
                } : {
                  left: sq.side === 'left' ? sq.initialLeft : undefined,
                  right: sq.side === 'right' ? sq.initialRight : undefined,
                  animationName: 'fall',
                  animationDuration: sq.duration,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: sq.delay,
                })
              }}
              onMouseDown={(e) => handleStart(e, sq)}
              onTouchStart={(e) => handleStart(e, sq)}
            >
              {sq.char}
            </div>
          );
        })}
      </div>
    </>
  );
}
