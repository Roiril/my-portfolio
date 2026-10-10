'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import './motion.css';

type MotionContextValue = {
    enabled: boolean;
    toggleMotion: () => void;
    reducedMotion: boolean;
};

const STORAGE_KEY = 'roil-motion';
const CHANGE_EVENT = 'roil-motion-change';
const MotionContext = createContext<MotionContextValue | null>(null);
let memoryPreference: boolean | null = null;

const subscribeHydration = () => () => undefined;

function getMotionPreference() {
    if (memoryPreference !== null) return memoryPreference;

    try {
        memoryPreference = window.localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch {
        memoryPreference = true;
    }
    return memoryPreference;
}

function subscribeMotionPreference(onChange: () => void) {
    const handleStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) return;
        memoryPreference = event.newValue !== 'off';
        onChange();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
}

function getReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribeReducedMotion(onChange: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
    const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
    const preferredMotion = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, () => false);
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true);
    const enabled = preferredMotion && !reducedMotion;

    useEffect(() => {
        if (!hydrated) return;
        document.documentElement.dataset.motion = enabled ? 'on' : 'off';
        return () => {
            delete document.documentElement.dataset.motion;
        };
    }, [enabled, hydrated]);

    const toggleMotion = useCallback(() => {
        if (reducedMotion) return;

        const next = !getMotionPreference();
        memoryPreference = next;
        try {
            window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
        } catch {
            // The in-memory preference still works when storage is unavailable.
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, [reducedMotion]);

    const value = useMemo(
        () => ({ enabled, toggleMotion, reducedMotion }),
        [enabled, reducedMotion, toggleMotion],
    );

    return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
    const context = useContext(MotionContext);
    if (!context) throw new Error('useMotion must be used within MotionProvider');
    return context;
}
