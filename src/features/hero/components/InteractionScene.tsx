'use client';

import { useEffect, useRef, type RefObject } from 'react';

type InteractionSceneProps = {
    progressRef: RefObject<number>;
    renderRef: RefObject<(() => void) | null>;
    motionEnabled: boolean;
};

type SceneController = {
    setMotionEnabled: (enabled: boolean) => void;
};

type Point3 = {
    x: number;
    y: number;
    z: number;
};

type Point2 = {
    x: number;
    y: number;
};

type ProjectedFrame = {
    corners: Point2[];
    depth: number;
    index: number;
};

const FRAME_COUNT = 30;
const INK = '#242624';
const VERMILION = '#ac4838';
const POINTER_ROTATION = Math.PI / 60;
const POINTER_EPSILON = 0.001;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeInOut = (value: number) => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
};

function rotatePoint(point: Point3, rotationX: number, rotationY: number, rotationZ: number): Point3 {
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);

    const afterX = {
        x: point.x,
        y: point.y * cosX - point.z * sinX,
        z: point.y * sinX + point.z * cosX,
    };
    const afterY = {
        x: afterX.x * cosY + afterX.z * sinY,
        y: afterX.y,
        z: -afterX.x * sinY + afterX.z * cosY,
    };
    return {
        x: afterY.x * cosZ - afterY.y * sinZ,
        y: afterY.x * sinZ + afterY.y * cosZ,
        z: afterY.z,
    };
}

function tracePolygon(context: CanvasRenderingContext2D, points: Point2[]) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
        context.lineTo(points[index].x, points[index].y);
    }
    context.closePath();
}

