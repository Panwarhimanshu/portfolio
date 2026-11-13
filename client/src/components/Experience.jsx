export default function Experience({ items }) {
  return (
    <section className="wrap section" id="experience" aria-labelledby="exp-h">
      <header className="section__head">
        <h2 id="exp-h">Experience and education</h2>
      </header>
      <ol className="timeline">
        {items.map((e) => (
          <li key={e.dates + e.title}>
            <p className="timeline__date mono">{e.dates}</p>
            <div>
              <h3>{e.title}{e.org && <span className="org"> at {e.org}</span>}</h3>
              <p>{e.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
