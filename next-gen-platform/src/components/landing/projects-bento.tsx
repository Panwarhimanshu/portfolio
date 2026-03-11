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
    }
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
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Selected Works <span className="text-primary">.</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    A showcase of digital craftsmanship, exploring the intersection of design, engineering, and user experience.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                {projects.map((project, index) => {
                    const tags = project.tags ? project.tags.split(",").map(t => t.trim()) : [];
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`${project.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"}`}
                        >
                            <CardSpotlight className="h-full flex flex-col justify-between p-8 bg-muted/10 border-white/10 group overflow-hidden">
                                <div className="flex justify-between items-start relative z-20">
                                    <div className="space-y-2">
                                        <div className="flex gap-2 flex-wrap">
                                            {tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-background/50 backdrop-blur-md border-white/5 text-xs font-normal">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                            <Button size="icon" variant="outline" className="rounded-full bg-background/20 border-white/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2 relative z-20">
                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Abstract Visual Background */}
                                {project.image ? (
                                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 overflow-hidden">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-muted/5 to-transparent pointer-events-none" />
                                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                                    </>
                                )}

                            </CardSpotlight>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

