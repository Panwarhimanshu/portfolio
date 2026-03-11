import { getAbout } from "@/app/actions";
import { AboutForm } from "./about-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AboutAdminPage() {
    const about = await getAbout();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
            </div>
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AboutForm defaultData={about} />
                    </CardContent>

                </Card>
            </div>
        </div>
    );
}
