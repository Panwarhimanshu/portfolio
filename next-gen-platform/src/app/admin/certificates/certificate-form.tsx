"use client";

import { useTransition } from "react";
import { createCertificate, deleteCertificate } from "@/app/actions";
import { Certificate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ExternalLink } from "lucide-react";

export function CertificateForm({ certificates }: { certificates: Certificate[] }) {
    const [pending, startTransition] = useTransition();

    function onAdd(formData: FormData) {
        startTransition(async () => {
            await createCertificate(formData);
        });
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Certificate</CardTitle>
                    <CardDescription>Add a new certification or achievement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onAdd} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="AWS Certified Solutions Architect" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="issuer">Issuer</Label>
                                <Input id="issuer" name="issuer" placeholder="Amazon Web Services" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" name="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Certificate Image</Label>
                                <Input id="image" type="file" name="image" accept="image/*" />
                                <p className="text-xs text-muted-foreground">Or paste a URL below</p>
                                <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credentialUrl">Credential URL</Label>
                                <Input id="credentialUrl" name="credentialUrl" placeholder="https://..." />
                            </div>
                        </div>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Adding..." : "Add Certificate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Existing Certificates</h2>
                <div className="grid gap-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-medium">{cert.title}</span>
                                <span className="text-sm text-muted-foreground">{cert.issuer} • {new Date(cert.date).toLocaleDateString()}</span>
                                {cert.credentialUrl && (
                                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center mt-1 hover:underline">
                                        View Credential <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                )}
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => startTransition(async () => await deleteCertificate(cert.id))}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
