"use client";

import { useTransition } from "react";
import { createInstagramPost, deleteInstagramPost } from "@/app/actions";
import { InstagramPost } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Heart, MessageCircle } from "lucide-react";

export function InstagramForm({ posts }: { posts: InstagramPost[] }) {
    const [pending, startTransition] = useTransition();

    function onAdd(formData: FormData) {
        startTransition(async () => {
            try {
                await createInstagramPost(formData);
                toast.success("Post added!");
            } catch {
                toast.error("Failed to add post.");
            }
        });
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Post</CardTitle>
                    <CardDescription>Paste the image URL from your Instagram post.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onAdd} className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL *</Label>
                            <Input id="imageUrl" name="imageUrl" placeholder="https://..." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea id="caption" name="caption" placeholder="Post caption..." rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postUrl">Post URL</Label>
                            <Input id="postUrl" name="postUrl" placeholder="https://www.instagram.com/p/..." />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="likes">Likes</Label>
                                <Input id="likes" name="likes" type="number" defaultValue={0} min={0} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comments">Comments</Label>
                                <Input id="comments" name="comments" type="number" defaultValue={0} min={0} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" name="order" type="number" defaultValue={0} min={0} />
                            </div>
                        </div>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Adding..." : "Add Post"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                        <div className="aspect-square relative bg-muted">
                            <img
                                src={post.imageUrl}
                                alt={post.caption || "Post"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-3">
                            {post.caption && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.caption}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments}</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full"
                                onClick={() => startTransition(async () => { await deleteInstagramPost(post.id); toast.success("Post deleted."); })}
                            >
                                <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
