"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Service } from "@prisma/client";

const defaultServices = [
    {
        id: "01",
        title: "Web Development",
        description: "Building scalable, high-performance web applications with Next.js and React.",
    },
    {
        id: "02",
        title: "UI/UX Design",
        description: "Crafting intuitive and aesthetically pleasing user interfaces that delight users.",
    },
];

export function ServicesList({ services }: { services: Service[] }) {
    const displayServices = services && services.length > 0 ? services : defaultServices as any;


    return (
        <section className="py-24 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            <div className="mb-16 border-b border-white/10 pb-8">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">What I Do</h2>
                <p className="text-3xl md:text-5xl font-bold">Services & Expertise</p>
            </div>

            <div className="flex flex-col">
                {displayServices.map((service: Service, index: number) => (

                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer"
                    >
                        <div className="flex items-baseline gap-8">
                            <span className="text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors">/{service.displayId || String(index + 1).padStart(2, '0')}</span>
                            <h3 className="text-2xl md:text-4xl font-semibold group-hover:text-primary transition-colors">{service.title}</h3>
                        </div>

                        <div className="flex items-center gap-8 mt-4 md:mt-0">
                            <p className="text-muted-foreground max-w-sm text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                {service.description}
                            </p>
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 transform -rotate-45 group-hover:rotate-0">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

