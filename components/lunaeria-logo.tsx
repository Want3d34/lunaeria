export function LunaeriaLogo({ size = 25 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="drop-shadow-[0_0_10px_rgba(196,181,253,0.28)]"
      fill="none"
      height={size}
      viewBox="0 0 64 64"
      width={size}
    >
      <defs>
        <linearGradient id="lunaeria-moon" x1="14" x2="50" y1="9" y2="54">
          <stop stopColor="#f1e8ff" />
          <stop offset="0.48" stopColor="#b69bff" />
          <stop offset="1" stopColor="#6d5bd0" />
        </linearGradient>
        <linearGradient id="lunaeria-crystal" x1="25" x2="42" y1="21" y2="55">
          <stop stopColor="#efe9ff" />
          <stop offset="0.54" stopColor="#9d7cff" />
          <stop offset="1" stopColor="#31206f" />
        </linearGradient>
      </defs>
      <path
        d="M46.9 11.5c-9.8 1.7-17.3 10.2-17.3 20.5 0 10 7.1 18.4 16.5 20.4A24 24 0 1 1 46.9 11.5Z"
        fill="url(#lunaeria-moon)"
        stroke="#ede9fe"
        strokeOpacity="0.72"
        strokeWidth="2"
      />
      <path
        d="M32 18.5 43.5 31 32 57 20.5 31 32 18.5Z"
        fill="url(#lunaeria-crystal)"
        stroke="#c4b5fd"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M32 18.5V57M20.5 31h23M12 32h7M45 32h7M32 8v7"
        stroke="#f5f3ff"
        strokeLinecap="round"
        strokeOpacity="0.55"
        strokeWidth="1.8"
      />
      <path
        d="m17 14 2.1 4.2 4.4.7-3.2 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.2-3.2 4.4-.7L17 14Z"
        fill="#d8b4fe"
        opacity="0.9"
      />
    </svg>
  );
}
