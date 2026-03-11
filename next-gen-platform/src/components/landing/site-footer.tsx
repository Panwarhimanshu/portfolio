"use client";

import { motion } from "framer-motion";
import { Twitter, Github, Linkedin, Mail, Instagram } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactInfo, AboutSection } from "@prisma/client";

export function SiteFooter({ contactInfo, about }: { contactInfo: ContactInfo | null, about: AboutSection | null }) {
    const email = contactInfo?.email || "hello@example.com";

    return (
        <footer className="w-full bg-foreground text-background py-24 px-6 lg:px-24 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-background/20 to-transparent" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="flex flex-col justify-between h-full">
                    <div className="space-y-10">
                        {about?.avatarUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-[0_0_50px_rgba(var(--primary),0.2)] group"
                            >
                                <img
                                    src={about.avatarUrl}
                                    alt="Himanshu"
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl" />
                                {/* Dynamic Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500 -z-10" />
                            </motion.div>
                        )}
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter max-w-2xl leading-[0.9]">
                            Let’s make something <span className="text-primary italic">extraordinary</span>.
                        </h2>

                        {about?.bio && <p className="text-xl text-background/60 max-w-md leading-relaxed">{about.bio}</p>}
                        <a href={`mailto:${email}`}>
                            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8 h-14 rounded-full">
                                Start a Project
                            </Button>
                        </a>
                    </div>


                    <div className="mt-24">
                        <p className="text-background/60 text-sm">© 2026 Next-Gen Platform. All content managed via Admin.</p>
                    </div>

                </div>

                <div className="grid grid-cols-2 gap-12 lg:place-content-end lg:text-right">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest">Socials</h3>
                        {contactInfo?.linkedin && <Link href={contactInfo.linkedin} target="_blank" className="text-xl font-medium hover:text-primary transition-colors">LinkedIn</Link>}
                        {contactInfo?.github && <Link href={contactInfo.github} target="_blank" className="text-xl font-medium hover:text-primary transition-colors">GitHub</Link>}
                        {contactInfo?.instagram && <Link href={contactInfo.instagram} target="_blank" className="text-xl font-medium hover:text-primary transition-colors">Instagram</Link>}
                        {/* Add more if needed */}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest">Site Map</h3>
                        <Link href="/" className="text-xl font-medium hover:text-primary transition-colors">Home</Link>
                        <Link href="#projects" className="text-xl font-medium hover:text-primary transition-colors">Work</Link>
                        <Link href="#about" className="text-xl font-medium hover:text-primary transition-colors">About</Link>
                        <Link href="#contact" className="text-xl font-medium hover:text-primary transition-colors">Contact</Link>
                    </div>

                    <div className="col-span-2 flex flex-col gap-4">
                        <h3 className="text-background/40 uppercase text-xs font-bold tracking-widest">Get in touch</h3>
                        <a href={`mailto:${email}`} className="text-3xl md:text-5xl font-bold hover:text-primary transition-colors decoration-slice break-all">
                            {email}
                        </a>
                        {contactInfo?.mobile && <p className="text-xl text-background/60">{contactInfo.mobile}</p>}
                        {contactInfo?.address && <p className="text-background/40 text-sm mt-2">{contactInfo.address}</p>}
                    </div>
                </div>
            </div>
        </footer>
    );
}

