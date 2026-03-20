"use client";

import { motion } from "framer-motion";
import {
    Code2,
    Database,
    Layout,
    Server,
    Smartphone,
    Terminal,
    Cpu,
    Globe,
    Layers,
    Figma,
    GitBranch,
    Zap,
} from "lucide-react";
import { TechItem } from "@prisma/client";

const iconMap: Record<string, any> = {
    Layout, Code2, Database, Globe, Terminal, Cpu, Server, Smartphone,
    Layers, Figma, GitBranch, Zap,
};

const defaultTechItems = [
    { name: "Next.js",    icon: "Globe" },
    { name: "React",      icon: "Code2" },
    { name: "TypeScript", icon: "Terminal" },
    { name: "Tailwind",   icon: "Layout" },
    { name: "Node.js",    icon: "Server" },
    { name: "Prisma",     icon: "Database" },
    { name: "Framer",     icon: "Zap" },
    { name: "Figma",      icon: "Figma" },
];

const row2Items = [
    { name: "MongoDB",    icon: "Database" },
    { name: "Git",        icon: "GitBranch" },
    { name: "Vercel",     icon: "Layers" },
    { name: "GraphQL",    icon: "Cpu" },
    { name: "Docker",     icon: "Server" },
    { name: "Redux",      icon: "Code2" },
    { name: "Supabase",   icon: "Database" },
    { name: "REST API",   icon: "Globe" },
];

function TechPill({ name, icon }: { name: string; icon: string }) {
    const Icon = (icon && iconMap[icon]) || Code2;
    return (
        <div className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/8 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all duration-300 cursor-default flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background/50 border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 text-sm whitespace-nowrap">
                    {name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Expertise</span>
            </div>
        </div>
    );
}

export function TechStack({ techItems }: { techItems: TechItem[] }) {
    const row1 = techItems && techItems.length > 0 ? techItems : defaultTechItems as any;
    const row2 = row2Items as any;

    return (
        <section className="py-20 w-full overflow-hidden bg-background/50 border-y border-white/5">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="container mx-auto px-6 mb-12 text-center"
            >
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
                    Powering Next-Gen Experiences
                </h3>
                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
            </motion.div>

            {/* Row 1 — forward */}
            <div className="relative flex mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />
                <div className="flex gap-4 animate-marquee whitespace-nowrap">
                    {[...row1, ...row1, ...row1].map((tech: any, i: number) => (
                        <TechPill key={`r1-${tech.name}-${i}`} name={tech.name} icon={tech.icon} />
                    ))}
                </div>
            </div>

            {/* Row 2 — reverse */}
            <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />
                <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                    {[...row2, ...row2, ...row2].map((tech: any, i: number) => (
                        <TechPill key={`r2-${tech.name}-${i}`} name={tech.name} icon={tech.icon} />
                    ))}
                </div>
            </div>
        </section>
    );
}
