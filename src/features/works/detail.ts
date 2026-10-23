import type { Work } from './types';

// 詳細ページを持つのは、作品の説明（detail）か技術説明（tech）のどちらかがある作品
export const hasDetailPage = (work: Work): boolean => Boolean(work.detail || work.tech);

export const detailHref = (work: Work): string => '/works/' + work.id;
