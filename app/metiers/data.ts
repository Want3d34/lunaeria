export type LocalizedName = {
  fr: string;
  en?: string;
};

export type Profession = {
  slug: string;
  jobId: number;
  iconId: number;
  name: LocalizedName;
  role: string;
  description: string;
  focus: string;
  imageUrl: string;
  source: "dofusdb";
};

export type Ingredient = {
  id: number;
  name: LocalizedName;
  imageUrl: string;
  type: LocalizedName;
  quantity: number;
};

export type Recipe = {
  id: number;
  recipeId: number;
  jobId: number;
  professionName: LocalizedName;
  resultId: number;
  resultLevel: number;
  resultName: LocalizedName;
  resultImageUrl: string;
  resultType: LocalizedName;
  ingredients: Ingredient[];
  craftCount: number;
  optionLabel?: string;
  source: "dofusdb";
};

export type CraftTier = {
  id: string;
  label: string;
  minLevel: number;
  maxLevel: number;
  title: string;
  intent: string;
  recommendedCrafts: number;
  recipeIds: number[];
};

export type ProfessionPageData = Profession & {
  tiers: CraftTier[];
  recipes: Recipe[];
};

type GrindEntry = {
  bracket: string;
  recipeName: string;
  craftCount: number;
  alternatives?: {
    optionLabel: string;
    recipeName: string;
    craftCount: number;
  }[];
};

type DofusDbRecipe = {
  id?: number;
  resultId?: number;
  resultLevel?: number;
  resultName?: LocalizedName;
  result?: {
    img?: string;
  };
  resultType?: {
    name?: LocalizedName;
  };
  ingredients?: {
    id?: number;
    name?: LocalizedName;
    img?: string;
    type?: {
      name?: LocalizedName;
    };
  }[];
  quantities?: number[];
};

const FALLBACK_IMAGE_URL = "/file.svg";

const progressionTitles = [
  "Initiation",
  "Premiers lots",
  "Cadence",
  "Production stable",
  "Rendement",
  "Spécialisation",
  "Stocks de guilde",
  "Routes avancées",
  "Optimisation",
  "Maîtrise",
];

export const professions: Profession[] = [
  {
    slug: "alchimiste",
    jobId: 26,
    iconId: 14,
    name: { fr: "Alchimiste", en: "Alchemist" },
    role: "Potions & essences",
    description:
      "Progression Alchimiste optimisée avec recettes et ingrédients isolés pour ce métier.",
    focus: "Potions, plantes, fioles",
    imageUrl: "https://api.dofusdb.fr/img/jobs/14.jpg",
    source: "dofusdb",
  },
  {
    slug: "paysan",
    jobId: 28,
    iconId: 18,
    name: { fr: "Paysan", en: "Farmer" },
    role: "Récolte & pains",
    description:
      "Progression Paysan optimisée avec recettes et ingrédients isolés pour ce métier.",
    focus: "Céréales, huiles, pains",
    imageUrl: "https://api.dofusdb.fr/img/jobs/18.jpg",
    source: "dofusdb",
  },
  {
    slug: "chasseur",
    jobId: 41,
    iconId: 32,
    name: { fr: "Chasseur", en: "Hunter" },
    role: "Viandes & préparations",
    description:
      "Progression Chasseur optimisée avec recettes et ingrédients isolés pour ce métier.",
    focus: "Viandes, préparations, butins",
    imageUrl: "https://api.dofusdb.fr/img/jobs/32.jpg",
    source: "dofusdb",
  },
  {
    slug: "mineur",
    jobId: 24,
    iconId: 13,
    name: { fr: "Mineur", en: "Miner" },
    role: "Minerais & alliages",
    description:
      "Progression Mineur optimisée avec recettes et ingrédients isolés pour ce métier.",
    focus: "Minerais, pierres, alliages",
    imageUrl: "https://api.dofusdb.fr/img/jobs/13.jpg",
    source: "dofusdb",
  },
  {
    slug: "pecheur",
    jobId: 36,
    iconId: 30,
    name: { fr: "Pêcheur", en: "Fisherman" },
    role: "Poissons & consommables",
    description:
      "Progression Pêcheur optimisée avec recettes et ingrédients isolés pour ce métier.",
    focus: "Poissons, huiles, plats",
    imageUrl: "https://api.dofusdb.fr/img/jobs/30.jpg",
    source: "dofusdb",
  },
  {
    slug: "bucheron",
    jobId: 2,
    iconId: 2,
    name: { fr: "Bûcheron", en: "Lumberjack" },
    role: "Bois & substrats",
    description:
      "Progression Bûcheron avec alternatives de craft à partir du niveau 20.",
    focus: "Planches, bois, substrats",
    imageUrl: "https://api.dofusdb.fr/img/jobs/2.jpg",
    source: "dofusdb",
  },
];

