"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

// --- Hero Actions ---
export async function getHero() {
    return await prisma.heroSection.findFirst();
}

export async function updateHero(data: FormData) {
    const id = data.get("id") as string;
    const heading = data.get("heading") as string;
    const subheading = data.get("subheading") as string;
    const ctaText = data.get("ctaText") as string;
    const ctaLink = data.get("ctaLink") as string;

    let imageUrl = (data.get("imageUrl") as string) || "";
    const imageFile = data.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        try {
            imageUrl = await saveFile(imageFile);
        } catch (error) {
            console.error("Failed to upload hero image:", error);
        }
    }

    if (id) {
        await prisma.heroSection.update({
            where: { id },
            data: { heading, subheading, ctaText, ctaLink, imageUrl },
        });
    } else {
        await prisma.heroSection.create({
            data: { heading, subheading, ctaText, ctaLink, imageUrl },
        });
    }

    revalidatePath("/");
    revalidatePath("/admin/hero");
}


// --- About Actions ---
export async function getAbout() {
    return await prisma.aboutSection.findFirst();
}

export async function updateAbout(data: FormData) {
    const id = data.get("id") as string;
    const bio = data.get("bio") as string;
    const resumeLink = data.get("resumeLink") as string;

    let avatarUrl = (data.get("avatarUrl") as string) || "";
    const avatarFile = data.get("avatar") as File | null;

    if (avatarFile && avatarFile.size > 0 && avatarFile.name !== "undefined") {
        try {
            avatarUrl = await saveFile(avatarFile);
        } catch (error) {
            console.error("Failed to upload avatar:", error);
        }
    }

    if (id) {
        await prisma.aboutSection.update({
            where: { id },
            data: { bio, avatarUrl, resumeLink },
        });
    } else {
        await prisma.aboutSection.create({
            data: { bio, avatarUrl, resumeLink },
        });
    }

    revalidatePath("/");
    revalidatePath("/admin/about");
}


// --- Project Actions ---
export async function getProjects() {
    return await prisma.portfolioProject.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createProject(data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const link = data.get("link") as string;
    const tags = data.get("tags") as string; // comma separated

    let image = "";
    const imageFile = data.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        try {
            image = await saveFile(imageFile);
        } catch (error) {
            console.error("Failed to upload file:", error);
        }
    } else {
        image = (data.get("image") as string) || "";
    }

    await prisma.portfolioProject.create({
        data: { title, description, link, image, tags },
    });
    revalidatePath("/admin/work");
    revalidatePath("/");
}

export async function deleteProject(id: string) {
    await prisma.portfolioProject.delete({ where: { id } });
    revalidatePath("/admin/work");
    revalidatePath("/");
}

// --- Certificate Actions ---
export async function getCertificates() {
    return await prisma.certificate.findMany({
        orderBy: { date: "desc" },
    });
}

// ... existing imports

// Helper to save file
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
}

export async function createCertificate(data: FormData) {
    const title = data.get("title") as string;
    const issuer = data.get("issuer") as string;
    const date = new Date(data.get("date") as string);
    const credentialUrl = data.get("credentialUrl") as string;

    let imageUrl = "";
    const imageFile = data.get("image") as File | null;

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        try {
            imageUrl = await saveFile(imageFile);
        } catch (error) {
            console.error("Failed to upload file:", error);
            // Fallback or handle error
        }
    } else {
        // Fallback to text input if user pasted a URL (optional, or just handle file)
        imageUrl = (data.get("imageUrl") as string) || "";
    }

    await prisma.certificate.create({
        data: { title, issuer, date, imageUrl, credentialUrl },
    });
    revalidatePath("/admin/certificates");
    revalidatePath("/");
}

export async function deleteCertificate(id: string) {
    await prisma.certificate.delete({ where: { id } });
    revalidatePath("/admin/certificates");
    revalidatePath("/");
}

