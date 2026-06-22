"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function scramble(original: string, progress: number): string {
    return original
        .split("")
        .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < Math.floor(progress * original.replace(/ /g, "").length)) return original[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
}

export function GlitchText({
    text,
    className = "",
    continuous = false,
    onHover = false,
    delay = 0,
}: {
    text: string;
    className?: string;
    continuous?: boolean;
    onHover?: boolean;
    delay?: number;
}) {
    const [display, setDisplay] = useState(onHover ? text : CHARS.slice(0, text.length));
    const rafRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const animate = () => {
        cancelAnimationFrame(rafRef.current);
        let start: number | null = null;
        const duration = 900;

        const frame = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setDisplay(scramble(text, progress));
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(frame);
            } else {
                setDisplay(text);
                if (continuous && !onHover) {
                    timerRef.current = setTimeout(animate, 5000);
                }
            }
        };
        rafRef.current = requestAnimationFrame(frame);
    };

    useEffect(() => {
        if (onHover) { setDisplay(text); return; }
        timerRef.current = setTimeout(animate, delay);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [text, delay, onHover]);

    if (onHover) {
        return (
            <span
                className={className}
                onMouseEnter={animate}
            >
                {display}
            </span>
        );
    }

    return <span className={className}>{display}</span>;
}
