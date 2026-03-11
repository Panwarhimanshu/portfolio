"use client";

import { useTransition } from "react";
import { updateHero } from "@/app/actions";
import { HeroSection } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming sonner or some toast exists, if not I'll just use simple feedback

export function HeroForm({ defaultData }: { defaultData: HeroSection | null }) {
    const [pending, startTransition] = useTransition();

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            await updateHero(formData);
            // In a real app we'd use a Toast here
            alert("Hero section updated!");
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Update the main content of your landing page.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="flex flex-col gap-4">
                    <input type="hidden" name="id" value={defaultData?.id || ""} />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="heading">Heading</Label>
                        <Input
                            id="heading"
                            name="heading"
                            defaultValue={defaultData?.heading || ""}
                            placeholder="e.g. Creative Developer"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subheading">Subheading</Label>
                        <Textarea
                            id="subheading"
                            name="subheading"
                            defaultValue={defaultData?.subheading || ""}
                            placeholder="Explain what you do..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="ctaText">CTA Text</Label>
                            <Input
                                id="ctaText"
                                name="ctaText"
                                defaultValue={defaultData?.ctaText || ""}
                                placeholder="View Projects"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="ctaLink">CTA Link</Label>
                            <Input
                                id="ctaLink"
                                name="ctaLink"
                                defaultValue={defaultData?.ctaLink || ""}
                                placeholder="/projects"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={pending}>
                        {pending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
