export type BreedingMount = {
  id: string;
  name: string;
  type: string;
  generation: number;
  imageUrl: string;
};

export type BreedingSpecialMount = {
  id: string;
  name: string;
  badge: "Spécial";
  imageUrl: string;
};

export type BreedingGeneration = {
  generation: number;
  title: string;
  mounts: BreedingMount[];
};

export type BreedingSpecies = {
  slug: "muldos" | "dragodindes" | "volkornes";
  familyId: number;
  title: string;
  subtitle: string;
  description: string;
  generations: BreedingGeneration[];
  specialMounts?: BreedingSpecialMount[];
};

type DofusDbMount = {
  id?: number;
  familyId?: number;
  certificateId?: number;
  name?: {
    fr?: string;
  };
};

type DofusDbItem = {
  id?: number;
  img?: string;
  name?: {
    fr?: string;
  };
};

type SpeciesConfig = {
  slug: BreedingSpecies["slug"];
  familyId: number;
  certificateTypeId: number;
  title: string;
  subtitle: string;
  description: string;
  mountType: string;
  generationTitles: string[];
  specialNames?: string[];
};

const DOFUSDB_API = "https://api.dofusdb.fr";
const FALLBACK_IMAGE_URL = "/file.svg";

const speciesConfigs: SpeciesConfig[] = [
  {
    slug: "muldos",
    familyId: 5,
    certificateTypeId: 196,
    title: "Muldos",
    subtitle: "Lignées aquatiques",
    description: "Généalogie des Muldos",
    mountType: "Muldo",
    generationTitles: [
      "Origines sauvages",
      "Couleurs primaires",
      "Croisements pourpres",
      "Croisements orchidée",
      "Croisements indigo",
      "Croisements roux",
      "Croisements amande",
      "Croisements ivoire",
      "Croisements turquoise",
      "Croisements prune et émeraude",
    ],
  },
  {
    slug: "dragodindes",
    familyId: 1,
    certificateTypeId: 97,
    title: "Dragodindes",
    subtitle: "Lignées classiques",
    description: "Généalogie des Dragodindes",
    mountType: "Dragodinde",
    specialNames: ["Dragodinde à Plumes", "Dragodinde en armure"],
    generationTitles: [
      "Fondatrices sauvages",
      "Couleurs primaires",
      "Premiers croisements amande",
      "Croisements dorés",
      "Croisements ébène",
      "Croisements émeraude",
      "Croisements indigo",
      "Croisements ivoire et turquoise",
      "Croisements orchidée et pourpre",
      "Croisements prune",
    ],
  },
  {
    slug: "volkornes",
    familyId: 6,
    certificateTypeId: 207,
    title: "Volkornes",
    subtitle: "Lignées sauvages",
    description: "Généalogie des Volkornes",
    mountType: "Volkorne",
    generationTitles: [
      "Origines sauvages",
      "Couleurs primaires",
      "Croisements pourpre et orchidée",
      "Croisements amande",
      "Croisements roux",
      "Croisements ivoire et turquoise",
      "Croisements prune et émeraude",
      "Croisements dorés",
      "Croisements jade",
      "Croisements rubis, saphir et améthyste",
    ],
  },
];

export async function getBreedingSpecies(slug: string) {
  const config = speciesConfigs.find((species) => species.slug === slug);

  if (!config) {
    return undefined;
  }

  const [mounts, certificateItems] = await Promise.all([
    fetchAllMounts(),
    fetchCertificateItems(config.certificateTypeId),
  ]);
  const itemsById = new Map(
    certificateItems
      .filter((item) => typeof item.id === "number")
      .map((item) => [item.id as number, item]),
  );
  const speciesMounts = mounts
    .filter((mount) => mount.familyId === config.familyId)
    .filter((mount) => !config.specialNames?.some((name) => sameName(name, mount.name?.fr)))
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  const generations = createGenerations(config, speciesMounts, itemsById);
  const specialMounts = createSpecialMounts(config, mounts, itemsById);

  return {
    slug: config.slug,
    familyId: config.familyId,
    title: config.title,
    subtitle: config.subtitle,
    description: config.description,
    generations,
    specialMounts,
  } satisfies BreedingSpecies;
}

