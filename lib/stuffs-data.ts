export type DofusClass = {
  name: string;
  image: string;
  accent: string;
};

export type DofusElement = {
  label: string;
  icon: string;
  accent: string;
};

type ClassArt = {
  accent: string;
  secondary: string;
  hair: string;
  weapon: string;
  symbol: string;
};

const classArt: Record<string, ClassArt> = {
  Cra: {
    accent: "#f4c66e",
    secondary: "#7dd3fc",
    hair: "#f8fafc",
    weapon: `<path d="M45 158c34-72 116-72 150 0M58 154c34-38 90-38 124 0" fill="none" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/><path d="M120 45v132" stroke="#f4c66e" stroke-width="5" stroke-linecap="round"/><path d="m111 62 18-12-6 22" fill="#f4c66e"/>`,
    symbol: "arrow",
  },
  Ecaflip: {
    accent: "#fb7185",
    secondary: "#facc15",
    hair: "#27272a",
    weapon: `<path d="M48 54h48v68H48Z" fill="#f8fafc" opacity=".92"/><path d="M60 70h24M60 90h24M60 110h24" stroke="#fb7185" stroke-width="5" stroke-linecap="round"/><circle cx="182" cy="63" r="23" fill="#facc15"/><path d="M170 63h24M182 51v24" stroke="#3f1d2f" stroke-width="5"/>`,
    symbol: "cards",
  },
  Eliotrope: {
    accent: "#8b5cf6",
    secondary: "#67e8f9",
    hair: "#1e1b4b",
    weapon: `<circle cx="56" cy="72" r="24" fill="none" stroke="#67e8f9" stroke-width="8"/><circle cx="184" cy="76" r="28" fill="none" stroke="#8b5cf6" stroke-width="8"/><path d="M72 72c30 10 64 10 96 2" stroke="#f8fafc" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
    symbol: "portal",
  },
  Eniripsa: {
    accent: "#f0abfc",
    secondary: "#86efac",
    hair: "#f8fafc",
    weapon: `<path d="M44 116c22-34 48-50 78-48 30 2 56 18 74 48-46-16-102-16-152 0Z" fill="#f0abfc" opacity=".5"/><path d="M68 107c18-20 36-28 52-28s34 8 52 28" fill="none" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/><path d="M184 42v44M162 64h44" stroke="#86efac" stroke-width="8" stroke-linecap="round"/>`,
    symbol: "wings",
  },
  Enutrof: {
    accent: "#f59e0b",
    secondary: "#a3e635",
    hair: "#e5e7eb",
    weapon: `<path d="M56 156c24-8 48-8 72 0 0 20-72 20-72 0Z" fill="#f59e0b"/><path d="M54 58h96v32H54Z" fill="#f8fafc" opacity=".88"/><path d="M52 84h100" stroke="#a16207" stroke-width="7"/><path d="M170 50v116" stroke="#a3e635" stroke-width="6" stroke-linecap="round"/><path d="M160 56h20" stroke="#a3e635" stroke-width="9" stroke-linecap="round"/>`,
    symbol: "bag",
  },
  Feca: {
    accent: "#60a5fa",
    secondary: "#c4b5fd",
    hair: "#111827",
    weapon: `<path d="M120 42 177 62v46c0 38-24 66-57 86-33-20-57-48-57-86V62Z" fill="#60a5fa" opacity=".52" stroke="#f8fafc" stroke-width="6"/><path d="M120 70v90M88 101h64" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>`,
    symbol: "shield",
  },
  Forgelance: {
    accent: "#fb923c",
    secondary: "#f8fafc",
    hair: "#78350f",
    weapon: `<path d="M178 30 80 186" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/><path d="m166 34 29 8-19 22Z" fill="#fb923c"/><path d="M80 138 54 170" stroke="#fb923c" stroke-width="8" stroke-linecap="round"/>`,
    symbol: "lance",
  },
  Huppermage: {
    accent: "#a78bfa",
    secondary: "#fde68a",
    hair: "#f8fafc",
    weapon: `<path d="M120 40 145 82 120 124 95 82Z" fill="#a78bfa" opacity=".9"/><path d="M73 79h94M88 122h64M104 164h32" stroke="#fde68a" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="82" r="44" fill="none" stroke="#f8fafc" stroke-width="4" opacity=".65"/>`,
    symbol: "runes",
  },
  Iop: {
    accent: "#ef4444",
    secondary: "#f8fafc",
    hair: "#facc15",
    weapon: `<path d="M168 28 190 50 102 138 80 116Z" fill="#f8fafc"/><path d="m76 120 22 22-18 18-22-22Z" fill="#ef4444"/><path d="M92 60h56l-12 34h-32Z" fill="#facc15"/>`,
    symbol: "sword",
  },
  Osamodas: {
    accent: "#38bdf8",
    secondary: "#a855f7",
    hair: "#111827",
    weapon: `<path d="M62 54c18 20 28 46 30 78M178 54c-18 20-28 46-30 78" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/><path d="M70 50 50 30M170 50l20-20" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/><circle cx="188" cy="154" r="19" fill="#38bdf8"/><path d="M178 152h20" stroke="#07111f" stroke-width="5"/>`,
    symbol: "horns",
  },
  Ouginak: {
    accent: "#a16207",
    secondary: "#f97316",
    hair: "#292524",
    weapon: `<path d="M62 72c14-32 44-32 58-2 14-30 44-30 58 2-26 0-42 10-58 28-16-18-32-28-58-28Z" fill="#a16207"/><path d="M78 156c34 18 50 18 84 0" stroke="#f97316" stroke-width="8" stroke-linecap="round"/><path d="M92 92h56" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>`,
    symbol: "fang",
  },
  Pandawa: {
    accent: "#22c55e",
    secondary: "#f59e0b",
    hair: "#111827",
    weapon: `<path d="M156 52h36v112h-36Z" fill="#22c55e"/><path d="M151 64h46M151 150h46" stroke="#f8fafc" stroke-width="6"/><path d="M52 148c28-24 56-24 84 0" fill="none" stroke="#f59e0b" stroke-width="9" stroke-linecap="round"/>`,
    symbol: "barrel",
  },
  Roublard: {
    accent: "#f43f5e",
    secondary: "#f8fafc",
    hair: "#18181b",
    weapon: `<circle cx="58" cy="156" r="22" fill="#f43f5e"/><circle cx="182" cy="150" r="20" fill="#f43f5e"/><path d="M58 134v-22M182 130v-22" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/><path d="M92 66h56v22H92Z" fill="#18181b"/><path d="M86 88h68" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>`,
    symbol: "bomb",
  },
  Sacrieur: {
    accent: "#dc2626",
    secondary: "#c4b5fd",
    hair: "#f8fafc",
    weapon: `<path d="M120 42c28 32 44 58 44 86 0 34-22 58-44 58s-44-24-44-58c0-28 16-54 44-86Z" fill="#dc2626" opacity=".52"/><path d="M84 108h72M120 72v96" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/>`,
    symbol: "blood",
  },
  Sadida: {
    accent: "#65a30d",
    secondary: "#facc15",
    hair: "#4d7c0f",
    weapon: `<path d="M54 132c28-54 104-66 132-4-40-8-92 0-132 4Z" fill="#65a30d"/><path d="M74 84c28-30 64-32 92 0" fill="none" stroke="#facc15" stroke-width="7" stroke-linecap="round"/><circle cx="184" cy="150" r="18" fill="#facc15"/><path d="M174 144c8 10 14 10 22 0" stroke="#365314" stroke-width="4" stroke-linecap="round"/>`,
    symbol: "leaf",
  },
  Sram: {
    accent: "#94a3b8",
    secondary: "#c084fc",
    hair: "#020617",
    weapon: `<path d="M64 66h112v42H64Z" fill="#020617"/><path d="M88 88h64" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/><path d="M82 154 46 190M158 154l36 36" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/><path d="M78 154h84" stroke="#c084fc" stroke-width="5" stroke-linecap="round"/>`,
    symbol: "daggers",
  },
  Steamer: {
    accent: "#0ea5e9",
    secondary: "#f97316",
    hair: "#7c2d12",
    weapon: `<circle cx="120" cy="112" r="48" fill="none" stroke="#0ea5e9" stroke-width="8"/><path d="M120 48v28M120 148v28M56 112h28M156 112h28" stroke="#f97316" stroke-width="7" stroke-linecap="round"/><circle cx="120" cy="112" r="16" fill="#f8fafc"/>`,
    symbol: "gear",
  },
  Xelor: {
    accent: "#facc15",
    secondary: "#8b5cf6",
    hair: "#f8fafc",
    weapon: `<circle cx="120" cy="105" r="54" fill="none" stroke="#facc15" stroke-width="8"/><path d="M120 68v42l30 20" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/><path d="M78 42h84M90 178h60" stroke="#8b5cf6" stroke-width="8" stroke-linecap="round"/>`,
    symbol: "clock",
  },
  Zobal: {
    accent: "#e879f9",
    secondary: "#f8fafc",
    hair: "#111827",
    weapon: `<path d="M74 54h92v58c0 34-18 58-46 72-28-14-46-38-46-72Z" fill="#e879f9" opacity=".58" stroke="#f8fafc" stroke-width="6"/><circle cx="102" cy="98" r="7" fill="#111827"/><circle cx="138" cy="98" r="7" fill="#111827"/><path d="M96 132c16 12 32 12 48 0" stroke="#111827" stroke-width="6" stroke-linecap="round"/>`,
    symbol: "mask",
  },
};

function classImage(name: string, art: ClassArt) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="360" viewBox="0 0 320 360"><defs><radialGradient id="halo" cx="50%" cy="18%" r="75%"><stop stop-color="${art.secondary}" stop-opacity=".65"/><stop offset=".42" stop-color="${art.accent}" stop-opacity=".28"/><stop offset="1" stop-color="#030512" stop-opacity="0"/></radialGradient><linearGradient id="armor" x1="100" x2="220" y1="132" y2="312"><stop stop-color="${art.accent}"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient></defs><rect width="320" height="360" rx="42" fill="transparent"/><ellipse cx="160" cy="150" rx="116" ry="132" fill="url(#halo)"/><g transform="translate(40 18)">${art.weapon}</g><path d="M118 312c10-78 22-120 42-120s32 42 42 120Z" fill="url(#armor)"/><path d="M104 312c6-78 26-116 56-116s50 38 56 116Z" fill="url(#armor)" opacity=".82"/><path d="M106 312h108l-26-78-28 44-28-44Z" fill="#ede9fe" opacity=".18"/><circle cx="160" cy="128" r="43" fill="#f3e8ff"/><path d="M111 124c14-55 82-62 104-6-25-18-62-16-104 6Z" fill="${art.hair}"/><path d="M132 141h.1M188 141h.1" stroke="#171126" stroke-width="10" stroke-linecap="round"/><path d="M140 163c14 9 26 9 40 0" fill="none" stroke="#171126" stroke-width="6" stroke-linecap="round" opacity=".5"/><path d="M92 316h136" stroke="${art.secondary}" stroke-width="8" stroke-linecap="round" opacity=".65"/><path d="M160 26 176 66 220 70 186 98 196 140 160 118 124 140 134 98 100 70 144 66Z" fill="none" stroke="#ede9fe" stroke-width="4" opacity=".2"/><text x="160" y="348" text-anchor="middle" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="900" letter-spacing="3" fill="#ede9fe" opacity=".9">${name.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const dofusClasses: DofusClass[] = [
  "Cra",
  "Ecaflip",
  "Eliotrope",
  "Eniripsa",
  "Enutrof",
  "Feca",
  "Forgelance",
  "Huppermage",
  "Iop",
  "Osamodas",
  "Ouginak",
  "Pandawa",
  "Roublard",
  "Sacrieur",
  "Sadida",
  "Sram",
  "Steamer",
  "Xelor",
  "Zobal",
].map((name) => {
  const art = classArt[name];

  return {
    name,
    accent: art.accent,
    image: classImage(name, art),
  };
});

export const dofusElements: DofusElement[] = [
  { label: "Terre", icon: "◆", accent: "#a3e635" },
  { label: "Feu", icon: "✦", accent: "#fb7185" },
  { label: "Air", icon: "◇", accent: "#67e8f9" },
  { label: "Eau", icon: "●", accent: "#60a5fa" },
  { label: "Sagesse", icon: "✧", accent: "#facc15" },
  { label: "Multi", icon: "✹", accent: "#c4b5fd" },
];

export function getClassImage(className: string) {
  return (
    dofusClasses.find((dofusClass) => dofusClass.name === className)?.image ??
    dofusClasses[0].image
  );
}

export function getElement(label: string) {
  return dofusElements.find((element) => element.label === label);
}
