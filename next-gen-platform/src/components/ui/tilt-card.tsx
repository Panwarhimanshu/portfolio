"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltCard({
    children,
    className = "",
    intensity = 12,
    glare = true,
}: {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glare?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const gx = useMotionValue(50);
    const gy = useMotionValue(50);
    const glareOp = useMotionValue(0);
    const glareSpring = useSpring(glareOp, { stiffness: 200, damping: 20 });

    const rotateX = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 280, damping: 26 });
    const rotateY = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 280, damping: 26 });

    const track = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
        gx.set(((e.clientX - r.left) / r.width) * 100);
        gy.set(((e.clientY - r.top) / r.height) * 100);
        glareOp.set(1);
    };

    const reset = () => {
        mx.set(0.5);
        my.set(0.5);
        gx.set(50);
        gy.set(50);
        glareOp.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={track}
            onMouseLeave={reset}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative ${className}`}
        >
            {children}
            {glare && (
                <motion.div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
                    style={{
                        opacity: glareSpring,
                        background: useTransform(
                            [gx, gy],
                            ([x, y]) =>
                                `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 58%)`
                        ),
                    }}
                />
            )}
        </motion.div>
    );
}
