"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
    children: string;
    baseVelocity: number;
    stroke?: boolean;
}

function ParallaxText({ children, baseVelocity = 100, stroke = false }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        if (velocityFactor.get() < 0) directionFactor.current = -1;
        else if (velocityFactor.get() > 0) directionFactor.current = 1;
        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const textStyle = stroke
        ? {
            WebkitTextStroke: "1.5px rgba(124,58,237,0.4)",
            color: "transparent",
        }
        : {
            background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
        };

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap my-1">
            <motion.div
                className="flex whitespace-nowrap flex-nowrap font-black uppercase select-none"
                style={{ x, fontSize: "clamp(5rem,12vw,10rem)", letterSpacing: "-0.04em", lineHeight: 1, ...textStyle }}
            >
                {Array(4).fill(null).map((_, i) => (
                    <span key={i} className="mr-[2vw] inline-block">
                        {children}&nbsp;
                        <span style={{ color: stroke ? "rgba(124,58,237,0.4)" : "rgba(124,58,237,0.35)" }}>✦</span>
                        &nbsp;
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

export function VelocityScroll() {
    return (
        <section className="py-16 w-full overflow-hidden pointer-events-none select-none relative">
            <div className="absolute inset-0 bg-background" />
            <div className="relative z-10">
                <ParallaxText baseVelocity={-1.8} stroke={false}>Strategy Design Development</ParallaxText>
                <ParallaxText baseVelocity={1.8} stroke={true}>Motion Interface Engineering</ParallaxText>
            </div>
        </section>
    );
}
