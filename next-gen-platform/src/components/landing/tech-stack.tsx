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
    Hexagon
} from "lucide-react";
import { TechItem } from "@prisma/client";

const iconMap: Record<string, any> = {
    Layout, Code2, Database, Globe, Terminal, Cpu, Server, Smartphone
};

const defaultTechItems = [
    { name: "Next.js", icon: "Globe" },
    { name: "React", icon: "Code2" },
    { name: "TypeScript", icon: "Terminal" },
    { name: "Tailwind", icon: "Layout" },
    { name: "Node.js", icon: "Server" },
    { name: "Prisma", icon: "Database" },
];

export function TechStack({ techItems }: { techItems: TechItem[] }) {
    const displayItems = techItems && techItems.length > 0 ? techItems : defaultTechItems as any;


    return (
        <section className="py-20 w-full overflow-hidden bg-background/50 border-y border-white/5">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h3 className="text-xl font-medium text-muted-foreground uppercase tracking-widest">
                    Powering Next-Gen Experiences
                </h3>
            </div>

            <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

                <div className="flex gap-12 animate-marquee whitespace-nowrap">
                    {[...displayItems, ...displayItems, ...displayItems].map((tech, i) => {
                        const Icon = (tech.icon && iconMap[tech.icon]) || Code2;
                        return (
                            <div
                                key={`${tech.name}-${i}`}
                                className="group flex items-center gap-4 px-8 py-4 rounded-full border border-white/5 bg-muted/10 hover:bg-muted/30 transition-colors cursor-default"
                            >
                                <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{tech.name}</span>
                                    {/* Using order or hidden meta for category if needed */}
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Expertise</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

