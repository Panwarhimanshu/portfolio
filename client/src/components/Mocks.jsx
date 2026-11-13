// Stand-in screens for the sample projects, shown until a real screenshot exists.
// Once you add a screenshot, remove the "mock" line from that project in portfolio.json.

function Tiffin() {
  const rows = [
    ['Mehta family', 'Sector 21, 2 tiffins', 'ok', 'Delivered'],
    ['R. Iyer', 'Model Town, 1 tiffin', 'ok', 'Delivered'],
    ['Kapoor', 'Civil Lines, 3 tiffins', 'go', 'On the way'],
    ['S. Bansal', 'Sector 14', '', 'Paused till 12 Nov'],
    ['A. Khan', 'Rajouri Garden, 2 tiffins', 'go', 'On the way'],
    ['Verma PG', 'Sector 15, 6 tiffins', '', 'Packing'],
    ['N. Joshi', 'Model Town, 1 tiffin', '', 'Packing']
  ];
  return (
    <div className="mock">
      <div className="m-head"><span className="m-title">Lunch, Friday 6 November</span><span className="m-sub mono">Route 2</span></div>
      <div className="m-stats">
        <div><b>58</b><span>Tiffins today</span></div>
        <div><b>6</b><span>Paused</span></div>
        <div><b>₹1,84,200</b><span>Collected in November</span></div>
      </div>
      <div className="m-rows">
        {rows.map(([name, where, state, label]) => (
          <div className="m-row" key={name}>
            <span>{name}</span>
            <span className="m-sub">{where}</span>
            <span className="m-status"><span className={`m-dot${state ? ` m-dot--${state}` : ''}`} />{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Queueless() {
  return (
    <div className="mock mock--tv">
      <span className="tv-label mono">Now seeing</span>
      <div className="tv-now">
        <span className="tv-num">24</span>
        <span className="tv-room">Dr. Sharma<small>Room 2, average wait 11 min</small></span>
      </div>
      <div className="tv-next">{[25, 26, 27, 28].map((n) => <span key={n}>{n}</span>)}</div>
    </div>
  );
}

function Mess() {
  const bars = [['Dal too watery', 38], ['Breakfast late on Tuesday', 21], ['Not enough rotis at dinner', 17], ['Cold tea in the morning', 9]];
  const max = bars[0][1];
  return (
    <div className="mock">
      <div className="m-head"><span className="m-title">Week 44, Hostel B</span><span className="m-sub mono">412 ratings</span></div>
      <div className="m-stats">
        <div><b>3.6 / 5</b><span>Average dinner rating</span></div>
        <div><b>85</b><span>Problems reported</span></div>
      </div>
      <div className="m-bars">
        {bars.map(([label, n], i) => (
          <div className={`m-bar${i === 0 ? ' m-bar--top' : ''}`} key={label}>
            <span>{label}</span><b>{n}</b>
            <div className="m-bar__track"><div className="m-bar__fill" style={{ width: `${Math.round((n / max) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Paperboy() {
  return (
    <div className="mock mock--term">
      <div className="t-cmd">paperboy run</div>
      <div className="t-dim">fetching 23 feeds</div>
      <div>  hacker news ........ 12 items</div>
      <div>  the hindu tech ..... 8 items</div>
      <div>  julia evans ........ 1 item</div>
      <div>  go blog ............ 1 item</div>
      <div className="t-dim">  19 more feeds, 31 items</div>
      <div className="t-dim">laying out 53 articles</div>
      <div className="t-ok">wrote paper-2026-11-06.pdf, 14 pages</div>
    </div>
  );
}

export const MOCKS = { tiffin: Tiffin, queueless: Queueless, mess: Mess, paperboy: Paperboy };
