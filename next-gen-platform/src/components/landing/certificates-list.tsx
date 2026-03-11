"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { Certificate } from "@prisma/client";
import { cn } from "@/lib/utils";

export function CertificatesList({ certificates }: { certificates: Certificate[] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    if (!certificates || certificates.length === 0) return null;

    return (
        <section ref={ref} className="py-24 bg-muted/20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <span className="text-primary font-medium tracking-wider uppercase text-sm mb-2">Qualifications</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Certifications & Achievements</h2>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Continuous learning and professional validation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Area */}
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {cert.imageUrl ? (
                                    <img
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                        <Award className="w-16 h-16 text-muted-foreground/30" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                                        >
                                            View Credential <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-xs font-medium text-primary mb-2 flex items-center justify-between">
                                    <span>{cert.issuer}</span>
                                    <span className="text-muted-foreground" suppressHydrationWarning>{new Date(cert.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short' })}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {cert.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
