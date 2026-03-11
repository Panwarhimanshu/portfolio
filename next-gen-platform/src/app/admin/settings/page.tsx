import { getSiteSettings } from "@/app/actions";
import { SettingsForm } from "./settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Global Settings</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Site Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SettingsForm initialData={settings} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Security & Advanced</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Manage your site's core settings here. These values affect how your site appears to the public and search engines.</p>
                            <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                                <h4 className="text-yellow-500 font-semibold mb-1">Backup Recommendation</h4>
                                <p className="text-xs text-yellow-500/70">Always backup your database before making major configuration changes.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