// --- Contact Actions ---
export async function getMessages() {
    return await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function deleteMessage(id: string) {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/contact");
}

// ... existing imports

// --- Tech Item Actions ---
export async function getTechItems() {
    return await prisma.techItem.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createTechItem(data: FormData) {
    const name = data.get("name") as string;
    const icon = data.get("icon") as string;
    const order = parseInt(data.get("order") as string) || 0;

    await prisma.techItem.create({
        data: { name, icon, order },
    });
    revalidatePath("/admin/tech");
    revalidatePath("/");
}


export async function deleteTechItem(id: string) {
    await prisma.techItem.delete({ where: { id } });
    revalidatePath("/admin/tech");
    revalidatePath("/");
}


// --- Service Actions ---
export async function getServices() {
    return await prisma.service.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createService(data: FormData) {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const displayId = data.get("displayId") as string;

    await prisma.service.create({
        data: { title, description, displayId },
    });
    revalidatePath("/admin/services");
    revalidatePath("/");
}

export async function deleteService(id: string) {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/services");
    revalidatePath("/");
}




// --- Contact Info Actions ---
export async function getContactInfo() {
    return await prisma.contactInfo.findFirst();
}

export async function updateContactInfo(data: FormData) {
    const id = data.get("id") as string;
    const mobile = data.get("mobile") as string;
    const email = data.get("email") as string;
    const address = data.get("address") as string;
    const linkedin = data.get("linkedin") as string;
    const instagram = data.get("instagram") as string;
    const github = data.get("github") as string;
    const whatsapp = data.get("whatsapp") as string;

    const dataObj = { mobile, email, address, linkedin, instagram, github, whatsapp };

    if (id) {
        await prisma.contactInfo.update({
            where: { id },
            data: dataObj,
        });
    } else {
        await prisma.contactInfo.create({
            data: dataObj,
        });
    }

    revalidatePath("/");
    revalidatePath("/admin/contact");
}

// --- Instagram Post Actions ---
export async function getInstagramPosts() {
    return await prisma.instagramPost.findMany({ orderBy: { order: "asc" } });
}

export async function createInstagramPost(data: FormData) {
    const imageUrl = data.get("imageUrl") as string;
    const caption = data.get("caption") as string;
    const postUrl = data.get("postUrl") as string;
    const likes = parseInt(data.get("likes") as string) || 0;
    const comments = parseInt(data.get("comments") as string) || 0;
    const order = parseInt(data.get("order") as string) || 0;
    await prisma.instagramPost.create({ data: { imageUrl, caption, postUrl, likes, comments, order } });
    revalidatePath("/");
    revalidatePath("/admin/instagram");
}

export async function deleteInstagramPost(id: string) {
    await prisma.instagramPost.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/instagram");
}

// --- Contact Message Actions ---
export async function sendContactMessage(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;

    if (!name || !email || !message) throw new Error("Missing required fields");

    await prisma.contactMessage.create({
        data: { name, email, message },
    });
    revalidatePath("/admin/contact");
}

// --- Dashboard Actions ---
export async function getDashboardStats() {
    const [projectsCount, servicesCount, certificatesCount, messagesCount] = await Promise.all([
        prisma.portfolioProject.count(),
        prisma.service.count(),
        prisma.certificate.count(),
        prisma.contactMessage.count(),
    ]);

    return {
        projectsCount,
        servicesCount,
        certificatesCount,
        messagesCount,
    };
}

// --- Settings Actions ---
export async function getSiteSettings() {
    try {
        // @ts-ignore - siteSettings might not be in the generated client yet
        let settings = await prisma.siteSettings?.findFirst();
        if (!settings) {
            // @ts-ignore
            settings = await prisma.siteSettings?.create({
                data: { siteName: "Next-Gen Platform" }
            });
        }
        return settings || { siteName: "Next-Gen Platform", siteDescription: "", seoKeywords: "", maintenanceMode: false };
    } catch (e) {
        console.error("Prisma siteSettings model not found. Run 'npx prisma generate'.");
        return { siteName: "Next-Gen Platform", siteDescription: "", seoKeywords: "", maintenanceMode: false };
    }
}

export async function updateSiteSettings(data: FormData) {
    const id = data.get("id") as string;
    const siteName = data.get("siteName") as string;
    const siteDescription = data.get("siteDescription") as string;
    const seoKeywords = data.get("seoKeywords") as string;
    const maintenanceMode = data.get("maintenanceMode") === "on";

    try {
        // @ts-ignore
        await prisma.siteSettings.update({
            where: { id },
            data: { siteName, siteDescription, seoKeywords, maintenanceMode },
        });
    } catch (e) {
        console.error("Failed to update settings. Prisma model missing?");
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");
}


