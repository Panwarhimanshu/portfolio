"use client";

import { useTransition } from "react";
import { deleteMessage } from "@/app/actions";
import { ContactMessage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail } from "lucide-react";

export function ContactList({ messages }: { messages: ContactMessage[] }) {
    const [pending, startTransition] = useTransition();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {messages.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                No messages found.
                            </TableCell>
                        </TableRow>
                    )}
                    {messages.map((msg) => (
                        <TableRow key={msg.id}>
                            <TableCell className="whitespace-nowrap font-medium text-xs text-muted-foreground">
                                {new Date(msg.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{msg.name}</TableCell>
                            <TableCell>
                                <a href={`mailto:${msg.email}`} className="flex items-center hover:underline text-primary">
                                    <Mail className="w-3 h-3 mr-1" /> {msg.email}
                                </a>
                            </TableCell>
                            <TableCell className="max-w-md truncate" title={msg.message}>
                                {msg.message}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => startTransition(async () => await deleteMessage(msg.id))}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
