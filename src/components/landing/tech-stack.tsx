"use client";

import { motion } from "framer-motion";
import {
    Code2, Database, Layout, Server, Smartphone,
    Terminal, Cpu, Globe, Layers, Figma, GitBranch, Zap,
} from "lucide-react";
import { TechItem } from "@prisma/client";

const iconMap: Record<string, any> = {
    Layout, Code2, Database, Globe, Terminal, Cpu, Server,
    Smartphone, Layers, Figma, GitBranch, Zap,
};

const defaultRow1 = [
    { name: "Next.js", icon: "Globe" },
    { name: "React", icon: "Code2" },
    { name: "TypeScript", icon: "Terminal" },
    { name: "Tailwind", icon: "Layout" },
    { name: "Node.js", icon: "Server" },
    { name: "Prisma", icon: "Database" },
    { name: "Framer", icon: "Zap" },
    { name: "Figma", icon: "Figma" },
];

const defaultRow2 = [
    { name: "MongoDB", icon: "Database" },
    { name: "Git", icon: "GitBranch" },
    { name: "Vercel", icon: "Layers" },
    { name: "Docker", icon: "Server" },
    { name: "AWS", icon: "Cpu" },
    { name: "Redux", icon: "Code2" },
    { name: "Supabase", icon: "Database" },
    { name: "REST API", icon: "Globe" },
];

const pillColors = [
    { border: "rgba(124,58,237,0.3)", glow: "rgba(124,58,237,0.4)", text: "#6d28d9" },
    { border: "rgba(6,182,212,0.3)", glow: "rgba(6,182,212,0.4)", text: "#0e7490" },
    { border: "rgba(236,72,153,0.3)", glow: "rgba(236,72,153,0.4)", text: "#be185d" },
    { border: "rgba(16,185,129,0.3)", glow: "rgba(16,185,129,0.4)", text: "#065f46" },
];

function NeonPill({ name, icon, colorIdx }: { name: string; icon: string; colorIdx: number }) {
    const Icon = iconMap[icon] || Code2;
    const c = pillColors[colorIdx % pillColors.length];
    return (
        <div
            className="group flex items-center gap-3 px-5 py-3 rounded-full flex-shrink-0 transition-all duration-300 cursor-default"
            style={{
                border: `1px solid ${c.border}`,
                background: "var(--muted)",
                backdropFilter: "blur(12px)",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c.glow}, 0 0 40px ${c.glow.replace("0.5", "0.2")}`;
                (e.currentTarget as HTMLElement).style.borderColor = c.glow;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "";
                (e.currentTarget as HTMLElement).style.borderColor = c.border;
            }}
        >
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: `${c.border.replace("0.3", "0.12")}` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap text-foreground/80 group-hover:text-foreground transition-colors">
                {name}
            </span>
        </div>
    );
}

export function TechStack({ techItems }: { techItems: TechItem[] }) {
    const row1 = techItems && techItems.length > 0 ? techItems : defaultRow1 as any;
    const row2 = defaultRow2 as any;

    return (
        <section className="py-24 w-full overflow-hidden relative bg-background border-y border-border/40">
            {/* Dot grid texture */}
            <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

            {/* Section heading */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14 relative z-10 px-6"
            >
                <span className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase mb-3">
                    <span className="h-px w-8 bg-primary/40 inline-block" />
                    Tech Arsenal
                    <span className="h-px w-8 bg-primary/40 inline-block" />
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                    Powering Next-Gen{" "}
                    <span className="text-gradient-neon">Experiences</span>
                </h2>
            </motion.div>

            {/* Row 1 — forward */}
            <div className="relative flex mb-4 z-10">
                <div className="absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-background to-transparent" />
                <div className="flex gap-4 animate-marquee whitespace-nowrap">
                    {[...row1, ...row1, ...row1].map((t: any, i: number) => (
                        <NeonPill key={`r1-${t.name}-${i}`} name={t.name} icon={t.icon} colorIdx={i} />
                    ))}
                </div>
            </div>

            {/* Row 2 — reverse */}
            <div className="relative flex z-10">
                <div className="absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-background to-transparent" />
                <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                    {[...row2, ...row2, ...row2].map((t: any, i: number) => (
                        <NeonPill key={`r2-${t.name}-${i}`} name={t.name} icon={t.icon} colorIdx={i + 2} />
                    ))}
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10 bg-gradient-to-b from-transparent to-background" />
        </section>
    );
}
