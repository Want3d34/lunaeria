export type BreedingSpeciesSlug = "dragodindes" | "muldos" | "volkornes";

export type BreedingCrossing = {
  parents: readonly [string, string];
  result: string;
  generation: number;
};

export type LocalBreedingMount = {
  id: string;
  name: string;
  lineage: string;
  species: BreedingSpeciesSlug;
  mountType: string;
  generation: number;
  parents: readonly [string, string];
  crossings: readonly BreedingCrossing[];
  result: string;
  baseColors: readonly string[];
  dofusDbImage?: string;
};

export type BreedingSpeciesDefinition = {
  slug: BreedingSpeciesSlug;
  familyId: number;
  certificateTypeId: number;
  title: string;
  subtitle: string;
  description: string;
  mountType: string;
  generationCount: number;
  generationTitles: readonly string[];
  specialNames?: readonly string[];
  mounts: readonly LocalBreedingMount[];
};

type BreedingColor = {
  name: string;
  generation: number;
  image?: string;
};

type BreedingSpeciesConfig = Omit<BreedingSpeciesDefinition, "mounts"> & {
  colors: readonly BreedingColor[];
};

const speciesConfigs: readonly BreedingSpeciesConfig[] = [
  {
    slug: "dragodindes",
    familyId: 1,
    certificateTypeId: 97,
    title: "Dragodindes",
    subtitle: "Lignees classiques",
    description: "Genealogie des Dragodindes basee sur la matrice DofusDB.",
    mountType: "Dragodinde",
    generationCount: 10,
    specialNames: ["Dragodinde à Plumes", "Dragodinde en armure"],
    generationTitles: [
      "Couleurs fondatrices",
      "Croisements des fondatrices",
      "Couleurs indigo et ebene",
      "Croisements indigo et ebene",
      "Couleurs pourpre et orchidee",
      "Croisements pourpre et orchidee",
      "Couleurs ivoire et turquoise",
      "Croisements ivoire et turquoise",
      "Couleurs emeraude et prune",
      "Croisements emeraude et prune",
    ],
    colors: [
      { name: "Dorée", generation: 1, image: "18.png" },
      { name: "Amande", generation: 1, image: "20.png" },
      { name: "Rousse", generation: 1, image: "10.png" },
      { name: "Indigo", generation: 3, image: "17.png" },
      { name: "Ebène", generation: 3, image: "3.png" },
      { name: "Pourpre", generation: 5, image: "19.png" },
      { name: "Orchidée", generation: 5, image: "22.png" },
      { name: "Ivoire", generation: 7, image: "1.png" },
      { name: "Turquoise", generation: 7, image: "15.png" },
      { name: "Emeraude", generation: 9, image: "21.png" },
      { name: "Prune", generation: 9, image: "23.png" },
    ],
  },
  {
    slug: "muldos",
    familyId: 5,
    certificateTypeId: 196,
    title: "Muldos",
    subtitle: "Lignees aquatiques",
    description: "Genealogie des Muldos basee sur la matrice DofusDB.",
    mountType: "Muldo",
    generationCount: 8,
    generationTitles: [
      "Couleurs fondatrices",
      "Croisements des fondatrices",
      "Couleurs roux et amande",
      "Croisements roux et amande",
      "Couleurs ivoire et turquoise",
      "Croisements ivoire et turquoise",
      "Couleurs prune et emeraude",
      "Croisements prune et emeraude",
    ],
    colors: [
      { name: "Orchidée", generation: 1, image: "90.png" },
      { name: "Ebène", generation: 1, image: "91.png" },
      { name: "Indigo", generation: 1, image: "92.png" },
      { name: "Pourpre", generation: 1, image: "93.png" },
      { name: "Doré", generation: 1, image: "94.png" },
      { name: "Roux", generation: 3, image: "95.png" },
      { name: "Amande", generation: 3, image: "96.png" },
      { name: "Ivoire", generation: 5, image: "97.png" },
      { name: "Turquoise", generation: 5, image: "98.png" },
      { name: "Prune", generation: 7, image: "99.png" },
      { name: "Emeraude", generation: 7, image: "100.png" },
    ],
  },
  {
    slug: "volkornes",
    familyId: 6,
    certificateTypeId: 207,
    title: "Volkornes",
    subtitle: "Lignees sauvages",
    description: "Genealogie des Volkornes basee sur la matrice DofusDB.",
    mountType: "Volkorne",
    generationCount: 10,
    generationTitles: [
      "Couleurs fondatrices",
      "Croisements des fondatrices",
      "Couleurs roux, amande, ivoire et turquoise",
      "Croisements roux, amande, ivoire et turquoise",
      "Couleurs prune et emeraude",
      "Croisements prune et emeraude",
      "Couleur doree",
      "Croisements dores",
      "Couleurs jade, rubis, saphir et amethyste",
      "Croisements jade, rubis, saphir et amethyste",
    ],
    colors: [
      { name: "Pourpre", generation: 1, image: "172.png" },
      { name: "Orchidée", generation: 1, image: "173.png" },
      { name: "Indigo", generation: 1, image: "174.png" },
      { name: "Ebène", generation: 1, image: "175.png" },
      { name: "Roux", generation: 3, image: "180.png" },
      { name: "Amande", generation: 3, image: "181.png" },
      { name: "Ivoire", generation: 3, image: "182.png" },
      { name: "Turquoise", generation: 3, image: "183.png" },
      { name: "Prune", generation: 5, image: "184.png" },
      { name: "Emeraude", generation: 5, image: "185.png" },
      { name: "Dorée", generation: 7, image: "186.png" },
      { name: "Jade", generation: 9, image: "187.png" },
      { name: "Rubis", generation: 9, image: "188.png" },
      { name: "Saphir", generation: 9, image: "189.png" },
      { name: "Améthyste", generation: 9, image: "190.png" },
    ],
  },
];