const grindPaths: Record<string, GrindEntry[]> = {
  alchimiste: [
    grind("0-10", "Potion de mini soin", 158),
    grind("10-20", "Potion Raide Mhor", 306),
    grind("20-30", "Potion de Mini Soin Supérieure", 404),
    grind("30-40", "Potion Raide Dite", 367),
    grind("40-50", "Potion de Soin", 355),
    grind("50-60", "Potion Ghetto Raide", 342),
    grind("60-70", "Potion de Soin supérieure", 338),
    grind("70-80", "Potion Pahoa Raide", 334),
    grind("80-90", "Potion Eau de fée", 331),
    grind("90-100", "Potion Raide Boule", 328),
    grind("100-110", "Sang de Likrone", 325),
    grind("110-120", "Potion Jeud Raide", 324),
    grind("120-130", "Sang de Trooll", 323),
    grind("130-140", "Potion Raide Emption", 321),
    grind("140-150", "Potion Bulbique", 320),
    grind("150-160", "Potion Raide Izdaide", 320),
    grind("160-170", "Larme d'Eniripsa", 319),
    grind("170-180", "Potion Axel Raide", 318),
    grind("180-190", "Potion Revitalisante", 318),
    grind("190-200", "Potion Raide Rêve", 317),
  ],
  paysan: [
    grind("0-10", "Pain d'Incarnam", 158),
    grind("10-20", "Michette", 306),
    grind("20-30", "Carasau", 404),
    grind("30-40", "Fougasse", 367),
    grind("40-50", "Pain aux Flocons d'Avoine", 355),
    grind("50-60", "Pain de Mie", 342),
    grind("60-70", "Briochette", 338),
    grind("70-80", "Pain Consistant", 334),
    grind("80-90", "Pain D'Epices", 328),
    grind("90-100", "Biscotte", 331),
    grind("100-110", "Pain de seigle", 325),
    grind("110-120", "Pain des villes", 324),
    grind("120-130", "Pain aux céréales", 323),
    grind("130-140", "Borodinski", 321),
    grind("140-150", "Pain Gre", 320),
    grind("150-160", "Mantou", 320),
    grind("160-170", "Tortilla", 319),
    grind("170-180", "Pain des Champs", 318),
    grind("180-190", "Pain Tahde", 318),
    grind("190-200", "Brioche Dorée", 317),
  ],
  chasseur: [
    grind("0-10", "Bouillon de Chair", 77),
    grind("10-20", "Boulette de Viande", 159),
    grind("20-30", "Beignet Astrubien", 197),
    grind("30-40", "Roulade de Carne", 183),
    grind("40-50", "Papillote au Citron", 175),
    grind("50-60", "Salade Sufokienne", 171),
    grind("60-70", "Friture Amaknéenne", 168),
    grind("70-80", "Parmentier à l'Oignon", 166),
    grind("80-90", "Terrine Bontarienne", 164),
    grind("90-100", "Pot-au-feu Goûteux", 163),
    grind("100-110", "Poêlée Paysanne", 162),
    grind("110-120", "Pemmican aux Haricots", 162),
    grind("120-130", "Grillade Brâkmarienne", 161),
    grind("130-140", "Marinade Sucrée-Salée", 160),
    grind("140-150", "Boudin Noir", 160),
    grind("150-160", "Daube aux Épices", 159),
    grind("160-170", "Mijoté Récréatif", 159),
    grind("170-180", "Filet Mignon", 159),
    grind("180-190", "Quenelle Tijan", 158),
    grind("190-200", "Andouillette de Gibier", 158),
  ],
  mineur: [
    grind("0-10", "Ferrite", 77),
    grind("10-20", "Eau Ferrugineuse", 59),
    grind("20-40", "Aluminite", 236),
    grind("40-60", "Ébonite", 191),
    grind("60-80", "Magnésite", 177),
    grind("80-100", "Bakélélite", 169),
    grind("100-120", "Kouartz", 165),
    grind("120-140", "Kriptonite", 162),
    grind("140-160", "Kobalite", 160),
    grind("160-180", "Rutile", 159),
    grind("180-200", "Pyrute", 157),
  ],
  pecheur: [
    grind("0-10", "Goujon en Tranche", 158),
    grind("10-20", "Beignet de Greuvette", 306),
    grind("20-30", "Truite Flambée", 404),
    grind("30-40", "Bâton de Crabe", 367),
    grind("40-50", "Poisson-Chaton Fumé", 355),
    grind("50-60", "Poisson Pané Frit", 342),
    grind("60-70", "Carpe Vapeur", 338),
    grind("70-80", "Sardine à l'Étouffée", 334),
    grind("80-90", "Brochet Farci", 331),
    grind("90-100", "Kralamoure Grillé", 328),
    grind("100-110", "Anguille Rôtie", 325),
    grind("110-120", "Dorade au four", 324),
    grind("120-130", "Perche Sautée", 323),
    grind("130-140", "Aile de Raie", 321),
    grind("140-150", "Salace de Lotte", 320),
    grind("150-160", "Aileron de Requin", 320),
    grind("160-170", "Bar Grillé", 319),
    grind("170-180", "Estouffade de Morue", 318),
    grind("180-190", "Tanche en Matelote", 318),
    grind("190-200", "Espadon Poêlé", 317),
  ],
  bucheron: [
    grind("0-20", "Planche agglomérée", 523),
    alternatives("20-40", [
      option("Option 1", "Planche contreplaquée", 178),
      option("Option 2", "Substrat de Buisson", 178),
    ]),
    alternatives("40-60", [
      option("Option 1", "Planche à griller", 144),
      option("Option 2", "Substrat de Bocage", 144),
    ]),
    alternatives("60-80", [
      option("Option 1", "Planche de surf", 133),
      option("Option 2", "Substrat de Futaie", 133),
    ]),
    alternatives("80-100", [
      option("Option 1", "Planche à repasser", 127),
      option("Option 2", "Substrat de Fascine", 127),
    ]),
    alternatives("100-120", [
      option("Option 1", "Planche de toilette", 124),
      option("Option 2", "Substrat de Bosquet", 124),
    ]),
    alternatives("120-140", [
      option("Option 1", "Planche à pâtisserie", 122),
      option("Option 2", "Substrat de Fourré", 122),
    ]),
    alternatives("140-160", [
      option("Option 1", "Planche de gravure", 120),
      option("Option 2", "Substrat de forêt", 120),
    ]),
    alternatives("160-180", [
      option("Option 1", "Planche à pain", 119),
      option("Option 2", "Substrat de forêt primaire", 119),
    ]),
    alternatives("180-200", [
      option("Option 1", "Planche à dessin", 118),
      option("Option 2", "Substrat de forêt vierge", 118),
    ]),
  ],
};

