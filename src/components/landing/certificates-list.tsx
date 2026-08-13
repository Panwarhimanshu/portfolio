"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Award, ShieldCheck } from "lucide-react";
import { Certificate } from "@prisma/client";

export function CertificatesList({ certificates }: { certificates: Certificate[] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    if (!certificates || certificates.length === 0) return null;

    return (
        <section ref={ref} className="py-28 relative overflow-hidden" id="certificates">
            {/* Background layers */}
            <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
            {/* Grid texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-6 mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <p className="text-gradient text-sm font-medium tracking-widest uppercase mb-3">
                        Qualifications
                    </p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        Certifications<span className="text-gradient">.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                        Continuous learning and professional validation.
                    </p>
                    <div className="h-px w-24 mt-8 bg-gradient-to-r from-transparent via-primary to-transparent" />
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            whileHover={{ y: -6 }}
                            className="group relative bg-card border border-border/40 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-primary/30"
                            style={{
                                boxShadow: "0 0 0 1px transparent",
                            }}
                        >
                            {/* Glow on hover */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ boxShadow: "0 0 30px rgba(99,102,241,0.15), inset 0 0 0 1px rgba(99,102,241,0.15)" }} />

                            {/* Top ribbon badge */}
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-primary/15 border border-primary/25 text-primary text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-md">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                            </div>

                            {/* Image Area */}
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {cert.imageUrl ? (
                                    <>
                                        <img
                                            src={cert.imageUrl}
                                            alt={cert.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Shimmer overlay */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                                                backgroundSize: "200% 100%",
                                                animation: "shimmer 1.5s linear",
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-violet-500/10 relative">
                                        <Award className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors duration-300" />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                                    </div>
                                )}

                                {/* Credential hover overlay */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    {cert.credentialUrl ? (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 text-sm"
                                        >
                                            View Credential
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    ) : (
                                        <span className="text-white/50 text-sm">Offline Certificate</span>
                                    )}
                                </div>
            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="text-xs font-semibold text-primary mb-2 flex items-center justify-between">
                                    <span className="truncate">{cert.issuer}</span>
                                    <span className="text-muted-foreground shrink-0 ml-2" suppressHydrationWarning>
                                        {new Date(cert.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
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
