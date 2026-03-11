"use client";

import { TechItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTechItem } from "@/app/actions";
import { useRouter } from "next/navigation";

export function TechItemList({ items }: { items: TechItem[] }) {
    const router = useRouter();

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this tech item?")) {
            await deleteTechItem(id);
            router.refresh();
        }
    }

    if (items.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No tech items added yet.</p>;
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground italic">Icon: {item.icon || "Default"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
