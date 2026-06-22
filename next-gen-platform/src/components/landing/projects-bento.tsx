"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PortfolioProject } from "@prisma/client";
import { TiltCard } from "@/components/ui/tilt-card";
import { Magnetic } from "@/components/ui/magnetic";

const defaultProjects = [
    { id: "1", title: "Quantum Nexus", description: "High-performance analytics dashboard for real-time data visualization with AI-powered insights.", tags: "Next.js,Tailwind,Framer Motion,AI", link: "#", image: null, colSpan: 2, order: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: "2", title: "Ether UI", description: "A premium glassmorphic component library with complex micro-interactions.", tags: "React,TypeScript,Motion", link: "#", image: null, colSpan: 1, order: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: "3", title: "NovaPay", description: "Fintech payment platform built for scale with real-time transaction monitoring.", tags: "Node.js,MongoDB,Stripe", link: "#", image: null, colSpan: 1, order: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: "4", title: "Orbital CMS", description: "Headless CMS with AI content generation and instant edge deployment.", tags: "Next.js,Prisma,OpenAI", link: "#", image: null, colSpan: 2, order: 3, createdAt: new Date(), updatedAt: new Date() },
];

const cardThemes = [
    {
        gradient: "from-violet-50 via-indigo-50/60 to-white/0",
        glow: "rgba(124,58,237,0.15)",
        border: "rgba(139,92,246,0.35)",
        tag: "bg-violet-100 text-violet-700 border-violet-200",
        accent: "#7c3aed",
        shadow: "0 2px 12px rgba(124,58,237,0.10), 0 1px 3px rgba(0,0,0,0.07)",
        shadowHover: "0 8px 32px rgba(124,58,237,0.22), 0 2px 8px rgba(0,0,0,0.08)",
        topBar: "#7c3aed",
    },
    {
        gradient: "from-cyan-50 via-sky-50/60 to-white/0",
        glow: "rgba(6,182,212,0.15)",
        border: "rgba(6,182,212,0.35)",
        tag: "bg-cyan-100 text-cyan-700 border-cyan-200",
        accent: "#0891b2",
        shadow: "0 2px 12px rgba(6,182,212,0.10), 0 1px 3px rgba(0,0,0,0.07)",
        shadowHover: "0 8px 32px rgba(6,182,212,0.22), 0 2px 8px rgba(0,0,0,0.08)",
        topBar: "#0891b2",
    },
    {
        gradient: "from-pink-50 via-rose-50/60 to-white/0",
        glow: "rgba(236,72,153,0.15)",
        border: "rgba(236,72,153,0.35)",
        tag: "bg-pink-100 text-pink-700 border-pink-200",
        accent: "#db2777",
        shadow: "0 2px 12px rgba(236,72,153,0.10), 0 1px 3px rgba(0,0,0,0.07)",
        shadowHover: "0 8px 32px rgba(236,72,153,0.22), 0 2px 8px rgba(0,0,0,0.08)",
        topBar: "#db2777",
    },
    {
        gradient: "from-emerald-50 via-teal-50/60 to-white/0",
        glow: "rgba(16,185,129,0.15)",
        border: "rgba(16,185,129,0.35)",
        tag: "bg-emerald-100 text-emerald-700 border-emerald-200",
        accent: "#059669",
        shadow: "0 2px 12px rgba(16,185,129,0.10), 0 1px 3px rgba(0,0,0,0.07)",
        shadowHover: "0 8px 32px rgba(16,185,129,0.22), 0 2px 8px rgba(0,0,0,0.08)",
        topBar: "#059669",
    },
];

export function ProjectsBento({ projects }: { projects: PortfolioProject[] }) {
    const list = projects && projects.length > 0 ? projects : defaultProjects as any;

    return (
        <section id="projects" className="py-28 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
                    <span className="h-px w-8 bg-primary/40 inline-block" />
                    Portfolio
                </span>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                        Selected <span className="text-gradient-neon">Works</span>.
                    </h2>
                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                        A showcase of digital craftsmanship — engineering meets design at the edge of innovation.
                    </p>
                </div>
            </motion.div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[380px]">
                {list.map((project: PortfolioProject, i: number) => {
                    const tags = project.tags ? project.tags.split(",").map(t => t.trim()) : [];
                    const theme = cardThemes[i % cardThemes.length];

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.07 }}
                            className={project.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"}
                        >
                                <TiltCard
                                intensity={8}
                                className="h-full rounded-2xl overflow-hidden"
                            >
                                <div
                                    className="group absolute inset-0 rounded-2xl overflow-hidden"
                                    style={{
                                        border: `1px solid ${theme.border}`,
                                        boxShadow: theme.shadow,
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.boxShadow = theme.shadowHover;
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.boxShadow = theme.shadow;
                                    }}
                                >
                                    {/* Image / fallback background */}
                                    {(project as any).image ? (
                                        <img
                                            src={(project as any).image}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                                    )}

                                    {/* Always-visible bottom title strip */}
                                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 z-10"
                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
                                        <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                                            {project.title}
                                        </h3>
                                    </div>

                                    {/* Hover overlay — slides up */}
                                    <div className="absolute inset-0 z-20 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out rounded-2xl"
                                        style={{ background: `linear-gradient(to top, ${theme.accent}ee 0%, ${theme.accent}bb 60%, ${theme.accent}88 100%)` }}>
                                        <div className="p-6 flex flex-col gap-3">
                                            {/* Tags */}
                                            <div className="flex gap-2 flex-wrap">
                                                {tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="text-[10px] px-3 py-1 rounded-full border border-white/30 bg-white/20 text-white font-semibold backdrop-blur-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Title + desc */}
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">
                                                    {project.title}
                                                </h3>
                                                <p className="text-white/85 text-sm leading-relaxed mt-1.5">
                                                    {project.description}
                                                </p>
                                            </div>

                                            {/* Link */}
                                            {project.link && (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 rounded-full w-fit transition-all duration-200"
                                                >
                                                    View Project
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Accent top bar */}
                                    <div className="absolute top-0 left-0 right-0 h-[3px] z-30 rounded-t-2xl"
                                        style={{ background: theme.topBar }} />
                                </div>
                            </TiltCard>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
