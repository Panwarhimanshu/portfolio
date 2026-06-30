export const dynamic = 'force-dynamic';
import PortfolioPage from '@/components/portfolio-page';
import {
  getHero,
  getAbout,
  getProjects,
  getServices,
  getTechItems,
  getCertificates,
  getContactInfo,
  getInstagramPosts,
} from './actions';

export default async function Home() {
  const [hero, about, projects, services, techItems, certificates, contactInfo, instagramPosts] = await Promise.all([
    getHero(),
    getAbout(),
    getProjects(),
    getServices(),
    getTechItems(),
    getCertificates(),
    getContactInfo(),
    getInstagramPosts(),
  ]);

  return (
    <PortfolioPage
      hero={hero}
      about={about}
      projects={projects}
      services={services}
      techItems={techItems}
      certificates={certificates}
      contactInfo={contactInfo}
      instagramPosts={instagramPosts}
    />
  );
}
