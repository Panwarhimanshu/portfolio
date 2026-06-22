import { CommandMenu } from "@/components/admin/command-menu";
import { UserNav } from "@/components/admin/user-nav";
import {
    LayoutDashboard,
    Package,
    Settings,
    Users,
    FileText,
    Cpu,
    Wrench,
    Instagram
} from "lucide-react";

import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/">
                        <Package className="h-6 w-6" />
                        <span className="">Admin Inc</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <ul className="grid gap-2 text-sm font-medium">
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/hero"
                            >
                                <FileText className="h-4 w-4" />
                                Hero Section
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/about"
                            >
                                <Users className="h-4 w-4" />
                                About Me
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/work"
                            >
                                <Package className="h-4 w-4" />
                                My Work
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/services"
                            >
                                <Wrench className="h-4 w-4" />
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/tech"
                            >
                                <Cpu className="h-4 w-4" />
                                Tech Stack
                            </Link>
                        </li>
                        <li>

                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/certificates"
                            >
                                <FileText className="h-4 w-4" />
                                Certificates
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/instagram"
                            >
                                <Instagram className="h-4 w-4" />
                                Instagram
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/contact"
                            >
                                <Users className="h-4 w-4" />
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                                href="/admin/settings"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-0 flex-1">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="flex items-center w-full gap-4">
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <CommandMenu />
                        </div>
                        <UserNav />
                    </div>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
