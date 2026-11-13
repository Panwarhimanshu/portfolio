import ListEditor, { newId } from './ListEditor.jsx';
import { Text, Area, Tags, Lines, Check, Select, Upload } from './fields.jsx';

const upd = (obj, key, set) => (v) => set({ ...obj, [key]: v });

/* ---------------- Profile ---------------- */
export function ProfileEditor({ data, setData }) {
  const p = data.profile;
  const setP = (next) => setData({ ...data, profile: next });
  const f = (key) => upd(p, key, setP);
  const note = data.githubNote || { text: '', label: '', url: '' };
  const setNote = (next) => setData({ ...data, githubNote: next });
  const links = (p.links || []).map((l) => (l._id ? l : { ...l, _id: newId() }));

  return (
    <>
      <div className="a-card">
        <h3 className="a-card__title">About you</h3>
        <div className="a-grid">
          <Text label="Name" value={p.name} onChange={f('name')} />
          <Text label="Role" value={p.role} onChange={f('role')} placeholder="Software developer" />
          <Text label="City" value={p.location} onChange={f('location')} />
          <Text label="Email" type="email" value={p.email} onChange={f('email')} />
          <Text label="WhatsApp number" type="tel" value={p.whatsapp} onChange={f('whatsapp')} placeholder="+91 98765 43210" hint="With country code. Leave empty to hide the WhatsApp button" />
        </div>
        <Area label="Headline" value={p.headline} onChange={f('headline')} rows={2} hint="The big sentence at the top of the page" />
        <Area label="Intro" value={p.intro} onChange={f('intro')} rows={3} />
        <Area label="Availability" value={p.availability} onChange={f('availability')} rows={2} hint="Shown in the Contact section" />
      </div>

      <div className="a-card">
        <h3 className="a-card__title">Photo and résumé</h3>
        <Upload label="Your photo" value={p.photo} onChange={f('photo')} hint="Portrait, about 1000 × 1250 px. Without a photo, the hero shows your featured project" />
        <Upload label="Résumé" value={p.resume} onChange={f('resume')} accept="application/pdf" preview="link" hint="PDF" />
      </div>

      <div className="a-card">
        <h3 className="a-card__title">Links</h3>
        <ListEditor
          items={links}
          onChange={(next) => setP({ ...p, links: next })}
          newItem={() => ({ label: '', url: 'https://' })}
          title={(l) => l.label}
          meta={(l) => l.url}
          noun="link"
          addLabel="Add link"
          render={(l, set) => (
            <div className="a-grid">
              <Text label="Label" value={l.label} onChange={upd(l, 'label', set)} placeholder="GitHub" />
              <Text label="URL" value={l.url} onChange={upd(l, 'url', set)} />
            </div>
          )}
        />
      </div>

      <div className="a-card">
        <h3 className="a-card__title">Line under the projects</h3>
        <div className="a-grid a-grid--3">
          <Text label="Text" value={note.text} onChange={upd(note, 'text', setNote)} />
          <Text label="Link text" value={note.label} onChange={upd(note, 'label', setNote)} />
          <Text label="Link URL" value={note.url} onChange={upd(note, 'url', setNote)} />
        </div>
      </div>
    </>
  );
}

/* ---------------- Projects ---------------- */
const MOCK_OPTIONS = [['', 'None'], ['tiffin', 'Delivery list'], ['queueless', 'Token display'], ['mess', 'Bar summary'], ['paperboy', 'Terminal']];

