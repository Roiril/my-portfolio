'use client';

import { useEffect, useRef } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';
import './pattern-playground.css';

const PAPER = '#f3f1eb';
const INK = '#242624';
const VERMILION = '#ac4838';
const GRAY = '#9b9d96';
const PANEL_COUNT = 3;

type PanelSize = { width: number; height: number; dpr: number };
type InputState = { x: number; y: number; targetX: number; targetY: number };

const clamp = (value: number, minimum: number, maximum: number) =>
    Math.min(maximum, Math.max(minimum, value));

function beginPanel(context: CanvasRenderingContext2D, size: PanelSize) {
    const { width, height, dpr } = size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = PAPER;
    context.fillRect(0, 0, width, height);
    context.save();
    context.beginPath();
    context.rect(0, 0, width, height);
    context.clip();
}

function drawMoire(context: CanvasRenderingContext2D, size: PanelSize, phase: number, input: InputState) {
    beginPanel(context, size);
    const { width, height } = size;
    const diagonal = Math.hypot(width, height) * 1.35;
    const spacing = Math.max(7, Math.min(width, height) / 22);
    const angle = -.42 + phase * .3 + input.x * .22;

    context.translate(width * (.5 + input.x * .04), height * (.5 + input.y * .04));
    for (let family = 0; family < 2; family += 1) {
        context.save();
        context.rotate(angle + family * (.23 + phase * .18));
        context.translate((family ? 1 : -1) * phase * spacing * 2.5, 0);
        context.lineWidth = family ? .75 : 1;
        context.strokeStyle = family ? GRAY : INK;
        context.globalAlpha = family ? .62 : .86;
        for (let offset = -diagonal; offset <= diagonal; offset += spacing) {
            context.beginPath();
            context.moveTo(offset, -diagonal);
            context.lineTo(offset + input.y * spacing * 4, diagonal);
            context.stroke();
        }
        context.restore();
    }

    context.rotate(-angle * .4);
    context.strokeStyle = VERMILION;
    context.globalAlpha = .9;
    context.lineWidth = 1.4;
    const accentX = (phase - .5) * width * .42 + input.x * width * .1;
    context.beginPath();
    context.moveTo(accentX, -diagonal);
    context.lineTo(accentX + input.y * width * .08, diagonal);
    context.stroke();
    context.restore();
}

function drawTriangles(context: CanvasRenderingContext2D, size: PanelSize, phase: number, input: InputState) {
    beginPanel(context, size);
    const { width, height } = size;
    const side = clamp(Math.min(width, height) / 5.2, 34, 72);
    const rowHeight = side * .86;
    const columns = Math.ceil(width / side) + 3;
    const rows = Math.ceil(height / rowHeight) + 3;
    const shift = (phase - .5) * side * .72 + input.x * side * .6;

    context.translate(-side, -rowHeight);
    for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
            const x = column * side + (row % 2) * side * .5;
            const y = row * rowHeight;
            const direction = (row + column) % 2 === 0 ? 1 : -1;
            const localShift = direction * shift * (.45 + ((row + column) % 3) * .14);
            const peakY = y + (direction > 0 ? rowHeight : 0);
            const baseY = y + (direction > 0 ? 0 : rowHeight);

            context.beginPath();
            context.moveTo(x + side * .5 + localShift, peakY + input.y * rowHeight * .2);
            context.lineTo(x, baseY);
            context.lineTo(x + side, baseY);
            context.closePath();
            context.fillStyle = (row * 3 + column) % 11 === 0
                ? VERMILION
                : (row + column) % 3 === 0 ? GRAY : PAPER;
            context.globalAlpha = (row + column) % 3 === 1 ? 0 : .72;
            context.fill();
            context.globalAlpha = .72;
            context.strokeStyle = INK;
            context.lineWidth = .8;
            context.stroke();
        }
    }
    context.restore();
}

function drawSquares(context: CanvasRenderingContext2D, size: PanelSize, phase: number, input: InputState) {
    beginPanel(context, size);
    const { width, height } = size;
    const count = 19;
    const limit = Math.min(width, height) * .84;

    context.translate(width * (.5 + input.x * .08), height * (.5 + input.y * .08));
    for (let index = count; index > 0; index -= 1) {
        const ratio = index / count;
        const side = limit * ratio;
        const turn = (1 - ratio) * (phase - .5) * 1.7 + input.x * (1 - ratio) * .46;
        const drift = (1 - ratio) * phase * Math.min(width, height) * .13;
        context.save();
        context.translate(drift, -drift * .62);
        context.rotate(turn);
        context.strokeStyle = index === 7 ? VERMILION : index % 5 === 0 ? GRAY : INK;
        context.globalAlpha = index === 7 ? 1 : .78;
        context.lineWidth = index === 7 ? 1.6 : .8;
        context.strokeRect(-side / 2, -side / 2, side, side);
        context.restore();
    }

    context.strokeStyle = VERMILION;
    context.globalAlpha = .68;
    context.lineWidth = 1;
    const rayCount = 7;
    for (let index = 0; index < rayCount; index += 1) {
        const angle = -.85 + index * .19 + phase * .24 + input.y * .2;
        context.beginPath();
        context.moveTo(-limit * .48, limit * .48);
        context.lineTo(Math.cos(angle) * limit, Math.sin(angle) * limit);
        context.stroke();
    }
    context.restore();
}