export function getBreedingSpeciesSlugs() {
  return speciesConfigs.map((species) => ({ slug: species.slug }));
}

function createGenerations(
  config: SpeciesConfig,
  mounts: DofusDbMount[],
  itemsById: Map<number, DofusDbItem>,
): BreedingGeneration[] {
  const grouped = new Map<number, DofusDbMount[]>();

  for (const mount of mounts) {
    const generation = resolveGeneration(config.slug, mount.name?.fr, mount.id);
    grouped.set(generation, [...(grouped.get(generation) ?? []), mount]);
  }

  fillEmptyGenerations(grouped);

  return Array.from({ length: 10 }, (_, index) => {
    const generation = index + 1;
    const generationMounts = grouped.get(generation) ?? [];

    return {
      generation,
      title: config.generationTitles[index],
      mounts: generationMounts.map((mount) =>
        toBreedingMount(config, mount, generation, itemsById),
      ),
    };
  });
}

function fillEmptyGenerations(grouped: Map<number, DofusDbMount[]>) {
  for (let generation = 1; generation <= 10; generation += 1) {
    if ((grouped.get(generation) ?? []).length) {
      continue;
    }

    const donorGeneration = Array.from(grouped.entries())
      .filter(([, mounts]) => mounts.length > 1)
      .sort(([, left], [, right]) => right.length - left.length)[0];
    const donorMount = donorGeneration?.[1].pop();

    if (donorMount) {
      grouped.set(generation, [donorMount]);
    }
  }
}

function createSpecialMounts(
  config: SpeciesConfig,
  mounts: DofusDbMount[],
  itemsById: Map<number, DofusDbItem>,
): BreedingSpecialMount[] | undefined {
  if (!config.specialNames?.length) {
    return undefined;
  }

  return config.specialNames.map((name) => {
    const mount = mounts.find((candidate) => sameName(name, candidate.name?.fr));
    const item = mount?.certificateId ? itemsById.get(mount.certificateId) : undefined;

    return {
      id: String(mount?.id ?? normalizeName(name)),
      name: mount?.name?.fr ?? name,
      badge: "Spécial",
      imageUrl: safeImageUrl(item?.img),
    };
  });
}

function toBreedingMount(
  config: SpeciesConfig,
  mount: DofusDbMount,
  generation: number,
  itemsById: Map<number, DofusDbItem>,
): BreedingMount {
  const item = mount.certificateId ? itemsById.get(mount.certificateId) : undefined;
  const name = mount.name?.fr ?? item?.name?.fr ?? `${config.mountType} génération ${generation}`;

  return {
    id: String(mount.id ?? `${config.slug}-${generation}-${normalizeName(name)}`),
    name,
    type: config.mountType,
    generation,
    imageUrl: safeImageUrl(item?.img),
  };
}

function resolveGeneration(
  slug: BreedingSpecies["slug"],
  name: string | undefined,
  id: number | undefined,
) {
  if (slug === "dragodindes") {
    return resolveDragodindeGeneration(name);
  }

  if (slug === "muldos") {
    return resolveMuldoGeneration(name, id);
  }

  return resolveVolkorneGeneration(name, id);
}

function resolveDragodindeGeneration(name: string | undefined) {
  const normalized = normalizeName(name);

  if (normalized.includes("sauvage")) {
    return 1;
  }

  if (hasAny(normalized, ["rousse", "amande", "doree"]) && !normalized.includes(" et ")) {
    return 2;
  }

  if (normalized.includes("amande et")) {
    return 3;
  }

  if (normalized.includes("doree et")) {
    return 4;
  }

  if (normalized.includes("ebene et")) {
    return 5;
  }

  if (normalized.includes("emeraude et")) {
    return 6;
  }

  if (normalized.includes("indigo et")) {
    return 7;
  }

  if (hasAny(normalized, ["ivoire et", "turquoise et"])) {
    return 8;
  }

  if (hasAny(normalized, ["orchidee et", "pourpre et"])) {
    return 9;
  }

  if (normalized.includes("prune")) {
    return 10;
  }

  return 2;
}

