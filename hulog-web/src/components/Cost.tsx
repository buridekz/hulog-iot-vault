import { BOM_DATA } from "../data/bomData";
import { Reveal } from "./Reveal";

const GROUPS: { id: "brain" | "power_lock" | "enclosure_wiring"; title: string }[] = [
  { id: "brain", title: "The brain" },
  { id: "power_lock", title: "The lock" },
  { id: "enclosure_wiring", title: "Box and wires" },
];

export function Cost() {
  const total = BOM_DATA.reduce((acc, item) => acc + item.unitPricePhp * item.qty, 0);

  return (
    <div className="page">
      <h2>What it costs to build one</h2>
      <p className="lead">Electronics for a working vault sit at about ₱820. The full Shopee basket on this page, box included, adds up to ₱{total.toLocaleString("en-PH")}.</p>
      <div className="price">₱820</div>
      <p className="lead">If we sell a finished, powder-coated box, we are looking at ₱3,499 to ₱4,999 installed. We are not quoting a live shop yet.</p>

      {GROUPS.map((g) => (
        <Reveal key={g.id}>
          <h3 style={{ margin: "2rem 0 0.4rem", fontSize: "1.05rem" }}>{g.title}</h3>
          <div className="parts">
            {BOM_DATA.filter((i) => i.category === g.id).map((item) => (
              <div className="part" key={item.id}>
                <strong>{item.name}</strong>
                <span>
                  ₱{item.unitPricePhp} · {item.searchKeyword}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
