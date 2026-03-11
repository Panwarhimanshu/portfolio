import { getCertificates } from "@/app/actions";
import { CertificateForm } from "./certificate-form";

export default async function CertificatePage() {
    const certificates = await getCertificates();
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Certificates & Achievements</h1>
                <p className="text-muted-foreground">Showcase your professional qualifications.</p>
            </div>
            <CertificateForm certificates={certificates} />
        </div>
    );
}
