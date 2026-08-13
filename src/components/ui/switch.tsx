"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        onCheckedChange?: (checked: boolean) => void;
        defaultChecked?: boolean;
    }
>(({ className, onCheckedChange, defaultChecked, ...props }, ref) => {
    const [checked, setChecked] = React.useState(defaultChecked || false);

    const toggle = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        if (onCheckedChange) {
            onCheckedChange(newChecked);
        }
    };

    return (
        <div
            className={cn(
                "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-primary" : "bg-input",
                className
            )}
            onClick={toggle}
        >
            <input
                type="checkbox"
                ref={ref}
                className="hidden"
                checked={checked}
                onChange={() => { }}
                {...props}
            />
            <span
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                    checked ? "translate-x-5" : "translate-x-0"
                )}
            />
        </div>
    );
});
Switch.displayName = "Switch";

export { Switch };
