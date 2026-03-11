import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Seed Hero
    const hero = await prisma.heroSection.create({
        data: {
            heading: "Building for the Next Generation",
            subheading: "I craft digital experiences that merge art, engineering, and human connection.",
            ctaText: "Explore Work",
            ctaLink: "#projects",
        },
    })
    console.log({ hero })

    // Seed Services
    const servicesData = [
        {
            displayId: "01",
            title: "Web Development",
            description: "Building scalable, high-performance web applications with Next.js and React.",
            order: 1,
        },
        {
            displayId: "02",
            title: "UI/UX Design",
            description: "Crafting intuitive and aesthetically pleasing user interfaces that delight users.",
            order: 2,
        },
        {
            displayId: "03",
            title: "Motion Design",
            description: "Adding life to interfaces with complex animations and micro-interactions.",
            order: 3,
        },
        {
            displayId: "04",
            title: "Brand Strategy",
            description: "Defining your digital presence with a unified visual identity and voice.",
            order: 4,
        },
    ]

    for (const s of servicesData) {
        await prisma.service.create({ data: s })
    }
    console.log('Seeded Services')

    // Seed Projects
    const projectsData = [
        {
            id: "project-1",
            title: "Nebula Dashboard",
            description: "A futuristic analytics platform for space exploration data, featuring real-time 3D visualizations.",
            tags: ["Next.js", "Three.js", "Tailwind"],
            link: "#",
            colSpan: 2,
            order: 1,
        },
        {
            id: "project-2",
            title: "Quantum E-commerce",
            description: "An ultra-fast shopping experience utilizing edge computing and AI-driven recommendations.",
            tags: ["Shopify Headless", "React", "Redis"],
            link: "#",
            colSpan: 1,
            order: 2,
        },
        {
            id: "project-3",
            title: "Cyber Identity",
            description: "Decentralized identity management system with biometric authentication and zero-knowledge proofs.",
            tags: ["Web3", "Solidity", "Framer Motion"],
            link: "#",
            colSpan: 1,
            order: 3,
        },
        {
            id: "project-4",
            title: "Aether Social",
            description: "A privacy-focused social network with ephemeral content and end-to-end encryption.",
            tags: ["Socket.io", "Node.js", "PostgreSQL"],
            link: "#",
            colSpan: 2,
            order: 4,
        },
        {
            id: "project-5",
            title: "Lumina Art",
            description: "Digital art marketplace for NFTs and generative art pieces.",
            tags: ["Next.js", "GraphQL", "Stripe"],
            link: "#",
            colSpan: 1,
            order: 5,
        },
    ]

    for (const p of projectsData) {
        await prisma.portfolioProject.create({ data: p })
    }

    console.log('Seeded Projects')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
