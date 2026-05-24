export const DOFAPI_BASE_URL = "https://fr.dofus.dofapi.fr";

export const DOFAPI_ITEM_ENDPOINTS = [
  "resources",
  "consumables",
  "equipments",
  "weapons",
  "pets",
  "mounts",
] as const;

export const DOFAPI_PROFESSION_ENDPOINT = "professions";

export type DofApiItemEndpoint = (typeof DOFAPI_ITEM_ENDPOINTS)[number];

export type DofApiCollectionEndpoint =
  | DofApiItemEndpoint
  | typeof DOFAPI_PROFESSION_ENDPOINT;

export type DofApiFilter = {
  where?: Record<string, unknown>;
  fields?: Record<string, boolean>;
  offset?: number;
  limit?: number;
  skip?: number;
  order?: string | string[];
  include?: unknown;
};

export type DofApiRecipeEntry = Record<string, unknown>;

export type DofApiItem = {
  _id: number;
  ankamaId?: number;
  name?: string;
  level?: number;
  type?: string;
  imgUrl?: string;
  url?: string;
  description?: string;
  recipe?: DofApiRecipeEntry[];
};

export type DofApiProfession = DofApiItem & {
  harvests?: Record<string, unknown>[];
};

function buildDofApiUrl(endpoint: DofApiCollectionEndpoint, filter?: DofApiFilter) {
  const url = new URL(`${DOFAPI_BASE_URL}/${endpoint}`);

  if (filter) {
    url.searchParams.set("filter", JSON.stringify(filter));
  }

  return url;
}

export async function fetchDofApiCollection<T>(
  endpoint: DofApiCollectionEndpoint,
  filter?: DofApiFilter,
) {
  const response = await fetch(buildDofApiUrl(endpoint, filter), {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(
      `DofAPI request failed for /${endpoint}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T[];
}

export function fetchDofApiItems(
  endpoint: DofApiItemEndpoint,
  filter?: DofApiFilter,
) {
  return fetchDofApiCollection<DofApiItem>(endpoint, filter);
}

export function fetchDofApiProfessions(filter?: DofApiFilter) {
  return fetchDofApiCollection<DofApiProfession>("professions", filter);
}

export async function searchDofApiItemsByName(name: string, limit = 10) {
  const filter: DofApiFilter = {
    where: { name: { like: name, options: "i" } },
    limit,
  };

  const groupedResults = await Promise.all(
    DOFAPI_ITEM_ENDPOINTS.map(async (endpoint) => ({
      endpoint,
      items: await fetchDofApiItems(endpoint, filter),
    })),
  );

  return groupedResults.flatMap(({ endpoint, items }) =>
    items.map((item) => ({ ...item, endpoint })),
  );
}
