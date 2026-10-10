'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { WorkCategory } from '@/features/works/types';

type ActiveCategory = 'all' | WorkCategory;

type Filter = {
    key: ActiveCategory;
    label: string;
    count: number;
};

type Props = {
    filters: Filter[];
    children: ReactNode;
};

const CATEGORIES: WorkCategory[] = ['research', 'personal', 'internship', 'creative'];
const subscribeToHydration = () => () => undefined;

const isCategory = (value: string | null): value is WorkCategory =>
    value !== null && CATEGORIES.includes(value as WorkCategory);

function currentHashId() {
    let hashId = window.location.hash.slice(1);
    try {
        hashId = decodeURIComponent(hashId);
    } catch {
        // Keep the raw hash when an externally supplied URL contains invalid escaping.
    }
    return hashId;
}

function categoryFromLocation(): ActiveCategory {
    const hashId = currentHashId();

    if (hashId.startsWith('works-')) {
        const category = hashId.slice('works-'.length);
        if (isCategory(category)) return category;
    }

    if (hashId.startsWith('work-')) {
        const target = document.getElementById(hashId);
        const category = target?.closest<HTMLElement>('[data-work-category]')?.dataset.workCategory ?? null;
        if (isCategory(category)) return category;
    }

    const queryCategory = new URLSearchParams(window.location.search).get('category');
    return isCategory(queryCategory) ? queryCategory : 'all';
}

export function WorkFilters({ filters, children }: Props) {
    const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all');
    const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
    const filterRef = useRef<HTMLDivElement>(null);
    const navigationFrame = useRef(0);

    useEffect(() => {
        let scrollFrame = 0;
        const restoreFromLocation = () => {
            setActiveCategory(categoryFromLocation());
            const hashId = currentHashId();
            if (hashId.startsWith('works-') || hashId.startsWith('work-')) {
                cancelAnimationFrame(scrollFrame);
                scrollFrame = requestAnimationFrame(() => document.getElementById(hashId)?.scrollIntoView());
            }
        };

        restoreFromLocation();
        window.addEventListener('popstate', restoreFromLocation);
        window.addEventListener('hashchange', restoreFromLocation);

        return () => {
            cancelAnimationFrame(scrollFrame);
            cancelAnimationFrame(navigationFrame.current);
            window.removeEventListener('popstate', restoreFromLocation);
            window.removeEventListener('hashchange', restoreFromLocation);
        };
    }, []);

    const selectCategory = (category: ActiveCategory) => {
        if (category === activeCategory) return;

        setActiveCategory(category);
        const url = new URL(window.location.href);
        if (category === 'all') url.searchParams.delete('category');
        else url.searchParams.set('category', category);
        url.hash = '';
        window.history.pushState(null, '', `${url.pathname}${url.search}`);
        cancelAnimationFrame(navigationFrame.current);
        navigationFrame.current = requestAnimationFrame(() => filterRef.current?.scrollIntoView({ block: 'start' }));
    };

    const activeCount = filters.find((filter) => filter.key === activeCategory)?.count ?? 0;

    return (
        <div ref={filterRef} className="works-filter" data-active-category={activeCategory}>
            {isHydrated && (
                <div className="works-filter__bar">
                    <p className="works-filter__label" id="works-filter-label">表示</p>
                    <div className="works-filter__buttons" role="group" aria-labelledby="works-filter-label">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                className="works-filter__button"
                                aria-pressed={activeCategory === filter.key}
                                onClick={() => selectCategory(filter.key)}
                            >
                                <span>{filter.label}</span>
                                <span className="works-filter__count">{filter.count}</span>
                            </button>
                        ))}
                    </div>
                    <p className="works-filter__status" aria-live="polite">{activeCount}件を表示</p>
                </div>
            )}
            <div className="works-filter__content">{children}</div>
        </div>
    );
}

export default WorkFilters;
