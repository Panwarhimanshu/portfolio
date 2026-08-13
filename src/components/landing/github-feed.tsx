"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github } from "lucide-react";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const LIGHT_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const DARK_COLORS  = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function getColors() {
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
        return DARK_COLORS;
    }
    return LIGHT_COLORS;
}

export function GitHubFeed({ githubUrl }: { githubUrl?: string | null }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [days, setDays] = useState<Day[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [colors, setColors] = useState(LIGHT_COLORS);

    const username = githubUrl
        ? githubUrl.replace(/https?:\/\/(www\.)?github\.com\/?/, "").replace(/\/$/, "")
        : null;

    useEffect(() => {
        setColors(getColors());
    }, []);

    useEffect(() => {
        if (!username) { setLoading(false); return; }
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
            .then(r => r.json())
            .then((data: { total: Record<string, number>; contributions: Day[] }) => {
                setDays(data.contributions);
                setTotal(Object.values(data.total).reduce((a, b) => a + b, 0));
                setLoading(false);
            })
            .catch(() => { setError(true); setLoading(false); });
    }, [username]);

    if (!username) return null;

    // Group flat day array into week columns
    const grid: (Day | null)[][] = [];
    if (days.length > 0) {
        let week: (Day | null)[] = [];
        days.forEach(day => {
            const dow = new Date(day.date).getDay(); // 0=Sun
            if (week.length === 0 && dow > 0) {
                for (let i = 0; i < dow; i++) week.push(null); // pad start
            }
            week.push(day);
            if (dow === 6) { grid.push(week); week = []; }
        });
        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            grid.push(week);
        }
    }

    // Month labels
    const monthLabels: { label: string; col: number }[] = [];
    grid.forEach((week, wi) => {
        const first = week.find(d => d !== null);
        if (!first) return;
        const m = new Date(first.date).toLocaleString("default", { month: "short" });
        if (!monthLabels.length || m !== monthLabels[monthLabels.length - 1].label)
            monthLabels.push({ label: m, col: wi });
    });

    const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

    return (
        <div ref={ref} className="w-full">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-2">Open source vibes</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Catch me on{" "}
                    <span style={{
                        background: "linear-gradient(90deg, #6e40c9, #2ea44f)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        GitHub
                    </span>{" "}✦
                </h2>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Github className="w-3.5 h-3.5" />
                    @{username}
                </a>
            </motion.div>

            {/* Contribution graph */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-2xl border border-border/50 p-5 bg-card/60 backdrop-blur-sm overflow-x-auto"
            >
                {loading && (
                    <div className="h-28 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                        Loading contributions…
                    </div>
                )}
                {error && (
                    <div className="h-28 flex items-center justify-center text-sm text-muted-foreground">
                        Could not load GitHub data.
                    </div>
                )}
                {!loading && !error && (
                    <>
                        <p className="text-sm font-semibold text-foreground mb-3">
                            {total.toLocaleString()} contributions in the last year
                        </p>

                        <div className="flex gap-[3px]">
                            {/* Day-of-week labels */}
                            <div className="flex flex-col gap-[3px] pt-5 mr-1 shrink-0">
                                {DAY_LABELS.map((label, i) => (
                                    <div key={i} className="w-7 h-[11px] flex items-center text-[9px] text-muted-foreground leading-none">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div>
                                {/* Month labels */}
                                <div className="relative h-5 mb-[3px]">
                                    {monthLabels.map(m => (
                                        <span
                                            key={`${m.label}-${m.col}`}
                                            className="absolute text-[10px] text-muted-foreground"
                                            style={{ left: m.col * 14 }}
                                        >
                                            {m.label}
                                        </span>
                                    ))}
                                </div>

                                {/* Grid */}
                                <div className="flex gap-[3px]">
                                    {grid.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-[3px]">
                                            {week.map((day, di) => (
                                                <motion.div
                                                    key={di}
                                                    title={day ? `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}` : ""}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                                    transition={{
                                                        delay: 0.25 + wi * 0.008 + di * 0.004,
                                                        duration: 0.2,
                                                    }}
                                                    className="w-[11px] h-[11px] rounded-[2px]"
                                                    style={{
                                                        backgroundColor: day ? colors[day.level] : "transparent",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-[3px] mt-4 justify-end">
                            <span className="text-[10px] text-muted-foreground mr-1">Less</span>
                            {colors.map((c, i) => (
                                <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: c }} />
                            ))}
                            <span className="text-[10px] text-muted-foreground ml-1">More</span>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