export function ProjectsEditor({ data, setData }) {
  const setFeatured = (id) => setData({ ...data, projects: data.projects.map((p) => ({ ...p, featured: p._id === id })) });

  return (
    <div className="a-card">
      <p className="a-intro">Projects show on the site in this order. The featured one is shown large at the top.</p>
      <ListEditor
        items={data.projects}
        onChange={(next) => setData({ ...data, projects: next })}
        newItem={() => ({ title: '', year: String(new Date().getFullYear()), role: 'Solo', category: 'Web app', description: '', tags: [], image: '', live: '', code: '' })}
        title={(p) => p.title}
        meta={(p) => [p.featured && 'Featured', p.year, p.category].filter(Boolean).join(' · ')}
        noun="project"
        addLabel="Add project"
        render={(p, set) => (
          <>
            <div className="a-grid">
              <Text label="Title" value={p.title} onChange={upd(p, 'title', set)} />
              <Text label="Year" value={p.year} onChange={upd(p, 'year', set)} />
              <Text label="Role" value={p.role} onChange={upd(p, 'role', set)} placeholder="Solo, Team of 3" />
              <Text label="Category" value={p.category} onChange={upd(p, 'category', set)} hint="Used for the filter tabs" />
            </div>
            <Area label="Description" value={p.description} onChange={upd(p, 'description', set)} rows={3} />
            <Tags label="Built with" value={p.tags} onChange={upd(p, 'tags', set)} />
            <div className="a-grid">
              <Text label="Live site" value={p.live} onChange={upd(p, 'live', set)} placeholder="https://" />
              <Text label="Source code" value={p.code} onChange={upd(p, 'code', set)} placeholder="https://github.com/..." />
            </div>
            <Upload label="Screenshot" value={p.image} onChange={upd(p, 'image', set)} hint="Landscape, about 1600 × 1000 px" />
            <div className="a-grid">
              <Select label="Stand-in screen" value={p.mock || ''} onChange={upd(p, 'mock', set)} options={MOCK_OPTIONS} hint="Shown only when there is no screenshot" />
              <div className="a-field a-field--end">
                <Check label="Featured project" value={p.featured} onChange={(v) => (v ? setFeatured(p._id) : set({ ...p, featured: false }))} />
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}

/* ---------------- Skills ---------------- */
export function SkillsEditor({ data, setData }) {
  return (
    <div className="a-card">
      <p className="a-intro">Each group is a column on the site.</p>
      <ListEditor
        items={data.skills}
        onChange={(next) => setData({ ...data, skills: next })}
        newItem={() => ({ group: '', items: [] })}
        title={(g) => g.group}
        meta={(g) => `${g.items.length} skills`}
        noun="group"
        addLabel="Add group"
        render={(g, set) => (
          <>
            <Text label="Group name" value={g.group} onChange={upd(g, 'group', set)} placeholder="Every day" />
            <Lines label="Skills" value={g.items} onChange={upd(g, 'items', set)} />
          </>
        )}
      />
    </div>
  );
}

/* ---------------- Experience ---------------- */
export function ExperienceEditor({ data, setData }) {
  return (
    <div className="a-card">
      <ListEditor
        items={data.experience}
        onChange={(next) => setData({ ...data, experience: next })}
        newItem={() => ({ dates: '', title: '', org: '', text: '' })}
        title={(e) => e.title}
        meta={(e) => [e.org, e.dates].filter(Boolean).join(' · ')}
        noun="entry"
        addLabel="Add job or course"
        render={(e, set) => (
          <>
            <div className="a-grid a-grid--3">
              <Text label="Title" value={e.title} onChange={upd(e, 'title', set)} placeholder="Software developer intern" />
              <Text label="Company or college" value={e.org} onChange={upd(e, 'org', set)} />
              <Text label="Dates" value={e.dates} onChange={upd(e, 'dates', set)} placeholder="2025 – now" />
            </div>
            <Area label="What you did" value={e.text} onChange={upd(e, 'text', set)} rows={3} />
          </>
        )}
      />
    </div>
  );
}

/* ---------------- Writing ---------------- */
export function WritingEditor({ data, setData }) {
  return (
    <div className="a-card">
      <p className="a-intro">Posts, talks, certificates and open-source work.</p>
      <ListEditor
        items={data.writing}
        onChange={(next) => setData({ ...data, writing: next })}
        newItem={() => ({ date: '', title: '', kind: 'Post', url: '' })}
        title={(w) => w.title}
        meta={(w) => [w.kind, w.date].filter(Boolean).join(' · ')}
        noun="entry"
        addLabel="Add entry"
        render={(w, set) => (
          <>
            <Text label="Title" value={w.title} onChange={upd(w, 'title', set)} />
            <div className="a-grid a-grid--3">
              <Text label="Date" value={w.date} onChange={upd(w, 'date', set)} placeholder="Oct 2026" />
              <Text label="Kind" value={w.kind} onChange={upd(w, 'kind', set)} placeholder="Post, Talk, Certificate" />
              <Text label="Link" value={w.url} onChange={upd(w, 'url', set)} placeholder="https://" />
            </div>
          </>
        )}
      />
    </div>
  );
}

/* ---------------- Now ---------------- */
export function NowEditor({ data, setData }) {
  return (
    <div className="a-card">
      <p className="a-intro">The small list next to your writing, about what you're up to right now.</p>
      <ListEditor
        items={data.now}
        onChange={(next) => setData({ ...data, now: next })}
        newItem={() => ({ label: '', text: '' })}
        title={(n) => n.label}
        meta={(n) => n.text}
        noun="line"
        addLabel="Add line"
        render={(n, set) => (
          <div className="a-grid">
            <Text label="Label" value={n.label} onChange={upd(n, 'label', set)} placeholder="Reading" />
            <Text label="Text" value={n.text} onChange={upd(n, 'text', set)} />
          </div>
        )}
      />
    </div>
  );
}
