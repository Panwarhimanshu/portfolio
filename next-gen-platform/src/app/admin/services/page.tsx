import { getServices } from "@/app/actions";
import { ServiceForm } from "./service-form";
import { ServiceList } from "./service-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ServicesAdminPage() {
    const services = await getServices();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Services</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Manage Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceList items={services} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Add New Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
