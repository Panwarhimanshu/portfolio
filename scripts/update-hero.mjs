import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const hero = await prisma.heroSection.findFirst();
    if (hero) {
        await prisma.heroSection.update({
            where: { id: hero.id },
            data: {
                imageUrl: "/uploads/hero-graphic.png",
                heading: "Designer & Developer.",
                subheading: "Crafting digital symphonies with code and color. Specializing in high-performance React architectures and expressive UI design."
            }
        });
        console.log("Updated HeroSection with new graphic.");
    } else {
        await prisma.heroSection.create({
            data: {
                heading: "Designer & Developer.",
                subheading: "Crafting digital symphonies with code and color. Specializing in high-performance React architectures and expressive UI design.",
                imageUrl: "/uploads/hero-graphic.png",
                ctaText: "Explore Work"
            }
        });
        console.log("Created new HeroSection with graphic.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
