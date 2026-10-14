import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "1",
    title: "You make a pass",
    body: "Open Hulog, name the rider, and get a 6-digit PIN plus a QR. Copy the Taglish note and send it in chat.",
  },
  {
    n: "2",
    title: "Rider uses it once",
    body: "They type the PIN on the keypad or show the QR to the little screen. The bolt opens for one drop.",
  },
  {
    n: "3",
    title: "The door shuts. The pass dies.",
    body: "A switch feels the door close. A light inside checks the parcel is really there. Then that PIN will not work again.",
  },
];

export function HowItWorks() {
  return (
    <div className="page">
      <h2>How a drop works</h2>
      <p className="lead">Same idea as a jeepney beep. One tap, then the fare is spent. Here the fare is a gate code.</p>
      <div className="steps">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="step">
              <div className="step-mark" aria-hidden="true">
                {s.n}
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
