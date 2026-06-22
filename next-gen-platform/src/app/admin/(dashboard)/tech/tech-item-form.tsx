"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTechItem } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TechItemForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await createTechItem(formData);
        setLoading(false);
        (e.target as HTMLFormElement).reset();
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Tech Name</Label>
                <Input id="name" name="name" placeholder="React, Next.js, etc." required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="icon">Icon Identifier</Label>
                <Select name="icon" defaultValue="Code2">
                    <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Code2">Code</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Layout">Layout</SelectItem>
                        <SelectItem value="Server">Server</SelectItem>
                        <SelectItem value="Smartphone">Mobile</SelectItem>
                        <SelectItem value="Terminal">Terminal</SelectItem>
                        <SelectItem value="Cpu">CPU</SelectItem>
                        <SelectItem value="Globe">Globe</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-[0.7rem] text-muted-foreground">Select an icon for the tech marquee.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" defaultValue="0" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Tech Item"}
            </Button>
        </form>
    );
}
