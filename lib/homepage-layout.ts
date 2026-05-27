export type HomepageLayoutBlockKey =
  | "events"
  | "online"
  | "announcements"
  | "activity"
  | "almanax"
  | "gallery";

export type HomepageLayoutItem = {
  key: HomepageLayoutBlockKey;
  label: string;
  columns: number;
  rows: number;
  order: number;
};

export const homepageLayoutDefaults: HomepageLayoutItem[] = [
  { key: "announcements", label: "Dernières annonces", columns: 4, rows: 6, order: 0 },
  { key: "online", label: "Membres en ligne", columns: 2, rows: 6, order: 1 },
  { key: "events", label: "Prochains events", columns: 4, rows: 5, order: 2 },
  { key: "activity", label: "Activité récente", columns: 2, rows: 6, order: 3 },
  { key: "almanax", label: "Almanax", columns: 2, rows: 6, order: 4 },
  { key: "gallery", label: "Galerie", columns: 4, rows: 6, order: 5 },
];

const blockKeys = new Set(homepageLayoutDefaults.map((item) => item.key));

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(numberValue)));
}

export function normalizeHomepageLayout(value: unknown): HomepageLayoutItem[] {
  const source = Array.isArray(value) ? value : [];
  const byKey = new Map<string, Partial<HomepageLayoutItem>>();

  source.forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }

    const candidate = item as Partial<HomepageLayoutItem>;

    if (candidate.key && blockKeys.has(candidate.key)) {
      byKey.set(candidate.key, candidate);
    }
  });

  return homepageLayoutDefaults
    .map((fallback) => {
      const stored = byKey.get(fallback.key);

      return {
        ...fallback,
        columns: clamp(stored?.columns, 1, 6, fallback.columns),
        rows: clamp(stored?.rows, 3, 12, fallback.rows),
        order: clamp(stored?.order, 0, 99, fallback.order),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function serializeHomepageLayout(layout: HomepageLayoutItem[]) {
  return normalizeHomepageLayout(layout).map((item, index) => ({
    ...item,
    order: index,
  }));
}
