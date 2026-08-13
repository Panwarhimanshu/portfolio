"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateSiteSettings } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SettingsForm({ initialData }: { initialData: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await updateSiteSettings(formData);
            toast.success("Settings updated successfully!");
            router.refresh();
        } catch {
            toast.error("Failed to update settings.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={initialData?.id} />

            <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" name="siteName" defaultValue={initialData?.siteName} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description (SEO)</Label>
                <Textarea id="siteDescription" name="siteDescription" defaultValue={initialData?.siteDescription} placeholder="Tell the world what this site is about..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords (comma separated)</Label>
                <Input id="seoKeywords" name="seoKeywords" defaultValue={initialData?.seoKeywords} placeholder="design, engineering, portfolio" />
            </div>

            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-muted/20">
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">When enabled, public users will see a maintenance page.</p>
                </div>
                <Switch id="maintenanceMode" name="maintenanceMode" defaultChecked={initialData?.maintenanceMode} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving Changes..." : "Save Settings"}
            </Button>
        </form>
    );
}
