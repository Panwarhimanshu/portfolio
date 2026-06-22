export const dynamic = 'force-dynamic';
import { Hero } from "@/components/landing/hero";
import { TechStack } from "@/components/landing/tech-stack";
import { ProjectsBento } from "@/components/landing/projects-bento";
import { VelocityScroll } from "@/components/landing/velocity-scroll";
import { ServicesList } from "@/components/landing/services-list";
import { CertificatesList } from "@/components/landing/certificates-list";
import { AboutSection } from "@/components/landing/about-section";
import { ContactForm } from "@/components/landing/contact-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { InstagramFeed } from "@/components/landing/instagram-feed";
import { GitHubFeed } from "@/components/landing/github-feed";
import {
  getHero,
  getCertificates,
  getProjects,
  getServices,
  getTechItems,
  getContactInfo,
  getAbout,
  getInstagramPosts
} from "./actions";

export default async function Home() {
  const [
    heroContent,
    certificates,
    projects,
    services,
    techItems,
    contactInfo,
    about,
    instagramPosts
  ] = await Promise.all([
    getHero(),
    getCertificates(),
    getProjects(),
    getServices(),
    getTechItems(),
    getContactInfo(),
    getAbout(),
    getInstagramPosts()
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero content={heroContent} />
      <TechStack techItems={techItems} />
      <VelocityScroll />
      <AboutSection about={about} />
      <InstagramFeed posts={instagramPosts} instagramUrl={contactInfo?.instagram} />
      <div className="w-full max-w-3xl mx-auto px-4 py-16">
        <GitHubFeed githubUrl={contactInfo?.github} />
      </div>
      <ServicesList services={services} />
      <ProjectsBento projects={projects} />
      <CertificatesList certificates={certificates} />
      <ContactForm />
      <SiteFooter contactInfo={contactInfo} about={about} />
    </main>
  );
}
