import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const hero = await prisma.heroSection.findFirst();
    const about = await prisma.aboutSection.findFirst();

    console.log("--- Hero Section ---");
    console.log(JSON.stringify(hero, null, 2));

    console.log("\n--- About Section ---");
    console.log(JSON.stringify(about, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
