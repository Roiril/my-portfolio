import type { Metadata } from 'next';
import { katakage } from '@/content/books';
import { KatakagePage } from '@/features/books';

const title = `${katakage.title} | 白石大晴 Portfolio`;

export const metadata: Metadata = {
  title,
  description: katakage.say,
  alternates: { canonical: '/books/katakage' },
  openGraph: { title, description: katakage.say, url: '/books/katakage', images: [{ url: '/images/books/katakage/og.jpg', width: 1200, height: 630 }] },
};

export default function Page() {
  return <KatakagePage />;
}
