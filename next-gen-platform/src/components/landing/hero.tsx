"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Spotlight } from "@/components/ui/spotlight";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { HeroSection } from "@prisma/client";



export function Hero({ content }: { content: HeroSection | null }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <AuroraBackground className="bg-background">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                    "absolute inset-0 h-full w-full fill-neutral-400/20 stroke-neutral-400/20",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
                )}
            />
            <section
                ref={ref}
                className="relative z-10 w-full min-h-screen overflow-hidden flex items-center justify-center p-6 lg:p-24"
            >
                <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left: Content */}
                    <motion.div
                        style={{ y, opacity }}
                        className="flex flex-col gap-6 text-center lg:text-left"
                    >
                        {/* Open for work badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2.5 mx-auto lg:mx-0 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20 backdrop-blur-md shadow-lg"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-sm font-medium text-foreground/80">
                                Available for new projects
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-6xl lg:text-[7rem] font-bold tracking-tighter text-foreground drop-shadow-2xl"
                            style={{ lineHeight: 0.95 }}
                        >
                            {content?.heading ? (
                                content.heading
                            ) : (
                                <>
                                    Creative.
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-500 to-pink-500"
                                        style={{ backgroundSize: "200% auto", animation: "shimmer 4s linear infinite" }}>
                                        Developer.
                                    </span>
                                </>
                            )}
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-xl text-muted-foreground/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
                        >
                            {content?.subheading || "Building next-generation digital experiences. Specializing in React, Motion Design, and High-Performance Applications."}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <a href="#projects">
                                <Button
                                    size="lg"
                                    className="group rounded-full text-base px-8 h-12 bg-foreground text-background border-none hover:scale-105 active:scale-95 duration-300 relative overflow-hidden"
                                    style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {content?.ctaText || "View Projects"}
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Button>
                            </a>
                            <a href={`mailto:${content ? '' : 'hello@example.com'}`}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full text-base px-8 h-12 border-white/30 hover:border-white/60 hover:bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    Contact Me
                                </Button>
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* Right: Glass Card Stack */}
                    <motion.div
                        style={{ scale }}
                        className="relative h-[520px] w-full hidden lg:flex items-center justify-center perspective-[1000px]"
                    >
                        {(content as any)?.imageUrl ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20, rotateY: -10 }}
                                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative w-full h-full flex items-center justify-center p-8"
                            >
                                <img
                                    src={(content as any).imageUrl}
                                    alt="Hero Graphic"
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl"
                                />
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10 animate-pulse" />
                            </motion.div>
                        ) : (
                            <>
                                {/* Background deco cards */}
                                <FloatingGlassCard
                                    className="absolute top-8 left-8 z-10 w-64 h-80 bg-white/3"
                                    delay={0.2}
                                    rotate="-8deg"
                                    floatDelay="0s"
                                />
                                <FloatingGlassCard
                                    className="absolute top-16 left-16 z-20 w-64 h-80 bg-indigo-500/5"
                                    delay={0.4}
                                    rotate="5deg"
                                    floatDelay="2s"
                                />
                                {/* Main card */}
                                <FloatingGlassCard
                                    className="absolute z-30 w-72 h-[400px] bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-2xl group"
                                    delay={0.6}
                                    rotate="0deg"
                                    floatDelay="1s"
                                >
                                    {/* Gradient glow */}
                                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 text-center p-8 flex flex-col items-center justify-center h-full gap-6">
                                        {/* Avatar ring */}
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/40 to-violet-600/40 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] transition-shadow duration-700">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-full" />
                                            </div>
                                            {/* orbit dot */}
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0"
                                            >
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold tracking-tight mb-1">Himanshu</h3>
                                        </div>
                                        {/* Skill chips */}
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {["Development", "Networking", "Cloud", "Cyber", "AI", "Troubleshooting"].map(skill => (
                                                <span key={skill} className="px-3 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-md">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </FloatingGlassCard>

                                {/* Side mini-cards */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1, duration: 0.7 }}
                                    className="absolute bottom-16 -right-4 z-40 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
                                    style={{ animation: "float 5s ease-in-out 0.5s infinite" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                            <span className="text-green-400 text-xs">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">Project Live!</p>
                                            <p className="text-xs text-muted-foreground">Deployed successfully</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2, duration: 0.7 }}
                                    className="absolute top-12 -right-8 z-40 bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
                                    style={{ animation: "float 7s ease-in-out 1s infinite" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⚡</span>
                                        <div>
                                            <p className="text-xs font-semibold">Performance</p>
                                            <p className="text-xs text-green-400 font-bold">99 / 100</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                </div>
            </section>
        </AuroraBackground>
    );
}

function FloatingGlassCard({
    className,
    delay,
    rotate,
    floatDelay,
    children
}: {
    className?: string;
    delay: number;
    rotate: string;
    floatDelay?: string;
    children?: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: "0deg", scale: 0.8 }}
            animate={{ opacity: 1, rotate: rotate, scale: 1 }}
            whileHover={{ scale: 1.04, rotate: "0deg", zIndex: 50 }}
            transition={{ duration: 0.8, delay, type: "spring" }}
            className={`rounded-3xl border border-white/10 shadow-xl backdrop-blur-2xl ${className}`}
            style={{ animation: `float 6s ease-in-out ${floatDelay ?? "0s"} infinite` }}
        >
            {children}
        </motion.div>
    );
}
