export const dynamic = 'force-dynamic';
import { getMessages, getContactInfo } from "@/app/actions";
import { ContactList } from "./contact-list";
import { ContactInfoForm } from "./contact-info-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ContactPage() {
    const messages = await getMessages();
    const contactInfo = await getContactInfo();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
                <p className="text-muted-foreground">Manage messages and your contact information.</p>
            </div>

            <Tabs defaultValue="messages" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="info">Contact Details</TabsTrigger>
                </TabsList>
                <TabsContent value="messages" className="space-y-4">
                    <ContactList messages={messages} />
                </TabsContent>
                <TabsContent value="info">
                    <ContactInfoForm defaultData={contactInfo} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
