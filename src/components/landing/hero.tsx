"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Globe } from "lucide-react";
import { ParticleField } from "@/components/ui/particle-field";
import { Magnetic } from "@/components/ui/magnetic";
import { GlitchText } from "@/components/ui/glitch-text";
import { TiltCard } from "@/components/ui/tilt-card";
import { HeroSection } from "@prisma/client";

const ROLES = ["Full Stack Developer", "UI/UX Architect", "Motion Designer", "Cloud Engineer", "Cybersecurity Pro"];
const SKILLS = ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "AWS"];

export function Hero({ content }: { content: HeroSection | null }) {
    const ref = useRef<HTMLElement>(null);
    const [roleIdx, setRoleIdx] = useState(0);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

    useEffect(() => {
        const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2700);
        return () => clearInterval(t);
    }, []);

    return (
        <section
            ref={ref}
            className="relative min-h-screen w-full flex items-center overflow-hidden bg-background"
        >
            {/* Particle field */}
            <div className="absolute inset-0 z-0">
                <ParticleField />
            </div>

            {/* Line grid */}
            <div className="absolute inset-0 z-[1] line-grid pointer-events-none" />

            {/* Scan line sweep */}
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute left-0 right-0 h-[1px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(6,182,212,0.3), transparent)" }}
                    animate={{ top: ["-2%", "102%"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                />
            </div>

            {/* Edge vignette */}
            <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_30%,hsl(var(--background)/0.9)_100%)]" />

            {/* Ambient glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] z-[1] pointer-events-none rounded-full blur-[160px]"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] z-[1] pointer-events-none rounded-full blur-[140px]"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent)" }} />

            {/* Main content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center pt-24 pb-20"
            >
                {/* ── Left column ── */}
                <div className="flex flex-col gap-7">

                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 w-fit px-4 py-2 rounded-full border border-border bg-muted/40 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase">Available For Work</span>
                    </motion.div>

                    {/* Main heading — glitch scramble */}
                    <div className="flex flex-col gap-1 overflow-hidden">
                        {["CREATIVE", "DEVELOPER."].map((word, wi) => (
                            <motion.div
                                key={word}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 + wi * 0.14, ease: "easeOut" }}
                            >
                                <GlitchText
                                    text={word}
                                    delay={300 + wi * 150}
                                    continuous={wi === 1}
                                    className={
                                        "block text-[4.2rem] sm:text-[5.5rem] lg:text-[7.5rem] font-black tracking-[-0.04em] leading-[0.92] " +
                                        (wi === 1
                                            ? "text-gradient-neon"
                                            : "text-foreground")
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Typewriter role */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="flex items-center gap-3"
                    >
                        <div className="h-px w-10 bg-primary/60" />
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={roleIdx}
                                initial={{ y: 14, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -14, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-[11px] sm:text-sm font-mono text-primary/90 tracking-[0.18em] uppercase"
                            >
                                {ROLES[roleIdx]}
                            </motion.span>
                        </AnimatePresence>
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                            className="inline-block w-[2px] h-4 bg-primary"
                        />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.6 }}
                        className="text-muted-foreground max-w-md leading-relaxed text-base"
                    >
                        {content?.subheading ||
                            "Architecting next-generation digital experiences. I blend code, design, and motion into interfaces people actually remember."}
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.78 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Magnetic strength={0.3}>
                            <a href="#projects">
                                <button className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.55)]">
                                    <span className="relative z-10 flex items-center gap-2">
                                        View My Work
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </a>
                        </Magnetic>

                        <Magnetic strength={0.3}>
                            <a href="#contact-form">
                                <button className="group flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-foreground font-semibold text-sm backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                                    Let&apos;s Talk
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                            </a>
                        </Magnetic>
                    </motion.div>

                    {/* Social icons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.95 }}
                        className="flex items-center gap-2 pt-1"
                    >
                        {[
                            { icon: Github, href: "#", label: "GitHub" },
                            { icon: Linkedin, href: "#", label: "LinkedIn" },
                            { icon: Globe, href: "#", label: "Website" },
                        ].map(({ icon: Icon, href, label }) => (
                            <Magnetic key={label} strength={0.45}>
                                <a
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            </Magnetic>
                        ))}
                        <div className="h-px w-8 bg-border ml-2" />
                        <span className="text-xs font-mono text-muted-foreground/50 tracking-widest">2026</span>
                    </motion.div>
                </div>

                {/* ── Right column — 3D card ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.82, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
                    className="hidden lg:flex items-center justify-center perspective-1200"
                >
                    <TiltCard
                        intensity={15}
                        className="w-[340px] h-[480px] rounded-[2rem] overflow-hidden"
                    >
                        {/* Gradient border */}
                        <div className="absolute -inset-px rounded-[2rem] z-0"
                            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.3), rgba(236,72,153,0.4))" }}
                        />
                        {/* Card body */}
                        <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] z-10 overflow-hidden bg-card/80"
                            style={{ backdropFilter: "blur(24px)" }}
                        >
                            {/* Terminal header */}
                            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40">
                                {["#ff5f57", "#ffbd2e", "#28c840"].map(c => (
                                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                                ))}
                                <span className="text-[10px] font-mono text-muted-foreground/40 ml-2 tracking-widest">himanshu.dev</span>
                            </div>

                            <div className="flex flex-col items-center justify-between h-[calc(100%-48px)] p-7">
                                {/* Orbiting avatar */}
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="relative w-36 h-36">
                                        {/* Orbit rings */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-5 rounded-full border border-dashed"
                                            style={{ borderColor: "rgba(124,58,237,0.35)" }}
                                        />
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-10 rounded-full border border-dashed"
                                            style={{ borderColor: "rgba(6,182,212,0.2)" }}
                                        />

                                        {/* Core */}
                                        <div className="w-full h-full rounded-full flex items-center justify-center border border-border/40"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(99,102,241,0.25), rgba(6,182,212,0.2))",
                                                boxShadow: "0 0 40px rgba(124,58,237,0.35), inset 0 0 30px rgba(124,58,237,0.15)"
                                            }}
                                        >
                                            <span className="text-5xl font-black text-gradient-neon">H</span>
                                        </div>

                                        {/* Orbiting dot — primary */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-5"
                                        >
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400"
                                                style={{ boxShadow: "0 0 12px rgba(52,211,153,0.9), 0 0 24px rgba(52,211,153,0.5)" }}
                                            />
                                        </motion.div>

                                        {/* Orbiting dot — secondary */}
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-10"
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400"
                                                style={{ boxShadow: "0 0 10px rgba(6,182,212,0.9)" }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Name + title */}
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Himanshu</h3>
                                    <p className="text-[11px] font-mono text-muted-foreground mt-1 tracking-[0.15em]">FULL STACK DEVELOPER</p>
                                </div>

                                {/* Skill chips */}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {SKILLS.map((s, i) => (
                                        <motion.span
                                            key={s}
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.6 + i * 0.06 }}
                                            className="px-2.5 py-1 text-[10px] font-medium rounded-full border border-border bg-muted/50 text-muted-foreground"
                                        >
                                            {s}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Bottom status bar */}
                                <div className="w-full mt-5 flex items-center justify-between px-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Online</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-muted-foreground/40">India • UTC+5:30</span>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[9px] font-mono text-muted-foreground/40 tracking-[0.3em] uppercase">Scroll</span>
                <motion.div
                    animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-px h-10 origin-top"
                    style={{ background: "linear-gradient(to bottom, rgba(124,58,237,0.8), transparent)" }}
                />
            </motion.div>
        </section>
    );
}
