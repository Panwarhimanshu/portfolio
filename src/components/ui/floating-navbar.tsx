"use client";

import React, { JSX, useState, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, User, Briefcase, Mail, Award } from "lucide-react";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);
    const [activeSection, setActiveSection] = useState("home");

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - (scrollYProgress.getPrevious() ?? 0);
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                setVisible(direction < 0);
            }
        }
    });

    useEffect(() => {
        const sections = ["home", "about", "projects", "certificates", "contact"];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id || "home");
                });
            },
            { threshold: 0.4 }
        );
        sections.forEach((id) => {
            const el = id === "home" ? document.querySelector("section") : document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                    "flex fixed top-6 inset-x-0 mx-auto w-fit z-[5000]",
                    "border border-white/[0.15] rounded-full",
                    "bg-background/60 backdrop-blur-xl",
                    "shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]",
                    "px-4 py-2.5 items-center gap-1",
                    className
                )}
            >
                {navItems.map((navItem, idx) => {
                    const isActive = activeSection === navItem.link.replace("#", "") || (navItem.link === "/" && activeSection === "home");
                    return (
                        <Link
                            key={idx}
                            href={navItem.link}
                            className={cn(
                                "relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 block sm:hidden">{navItem.icon}</span>
                            <span className="relative z-10 hidden sm:block">{navItem.name}</span>
                        </Link>
                    );
                })}
            </motion.div>
        </AnimatePresence>
    );
};

export const navItems = [
    { name: "Home", link: "/", icon: <Home className="h-4 w-4" /> },
    { name: "About", link: "#about", icon: <User className="h-4 w-4" /> },
    { name: "Work", link: "#projects", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Certs", link: "#certificates", icon: <Award className="h-4 w-4" /> },
    { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4" /> },
];
