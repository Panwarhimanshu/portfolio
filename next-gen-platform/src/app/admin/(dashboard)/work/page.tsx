export const dynamic = 'force-dynamic';
import { getProjects } from "@/app/actions";
import { WorkForm } from "./work-form";

export default async function WorkPage() {
    const projects = await getProjects();
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">My Work</h1>
                <p className="text-muted-foreground">Manage your portfolio projects.</p>
            </div>
            <WorkForm projects={projects} />
        </div>
    );
}