export default function InteractionScene({ progressRef, renderRef, motionEnabled }: InteractionSceneProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<SceneController | null>(null);
    const motionEnabledRef = useRef(motionEnabled);

    useEffect(() => {
        motionEnabledRef.current = motionEnabled;
        controllerRef.current?.setMotionEnabled(motionEnabled);
    }, [motionEnabled]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            root.dataset.frames = '0';
            root.dataset.inputs = '0';
            root.dataset.sceneReady = 'fallback';
            return () => {
                renderRef.current = null;
                delete root.dataset.frames;
                delete root.dataset.inputs;
                delete root.dataset.sceneReady;
            };
        }

        let disposed = false;
        let frameRequest = 0;
        let frameCount = 0;
        let inputCount = 0;
        let lastTime = 0;
        let width = 0;
        let height = 0;
        let sceneVisible = false;
        let pageVisible = document.visibilityState === 'visible';
        let activeMotion = motionEnabledRef.current;
        let pointerTargetX = 0;
        let pointerTargetY = 0;
        let pointerX = 0;
        let pointerY = 0;

        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        root.appendChild(canvas);
        root.dataset.frames = '0';
        root.dataset.inputs = '0';
        root.dataset.sceneReady = 'loading';

        const canRender = () => !disposed && sceneVisible && pageVisible && width > 0 && height > 0;
        const getProgress = () => {
            const requested = activeMotion ? progressRef.current : 0;
            return clamp01(Number.isFinite(requested) ? requested : 0);
        };
        const recordInput = () => {
            inputCount += 1;
            root.dataset.inputs = String(inputCount);
        };

        const resize = () => {
            const nextWidth = root.clientWidth;
            const nextHeight = root.clientHeight;
            const pixelRatio = Math.min(window.devicePixelRatio || 1, nextWidth < 768 ? 1.5 : 2);
            const pixelWidth = Math.round(nextWidth * pixelRatio);
            const pixelHeight = Math.round(nextHeight * pixelRatio);
            if (width === nextWidth && height === nextHeight && canvas.width === pixelWidth && canvas.height === pixelHeight) return false;

            width = nextWidth;
            height = nextHeight;
            if (width < 1 || height < 1) return false;

            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.lineCap = 'butt';
            context.lineJoin = 'miter';
            context.miterLimit = 4;
            return true;
        };

        const project = (
            point: Point3,
            viewYaw: number,
            viewPitch: number,
        ): Point2 & { depth: number } => {
            const viewed = rotatePoint(point, viewPitch, viewYaw, 0);
            const cameraDistance = 10;
            const depth = Math.max(3, cameraDistance - viewed.z);
            const scale = 1 / depth;
            return {
                x: viewed.x * scale,
                y: -viewed.y * scale,
                depth: viewed.z,
            };
        };

        const buildFrames = (progress: number) => {
            const phase = clamp01((progress - 0.12) / 0.73);
            const morph = easeInOut(phase);
            const pointerWeight = activeMotion ? 1 - easeInOut(progress / 0.15) : 0;
            const viewYaw = mix(-0.6, 0, morph) + pointerX * POINTER_ROTATION * pointerWeight;
            const viewPitch = mix(0.38, 0, morph) - pointerY * POINTER_ROTATION * pointerWeight;
            const frames: ProjectedFrame[] = [];

            for (let index = 0; index < FRAME_COUNT; index += 1) {
                const t = index / (FRAME_COUNT - 1);
                const frameMorph = easeInOut((phase - t * 0.035) / 0.965);
                const center = {
                    x: mix(Math.sin(t * Math.PI * 2) * 0.22, (t - 0.5) * 6.1, frameMorph),
                    y: mix(Math.sin(t * Math.PI) * 0.15, (0.5 - t) * 0.15, frameMorph),
                    z: mix((t - 0.5) * 5.8, (t - 0.5) * 0.12, frameMorph),
                };
                const rotationX = (t - 0.5) * 0.16;
                const rotationY = (t - 0.5) * 0.2;
                const rotationZ = (t - 0.5) * Math.PI * 0.9;
                const halfSize = 1.65;
                const localCorners = [
                    { x: -halfSize, y: -halfSize, z: 0 },
                    { x: halfSize, y: -halfSize, z: 0 },
                    { x: halfSize, y: halfSize, z: 0 },
                    { x: -halfSize, y: halfSize, z: 0 },
                ];
                let depth = 0;
                const corners = localCorners.map((corner) => {
                    const rotated = rotatePoint(corner, rotationX, rotationY, rotationZ);
                    const aligned = {
                        x: corner.x / halfSize + corner.y / halfSize * 0.52,
                        y: corner.y / halfSize * 0.62,
                        z: 0,
                    };
                    const projected = project({
                        x: mix(rotated.x, aligned.x, frameMorph) + center.x,
                        y: mix(rotated.y, aligned.y, frameMorph) + center.y,
                        z: mix(rotated.z, aligned.z, frameMorph) + center.z,
                    }, viewYaw, viewPitch);
                    depth += projected.depth;
                    return { x: projected.x, y: projected.y };
                });
                frames.push({
                    corners,
                    depth: depth / 4,
                    index,
                });
            }

            const points = frames.flatMap((frame) => frame.corners);
            const left = Math.min(...points.map((point) => point.x));
            const right = Math.max(...points.map((point) => point.x));
            const top = Math.min(...points.map((point) => point.y));
            const bottom = Math.max(...points.map((point) => point.y));
            const scale = Math.min(width * 0.86 / (right - left), height * 0.86 / (bottom - top));
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            for (const frame of frames) {
                for (const point of frame.corners) {
                    point.x = width / 2 + (point.x - centerX) * scale;
                    point.y = height / 2 + (point.y - centerY) * scale;
                }
            }
            return frames;
        };

        const drawFrame = (frame: ProjectedFrame, color: string, lineWidth: number, alpha: number) => {
            tracePolygon(context, frame.corners);
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.stroke();
        };

        const renderFrame = (now: number) => {
            frameRequest = 0;
            if (!canRender()) { lastTime = 0; return; }

            const progress = getProgress();
            if (!activeMotion || progress >= 0.15) {
                pointerTargetX = 0;
                pointerTargetY = 0;
                pointerX = 0;
                pointerY = 0;
            }
            const delta = lastTime ? Math.max(0, now - lastTime) : 16;
            const easing = 1 - Math.exp(-delta / 80);
            lastTime = now;
            pointerX += (pointerTargetX - pointerX) * easing;
            pointerY += (pointerTargetY - pointerY) * easing;
            if (Math.abs(pointerTargetX - pointerX) < POINTER_EPSILON) pointerX = pointerTargetX;
            if (Math.abs(pointerTargetY - pointerY) < POINTER_EPSILON) pointerY = pointerTargetY;

            context.clearRect(0, 0, width, height);
            const frames = buildFrames(progress);
            const sortedFrames = [...frames].sort((a, b) => a.depth - b.depth);
            const farDepth = sortedFrames[0].depth;
            const depthRange = Math.max(0.001, sortedFrames[sortedFrames.length - 1].depth - farDepth);

            for (const frame of sortedFrames) {
                if (frame.index === 15) {
                    tracePolygon(context, frame.corners);
                    context.globalAlpha = 0.24;
                    context.fillStyle = VERMILION;
                    context.fill();
                }
                const depth = clamp01((frame.depth - farDepth) / depthRange);
                const depthAlpha = mix(0.18, 0.88, depth);
                const accented = frame.index === 15;
                drawFrame(frame, accented ? VERMILION : INK, accented ? 1.5 : mix(0.65, 1.25, depth), accented ? 1 : depthAlpha);
            }
            context.globalAlpha = 1;

            frameCount += 1;
            root.dataset.frames = String(frameCount);
            root.dataset.sceneReady = 'true';
            root.classList.add('is-ready');
            if (activeMotion && (pointerX !== pointerTargetX || pointerY !== pointerTargetY)) {
                frameRequest = requestAnimationFrame(renderFrame);
            } else lastTime = 0;
        };

        const requestRender = () => {
            if (!canRender() || frameRequest) return;
            lastTime = performance.now();
            frameRequest = requestAnimationFrame(renderFrame);
        };
        const stopRendering = () => {
            if (frameRequest) cancelAnimationFrame(frameRequest);
            frameRequest = 0;
            lastTime = 0;
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (!activeMotion || !canRender() || getProgress() >= 0.15 || event.pointerType === 'touch') return;
            recordInput();
            pointerTargetX = clamp01(event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
            pointerTargetY = clamp01(event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
            requestRender();
        };
        const handlePointerLeave = () => {
            if (!activeMotion || !canRender() || (!pointerTargetX && !pointerTargetY)) return;
            recordInput();
            pointerTargetX = 0;
            pointerTargetY = 0;
            requestRender();
        };
        const handleVisibility = () => {
            pageVisible = document.visibilityState === 'visible';
            if (pageVisible) requestRender();
            else stopRendering();
        };

        renderRef.current = () => {
            recordInput();
            if (activeMotion) requestRender();
        };
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', handlePointerLeave);
        document.addEventListener('visibilitychange', handleVisibility);

        const bounds = root.getBoundingClientRect();
        sceneVisible = bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            const wasVisible = sceneVisible;
            sceneVisible = entry.isIntersecting;
            if (sceneVisible && !wasVisible) requestRender();
            else if (!sceneVisible) stopRendering();
        }, { threshold: 0.01 });
        intersectionObserver.observe(root);

        const resizeObserver = new ResizeObserver(() => {
            if (resize()) requestRender();
        });
        resizeObserver.observe(root);

        controllerRef.current = {
            setMotionEnabled(enabled) {
                activeMotion = enabled;
                if (!enabled) {
                    pointerTargetX = 0;
                    pointerTargetY = 0;
                    pointerX = 0;
                    pointerY = 0;
                    stopRendering();
                }
                requestRender();
            },
        };

        if (resize()) requestRender();

        return () => {
            disposed = true;
            controllerRef.current = null;
            renderRef.current = null;
            stopRendering();
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('pointermove', handlePointerMove);
            document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
            document.removeEventListener('visibilitychange', handleVisibility);
            canvas.remove();
            root.classList.remove('is-ready');
            delete root.dataset.sceneReady;
            delete root.dataset.frames;
            delete root.dataset.inputs;
        };
    }, [progressRef, renderRef]);

    return <div ref={rootRef} className="interaction-scene" aria-hidden="true" />;
}
