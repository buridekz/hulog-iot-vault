const SEG: Record<string, number> = {
  "0": 0b0111111,
  "1": 0b0000110,
  "2": 0b1011011,
  "3": 0b1001111,
  "4": 0b1100110,
  "5": 0b1101101,
  "6": 0b1111101,
  "7": 0b0000111,
  "8": 0b1111111,
  "9": 0b1101111,
  "-": 0b1000000,
  _: 0,
  " ": 0,
};

export function SevenSeg({
  value,
  ghost = "______",
  size = "md",
}: {
  value: string;
  ghost?: string;
  size?: "sm" | "md" | "lg";
}) {
  const padded = value.padEnd(ghost.length, "_").slice(0, ghost.length);
  return (
    <div className={`seven-row seven-${size}`} aria-hidden="true">
      {padded.split("").map((ch, i) => {
        const bits = SEG[ch] ?? 0;
        return (
          <span key={i} className="seven-digit" data-on={ch !== "_"}>
            {[0, 1, 2, 3, 4, 5, 6].map((s) => (
              <i key={s} className={`seg s${s} ${bits & (1 << s) ? "lit" : "ghost"}`} />
            ))}
          </span>
        );
      })}
    </div>
  );
}
