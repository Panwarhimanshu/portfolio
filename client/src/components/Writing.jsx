export default function Writing({ items, now }) {
  return (
    <section className="wrap section" id="writing" aria-labelledby="writing-h">
      <header className="section__head">
        <h2 id="writing-h">Writing, talks and certificates</h2>
      </header>
      <div className="writing">
        <ul className="notes">
          {items.map((w) => (
            <li key={w.date + w.title}>
              <span className="mono notes__date">{w.date}</span>
              <a href={w.url}>{w.title}</a>
              <span className="mono notes__kind">{w.kind}</span>
            </li>
          ))}
        </ul>
        {now?.length > 0 && (
          <dl className="now">
            {now.map((n) => (
              <div key={n.label}>
                <dt className="mono">{n.label}</dt>
                <dd>{n.text}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
