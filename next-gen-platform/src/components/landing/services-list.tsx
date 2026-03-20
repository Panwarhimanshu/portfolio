"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Service } from "@prisma/client";

const defaultServices = [
    {
        id: "01",
        displayId: "01",
        title: "Web Development",
        description: "Building scalable, high-performance web applications with Next.js and React.",
    },
    {
        id: "02",
        displayId: "02",
        title: "UI/UX Design",
        description: "Crafting intuitive and aesthetically pleasing user interfaces that delight users.",
    },
    {
        id: "03",
        displayId: "03",
        title: "Motion Design",
        description: "Adding life to interfaces with complex animations and delightful micro-interactions.",
    },
];

const accentColors = [
    "from-indigo-500 to-violet-500",
    "from-violet-500 to-pink-500",
    "from-pink-500 to-orange-500",
    "from-cyan-500 to-indigo-500",
];

export function ServicesList({ services }: { services: Service[] }) {
    const displayServices = services && services.length > 0 ? services : defaultServices as any;

    return (
        <section className="py-24 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 pb-8 border-b border-white/10"
            >
                <p className="text-sm font-medium uppercase tracking-widest mb-2 text-gradient w-fit">
                    What I Do
                </p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Services <span className="text-gradient">&amp;</span> Expertise
                </h2>
            </motion.div>

            <div className="flex flex-col">
                {displayServices.map((service: Service & { displayId?: string }, index: number) => {
                    const accent = accentColors[index % accentColors.length];
                    const num = service.displayId || String(index + 1).padStart(2, "0");
                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden pl-6"
                        >
                            {/* Left accent border reveal */}
                            <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${accent} scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top rounded-full`} />

                            {/* Ghost number */}
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[7rem] font-black text-foreground/3 group-hover:text-foreground/6 transition-colors duration-500 select-none pointer-events-none leading-none">
                                {num}
                            </span>

                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/3 to-transparent pointer-events-none" />

                            {/* Left content */}
                            <div className="flex items-baseline gap-8 relative z-10">
                                <span className={`text-sm font-mono bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
                                    /{num}
                                </span>
                                <h3 className="text-2xl md:text-4xl font-semibold group-hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </h3>
                            </div>

                            {/* Right: description + arrow */}
                            <div className="flex items-center gap-6 mt-4 md:mt-0 relative z-10">
                                <p className="text-muted-foreground max-w-sm text-sm md:text-base leading-relaxed md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                                    {service.description}
                                </p>
                                <div className={`w-12 h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:${accent} group-hover:border-transparent transition-all duration-300 group-hover:shadow-lg`}>
                                    <ArrowUpRight className="w-5 h-5 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
