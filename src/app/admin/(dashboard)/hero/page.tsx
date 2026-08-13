export const dynamic = 'force-dynamic';
import { getHero } from "@/app/actions";
import { HeroForm } from "./hero-form";

export default async function HeroPage() {
    const heroData = await getHero();
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Hero Section</h1>
                <p className="text-muted-foreground">Manage your homepage hero content.</p>
            </div>
            <HeroForm defaultData={heroData} />
        </div>
    );
}
