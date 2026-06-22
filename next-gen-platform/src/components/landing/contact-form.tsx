"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Terminal } from "lucide-react";
import { sendContactMessage } from "@/app/actions";

const inputCls = "w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 border-0 outline-none resize-none caret-primary";

export function ContactForm() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [focused, setFocused] = useState<string | null>(null);
    const [vals, setVals] = useState({ name: "", email: "", message: "" });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        const fd = new FormData(e.currentTarget);
        try {
            await sendContactMessage(fd);
            setStatus("success");
            setVals({ name: "", email: "", message: "" });
        } catch {
            setStatus("error");
        }
    }

    const fields = [
        { key: "name", prompt: "name", type: "text", placeholder: "your full name...", multiline: false },
        { key: "email", prompt: "email", type: "email", placeholder: "your@email.com", multiline: false },
        { key: "message", prompt: "message", type: "text", placeholder: "tell me about your project...", multiline: true },
    ] as const;

    return (
        <section ref={ref} id="contact-form" className="py-28 px-6 lg:px-24 w-full max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* ── Left: heading ── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="lg:sticky lg:top-32"
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
                        <span className="h-px w-8 bg-primary/40 inline-block" />
                        Get in Touch
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
                        Let&apos;s build<br />
                        something{" "}
                        <span className="text-gradient-neon italic">great</span>.
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md mb-10">
                        Have a project in mind or just want to connect? Drop me a message and I&apos;ll get back within 24 hours.
                    </p>

                    {/* Info cards */}
                    {[
                        { label: "Response time", value: "< 24 hours" },
                        { label: "Availability", value: "Open for work" },
                        { label: "Time zone", value: "IST (UTC +5:30)" },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.15 + i * 0.1 }}
                            className="flex items-center justify-between py-3 border-b border-border/50"
                        >
                            <span className="text-xs font-mono text-muted-foreground tracking-wider">{item.label}</span>
                            <span className="text-xs font-mono text-primary">{item.value}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Right: terminal form ── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center gap-6 py-20 text-center rounded-2xl border border-border bg-muted/30"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                                >
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500"
                                        style={{ filter: "drop-shadow(0 0 12px rgba(52,211,153,0.6))" }}
                                    />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 font-mono text-emerald-600 dark:text-emerald-400">Message Sent!</h3>
                                    <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
                                </div>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="text-xs font-mono text-primary hover:underline"
                                >
                                    [send another]
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                className="rounded-2xl border border-border bg-muted/30 overflow-hidden"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                {/* Terminal header bar */}
                                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/50 bg-muted/50">
                                    {["#ff5f57", "#ffbd2e", "#28c840"].map(c => (
                                        <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                                    ))}
                                    <div className="flex items-center gap-1.5 ml-3">
                                        <Terminal className="w-3 h-3 text-muted-foreground/50" />
                                        <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">contact@himanshu.dev</span>
                                    </div>
                                </div>

                                {/* Form content */}
                                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-0">
                                    {/* Initial prompt */}
                                    <p className="text-[11px] font-mono text-muted-foreground/70 mb-5">
                                        <span className="text-emerald-600 dark:text-emerald-400">✓</span> Connected to himanshu.dev — type your message below
                                    </p>

                                    {fields.map((f, fi) => (
                                        <motion.div
                                            key={f.key}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ delay: 0.2 + fi * 0.08 }}
                                            className={`relative mb-4 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                                                focused === f.key
                                                    ? "border-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                                                    : "border-border hover:border-border/80"
                                            }`}
                                            style={{}}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-[11px] font-mono text-primary/70 mt-0.5 whitespace-nowrap shrink-0">
                                                    ~/{f.prompt} &gt;
                                                </span>
                                                {f.multiline ? (
                                                    <textarea
                                                        name={f.key}
                                                        required
                                                        rows={4}
                                                        placeholder={f.placeholder}
                                                        value={vals[f.key]}
                                                        onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))}
                                                        onFocus={() => setFocused(f.key)}
                                                        onBlur={() => setFocused(null)}
                                                        className={inputCls}
                                                    />
                                                ) : (
                                                    <input
                                                        name={f.key}
                                                        type={f.type}
                                                        required
                                                        placeholder={f.placeholder}
                                                        value={vals[f.key]}
                                                        onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))}
                                                        onFocus={() => setFocused(f.key)}
                                                        onBlur={() => setFocused(null)}
                                                        className={inputCls}
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {status === "error" && (
                                        <p className="text-xs font-mono text-red-400 mb-3">
                                            <span className="text-red-500">✗</span> Failed to send. Please try again.
                                        </p>
                                    )}

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={status === "loading"}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative w-full py-4 rounded-xl font-mono font-semibold text-sm overflow-hidden disabled:opacity-50 transition-all duration-300"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(99,102,241,0.9))",
                                            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.3)";
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                            {status === "loading" ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                            ) : (
                                                <>Send Message <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
