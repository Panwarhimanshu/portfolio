"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Service } from "@prisma/client";

const defaultServices = [
    { id: "01", displayId: "01", title: "Web Development", description: "Scalable, blazing-fast web apps built with Next.js, React, and modern cloud infrastructure." },
    { id: "02", displayId: "02", title: "UI/UX Design", description: "Pixel-perfect interfaces designed for delight — where aesthetics meet seamless user experience." },
    { id: "03", displayId: "03", title: "Motion Design", description: "Breathing life into interfaces with cinematic animations and micro-interactions that captivate." },
    { id: "04", displayId: "04", title: "Cloud & DevOps", description: "Deploying and scaling production apps on AWS, Vercel, Docker — zero downtime, maximum reliability." },
];

const accents = [
    { line: "#7c3aed", text: "#7c3aed", glow: "rgba(124,58,237,0.25)" },
    { line: "#0891b2", text: "#0891b2", glow: "rgba(6,182,212,0.25)" },
    { line: "#db2777", text: "#db2777", glow: "rgba(236,72,153,0.25)" },
    { line: "#059669", text: "#059669", glow: "rgba(16,185,129,0.25)" },
];

export function ServicesList({ services }: { services: Service[] }) {
    const list = services && services.length > 0 ? services : defaultServices as any;

    return (
        <section className="py-28 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
                    <span className="h-px w-8 bg-primary/40 inline-block" />
                    What I Do
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                    Services <span className="text-gradient-neon">&amp;</span> Expertise
                </h2>
            </motion.div>

            {/* List */}
            <div className="flex flex-col">
                {list.map((svc: any, i: number) => {
                    const a = accents[i % accents.length];
                    const num = svc.displayId || String(i + 1).padStart(2, "0");

                    return (
                        <motion.div
                            key={svc.id}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07, duration: 0.5 }}
                            className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 border-b overflow-hidden cursor-pointer pl-0"
                            style={{ borderColor: "var(--border)" }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderBottomColor = a.line + "88";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderBottomColor = "var(--border)";
                            }}
                        >
                            {/* Left neon bar */}
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 w-[3px] origin-top rounded-full"
                                initial={{ scaleY: 0 }}
                                whileHover={{ scaleY: 1 }}
                                style={{ background: a.line }}
                                transition={{ duration: 0.35 }}
                            />

                            {/* Background glow on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-r-2xl"
                                style={{ background: `linear-gradient(90deg, ${a.glow} 0%, transparent 60%)` }}
                            />

                            {/* Ghost number */}
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[6rem] font-black leading-none select-none pointer-events-none text-foreground/[0.04] group-hover:text-foreground/[0.07] transition-colors duration-500">
                                {num}
                            </span>

                            {/* Left: number + title */}
                            <div className="flex items-baseline gap-8 relative z-10 pl-6">
                                <span className="text-xs font-mono" style={{ color: a.text }}>/{num}</span>
                                <h3 className="text-2xl md:text-4xl font-bold transition-colors duration-300 text-foreground">
                                    {svc.title}
                                </h3>
                            </div>

                            {/* Right: desc + arrow */}
                            <div className="flex items-center gap-6 mt-4 md:mt-0 relative z-10 pl-6 md:pl-0">
                                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                    {svc.description}
                                </p>
                                <div
                                    className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                                    style={{ borderColor: "var(--border)" }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = a.line;
                                        el.style.borderColor = a.line;
                                        el.style.boxShadow = `0 0 20px ${a.glow}`;
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.background = "";
                                        el.style.borderColor = "var(--border)";
                                        el.style.boxShadow = "";
                                    }}
                                >
                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
