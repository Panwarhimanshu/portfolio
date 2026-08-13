"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Globe, Layers, ArrowUpRight, Download, Zap } from "lucide-react";
import { AboutSection as AboutType } from "@prisma/client";
import { TiltCard } from "@/components/ui/tilt-card";
import { GlitchText } from "@/components/ui/glitch-text";

const stats = [
    { value: 3, suffix: "+", label: "Years Coding" },
    { value: 20, suffix: "+", label: "Projects Built" },
    { value: 10, suffix: "+", label: "Technologies" },
    { value: 100, suffix: "%", label: "Passion" },
];

const skills = [
    { name: "Frontend (React/Next.js)", pct: 93, color: "#7c3aed", glow: "rgba(124,58,237,0.6)" },
    { name: "Backend (Node/APIs)", pct: 82, color: "#06b6d4", glow: "rgba(6,182,212,0.6)" },
    { name: "UI/UX & Motion Design", pct: 78, color: "#ec4899", glow: "rgba(236,72,153,0.6)" },
    { name: "Cloud & DevOps", pct: 70, color: "#10b981", glow: "rgba(16,185,129,0.6)" },
    { name: "Cybersecurity", pct: 72, color: "#f59e0b", glow: "rgba(245,158,11,0.6)" },
];

const traits = [
    { icon: Code2, label: "Clean code", color: "#7c3aed" },
    { icon: Zap, label: "Performance", color: "#06b6d4" },
    { icon: Globe, label: "Full-stack", color: "#ec4899" },
    { icon: Layers, label: "Systems thinking", color: "#10b981" },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (!inView || started.current) return;
        started.current = true;
        let n = 0;
        const step = Math.ceil(value / 60);
        const t = setInterval(() => {
            n = Math.min(n + step, value);
            setCount(n);
            if (n >= value) clearInterval(t);
        }, 20);
        return () => clearInterval(t);
    }, [inView, value]);

    return <span className="tabular-nums">{count}{suffix}</span>;
}

export function AboutSection({ about }: { about: AboutType | null }) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const yLeft = useTransform(scrollYProgress, [0, 1], [50, -50]);

    const bio = about?.bio || "I'm a full-stack developer and cybersecurity enthusiast, obsessed with building next-gen digital experiences. I merge technical depth with motion design to create interfaces that don't just work — they feel extraordinary.";
    const resumeLink = about?.resumeLink;

    return (
        <section
            ref={ref}
            id="about"
            className="relative py-32 px-6 lg:px-24 w-full max-w-[1600px] mx-auto overflow-hidden"
        >
            {/* Ghost heading watermark */}
            <div className="absolute -top-8 left-0 right-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <span className="text-[10vw] font-black tracking-tighter text-foreground/[0.025] whitespace-nowrap">ABOUT ME</span>
            </div>

            {/* Ambient glows */}
            <div className="absolute -left-48 top-1/3 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-0"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07), transparent)" }}
            />
            <div className="absolute -right-32 bottom-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06), transparent)" }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* ── Left: Visual card ── */}
                <motion.div style={{ y: yLeft }} className="flex flex-col items-center lg:items-start gap-8">
                    <TiltCard
                        intensity={10}
                        className="w-72 h-80 rounded-3xl overflow-hidden"
                    >
                        {/* Neon gradient border */}
                        <div className="absolute -inset-px rounded-3xl z-0"
                            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.7), rgba(6,182,212,0.4), rgba(236,72,153,0.5))" }}
                        />
                        <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] z-10 overflow-hidden">
                            {about?.avatarUrl ? (
                                <img
                                    src={about.avatarUrl}
                                    alt="Himanshu"
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15), rgba(236,72,153,0.1))" }}>
                                    <GlitchText
                                        text="H"
                                        className="text-8xl font-black text-gradient-neon"
                                        delay={400}
                                    />
                                </div>
                            )}
                        </div>
                        {/* Floating location badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.7 }}
                            className="absolute bottom-4 right-4 z-30 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-xl"
                            style={{ background: "rgba(0,0,0,0.7)" }}
                        >
                            <p className="text-[10px] text-muted-foreground font-mono">Based in</p>
                            <p className="text-xs font-bold text-foreground">India 🇮🇳</p>
                        </motion.div>
                    </TiltCard>

                    {/* Trait pills */}
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                        {traits.map((t, i) => (
                            <motion.div
                                key={t.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3 + i * 0.09 }}
                                className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/30 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: `${t.color}18` }}>
                                    <t.icon className="w-4 h-4" style={{ color: t.color }} />
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground">{t.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Right: Content ── */}
                <div className="flex flex-col gap-10">
                    {/* Label + heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
                            <span className="h-px w-8 bg-primary/40 inline-block" />
                            About Me
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5 leading-[1.08]">
                            Crafting the{" "}
                            <span className="text-gradient-neon">future</span>
                            <br />of the web.
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-lg">{bio}</p>
                    </motion.div>

                    {/* Stat grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-muted/30 hover:border-primary/20 transition-colors duration-300"
                            >
                                <span className="text-3xl font-black text-gradient-neon">
                                    <Counter value={s.value} suffix={s.suffix} inView={isInView} />
                                </span>
                                <span className="text-[11px] text-muted-foreground leading-tight font-mono">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Neon skill bars */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        {skills.map((s, i) => (
                            <div key={s.name}>
                                <div className="flex justify-between text-[11px] mb-2 font-mono">
                                    <span className="text-foreground/80">{s.name}</span>
                                    <span className="text-muted-foreground">{s.pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden"
                                    className="bg-muted"
                                    style={{}}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={isInView ? { width: `${s.pct}%` } : { width: 0 }}
                                        transition={{ delay: 0.4 + i * 0.08, duration: 1, ease: "easeOut" }}
                                        className="h-full rounded-full relative"
                                        style={{ background: s.color, boxShadow: `0 0 10px ${s.glow}` }}
                                    >
                                        <div className="absolute right-0 top-0 bottom-0 w-3 rounded-full blur-sm"
                                            style={{ background: "white", opacity: 0.6 }}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Resume CTA */}
                    {resumeLink && resumeLink !== "#" && (
                        <motion.a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.65 }}
                            className="inline-flex items-center gap-2 text-sm font-mono font-medium text-primary hover:text-primary/80 transition-colors w-fit group"
                        >
                            <Download className="w-4 h-4" />
                            Download Resume
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </motion.a>
                    )}
                </div>
            </div>
        </section>
    );
}
