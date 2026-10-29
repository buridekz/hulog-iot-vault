import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "1",
    title: "You make a pass",
    body: "Open Hulog, name the rider, and get a 6-digit PIN. Copy the note and send it in chat.",
  },
  {
    n: "2",
    title: "Rider uses it once",
    body: "They already have the PIN in the chat. They type it on the keypad at the gate. The bolt opens for one drop.",
  },
  {
    n: "3",
    title: "The door shuts. The pass dies.",
    body: "A switch feels the door close. A light inside checks the parcel is really there. Then that PIN will not work again.",
  },
  {
    n: "4",
    title: "You take it out once",
    body: "When you are home, ask the box to open. That request works one time. It does not leave a code on the keypad.",
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
