import './legacy.js';
import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Writing from './components/Writing.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then(setData)
      .catch(() => setError('The portfolio could not load. Is the server running?'));
  }, []);

  useEffect(() => {
    if (data) document.title = `${data.profile.name}, ${data.profile.role.toLowerCase()}`;
  }, [data]);

  if (error) return <p className="wrap load-msg">{error}</p>;
  if (!data) return <div className="load-msg" aria-busy="true" />;

  const { profile } = data;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header name={profile.name} />
      <main id="main">
        <Hero profile={profile} projects={data.projects} />
        <Work projects={data.projects} note={data.githubNote} />
        <Skills groups={data.skills} />
        <Experience items={data.experience} />
        <Writing items={data.writing} now={data.now} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
