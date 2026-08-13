"use client";

import { useTransition } from "react";
import { updateContactInfo } from "@/app/actions";
import { ContactInfo } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function ContactInfoForm({ defaultData }: { defaultData: ContactInfo | null }) {
    const [pending, startTransition] = useTransition();

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await updateContactInfo(formData);
                toast.success("Contact details updated!");
            } catch {
                toast.error("Failed to update. Please try again.");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Contact Details</CardTitle>
                <CardDescription>Update your contact information displayed on the site.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={onSubmit} className="space-y-4">
                    <input type="hidden" name="id" value={defaultData?.id || ""} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email ID</Label>
                            <Input id="email" name="email" defaultValue={defaultData?.email || ""} placeholder="contact@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile No</Label>
                            <Input id="mobile" name="mobile" defaultValue={defaultData?.mobile || ""} placeholder="+1 234 567 890" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" name="address" defaultValue={defaultData?.address || ""} placeholder="City, Country" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Social Links</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input id="linkedin" name="linkedin" defaultValue={defaultData?.linkedin || ""} placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub</Label>
                                <Input id="github" name="github" defaultValue={defaultData?.github || ""} placeholder="https://github.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input id="instagram" name="instagram" defaultValue={defaultData?.instagram || ""} placeholder="https://instagram.com/..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" name="whatsapp" defaultValue={defaultData?.whatsapp || ""} placeholder="https://wa.me/..." />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={pending}>
                        {pending ? "Saving..." : "Save Details"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
