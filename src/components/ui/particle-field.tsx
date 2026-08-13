"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    radius: number;
    hue: number;
    alpha: number;
}

const HUES = [262, 192, 322];
const N = 70;
const CONNECT = 140;
const REPEL = 130;

export function ParticleField({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ptRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -999, y: -999 });
    const rafRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.scale(dpr, dpr);
            ptRef.current = Array.from({ length: N }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 1.6 + 0.5,
                hue: HUES[Math.floor(Math.random() * HUES.length)],
                alpha: Math.random() * 0.45 + 0.15,
            }));
        };

        const onMouse = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouse);

        const tick = () => {
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            ctx.clearRect(0, 0, W, H);
            const pts = ptRef.current;
            const m = mouseRef.current;

            for (const p of pts) {
                const dx = p.x - m.x;
                const dy = p.y - m.y;
                const d = Math.hypot(dx, dy);
                if (d < REPEL && d > 0) {
                    const f = (1 - d / REPEL) * 0.55;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x = (p.x + p.vx + W) % W;
                p.y = (p.y + p.vy + H) % H;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                /* darker saturation so particles show on light bg */
                ctx.fillStyle = `hsla(${p.hue},60%,45%,${p.alpha * 0.7})`;
                ctx.fill();
            }

            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const d = Math.hypot(dx, dy);
                    if (d < CONNECT) {
                        const a = (1 - d / CONNECT) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `hsla(262,60%,45%,${a})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouse);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{ display: "block" }}
        />
    );
}
