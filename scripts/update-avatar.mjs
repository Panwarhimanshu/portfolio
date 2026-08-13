import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const about = await prisma.aboutSection.findFirst();
    if (about) {
        await prisma.aboutSection.update({
            where: { id: about.id },
            data: { avatarUrl: "/uploads/avatar.jpg" }
        });
        console.log("Updated AboutSection with new avatar.");
    } else {
        await prisma.aboutSection.create({
            data: {
                bio: "Welcome to my next-gen platform.",
                avatarUrl: "/uploads/avatar.jpg"
            }
        });
        console.log("Created new AboutSection with avatar.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