const drawers = [drawMoire, drawTriangles, drawSquares] as const;

export default function PatternPlayground() {
    const { enabled } = useMotion();
    const rootRef = useRef<HTMLElement>(null);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        const root = rootRef.current;
        const canvases = canvasRefs.current.slice(0, PANEL_COUNT);
        if (!root || canvases.some((canvas) => !canvas)) return;

        const contexts = canvases.map((canvas) => canvas?.getContext('2d') ?? null);
        if (contexts.some((context) => !context)) return;

        const sizes: PanelSize[] = Array.from({ length: PANEL_COUNT }, () => ({ width: 1, height: 1, dpr: 1 }));
        const inputs: InputState[] = Array.from({ length: PANEL_COUNT }, () => ({ x: 0, y: 0, targetX: 0, targetY: 0 }));
        let phase = .38;
        let frameCount = 0;
        let inputCount = 0;
        let visible = false;
        let disposed = false;
        let frame = 0;
        let scrollFrame = 0;
        let dragging: { pointerId: number; panel: number; startX: number; startValue: number } | null = null;

        const draw = () => {
            if (disposed || !visible || document.hidden) return;
            for (let index = 0; index < PANEL_COUNT; index += 1) {
                const context = contexts[index];
                if (context) drawers[index](context, sizes[index], phase, inputs[index]);
            }
            frameCount += 1;
            root.dataset.playFrames = String(frameCount);
            root.dataset.playInputs = String(inputCount);
            root.dataset.playPhase = phase.toFixed(3);
        };

        const measure = () => {
            canvases.forEach((canvas, index) => {
                if (!canvas) return;
                const bounds = canvas.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const width = Math.max(1, bounds.width);
                const height = Math.max(1, bounds.height);
                const pixelWidth = Math.round(width * dpr);
                const pixelHeight = Math.round(height * dpr);
                if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
                if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
                sizes[index] = { width, height, dpr };
            });
            draw();
        };

        const updatePhase = () => {
            scrollFrame = 0;
            if (!enabled || !visible || document.hidden) return;
            const bounds = root.getBoundingClientRect();
            const travel = window.innerHeight + bounds.height;
            phase = clamp((window.innerHeight - bounds.top) / travel, 0, 1);
            draw();
        };

        const schedulePhase = () => {
            if (!scrollFrame && enabled && visible && !document.hidden) {
                scrollFrame = requestAnimationFrame(updatePhase);
            }
        };

        const halt = () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(scrollFrame);
            frame = 0;
            scrollFrame = 0;
        };

        const settle = () => {
            frame = 0;
            if (!enabled || !visible || document.hidden) return;
            let moving = false;
            inputs.forEach((input) => {
                input.x += (input.targetX - input.x) * .18;
                input.y += (input.targetY - input.y) * .18;
                if (Math.abs(input.targetX - input.x) > .002 || Math.abs(input.targetY - input.y) > .002) moving = true;
                else {
                    input.x = input.targetX;
                    input.y = input.targetY;
                }
            });
            draw();
            if (moving) frame = requestAnimationFrame(settle);
        };

        const wake = () => {
            if (!frame && enabled && visible && !document.hidden) frame = requestAnimationFrame(settle);
        };

        const setInput = (panel: number, x: number, y: number, count = true) => {
            if (!enabled) return;
            inputs[panel].targetX = clamp(x, -1, 1);
            inputs[panel].targetY = clamp(y, -1, 1);
            if (count) inputCount += 1;
            root.dataset.playInputs = String(inputCount);
            wake();
        };

        const findPanel = (target: EventTarget | null) => {
            if (!(target instanceof Element)) return -1;
            const panel = target.closest<HTMLElement>('[data-pattern-panel]');
            return panel ? Number(panel.dataset.patternPanel) : -1;
        };

        const pointerDown = (event: PointerEvent) => {
            if (!enabled) return;
            const panel = findPanel(event.target);
            if (panel < 0) return;
            if (event.pointerType === 'touch' || event.pointerType === 'pen') {
                dragging = { pointerId: event.pointerId, panel, startX: event.clientX, startValue: inputs[panel].targetX };
                root.setPointerCapture(event.pointerId);
            }
        };

        const pointerMove = (event: PointerEvent) => {
            if (!enabled) return;
            if (dragging?.pointerId === event.pointerId) {
                const panelWidth = canvases[dragging.panel]?.getBoundingClientRect().width || 1;
                const x = dragging.startValue + (event.clientX - dragging.startX) / (panelWidth * .42);
                setInput(dragging.panel, x, inputs[dragging.panel].targetY);
                return;
            }
            if (event.pointerType !== 'mouse') return;
            const panel = findPanel(event.target);
            const canvas = panel >= 0 ? canvases[panel] : null;
            if (!canvas) return;
            const bounds = canvas.getBoundingClientRect();
            setInput(panel,
                ((event.clientX - bounds.left) / bounds.width - .5) * 2,
                ((event.clientY - bounds.top) / bounds.height - .5) * 2,
            );
        };

        const releasePointer = (event: PointerEvent) => {
            if (dragging?.pointerId !== event.pointerId) return;
            const panel = dragging.panel;
            dragging = null;
            if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
            setInput(panel, 0, 0, false);
        };

        const pointerLeave = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return;
            const panel = findPanel(event.target);
            if (panel >= 0) setInput(panel, 0, 0, false);
        };

        const keyDown = (event: KeyboardEvent) => {
            if (!enabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            inputs.forEach((input, panel) => {
                const x = input.targetX + (event.key === 'ArrowRight' ? .18 : event.key === 'ArrowLeft' ? -.18 : 0);
                const y = input.targetY + (event.key === 'ArrowDown' ? .18 : event.key === 'ArrowUp' ? -.18 : 0);
                setInput(panel, x, y, panel === 0);
            });
        };

        const resetInput = () => {
            inputs.forEach((_, panel) => setInput(panel, 0, 0, false));
        };

        const changeVisibility = () => {
            if (!visible || document.hidden) {
                halt();
                return;
            }
            measure();
            updatePhase();
            wake();
        };

        root.dataset.playMotion = enabled ? 'on' : 'off';
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            root.dataset.playVisible = visible ? 'true' : 'false';
            changeVisibility();
        }, { rootMargin: '80px 0px' });
        const resizeObserver = new ResizeObserver(measure);

        intersectionObserver.observe(root);
        resizeObserver.observe(root);
        canvases.forEach((canvas) => { if (canvas) resizeObserver.observe(canvas); });
        window.addEventListener('scroll', schedulePhase, { passive: true });
        root.addEventListener('pointerdown', pointerDown, { passive: true });
        root.addEventListener('pointermove', pointerMove, { passive: true });
        root.addEventListener('pointerup', releasePointer, { passive: true });
        root.addEventListener('pointercancel', releasePointer, { passive: true });
        root.addEventListener('pointerleave', pointerLeave, { passive: true });
        root.addEventListener('keydown', keyDown);
        root.addEventListener('focusout', resetInput);
        document.addEventListener('visibilitychange', changeVisibility);

        return () => {
            disposed = true;
            halt();
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('scroll', schedulePhase);
            root.removeEventListener('pointerdown', pointerDown);
            root.removeEventListener('pointermove', pointerMove);
            root.removeEventListener('pointerup', releasePointer);
            root.removeEventListener('pointercancel', releasePointer);
            root.removeEventListener('pointerleave', pointerLeave);
            root.removeEventListener('keydown', keyDown);
            root.removeEventListener('focusout', resetInput);
            document.removeEventListener('visibilitychange', changeVisibility);
        };
    }, [enabled]);

    return (
        <section
            ref={rootRef}
            className="pattern-playground"
            data-testid="geometry-playground"
            data-play-frames="0"
            data-play-inputs="0"
            data-play-phase="0.380"
            aria-label="幾何模様で遊ぶ"
        >
            <div className="site-container">
                <header className="pattern-playground__heading">
                    <p className="section-kicker">PLAY / GEOMETRY</p>
                    <h2>Play</h2>
                    <p>動かすと、形が変わる。</p>
                </header>
                <div
                    className="pattern-playground__panels"
                    role="group"
                    tabIndex={0}
                    aria-label="3つの幾何模様。ポインターまたは左右上下の矢印キーで形を変えられます"
                >
                    {['交差する線', '三角形のタイル', '重なる正方形'].map((label, index) => (
                        <div
                            className="pattern-playground__panel"
                            data-pattern-panel={index}
                            key={label}
                            aria-hidden="true"
                        >
                            <canvas ref={(node) => { canvasRefs.current[index] = node; }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
