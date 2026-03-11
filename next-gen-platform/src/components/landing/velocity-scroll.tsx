"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
    children: string;
    baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
            <motion.div className="scroller font-bold uppercase text-[9rem] md:text-[12rem] flex whitespace-nowrap flex-nowrap" style={{ x }}>
                <span className="block mr-[30px]">{children} </span>
                <span className="block mr-[30px]">{children} </span>
                <span className="block mr-[30px]">{children} </span>
                <span className="block mr-[30px]">{children} </span>
            </motion.div>
        </div>
    );
}

export function VelocityScroll() {
    return (
        <section className="py-20 w-full overflow-hidden text-muted-foreground/20 select-none pointer-events-none">
            <ParallaxText baseVelocity={-2}>Strategy Design Development</ParallaxText>
            <ParallaxText baseVelocity={2}>Motion 3D Interface</ParallaxText>
        </section>
    );
}
