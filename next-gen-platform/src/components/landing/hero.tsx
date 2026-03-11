"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Command, Sparkles } from "lucide-react";
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
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                    "absolute inset-0 h-full w-full fill-neutral-400/30 stroke-neutral-400/30",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
                )}
            />
            <section
                ref={ref}
                className="relative z-10 w-full overflow-hidden flex items-center justify-center p-6 lg:p-24"
            >
                <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left: Content */}
                    <motion.div
                        style={{ y, opacity }}
                        className="flex flex-col gap-6 text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mx-auto lg:mx-0 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground/80">
                                Open for work
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-6xl lg:text-9xl font-bold tracking-tighter text-foreground drop-shadow-2xl"
                            style={{ lineHeight: 1 }}
                        >
                            {content?.heading ? (
                                content.heading
                            ) : (
                                <>
                                    Creative.
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse">
                                        Developer.
                                    </span>
                                </>
                            )}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-2xl text-muted-foreground/80 max-w-xl mx-auto lg:mx-0 font-light"
                        >
                            {content?.subheading || "Building next-generation digital experiences. Specializing in React, Motion Design, and High-Performance Applications."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Button size="lg" className="rounded-full text-base px-8 h-12 shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:shadow-[0_0_30px_rgba(var(--primary),0.8)] transition-all bg-foreground text-background border-none hover:scale-105 active:scale-95 duration-300">
                                {content?.ctaText || "View Projects"}
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-12 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all duration-300">
                                <Command className="mr-2 w-4 h-4" /> Contact Me
                            </Button>

                        </motion.div>
                    </motion.div>

                    {/* Right: Abstract 3D/Glass Element or Custom Image */}
                    <motion.div
                        style={{ scale }}
                        className="relative h-[500px] w-full hidden lg:flex items-center justify-center perspective-[1000px] grayscale hover:grayscale-0 transition-all duration-700"
                    >
                        {(content as any)?.imageUrl ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20, rotateY: -10 }}
                                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative w-full h-full flex items-center justify-center p-8 active:scale-95 transition-transform duration-500"
                            >
                                <img
                                    src={(content as any).imageUrl}
                                    alt="Hero Graphic"
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl"
                                />

                                {/* Overlay glow */}
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10 animate-pulse" />
                            </motion.div>
                        ) : (
                            <>
                                {/* Glass Card Stack Fallback */}
                                <GlassCard className="absolute top-10 left-10 z-10 w-64 h-80 bg-white/5" delay={0.2} rotate="-6deg" />
                                <GlassCard className="absolute top-20 left-20 z-20 w-64 h-80 bg-white/10" delay={0.4} rotate="6deg" />
                                <GlassCard
                                    className="absolute z-30 w-72 h-96 bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-center group"
                                    delay={0.6}
                                    rotate="0deg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="text-center p-8">
                                        <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(var(--primary),0.3)] group-hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] transition-shadow duration-500">
                                            <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2 tracking-tight">Himanshu</h3>
                                        <p className="text-base text-muted-foreground/80 font-medium tracking-wide uppercase">
                                            Full Stack Engineer <br /> & UI Designer.
                                        </p>
                                    </div>
                                </GlassCard>
                            </>
                        )}
                    </motion.div>

                </div>
            </section>
        </AuroraBackground>
    );
}

function GlassCard({ className, delay, rotate, children }: { className?: string, delay: number, rotate: string, children?: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: "0deg", scale: 0.8 }}
            animate={{ opacity: 1, rotate: rotate, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: "0deg", zIndex: 50 }}
            transition={{ duration: 0.8, delay, type: "spring" }}
            className={`rounded-3xl border border-white/10 shadow-xl backdrop-blur-2xl ${className}`}
        >
            {children}
        </motion.div>
    );
}
