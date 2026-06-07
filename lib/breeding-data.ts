import {
  breedingSpeciesDefinitions,
  getBreedingDefinition,
  getBreedingSpeciesSlugs as getLocalBreedingSpeciesSlugs,
  normalizeBreedingName,
  type BreedingSpeciesSlug,
  type LocalBreedingMount,
} from "@/lib/breeding-database";

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
  slug: BreedingSpeciesSlug;
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

const DOFUSDB_API = "https://api.dofusdb.fr";
const FALLBACK_IMAGE_URL = "/file.svg";

export async function getBreedingSpecies(slug: string) {
  const definition = getBreedingDefinition(slug);

  if (!definition) {
    return undefined;
  }

  const [mounts, certificateItems] = await Promise.all([
    fetchAllMounts(),
    fetchCertificateItems(definition.certificateTypeId),
  ]);
  const itemsById = createItemsById(certificateItems);
  const itemsByLineageKey = createItemsByLineageKey(
    certificateItems,
    definition.mountType,
  );

  return {
    slug: definition.slug,
    familyId: definition.familyId,
    title: definition.title,
    subtitle: definition.subtitle,
    description: definition.description,
    generations: Array.from(
      { length: definition.generationCount },
      (_, index) => index + 1,
    ).map((generation) => ({
      generation,
      title: definition.generationTitles[generation - 1],
      mounts: definition.mounts
        .filter((mount) => mount.generation === generation)
        .map((mount) => toBreedingMount(mount, itemsByLineageKey)),
    })),
    specialMounts: createSpecialMounts(definition.slug, mounts, itemsById),
  } satisfies BreedingSpecies;
}

export function getBreedingSpeciesSlugs() {
  return getLocalBreedingSpeciesSlugs();
}

function createSpecialMounts(
  slug: BreedingSpeciesSlug,
  mounts: DofusDbMount[],
  itemsById: Map<number, DofusDbItem>,
) {
  const definition = breedingSpeciesDefinitions.find((species) => species.slug === slug);

  if (!definition?.specialNames?.length) {
    return undefined;
  }

  return definition.specialNames.map((name) => {
    const mount = mounts.find((candidate) =>
      sameName(name, candidate.name?.fr),
    );
    const item = mount?.certificateId ? itemsById.get(mount.certificateId) : undefined;

    return {
      id: String(mount?.id ?? normalizeBreedingName(name)),
      name: mount?.name?.fr ?? name,
      badge: "Spécial",
      imageUrl: safeImageUrl(item?.img),
    } satisfies BreedingSpecialMount;
  });
}

function toBreedingMount(
  mount: LocalBreedingMount,
  itemsByLineageKey: Map<string, DofusDbItem>,
): BreedingMount {
  const item = itemsByLineageKey.get(createLineageKey(mount.lineage));

  if (!item?.img) {
    console.warn(`[breeding-data] Missing mount image for ${mount.name}`);
  }

  return {
    id: mount.id,
    name: mount.name,
    type: mount.mountType,
    generation: mount.generation,
    imageUrl: safeImageUrl(item?.img),
  };
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
    for (let skip = 0; skip < 250; skip += pageSize) {
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

function sameName(left: string | undefined, right: string | undefined) {
  return normalizeBreedingName(left ?? "") === normalizeBreedingName(right ?? "");
}

function createItemsById(items: DofusDbItem[]) {
  return new Map(
    items
      .filter((item) => typeof item.id === "number")
      .map((item) => [item.id as number, item]),
  );
}

function createItemsByLineageKey(items: DofusDbItem[], mountType: string) {
  const itemsByLineageKey = new Map<string, DofusDbItem>();

  for (const item of items) {
    if (!item.name?.fr) {
      continue;
    }

    const lineage = item.name.fr
      .replace(new RegExp(`^${mountType}\\s+`, "i"), "")
      .replace(/\s+sauvage$/i, "")
      .trim();
    const key = createLineageKey(lineage);

    if (!itemsByLineageKey.has(key)) {
      itemsByLineageKey.set(key, item);
    }
  }

  return itemsByLineageKey;
}

function createLineageKey(lineage: string) {
  const colors = lineage.split(/\s+et\s+/i);
  const parents = colors.length === 1 ? [colors[0], colors[0]] : colors;

  return parents.map(normalizeImageColorName).sort().join("|");
}

function normalizeImageColorName(color: string) {
  const normalized = normalizeBreedingName(color);

  return normalized === "doree" ? "dore" : normalized;
}

function safeImageUrl(imageUrl: string | undefined) {
  return imageUrl?.startsWith("https://") ? imageUrl : FALLBACK_IMAGE_URL;
}