export function getProfession(slug: string) {
  return professions.find((profession) => profession.slug === slug);
}

export async function getProfessionPageData(
  slug: string,
): Promise<ProfessionPageData | undefined> {
  const profession = getProfession(slug);

  if (!profession) {
    return undefined;
  }

  const path = grindPaths[slug] ?? [];
  const dofusDbRecipes = await fetchDofusDbRecipes(profession.jobId);
  const recipeGroups = path.map((entry, index) =>
    createRecipesForEntry(profession, entry, index, dofusDbRecipes),
  );
  const recipes = recipeGroups.flat();
  const tiers = path.map((entry, index) => createTier(entry, index, recipeGroups[index]));

  return {
    ...profession,
    tiers,
    recipes,
  };
}

export function getRecipesForTier(allRecipes: Recipe[], tier: CraftTier) {
  return allRecipes
    .filter((recipe) => tier.recipeIds.includes(recipe.id))
    .sort((a, b) => {
      const aIndex = tier.recipeIds.indexOf(a.id);
      const bIndex = tier.recipeIds.indexOf(b.id);

      return aIndex - bIndex;
    });
}

function grind(bracket: string, recipeName: string, craftCount: number): GrindEntry {
  return { bracket, recipeName, craftCount };
}

function option(optionLabel: string, recipeName: string, craftCount: number) {
  return { optionLabel, recipeName, craftCount };
}

function alternatives(
  bracket: string,
  alternativeCrafts: NonNullable<GrindEntry["alternatives"]>,
): GrindEntry {
  return {
    bracket,
    recipeName: alternativeCrafts.map((craft) => craft.recipeName).join(" ou "),
    craftCount: alternativeCrafts[0]?.craftCount ?? 0,
    alternatives: alternativeCrafts,
  };
}

function createTier(entry: GrindEntry, index: number, recipes: Recipe[]): CraftTier {
  const [minLevel, maxLevel] = entry.bracket.split("-").map(Number);

  return {
    id: entry.bracket,
    label: entry.bracket,
    minLevel,
    maxLevel,
    title: progressionTitles[Math.min(Math.floor(index / 2), progressionTitles.length - 1)],
    intent: entry.recipeName,
    recommendedCrafts: entry.craftCount,
    recipeIds: recipes.map((recipe) => recipe.id),
  };
}

