"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createService } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ServiceForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await createService(formData);
        setLoading(false);
        (e.target as HTMLFormElement).reset();
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="displayId">Service Number (e.g. 01)</Label>
                <Input id="displayId" name="displayId" placeholder="01, 02..." required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input id="title" name="title" placeholder="Web Development" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Building high performance applications..." required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input id="order" name="order" type="number" defaultValue="0" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Service"}
            </Button>
        </form>
    );
}
