"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactInfo, AboutSection } from "@prisma/client";
import { Github, Linkedin, Instagram, ArrowUpRight, Mail, Phone } from "lucide-react";

const socialIcons: Record<string, React.ElementType> = {
    linkedin: Linkedin,
    github: Github,
    instagram: Instagram,
};

export function SiteFooter({
    contactInfo,
    about,
}: {
    contactInfo: ContactInfo | null;
    about: AboutSection | null;
}) {
    const email = contactInfo?.email || "hello@example.com";

    return (
        <footer id="contact" className="w-full bg-foreground text-background py-24 px-6 lg:px-24 relative overflow-hidden noise-overlay">
            {/* Top separator */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Background accents */}
            <div className="absolute -right-24 -top-24 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -left-24 bottom-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Watermark */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none overflow-hidden select-none">
                <span className="text-[12vw] font-black text-background/[0.03] tracking-tighter leading-none whitespace-nowrap uppercase">
                    Himanshu
                </span>
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left */}
                    <div className="flex flex-col gap-10">
                        {/* Avatar */}
                        {about?.avatarUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative w-20 h-20 rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.2)] group"
                            >
                                <img
                                    src={about.avatarUrl}
                                    alt="Himanshu"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 -z-10" />
                            </motion.div>
                        )}

                        {/* CTA Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]"
                        >
                            Let&apos;s make something{" "}
                            <span
                                className="italic"
                                style={{
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
                                    backgroundSize: "300% auto",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    animation: "shimmer 5s linear infinite",
                                }}
                            >
                                extraordinary
                            </span>
                            .
                        </motion.h2>

                        {/* Bio */}
                        {about?.bio && (
                            <p className="text-lg text-background/60 max-w-md leading-relaxed">{about.bio}</p>
                        )}

                        {/* CTA Button */}
                        <a href={`mailto:${email}`}>
                            <Button
                                size="lg"
                                className="group w-fit bg-background text-foreground hover:bg-background/90 text-base px-8 h-14 rounded-full relative overflow-hidden"
                                style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Start a Project
                                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </Button>
                        </a>
                    </div>

                    {/* Right */}
                    <div className="grid grid-cols-2 gap-12 lg:place-content-end lg:text-right">
                        {/* Socials */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest mb-1">
                                Socials
                            </h3>
                            {(["linkedin", "github", "instagram"] as const).map((key) => {
                                const href = contactInfo?.[key as keyof ContactInfo] as string;
                                if (!href) return null;
                                const Icon = socialIcons[key] ?? ArrowUpRight;
                                return (
                                    <Link
                                        key={key}
                                        href={href}
                                        target="_blank"
                                        className="group flex items-center gap-2 text-xl font-medium hover:text-primary transition-colors duration-200 lg:flex-row-reverse"
                                    >
                                        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative overflow-hidden">
                                            <span className="block group-hover:-translate-y-full transition-transform duration-300 capitalize">
                                                {key}
                                            </span>
                                            <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 capitalize text-primary">
                                                {key}
                                            </span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Site Map */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest mb-1">
                                Sitemap
                            </h3>
                            {(["Home", "Work", "About", "Contact"] as const).map((item) => (
                                <Link
                                    key={item}
                                    href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                                    className="group relative text-xl font-medium hover:text-primary transition-colors duration-200 overflow-hidden inline-block w-fit lg:ml-auto"
                                >
                                    <span className="block group-hover:-translate-y-full transition-transform duration-300">
                                        {item}
                                    </span>
                                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-primary">
                                        {item}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Get in Touch */}
                        <div className="col-span-2 flex flex-col gap-3">
                            <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest mb-1">
                                Get in touch
                            </h3>
                            <a
                                href={`mailto:${email}`}
                                className="group text-2xl md:text-4xl font-bold hover:text-primary transition-colors duration-200 break-all relative w-fit lg:ml-auto"
                            >
                                {email}
                                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500" />
                            </a>
                            {contactInfo?.mobile && (
                                <a href={`tel:${contactInfo.mobile}`} className="flex items-center gap-2 text-lg text-background/60 hover:text-background transition-colors lg:flex-row-reverse lg:ml-auto">
                                    <Phone className="w-4 h-4" />
                                    {contactInfo.mobile}
                                </a>
                            )}
                            {contactInfo?.address && (
                                <p className="text-background/40 text-sm lg:text-right">{contactInfo.address}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-background/40 text-sm">
                        © 2026 Himanshu. All rights reserved.
                    </p>
                    <p className="text-background/20 text-xs">
                        Built with Next.js · Prisma · Tailwind · Framer Motion
                    </p>
                </div>
            </div>
        </footer>
    );
}
