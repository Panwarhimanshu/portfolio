"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid credentials.");
            } else {
                router.push("/admin");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuroraBackground showRadialGradient={false} className="bg-background">
            <div className="flex items-center justify-center min-h-screen w-full relative z-10 p-4">
                <Card className="w-full max-w-md bg-card/90 backdrop-blur-xl border-border shadow-2xl">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access the secure area.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="himanshu_admin"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-background border-border"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Authenticating..." : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuroraBackground>
    );
}
