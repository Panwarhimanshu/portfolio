"use client";

import { useTransition } from "react";
import { createProject, deleteProject } from "@/app/actions";
import { PortfolioProject } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function WorkForm({ projects }: { projects: PortfolioProject[] }) {
    const [pending, startTransition] = useTransition();

    function onAdd(formData: FormData) {
        startTransition(async () => {
            await createProject(formData);
            // Reset form if needed, though simple form action doesn't auto-reset without JS control
        });
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Project</CardTitle>
                    <CardDescription>Showcase your latest work.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onAdd} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="Project Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">Link</Label>
                                <Input id="link" name="link" placeholder="https://..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Project details..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="imageFile">Project Image</Label>
                                <Input id="imageFile" type="file" name="imageFile" accept="image/*" />
                                <p className="text-xs text-muted-foreground">Or paste a URL below</p>
                                <Input id="image" name="image" placeholder="/projects/1.jpg" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input id="tags" name="tags" placeholder="React, Next.js, AI" />
                            </div>
                        </div>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Adding..." : "Add Project"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription className="truncate">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 flex-wrap text-xs text-muted-foreground mb-4">
                                {project.tags}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={() => startTransition(async () => await deleteProject(project.id))}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