async function fetchDofusDbRecipes(jobId: number): Promise<DofusDbRecipe[]> {
  const pageSize = 50;
  const recipes: DofusDbRecipe[] = [];

  try {
    for (let skip = 0; skip < 1000; skip += pageSize) {
      const response = await fetch(
        `https://api.dofusdb.fr/recipes?$limit=${pageSize}&$skip=${skip}&jobId=${jobId}`,
        { next: { revalidate: 60 * 60 * 24 } },
      );

      if (!response.ok) {
        return recipes;
      }

      const payload = (await response.json()) as { data?: DofusDbRecipe[] };
      const page = payload.data ?? [];
      recipes.push(...page);

      if (page.length < pageSize) {
        break;
      }
    }
  } catch {
    return recipes;
  }

  return recipes;
}

function createRecipesForEntry(
  profession: Profession,
  entry: GrindEntry,
  index: number,
  dofusDbRecipes: DofusDbRecipe[],
): Recipe[] {
  const crafts = entry.alternatives ?? [
    {
      optionLabel: undefined,
      recipeName: entry.recipeName,
      craftCount: entry.craftCount,
    },
  ];

  return crafts.map((craft, craftIndex) =>
    createRecipe(
      profession,
      entry,
      index,
      dofusDbRecipes,
      craft.recipeName,
      craft.craftCount,
      craft.optionLabel,
      craftIndex,
    ),
  );
}

function createRecipe(
  profession: Profession,
  entry: GrindEntry,
  index: number,
  dofusDbRecipes: DofusDbRecipe[],
  recipeName = entry.recipeName,
  craftCount = entry.craftCount,
  optionLabel?: string,
  craftIndex = 0,
): Recipe {
  const [minLevel] = entry.bracket.split("-").map(Number);
  const dofusDbRecipe = findDofusDbRecipe(recipeName, dofusDbRecipes);
  const id =
    dofusDbRecipe?.id ?? Number(`${profession.jobId}${index + 1}${craftIndex}`);
  const resultId = dofusDbRecipe?.resultId ?? id;

  return {
    id,
    recipeId: dofusDbRecipe?.id ?? createSyntheticRecipeId(profession.jobId, index),
    jobId: profession.jobId,
    professionName: profession.name,
    resultId,
    resultLevel: dofusDbRecipe?.resultLevel ?? minLevel,
    resultName: { fr: recipeName },
    resultImageUrl: safeImageUrl(dofusDbRecipe?.result?.img),
    resultType: { fr: dofusDbRecipe?.resultType?.name?.fr ?? "Recette de métier" },
    ingredients: createIngredients(dofusDbRecipe),
    craftCount,
    optionLabel,
    source: "dofusdb",
  };
}

function createSyntheticRecipeId(jobId: number, index: number) {
  return Number(`${jobId}${index}`);
}

function createIngredients(recipe: DofusDbRecipe | undefined): Ingredient[] {
  return (recipe?.ingredients ?? []).map((ingredient, index) => ({
    id: ingredient.id ?? Number(`${recipe?.id ?? 0}${index}`),
    name: { fr: ingredient.name?.fr ?? "Ingrédient inconnu" },
    imageUrl: safeImageUrl(ingredient.img),
    type: { fr: ingredient.type?.name?.fr ?? "Ressource" },
    quantity: recipe?.quantities?.[index] ?? 1,
  }));
}

function safeImageUrl(imageUrl: string | undefined) {
  return imageUrl?.startsWith("https://") ? imageUrl : FALLBACK_IMAGE_URL;
}

function findDofusDbRecipe(recipeName: string, recipes: DofusDbRecipe[]) {
  const target = normalizeName(recipeName);
  const exact = recipes.find((recipe) => normalizeName(recipe.resultName?.fr) === target);

  if (exact) {
    return exact;
  }

  return recipes
    .map((recipe) => ({
      recipe,
      score: getMatchScore(target, normalizeName(recipe.resultName?.fr)),
    }))
    .filter(({ score }) => score >= 0.72)
    .sort((a, b) => b.score - a.score)[0]?.recipe;
}

function getMatchScore(target: string, candidate: string) {
  if (!target || !candidate) {
    return 0;
  }

  if (candidate.includes(target) || target.includes(candidate)) {
    return Math.min(target.length, candidate.length) / Math.max(target.length, candidate.length);
  }

  const targetTokens = new Set(target.split(" ").filter(Boolean));
  const candidateTokens = new Set(candidate.split(" ").filter(Boolean));
  const sharedTokens = [...targetTokens].filter((token) => candidateTokens.has(token));

  return sharedTokens.length / Math.max(targetTokens.size, candidateTokens.size);
}

function normalizeName(name: string | undefined) {
  return (name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/gi, "")
    .trim()
    .toLowerCase();
}
