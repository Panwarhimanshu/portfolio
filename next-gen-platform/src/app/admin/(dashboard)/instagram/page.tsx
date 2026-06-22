export const dynamic = 'force-dynamic';
import { getInstagramPosts } from "@/app/actions";
import { InstagramForm } from "./instagram-form";

export default async function InstagramPage() {
    const posts = await getInstagramPosts();
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Instagram Posts</h1>
                <p className="text-muted-foreground">Manage posts shown in the About section.</p>
            </div>
            <InstagramForm posts={posts} />
        </div>
    );
}