export const breedingSpeciesDefinitions: readonly BreedingSpeciesDefinition[] =
  speciesConfigs.map((config) => ({
    ...config,
    mounts: createMounts(config),
  }));

export const breedingCombinations: readonly BreedingCrossing[] =
  breedingSpeciesDefinitions.flatMap((species) =>
    species.mounts.map((mount) => mount.crossings).flat(),
  );

export function getBreedingDefinition(slug: string) {
  return breedingSpeciesDefinitions.find((species) => species.slug === slug);
}

export function getBreedingSpeciesSlugs() {
  return breedingSpeciesDefinitions.map((species) => ({ slug: species.slug }));
}

export function getMountsByGeneration(
  species: BreedingSpeciesSlug,
  generation: number,
) {
  return getBreedingDefinition(species)?.mounts.filter(
    (mount) => mount.generation === generation,
  ) ?? [];
}

export function getMountByLineage(species: BreedingSpeciesSlug, lineage: string) {
  const lineageKey = normalizeBreedingName(lineage);

  return getBreedingDefinition(species)?.mounts.find(
    (mount) => normalizeBreedingName(mount.lineage) === lineageKey,
  );
}

export function findMountByColors(
  species: BreedingSpeciesSlug,
  parentA: string,
  parentB: string,
) {
  const parentKey = createParentKey(parentA, parentB);

  return getBreedingDefinition(species)?.mounts.find(
    (mount) => createParentKey(mount.parents[0], mount.parents[1]) === parentKey,
  );
}

export function normalizeBreedingName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function createMounts(config: BreedingSpeciesConfig) {
  return config.colors.flatMap((leftColor, leftIndex) =>
    config.colors.slice(leftIndex).map((rightColor) => {
      const sameColor = leftColor.name === rightColor.name;
      const lineage = sameColor
        ? leftColor.name
        : `${leftColor.name} et ${rightColor.name}`;
      const generation = sameColor
        ? leftColor.generation
        : nextCrossGeneration(Math.max(leftColor.generation, rightColor.generation));
      const parents = [leftColor.name, rightColor.name] as const;
      const result = `${config.mountType} ${lineage}`;

      return {
        id: `${config.slug}-${createSlug(lineage)}`,
        name: result,
        lineage,
        species: config.slug,
        mountType: config.mountType,
        generation,
        parents,
        crossings: [{ parents, result: lineage, generation }],
        result,
        baseColors: sameColor ? [leftColor.name] : [leftColor.name, rightColor.name],
        dofusDbImage: sameColor ? leftColor.image : undefined,
      } satisfies LocalBreedingMount;
    }),
  );
}

function nextCrossGeneration(baseGeneration: number) {
  return Math.min(10, baseGeneration + 1);
}

function createParentKey(parentA: string, parentB: string) {
  return [normalizeBreedingName(parentA), normalizeBreedingName(parentB)]
    .sort()
    .join("|");
}

function createSlug(value: string) {
  return normalizeBreedingName(value).replace(/\s+/g, "-");
}
