const PEOPLE = [
  { name: "CAMARADOR, Jhorenz S.", job: "Hardware and enclosure" },
  { name: "CORPUZ, Lance Josh M.", job: "Lead and systems" },
  { name: "GOZE, AJ M.", job: "Firmware" },
  { name: "LUZANO, Justin Mark D.", job: "Cloud and this site" },
];

export function Team() {
  return (
    <div className="page">
      <h2>Who built this</h2>
      <p className="lead">University of Makati, CCIS. Technopreneurship and Real-Time Systems, AY 2026-2027.</p>
      <div className="people">
        {PEOPLE.map((p) => (
          <div className="person" key={p.name}>
            <strong>{p.name}</strong>
            <p>{p.job}</p>
          </div>
        ))}
      </div>
      <div className="person" style={{ marginTop: "0.5rem" }}>
        <strong>Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT</strong>
        <p>Adviser. Founder and CEO, Erovoutika.</p>
      </div>
      <a className="btn btn-stamp" href="/Hulog_One_Page_Proposal.pdf" target="_blank" rel="noopener noreferrer" style={{ marginTop: "1.5rem" }}>
        Open the one-page proposal
      </a>
    </div>
  );
}
