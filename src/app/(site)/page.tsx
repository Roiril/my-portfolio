import type { Metadata } from 'next';
import { Magazine } from '@/features/magazine';

// canonical はページごとに置く（layout に置くと、詳細ページまでトップを指してしまう）
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return <Magazine />;
}
