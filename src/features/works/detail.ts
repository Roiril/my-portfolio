import type { Work } from './types';

// 詳細ページを持つのは、技術説明（tech）がある作品。ページの中身は content/work-pages.ts
export const hasDetailPage = (work: Work): boolean => Boolean(work.tech);

export const detailHref = (work: Work): string => '/works/' + work.id;
