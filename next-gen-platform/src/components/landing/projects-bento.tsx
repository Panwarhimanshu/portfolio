"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioProject } from "@prisma/client";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const defaultProjects = [
    {
        id: "1",
        title: "Quantum Nexus",
        description: "A high-performance analytics dashboard for next-gen data visualization.",
        tags: "Next.js, Tailwind, Framer Motion",
        link: "#",
        image: null,
        colSpan: 2,
    },
    {
        id: "2",
        title: "Ether UI",
        description: "A premium component library focusing on glassmorphism and micro-interactions.",
        tags: "React, CSS, Motion",
        link: "#",
        image: null,
        colSpan: 1,
    },
];

// Per-project gradient accent colours
const cardGradients = [
    "from-indigo-500/20 via-violet-500/10 to-transparent",
    "from-violet-500/20 via-pink-500/10 to-transparent",
    "from-cyan-500/20 via-indigo-500/10 to-transparent",
    "from-pink-500/20 via-orange-500/10 to-transparent",
    "from-emerald-500/20 via-cyan-500/10 to-transparent",
];
const cardGlows = [
    "rgba(99,102,241,0.3)",
    "rgba(139,92,246,0.3)",
    "rgba(6,182,212,0.3)",
    "rgba(236,72,153,0.3)",
    "rgba(16,185,129,0.3)",
];
const tagColors = [
    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
];

export function ProjectsBento({ projects }: { projects: PortfolioProject[] }) {
    const displayProjects = projects && projects.length > 0 ? projects : defaultProjects as any;

    return (
        <section id="projects" className="py-24 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <p className="text-sm font-medium uppercase tracking-widest mb-3 text-gradient w-fit">Portfolio</p>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                    Selected Works<span className="text-gradient">.</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    A showcase of digital craftsmanship — exploring the intersection of design, engineering, and human experience.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[420px]">
                {displayProjects.map((project: PortfolioProject, index: number) => {
                    const tags = project.tags ? project.tags.split(",").map((t: string) => t.trim()) : [];
                    const grad = cardGradients[index % cardGradients.length];
                    const glow = cardGlows[index % cardGlows.length];

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className={`${project.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"}`}
                        >
                            <CardSpotlight
                                className="h-full flex flex-col justify-between p-8 bg-muted/10 border-white/10 group overflow-hidden transition-all duration-500 hover:border-white/20"
                                style={{ "--glow": glow } as any}
                            >
                                {/* Glowing gradient mesh bg */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                                {/* Corner accent */}
                                <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle, ${glow}, transparent)` }} />

                                {/* Hover glow border */}
                                <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ boxShadow: `inset 0 0 0 1px ${glow}, 0 0 40px ${glow}` }} />

                                {/* Top: Tags + Link */}
                                <div className="flex justify-between items-start relative z-20">
                                    <div className="flex gap-2 flex-wrap">
                                        {tags.map((tag: string, ti: number) => (
                                            <span
                                                key={tag}
                                                className={`text-xs px-3 py-1 rounded-full border font-medium backdrop-blur-md ${tagColors[ti % tagColors.length]}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="rounded-full bg-background/20 border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 shrink-0"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                {/* Bottom: Title + Desc + Case study link */}
                                <div className="space-y-3 relative z-20">
                                    {project.image ? (
                                        <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-30 transition-opacity duration-500 overflow-hidden">
                                            <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale" />
                                        </div>
                                    ) : null}
                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                                        {project.description}
                                    </p>
                                    {/* Case study link - appears on hover */}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                        >
                                            View Case Study
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </CardSpotlight>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
