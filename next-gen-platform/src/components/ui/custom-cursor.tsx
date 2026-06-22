"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);

    const cursorX = useMotionValue(-300);
    const cursorY = useMotionValue(-300);

    const dotX = useSpring(cursorX, { damping: 42, stiffness: 900 });
    const dotY = useSpring(cursorY, { damping: 42, stiffness: 900 });
    const ringX = useSpring(cursorX, { damping: 16, stiffness: 160 });
    const ringY = useSpring(cursorY, { damping: 16, stiffness: 160 });

    useEffect(() => {
        setMounted(true);

        const onMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest("a, button, [data-cursor-hover], input, textarea")) setHovering(true);
        };
        const onOut = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest("a, button, [data-cursor-hover], input, textarea")) setHovering(false);
        };

        const onDown = () => setClicking(true);
        const onUp = () => setClicking(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onOver);
        window.addEventListener("mouseout", onOut);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
            window.removeEventListener("mouseout", onOut);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Core dot */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "rgba(167,139,250,1)",
                    boxShadow: "0 0 8px rgba(124,58,237,0.9), 0 0 16px rgba(124,58,237,0.5)",
                }}
                animate={{
                    width: clicking ? 5 : 8,
                    height: clicking ? 5 : 8,
                }}
                transition={{ duration: 0.08 }}
            />

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9998]"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: clicking ? 18 : hovering ? 50 : 36,
                    height: clicking ? 18 : hovering ? 50 : 36,
                    opacity: hovering ? 0.9 : 0.5,
                    borderColor: hovering ? "rgba(139,92,246,0.9)" : "rgba(124,58,237,0.55)",
                    boxShadow: hovering
                        ? "0 0 16px rgba(124,58,237,0.5), 0 0 32px rgba(124,58,237,0.2)"
                        : "0 0 8px rgba(124,58,237,0.2)",
                }}
                transition={{ duration: 0.15 }}
            />
        </>
    );
}
