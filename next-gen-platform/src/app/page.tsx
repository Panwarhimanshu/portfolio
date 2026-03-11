import { Hero } from "@/components/landing/hero";
import { TechStack } from "@/components/landing/tech-stack";
import { ProjectsBento } from "@/components/landing/projects-bento";
import { VelocityScroll } from "@/components/landing/velocity-scroll";
import { ServicesList } from "@/components/landing/services-list";
import { CertificatesList } from "@/components/landing/certificates-list";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  getHero,
  getCertificates,
  getProjects,
  getServices,
  getTechItems,
  getContactInfo,
  getAbout
} from "./actions";

export default async function Home() {
  const [
    heroContent,
    certificates,
    projects,
    services,
    techItems,
    contactInfo,
    about
  ] = await Promise.all([
    getHero(),
    getCertificates(),
    getProjects(),
    getServices(),
    getTechItems(),
    getContactInfo(),
    getAbout()
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero content={heroContent} />
      <TechStack techItems={techItems} />
      <VelocityScroll />
      <ServicesList services={services} />
      <ProjectsBento projects={projects} />
      <CertificatesList certificates={certificates} />
      <SiteFooter contactInfo={contactInfo} about={about} />
    </main>
  );
}

