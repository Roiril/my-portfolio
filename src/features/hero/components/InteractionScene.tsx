'use client';

import { useEffect, useRef, type RefObject } from 'react';

type InteractionSceneProps = {
    progressRef: RefObject<number>;
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
    center: Point2;
    depth: number;
    index: number;
};

const FRAME_COUNT = 30;
const INK = '#242624';
const MUTED = '#a5a6a0';
const VERMILION = '#ac4838';

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

export default function InteractionScene({ progressRef, motionEnabled }: InteractionSceneProps) {
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
            root.dataset.sceneReady = 'fallback';
            return;
        }

        let disposed = false;
        let frameRequest = 0;
        let frameCount = 0;
        let width = 0;
        let height = 0;
        let sceneVisible = false;
        let pageVisible = document.visibilityState === 'visible';
        let activeMotion = motionEnabledRef.current;
        let pointerTargetX = 0;
        let pointerTargetY = 0;
        let pointerX = 0;
        let pointerY = 0;
        const startedAt = performance.now();

        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        root.appendChild(canvas);
        root.dataset.frames = '0';
        root.dataset.sceneReady = 'loading';

        const shouldAnimate = () => activeMotion && sceneVisible && pageVisible;

        const resize = () => {
            width = root.clientWidth;
            height = root.clientHeight;
            if (width < 1 || height < 1) return false;

            const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
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
            focalLength: number,
        ): Point2 & { depth: number } => {
            const viewed = rotatePoint(point, viewPitch, viewYaw, 0);
            const cameraDistance = 10;
            const depth = Math.max(3, cameraDistance - viewed.z);
            const scale = focalLength / depth;
            return {
                x: width * 0.5 + viewed.x * scale,
                y: height * 0.5 - viewed.y * scale,
                depth: viewed.z,
            };
        };

        const buildFrames = (progress: number, elapsed: number) => {
            const morph = easeInOut(progress);
            const driftYaw = activeMotion ? Math.sin(elapsed * 0.22) * 0.022 : 0;
            const driftPitch = activeMotion ? Math.cos(elapsed * 0.18) * 0.016 : 0;
            const viewYaw = mix(-0.48, 0.015, morph) + pointerX * 0.085 + driftYaw;
            const viewPitch = mix(0.34, 0, morph) - pointerY * 0.065 + driftPitch;
            const focalLength = Math.min(width, height) * 1.16;
            const frames: ProjectedFrame[] = [];

            for (let index = 0; index < FRAME_COUNT; index += 1) {
                const t = index / (FRAME_COUNT - 1);
                const center = {
                    x: mix(0, (t - 0.5) * 4.5, morph),
                    y: mix(0, (0.5 - t) * 1.8, morph),
                    z: mix((t - 0.5) * 5.4, 0, morph),
                };
                const rotationX = 0;
                const rotationY = 0;
                const rotationZ = mix((t - .5) * Math.PI * .62, Math.PI * .25, morph);
                const halfSize = mix(1.65, .8, morph);
                const localCorners = [
                    { x: -halfSize, y: -halfSize, z: 0 },
                    { x: halfSize, y: -halfSize, z: 0 },
                    { x: halfSize, y: halfSize, z: 0 },
                    { x: -halfSize, y: halfSize, z: 0 },
                ];
                let depth = 0;
                const corners = localCorners.map((corner) => {
                    const rotated = rotatePoint(corner, rotationX, rotationY, rotationZ);
                    const projected = project({
                        x: rotated.x + center.x,
                        y: rotated.y + center.y,
                        z: rotated.z + center.z,
                    }, viewYaw, viewPitch, focalLength);
                    depth += projected.depth;
                    return { x: projected.x, y: projected.y };
                });
                const projectedCenter = project(center, viewYaw, viewPitch, focalLength);
                frames.push({
                    corners,
                    center: projectedCenter,
                    depth: depth / 4,
                    index,
                });
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
            if (disposed || width < 1 || height < 1) return;

            const requestedProgress = activeMotion ? progressRef.current : 0.76;
            const progress = clamp01(Number.isFinite(requestedProgress) ? requestedProgress : 0);
            const elapsed = activeMotion ? (now - startedAt) / 1000 : 0;
            pointerX += (pointerTargetX - pointerX) * 0.04;
            pointerY += (pointerTargetY - pointerY) * 0.04;

            context.clearRect(0, 0, width, height);
            const frames = buildFrames(progress, elapsed);
            const sortedFrames = [...frames].sort((a, b) => a.depth - b.depth);

            for (const frame of sortedFrames) {
                if (frame.index === 15) {
                    tracePolygon(context, frame.corners);
                    context.globalAlpha = 0.16;
                    context.fillStyle = VERMILION;
                    context.fill();
                } else if (frame.index === 7 || frame.index === 23) {
                    tracePolygon(context, frame.corners);
                    context.globalAlpha = 0.08;
                    context.fillStyle = MUTED;
                    context.fill();
                }
            }

            context.globalAlpha = 0.28;
            context.strokeStyle = MUTED;
            context.lineWidth = 0.7;
            for (let index = 0; index < frames.length - 1; index += 1) {
                const current = frames[index];
                const next = frames[index + 1];
                for (let cornerIndex = 0; cornerIndex < 4; cornerIndex += 1) {
                    context.beginPath();
                    context.moveTo(current.corners[cornerIndex].x, current.corners[cornerIndex].y);
                    context.lineTo(next.corners[cornerIndex].x, next.corners[cornerIndex].y);
                    context.stroke();
                }
            }

            for (const frame of sortedFrames) {
                const depthAlpha = mix(0.34, 0.92, clamp01((frame.depth + 3.2) / 6.4));
                const accented = frame.index === 15;
                drawFrame(frame, accented ? VERMILION : INK, accented ? 1.2 : 0.9, accented ? 0.95 : depthAlpha);
            }

            context.globalAlpha = 0.34;
            context.strokeStyle = VERMILION;
            context.lineWidth = 0.75;
            context.beginPath();
            context.moveTo(frames[13].center.x, frames[13].center.y);
            context.lineTo(frames[17].center.x, frames[17].center.y);
            context.stroke();
            context.globalAlpha = 1;

            frameCount += 1;
            root.dataset.frames = String(frameCount);
            if (shouldAnimate()) frameRequest = requestAnimationFrame(renderFrame);
        };

        const requestRender = () => {
            if (disposed || frameRequest) return;
            frameRequest = requestAnimationFrame(renderFrame);
        };
        const stopRendering = () => {
            if (!frameRequest) return;
            cancelAnimationFrame(frameRequest);
            frameRequest = 0;
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (!activeMotion || event.pointerType === 'touch') return;
            pointerTargetX = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
            pointerTargetY = (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
        };
        const handleVisibility = () => {
            pageVisible = document.visibilityState === 'visible';
            if (shouldAnimate()) requestRender();
            else stopRendering();
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);

        const bounds = root.getBoundingClientRect();
        sceneVisible = bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            sceneVisible = entry.isIntersecting;
            if (shouldAnimate()) requestRender();
            else stopRendering();
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

        if (resize()) renderFrame(performance.now());
        root.dataset.sceneReady = 'true';
        root.classList.add('is-ready');

        return () => {
            disposed = true;
            controllerRef.current = null;
            stopRendering();
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('visibilitychange', handleVisibility);
            canvas.remove();
            root.classList.remove('is-ready');
            delete root.dataset.sceneReady;
            delete root.dataset.frames;
        };
    }, [progressRef]);

    return <div ref={rootRef} className="interaction-scene" aria-hidden="true" />;
}
