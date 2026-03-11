import { getTechItems } from "@/app/actions";
import { TechItemForm } from "./tech-item-form";
import { TechItemList } from "./tech-item-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TechAdminPage() {
    const techItems = await getTechItems();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Manage Tech Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TechItemList items={techItems} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Add New Tech</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TechItemForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
