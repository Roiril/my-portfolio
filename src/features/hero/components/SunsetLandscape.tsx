'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import './sunset-landscape.css';

const WIDTH = 1280;
const HEIGHT = 512;
const ease = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
// Original mountain silhouette: the sky never paints over a roof or tower.
const RIDGE: readonly (readonly [number, number])[] = [[0,190],[350,190],[416,190],[460,198],[526,193],[580,203],[624,185],[688,171],[732,167],[786,180],[832,199],[907,211],[961,215],[1000,202],[1058,184],[1100,164],[1153,185],[1211,208],[1280,204]];
const skyline = (x: number) => {
    const i = RIDGE.findIndex(p => p[0] >= x);
    if (i <= 0) return RIDGE[0][1];
    const a = RIDGE[i - 1], b = RIDGE[i];
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
};
type Point = readonly [number, number];
type House = { center: Point; panes: readonly (readonly Point[])[]; wall: readonly Point[]; bounds: readonly [number, number, number, number] };

// Traced from the actual painting; source masks retain mullions and shadows.
const HOUSES: readonly House[] = [
    { center: [737, 430], bounds: [716, 413, 42, 44],
        panes: [[[728,424],[736,424],[736,437],[728,438]], [[738,424],[746,424],[746,436],[738,436]]],
        wall: [[719,418],[753,416],[755,451],[719,448]] },
    { center: [807, 385], bounds: [778, 355, 53, 70],
        panes: [[[797,373],[802,373],[802,385],[797,384]], [[804,373],[808,373],[808,387],[804,386]], [[810,373],[817,373],[817,387],[810,387]],
            [[797,389],[799,389],[799,400],[797,400]], [[804,389],[807,389],[807,402],[804,402]], [[812,389],[815,389],[815,401],[812,401]]],
        wall: [[784,359],[827,359],[826,421],[783,419]] },
    { center: [915, 395], bounds: [894, 380, 47, 43],
        panes: [[[904,390],[913,390],[913,400],[904,400]], [[917,390],[925,390],[925,400],[917,400]]],
        wall: [[898,384],[936,383],[936,419],[900,414]] },
];
type Patch = { off: HTMLCanvasElement; spill: HTMLCanvasElement; glint: HTMLCanvasElement };
type Lamp = { level: number; holdUntil: number; latched: boolean };
const inside = (x: number, y: number, polygon: readonly Point[]) => {
    let hit = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[i], b = polygon[j];
        if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
};

