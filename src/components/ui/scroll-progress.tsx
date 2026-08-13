"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
            style={{
                scaleX,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
            }}
        />
    );
}
