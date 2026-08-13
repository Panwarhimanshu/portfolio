import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, Award, MessageSquare } from "lucide-react";
export const dynamic = 'force-dynamic';
import { getDashboardStats, getMessages } from "@/app/actions";

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    const recentMessages = await getMessages();

    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projects</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projectsCount}</div>
                        <p className="text-xs text-muted-foreground">Managed on your site</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.servicesCount}</div>
                        <p className="text-xs text-muted-foreground">Expertise areas defined</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certificatesCount}</div>
                        <p className="text-xs text-muted-foreground">Professional validations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.messagesCount}</div>
                        <p className="text-xs text-muted-foreground">Inquiries from CONTACT</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentMessages.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent messages.</p>
                            ) : (
                                recentMessages.slice(0, 5).map((msg) => (
                                    <div key={msg.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{msg.name}</p>
                                            <p className="text-sm text-muted-foreground">{msg.email}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="text-sm">Manage your site content using the sidebar links. You can update your Hero section, Projects, Services, and more instantly.</div>
                        <div className="flex flex-wrap gap-2 pt-4">
                            <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">Active Session</div>
                            <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">DB Connected</div>
                            <div className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full border border-blue-500/20">CMS Enabled</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

