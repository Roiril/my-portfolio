import type { Metadata } from 'next';
import { NotFoundPage } from '@/features/magazine';

export const metadata: Metadata = {
  title: 'ページが見つかりません | 白石大晴 Portfolio',
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