/** A fixed landscape: one real window invites the town into blue hour. */
export default function SunsetLandscape() {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nearRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const hero = root?.closest('section');
        const base = root?.querySelector('img');
        const ctx = canvas?.getContext('2d');
        const nearCanvas = nearRef.current;
        const nearCtx = nearCanvas?.getContext('2d');
        const nearImage = root?.querySelector<HTMLImageElement>('.sunset-landscape__near img');
        const skyImage = new window.Image(); skyImage.src = '/images/identity/night-sky.webp';
        if (!root || !canvas || !hero || !base || !ctx || !nearCtx || !nearImage) return;
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const lamps: Lamp[] = HOUSES.map(() => ({ level: 0, holdUntil: 0, latched: false }));
        let patches: Patch[] = [];
        let nightTown: HTMLCanvasElement | null = null;
        let nightSky: HTMLCanvasElement | null = null;
        let nightNear: HTMLCanvasElement | null = null;
        let cityBanks: { image: HTMLCanvasElement; x: number }[] = [];
        let journey = 0;
        let origin = 0;
        let lastInvitation = 0;
        let nightLatched = false;
        let bounds = canvas.getBoundingClientRect();
        let candidate = -1;
        let enteredAt = 0;
        let frame = 0;
        let previous = 0;
        let visible = true;
        let disposed = false;
        let scrollFired = false;
        let scrollPending = false;
        let scrollStart: number | null = null;
        let lastScrollY = window.scrollY;
        let touchStartY = 0;
        let scrollIntentUntil = 0;
        const drawable = () => !disposed && visible && !document.hidden && patches.length === HOUSES.length;
        const measure = () => { bounds = canvas.getBoundingClientRect(); };
        const draw = () => {
            if (!patches.length) return;
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.imageSmoothingEnabled = false;
            const dusk = ease((journey - .4) / 2.5);
            const sky = ease((journey - .65) / 2.8);
            // Separate exposure curves: walls cool before the high sky deepens.
            if (nightTown) { ctx.globalAlpha = dusk; ctx.drawImage(nightTown,0,0); }
            if (nightSky) { ctx.globalAlpha = sky; ctx.drawImage(nightSky,0,0); }
            ctx.globalAlpha = 1;
            cityBanks.forEach(bank => {
                const delay = .3 + Math.abs(bank.x + 80 - HOUSES[origin].center[0]) / 300;
                ctx.globalAlpha = 1 - ease((journey - delay) / .9);
                ctx.drawImage(bank.image,bank.x,225);
            });
            ctx.globalAlpha = 1;
            nearCtx.clearRect(0,0,WIDTH,HEIGHT);
            if (nightNear) { nearCtx.globalAlpha = dusk; nearCtx.drawImage(nightNear,0,0); }
            root.dataset.night = dusk.toFixed(3);
            root.dataset.journey = journey.toFixed(3);
            lamps.forEach((lamp, index) => {
                const { bounds: [x,y] } = HOUSES[index];
                const patch = patches[index];
                // Interior warms first; its reflected light follows softly.
                const delay = Math.hypot(HOUSES[index].center[0] - HOUSES[origin].center[0], HOUSES[index].center[1] - HOUSES[origin].center[1]) / 125;
                const propagated = ease((journey - delay) / .8);
                const light = Math.max(ease(lamp.level), propagated);
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1 - light;
                ctx.drawImage(patch.off, x, y);
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = Math.pow(light, 1.35) * .8;
                ctx.drawImage(patch.spill, x, y);
                ctx.globalAlpha = light * .24;
                ctx.drawImage(patch.glint, x, y);
            });
            ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        };
        const halt = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
        const reset = () => {
            halt(); candidate = -1; scrollPending = false;
            scrollStart = null; scrollIntentUntil = 0;
            lamps.forEach(lamp => { lamp.level = 0; lamp.holdUntil = 0; lamp.latched = false; });
            journey = 0; lastInvitation = 0; nightLatched = false;
            if (drawable()) draw();
        };
        const tick = (now: number) => {
            if (!drawable() || motion.matches) { halt(); return; }
            if (now - previous >= 40) {
                const dt = previous ? Math.min((now - previous) / 1000, .08) : .04;
                previous = now;
                let unsettled = false;
                const hovering = candidate >= 0 && now - enteredAt >= 160;
                if (hovering) { if (journey === 0) origin = candidate; lastInvitation = now; }
                const invited = lastInvitation > 0 && now - lastInvitation < 4200;
                const target = invited ? 4.4 : 0;
                journey = Math.max(0, Math.min(4.4, journey + (target > journey ? dt : -.65 * dt)));
                if (journey !== target || invited && !hovering) unsettled = true;
                lamps.forEach((lamp, index) => {
                    const inhabiting = index === candidate && now - enteredAt >= 160;
                    const aim = inhabiting || now < lamp.holdUntil ? 1 : 0;
                    lamp.level += (aim - lamp.level) * (1 - Math.exp(-dt / (aim ? .42 : .8)));
                    if (Math.abs(aim - lamp.level) < .004) lamp.level = aim;
                    if (lamp.level !== aim || (lamp.holdUntil > now && index !== candidate) || (index === candidate && now - enteredAt < 160)) unsettled = true;
                });
                draw();
                if (!unsettled) { halt(); return; }
            }
            frame = requestAnimationFrame(tick);
        };
        const wake = () => { if (drawable() && !motion.matches && !frame) frame = requestAnimationFrame(tick); };
        const point = (event: PointerEvent): Point => {
            // Invert object-fit: cover, including mobile cropping.
            const scale = Math.max(bounds.width / WIDTH, bounds.height / HEIGHT);
            return [(event.clientX - bounds.left - (bounds.width - WIDTH * scale) / 2) / scale,
                (event.clientY - bounds.top - (bounds.height - HEIGHT * scale) / 2) / scale];
        };
        const nearest = ([x,y]: Point, touch = false) => {
            let best = -1, distance = Infinity;
            HOUSES.forEach((house,index) => {
                const dx = x - house.center[0], dy = y - house.center[1];
                const radius = touch ? 50 : 25;
                const d = (dx / radius) ** 2 + (dy / (radius * .85)) ** 2;
                if (d < 1 && d < distance) { best = index; distance = d; }
            });
            return best;
        };
        const approach = (index: number) => {
            if (index === candidate) return;
            const now = performance.now();
            if (candidate >= 0) {
                if (journey > 0 && !motion.matches) lastInvitation = now;
                const lamp = lamps[candidate];
                if (motion.matches && !lamp.latched) lamp.level = 0;
                else if (lamp.level > .02) lamp.holdUntil = now + 700;
            }
            candidate = index; enteredAt = now;
            if (motion.matches) {
                if (index >= 0) { lamps[index].level = 1; origin = index; journey = 4.4; }
                else if (!nightLatched) journey = 0;
                draw();
            }
            else wake();
        };
        const move = (event: PointerEvent) => {
            if (!drawable() || event.pointerType === 'touch') return;
            approach(nearest(point(event)));
        };
        const leave = () => approach(-1);
        const invite = (index: number) => {
            if (index < 0 || !drawable()) return;
            const lamp = lamps[index];
            if (motion.matches) {
                nightLatched = !nightLatched;
                lamp.latched = nightLatched; lamp.level = nightLatched ? 1 : 0;
                origin = index; journey = nightLatched ? 4.4 : 0; draw();
             } else {
                if (!lastInvitation || journey < .05) origin = index;
                lastInvitation = performance.now() + 1600;
                lamp.holdUntil = performance.now() + 1900; wake();
            }
        };
        const touch = (event: PointerEvent) => {
            if (!(event.target instanceof Element) || event.target.closest('a, button')) return;
            const position = point(event);
            let index = nearest(position, true);
            if (index < 0 && event.pointerType === 'touch' && position[0]>560 && position[1]>120 && position[1]<HEIGHT) {
                index = HOUSES.map((house,i)=>({i,d:Math.hypot(house.center[0]-position[0],house.center[1]-position[1])})).sort((a,b)=>a.d-b.d)[0].i;
            }
            invite(index);
        };
        // User intent distinguishes scrolling from restored positions and anchor jumps.
        // One invitation per visit; reversing direction never scrubs the painting.
        const sceneVisible = () => {
            const height = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
            return height >= Math.min(160, bounds.height * .4, window.innerHeight * .32);
        };
        const armScroll = () => {
            // Passive wheel handlers may run after the compositor moves the page.
            // Use the preceding scroll position so the first gesture still counts.
            if (lastScrollY <= 12 && journey === 0) scrollFired = false;
            if (!scrollFired) {
                const now = performance.now();
                if (scrollStart === null || now > scrollIntentUntil) scrollStart = lastScrollY;
                scrollIntentUntil = now + 700;
            }
        };
        const scrollInvite = () => {
            if (performance.now() > scrollIntentUntil) { scrollPending = false; scrollStart = null; return; }
            if (!scrollPending || scrollFired || !drawable() || !sceneVisible()) return;
            scrollPending = false; scrollFired = true; scrollStart = null;
            if (motion.matches) {
                nightLatched = true; origin = 1; journey = 4.4;
                lamps[1].level = 1; lamps[1].latched = true; draw();
            } else invite(1);
        };
        const scroll = () => {
            measure();
            const y = window.scrollY;
            if (y < lastScrollY || performance.now() > scrollIntentUntil) {
                scrollStart = null; scrollPending = false;
            }
            if (y > lastScrollY && scrollStart !== null && y - scrollStart >= 20 && sceneVisible()) {
                scrollPending = true; scrollInvite();
            }
            lastScrollY = y;
        };
        const wheel = (event: WheelEvent) => { if (event.deltaY > 0 && !event.ctrlKey) armScroll(); };
        const touchStart = (event: TouchEvent) => { touchStartY = event.touches[0]?.clientY ?? 0; };
        const touchMove = (event: TouchEvent) => {
            if (touchStartY - (event.touches[0]?.clientY ?? touchStartY) > 2) armScroll();
        };
        const scrollKey = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
            if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="textbox"]')) return;
            if (event.key === ' ' && event.target instanceof Element && event.target.closest('a, button, [role="button"]')) return;
            if (['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) armScroll();
        };
        const focus = (event: FocusEvent) => {
            if (event.target instanceof Element && event.target.closest('.hero__actions a')) invite(0);
        };
        const visibility = () => { if (!visible || document.hidden) reset(); else { measure(); draw(); } };
        const preference = () => { reset(); draw(); };
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
        const resize = new ResizeObserver(() => { measure(); approach(-1); });
        observer.observe(hero); resize.observe(hero);
        hero.addEventListener('pointerenter', measure, { passive: true });
        hero.addEventListener('pointermove', move, { passive: true });
        hero.addEventListener('pointerleave', leave, { passive: true });
        hero.addEventListener('pointerdown', touch, { passive: true });
        hero.addEventListener('focusin', focus);
        window.addEventListener('scroll', scroll, { passive: true });
        window.addEventListener('wheel', wheel, { passive: true });
        window.addEventListener('touchstart', touchStart, { passive: true });
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('keydown', scrollKey);
        document.addEventListener('visibilitychange', visibility);
        motion.addEventListener('change', preference);

        void Promise.all([base.decode(), nearImage.decode(), skyImage.decode()]).then(() => {
            if (disposed) return;
            const sample = document.createElement('canvas'); sample.width = WIDTH; sample.height = HEIGHT;
            const source = sample.getContext('2d', { willReadFrequently: true });
            if (!source) return;
            source.drawImage(base, 0, 0, WIDTH, HEIGHT);
            // Connected amber panes exclude long roof rims, the sun's water reflection,
            // and single-pixel foliage glints from the illuminated-night palette.
            const original = source.getImageData(0,0,WIDTH,HEIGHT).data;
            const visited = new Uint8Array(WIDTH*HEIGHT), warmGlass = new Set<number>();
            const amber = (pixel: number) => {
                const i=pixel*4,r=original[i],g=original[i+1],b=original[i+2];
                return pixel/WIDTH>250 && r>210 && g>135 && r-b>90 && g>b*1.5;
            };
            for(let pixel=250*WIDTH;pixel<WIDTH*HEIGHT;pixel++) {
                if(visited[pixel] || !amber(pixel)) continue;
                const group=[pixel];visited[pixel]=1;
                let left=WIDTH,right=0,top=HEIGHT,bottom=0;
                for(let n=0;n<group.length;n++) {
                    const p=group[n],x=p%WIDTH,y=Math.floor(p/WIDTH);
                    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
                    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                        const xx=x+dx,yy=y+dy,q=yy*WIDTH+xx;
                        if(xx>=0&&xx<WIDTH&&yy>=250&&yy<HEIGHT&&!visited[q]&&amber(q)) { visited[q]=1;group.push(q); }
                    }
                }
                if(group.length>=2&&group.length<=110&&right-left<=14&&bottom-top<=20&&(bottom-top>0||group.length<4)) group.forEach(p=>warmGlass.add(p));
            }
            const make = (image: HTMLImageElement, sky = false, foreground = false) => {
                const bitmap = document.createElement('canvas'); bitmap.width = WIDTH; bitmap.height = HEIGHT;
                const g = bitmap.getContext('2d', { willReadFrequently: true });
                if (!g) return bitmap;
                g.drawImage(image,0,0,WIDTH,HEIGHT);
                const data = g.getImageData(0,0,WIDTH,HEIGHT);
                for (let y=0; y<HEIGHT; y++) for (let x=0; x<WIDTH; x++) {
                    const i=(y*WIDTH+x)*4, p=data.data;
                    if (sky) { const silhouette = y>140 && original[i]+original[i+1]+original[i+2]<385; p[i+3] = silhouette ? 0 : Math.round(p[i+3] * ease((skyline(x) - y) / 9)); continue; }
                    const r=p[i], green=p[i+1], b=p[i+2];
                    const brightness=.2126*r+.7152*green+.0722*b;
                    const window = !foreground && warmGlass.has(y*WIDTH+x);
                    if (window) { p[i]=Math.min(255,r*1.02); p[i+1]=green*.94; p[i+2]=b*.82; }
                    else {
                        // Preserve every source edge, but remove sunset rim light.
                        const exposure=.28 + .1 * Math.min(1,y/HEIGHT);
                        p[i]=14+r*exposure; p[i+1]=20+green*exposure; p[i+2]=40+b*.4+brightness*.065;
                    }
                }
                g.putImageData(data,0,0); return bitmap;
            };
            nightTown = make(base); nightNear = make(nearImage,false,true); nightSky = make(skyImage,true);
            cityBanks = Array.from({length:8},(_,bank) => {
                const x=bank*160, bitmap=document.createElement('canvas'); bitmap.width=160; bitmap.height=HEIGHT-225;
                const g=bitmap.getContext('2d');
                if (!g) return {image:bitmap,x};
                const input=source.getImageData(x,225,160,HEIGHT-225), out=new ImageData(160,HEIGHT-225);
                for(let i=0;i<input.data.length;i+=4) {
                    const p=input.data,r=p[i],green=p[i+1],b=p[i+2];
                    // Only the brightest amber glass; roof tiles and foliage stay untouched.
                    if (warmGlass.has((225+Math.floor(i/4/160))*WIDTH+x+(i/4)%160)) {
                        out.data[i]=38+r*.1;out.data[i+1]=40+green*.1;out.data[i+2]=62+b*.1;out.data[i+3]=230;
                    }
                }
                g.putImageData(out,0,0); return {image:bitmap,x};
            });
            patches = HOUSES.map(house => {
                const [left,top,width,height] = house.bounds;
                const pixels = source.getImageData(left,top,width,height).data;
                const buffers = [new ImageData(width,height),new ImageData(width,height),new ImageData(width,height)];
                const vertices = house.panes.flat();
                const opening = [Math.min(...vertices.map(p=>p[0])) - 1, Math.min(...vertices.map(p=>p[1])) - 1,
                    Math.max(...vertices.map(p=>p[0])) + 1, Math.max(...vertices.map(p=>p[1])) + 1];
                for (let py = 0; py < height; py++) for (let px = 0; px < width; px++) {
                    const i = (py * width + px) * 4, x = left + px + .5, y = top + py + .5;
                    const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
                    const pane = house.panes.some(polygon => inside(x,y,polygon));
                    const glass = pane && r > 165 && g > 90 && r - b > 65;
                    if (glass) {
                        const off = buffers[0].data, glint = buffers[2].data;
                        off[i] = Math.round(r * .12 + 35); off[i+1] = Math.round(g * .12 + 38); off[i+2] = Math.round(b * .12 + 50); off[i+3] = 255;
                        glint[i] = 255; glint[i+1] = 204 + Math.round(g * .15); glint[i+2] = 135 + Math.round(g * .15); glint[i+3] = Math.round(Math.max(0,g - 140) * .7);
                    } else if (!(x >= opening[0] && x <= opening[2] && y >= opening[1] && y <= opening[3]) && inside(x,y,house.wall) && r + g + b > 155 && r > b * .65) {
                        // Perspective-shaped facade reflection, not a circular overlay.
                        // Source luminance keeps pipes, eaves and plant shadows dark.
                        const dx = Math.abs(x - house.center[0]) / 17, dy = Math.abs(y - house.center[1]) / 21;
                        const attenuation = Math.exp(-(dx + dy) * 1.4);
                        const shadow = Math.min(1,Math.max(0,(r+g+b-155)/280));
                        const spill = buffers[1].data;
                        spill[i] = 241; spill[i+1] = 132; spill[i+2] = 69;
                        spill[i+3] = Math.round(attenuation * shadow * 62);
                    }
                }
                const bitmaps = buffers.map(buffer => {
                    const bitmap = document.createElement('canvas'); bitmap.width = width; bitmap.height = height;
                    bitmap.getContext('2d')?.putImageData(buffer,0,0); return bitmap;
                });
                return { off: bitmaps[0], spill: bitmaps[1], glint: bitmaps[2] };
            });
            measure(); draw(); lastScrollY = window.scrollY; scrollInvite();
        }).catch(() => { /* The original painting remains a complete static fallback. */ });
        return () => {
            disposed = true; halt(); observer.disconnect(); resize.disconnect();
            hero.removeEventListener('pointerenter', measure);
            hero.removeEventListener('pointermove', move);
            hero.removeEventListener('pointerleave', leave);
            hero.removeEventListener('pointerdown', touch);
            hero.removeEventListener('focusin', focus);
            window.removeEventListener('scroll', scroll);
            window.removeEventListener('wheel', wheel);
            window.removeEventListener('touchstart', touchStart);
            window.removeEventListener('touchmove', touchMove);
            window.removeEventListener('keydown', scrollKey);
            document.removeEventListener('visibilitychange', visibility);
            motion.removeEventListener('change', preference);
        };
    }, []);

    return (
        <div ref={rootRef} className="sunset-landscape" aria-hidden="true">
            <div className="sunset-landscape__frame">
                <div className="sunset-landscape__layer">
                    <Image src="/images/identity/sunset-town.webp" alt="" width={WIDTH} height={HEIGHT} priority unoptimized />
                </div>
                <div className="sunset-landscape__layer sunset-landscape__lights">
                    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
                </div>
                <div className="sunset-landscape__layer sunset-landscape__near">
                    <Image src="/images/identity/sunset-foreground.webp" alt="" width={WIDTH} height={HEIGHT} priority unoptimized />
                    <canvas ref={nearRef} width={WIDTH} height={HEIGHT} className="sunset-landscape__night-near" />
                </div>
            </div>
        </div>
    );
}
