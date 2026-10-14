export function InkDefs() {
  return (
    <svg className="ink-defs" aria-hidden="true" width="0" height="0">
      <defs>
        <filter id="ink-bleed" x="-6%" y="-16%" width="112%" height="132%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.72 0.14" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export function ScribbleX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 10" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 6 C 28 2.2, 62 8.1, 96 5.2 S 164 2.4, 198 6.4 S 268 9.2, 312 4.1 S 372 7.6, 400 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScribbleY({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 480" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M5 0 C 2.2 48, 7.6 96, 4.4 144 S 8.2 240, 5.1 288 S 2 384, 6.4 432 S 4 470, 5 480"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
