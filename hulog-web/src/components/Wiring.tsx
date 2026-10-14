import { Reveal } from "./Reveal";

const WIRES = [
  { pin: "GPIO 18", job: "Tells the relay to pop the 12V bolt for a few seconds." },
  { pin: "GPIO 19", job: "Listens to the door switch. Closed is the safe state." },
  { pin: "GPIO 5", job: "Looks inside with IR. Did a parcel actually land?" },
  { pin: "GPIO 21 / 22", job: "Talks to the tiny OLED (data and clock)." },
  { pin: "GPIO 4", job: "Buzzer. Happy chirp on unlock, angry chirp on a wrong PIN." },
  { pin: "GPIO 13, 12, 14, 27", job: "Keypad rows." },
  { pin: "GPIO 26, 25, 33, 32", job: "Keypad columns." },
  { pin: "VIN and GND", job: "5V brain power. The 12V lock lives on its own rail through the relay." },
];

export function Wiring() {
  return (
    <div className="page">
      <h2>How to wire the box</h2>
      <p className="lead">Two power stories: 12V for the bolt, 5V for the ESP32. Never feed the lock from the chip.</p>
      <Reveal>
        <p className="lead">
          12V plus goes to the relay common. Relay normally-open goes to the solenoid plus. Solenoid minus goes back to 12V ground. 5V from the buck converter feeds VIN. OLED sits on 3.3V.
        </p>
      </Reveal>
      <div className="wire-list">
        {WIRES.map((w) => (
          <div className="wire" key={w.pin}>
            <code>{w.pin}</code>
            <span>{w.job}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