function resolveMuldoGeneration(name: string | undefined, id: number | undefined) {
  const normalized = normalizeName(name);

  if (normalized.includes("sauvage")) {
    return 1;
  }

  if (!normalized.includes(" et ")) {
    return 2;
  }

  if (normalized.includes("pourpre")) {
    return 3;
  }

  if (normalized.includes("orchidee")) {
    return 4;
  }

  if (normalized.includes("indigo") || normalized.includes("ebene")) {
    return 5;
  }

  if (normalized.includes("roux")) {
    return 6;
  }

  if (normalized.includes("amande")) {
    return 7;
  }

  if (normalized.includes("ivoire")) {
    return 8;
  }

  if (normalized.includes("turquoise")) {
    return 9;
  }

  if (normalized.includes("prune") || normalized.includes("emeraude")) {
    return 10;
  }

  return id && id >= 155 ? 10 : 5;
}

function resolveVolkorneGeneration(name: string | undefined, id: number | undefined) {
  const normalized = normalizeName(name);

  if (normalized.includes("sauvage")) {
    return 1;
  }

  if (!normalized.includes(" et ")) {
    return 2;
  }

  if (hasAny(normalized, ["pourpre et", "orchidee et", "indigo et", "ebene et"])) {
    return 3;
  }

  if (normalized.includes("amande")) {
    return 4;
  }

  if (normalized.includes("roux")) {
    return 5;
  }

  if (hasAny(normalized, ["ivoire", "turquoise"])) {
    return 6;
  }

  if (hasAny(normalized, ["prune", "emeraude"])) {
    return 7;
  }

  if (normalized.includes("dore")) {
    return 8;
  }

  if (normalized.includes("jade")) {
    return 9;
  }

  if (hasAny(normalized, ["rubis", "saphir", "amethyste"])) {
    return 10;
  }

  return id && id > 250 ? 10 : 6;
}

async function fetchAllMounts() {
  const pageSize = 50;
  const mounts: DofusDbMount[] = [];

  try {
    for (let skip = 0; skip < 350; skip += pageSize) {
      const response = await fetch(
        `${DOFUSDB_API}/mounts?$limit=${pageSize}&$skip=${skip}`,
        { next: { revalidate: 60 * 60 * 24 } },
      );

      if (!response.ok) {
        return mounts;
      }

      const payload = (await response.json()) as {
        data?: DofusDbMount[];
      };
      const page = payload.data ?? [];
      mounts.push(...page);

      if (page.length < pageSize) {
        break;
      }
    }
  } catch {
    return mounts;
  }

  return mounts;
}

async function fetchCertificateItems(typeId: number) {
  const pageSize = 50;
  const items: DofusDbItem[] = [];

  try {
    for (let skip = 0; skip < 200; skip += pageSize) {
      const response = await fetch(
        `${DOFUSDB_API}/items?typeId=${typeId}&$limit=${pageSize}&$skip=${skip}`,
        { next: { revalidate: 60 * 60 * 24 } },
      );

      if (!response.ok) {
        return items;
      }

      const payload = (await response.json()) as {
        data?: DofusDbItem[];
      };
      const page = payload.data ?? [];
      items.push(...page);

      if (page.length < pageSize) {
        break;
      }
    }
  } catch {
    return items;
  }

  return items;
}

function hasAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function sameName(left: string | undefined, right: string | undefined) {
  return normalizeName(left) === normalizeName(right);
}

function normalizeName(name: string | undefined) {
  return (name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeImageUrl(imageUrl: string | undefined) {
  return imageUrl?.startsWith("https://") ? imageUrl : FALLBACK_IMAGE_URL;
}
