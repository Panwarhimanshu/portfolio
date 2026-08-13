"use client";

import { useTransition } from "react";
import { updateAbout } from "@/app/actions";
import { AboutSection } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function AboutForm({ defaultData }: { defaultData: AboutSection | null }) {
    const [pending, startTransition] = useTransition();

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await updateAbout(formData);
                toast.success("About section updated!");
            } catch {
                toast.error("Failed to update. Please try again.");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="flex flex-col gap-4">
                    <input type="hidden" name="id" value={defaultData?.id || ""} />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            defaultValue={defaultData?.bio || ""}
                            placeholder="Tell your story..."
                            className="h-32"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="avatarUrl">Avatar URL (Optional/Fallback)</Label>
                        <Input
                            id="avatarUrl"
                            name="avatarUrl"
                            defaultValue={defaultData?.avatarUrl || ""}
                            placeholder="https://example.com/me.png"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="resumeLink">Resume Link</Label>
                        <Input
                            id="resumeLink"
                            name="resumeLink"
                            defaultValue={defaultData?.resumeLink || ""}
                            placeholder="/resume.pdf"
                        />
                    </div>


                    <Button type="submit" disabled={pending}>
                        {pending ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
