import {
  BriefcaseBusiness,
  ChevronRight,
  Trees,
  FlaskConical,
  Gem,
  Home,
  Sparkles,
  Swords,
  Waves,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import {
  getProfessionPageData,
  getRecipesForTier,
  professions,
  type Ingredient,
  type Recipe,
} from "../data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const professionIcons: Record<string, LucideIcon> = {
  paysan: Wheat,
  alchimiste: FlaskConical,
  mineur: Gem,
  pecheur: Waves,
  chasseur: Swords,
  bucheron: Trees,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return professions.map((profession) => ({ slug: profession.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const profession = await getProfessionPageData(slug);

  return {
    title: profession
      ? `${profession.name.fr} | Métiers Lunae`
      : "Métier Lunae",
    description: profession?.description,
  };
}

function Sidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <aside className="sidebar-shell fixed left-0 top-0 z-30 flex h-screen w-24 flex-col border-r border-violet-200/8 bg-[#040719]/90 px-3 py-5 shadow-[24px_0_76px_rgba(0,0,0,0.54),0_0_24px_rgba(76,29,149,0.065)] backdrop-blur-md lg:w-72 lg:px-5">
      <Link
        className="relative z-10 mb-7 flex items-center justify-center gap-3 rounded-[1.7rem] border border-violet-200/9 bg-violet-100/[0.028] p-3 shadow-[inset_0_1px_0_rgba(196,181,253,0.05),inset_0_0_16px_rgba(196,181,253,0.025),0_0_16px_rgba(76,29,149,0.055)] lg:justify-start"
        href="/"
      >
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_18px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(237,233,254,0.42)]">
          <LunaeriaLogo size={27} />
        </div>
        <div className="hidden min-w-0 lg:block">
          <p className="text-lg font-black tracking-[0.24em] text-violet-50 drop-shadow-[0_0_7px_rgba(196,181,253,0.2)]">
            LUNAE
          </p>
          <p className="text-xs uppercase tracking-[0.32em] text-violet-100/70">
            Métiers
          </p>
        </div>
      </Link>

      <nav className="relative z-10 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        <Link
          className="group/nav relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-transparent px-3 text-sm font-bold text-slate-400 transition duration-300 hover:border-violet-200/12 hover:bg-violet-100/[0.035] hover:text-violet-100 lg:justify-start"
          href="/"
        >
          <Home className="shrink-0" size={19} />
          <span className="hidden flex-1 text-left lg:inline">Accueil</span>
        </Link>

        <div className="group/nav relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-violet-200/16 bg-[linear-gradient(90deg,rgba(124,58,237,0.13),rgba(91,33,182,0.055))] px-3 text-sm font-bold text-violet-50 shadow-[inset_0_1px_14px_rgba(196,181,253,0.045),0_0_13px_rgba(109,40,217,0.075)] lg:justify-start">
          <BriefcaseBusiness className="shrink-0" size={19} />
          <span className="hidden flex-1 text-left lg:inline">Métiers</span>
        </div>

        <div className="hidden pl-5 lg:block">
          <div className="ml-3 mt-2 space-y-2 border-l border-violet-100/12 pl-3">
            {professions.map((profession) => (
              <Link
                className={`group/sub relative flex h-10 items-center rounded-xl border px-3 text-xs font-black uppercase tracking-[0.16em] transition duration-300 ${
                  profession.slug === activeSlug
                    ? "border-violet-200/16 bg-violet-200/8 text-violet-50 shadow-[inset_0_0_12px_rgba(196,181,253,0.045),0_0_11px_rgba(109,40,217,0.06)]"
                    : "border-transparent text-slate-500 hover:border-violet-200/12 hover:bg-violet-100/[0.035] hover:text-violet-100"
                }`}
                href={`/metiers/${profession.slug}`}
                key={profession.slug}
              >
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_5px_currentColor]" />
                {profession.name.fr}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}

function ItemImage({ alt, src, size = "lg" }: { alt: string; src: string; size?: "sm" | "lg" }) {
  const sizeClass = size === "sm" ? "size-11" : "size-28";
  const imageSize = size === "sm" ? 44 : 112;

  return (
    <div
      className={`${sizeClass} grid shrink-0 place-items-center rounded-2xl border border-violet-100/12 bg-[#030512]/66 shadow-[inset_0_0_18px_rgba(196,181,253,0.035)]`}
    >
      <Image
        alt={alt}
        className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
        height={imageSize}
        loading="lazy"
        src={src}
        width={imageSize}
      />
    </div>
  );
}

function IngredientRow({ ingredient }: { ingredient: Ingredient }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.035] p-3 shadow-[inset_0_0_12px_rgba(196,181,253,0.018)] transition duration-300 hover:border-violet-200/14 hover:bg-violet-100/[0.052]">
      <ItemImage alt={ingredient.name.fr} size="sm" src={ingredient.imageUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-violet-50">
          {ingredient.name.fr}
        </p>
        <p className="truncate text-xs text-slate-400">{ingredient.type.fr}</p>
      </div>
      <span className="rounded-xl border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-[#e8dcbd]">
        x{ingredient.quantity}
      </span>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="rounded-[1.45rem] border border-violet-100/8 bg-violet-50/[0.035] p-4 shadow-[inset_0_0_14px_rgba(196,181,253,0.018),0_16px_38px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/16 hover:bg-violet-100/[0.055]">
      {recipe.optionLabel ? (
        <span className="mb-4 inline-flex rounded-full border border-violet-100/12 bg-violet-200/[0.07] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-violet-100">
          {recipe.optionLabel}
        </span>
      ) : null}
      <div className="flex gap-4">
        <div className="rounded-[1.25rem] border border-violet-200/12 bg-[radial-gradient(circle_at_35%_25%,rgba(196,181,253,0.14),transparent_28%),linear-gradient(145deg,#090d28,#20114f_58%,#030512)] p-3">
          <ItemImage alt={recipe.resultName.fr} src={recipe.resultImageUrl} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-violet-100/80">
              Niv. {recipe.resultLevel}
            </span>
            <span className="rounded-full border border-violet-100/10 bg-violet-200/[0.055] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-violet-200">
              {recipe.resultType.fr}
            </span>
            {recipe.craftCount ? (
              <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#e8dcbd]">
                x{recipe.craftCount}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-xl font-black text-violet-50">
            {recipe.resultName.fr}
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            Recette #{recipe.recipeId} · Item #{recipe.resultId}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
            Ingrédients
          </p>
          <ChevronRight className="text-violet-100/45" size={17} />
        </div>
        <div className="grid gap-2">
          {recipe.ingredients.map((ingredient) => (
            <IngredientRow ingredient={ingredient} key={ingredient.id} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function MetierPage({ params }: PageProps) {
  const { slug } = await params;
  const profession = await getProfessionPageData(slug);

  if (!profession) {
    notFound();
  }

  const Icon = professionIcons[profession.slug] ?? BriefcaseBusiness;
  const populatedRecipes = profession.recipes.length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-42" />
      <div className="fog-veil fixed inset-0" />

      <Sidebar activeSlug={profession.slug} />

      <div className="relative z-10 ml-24 min-h-screen p-4 sm:p-6 lg:ml-72 lg:p-8">
        <section className="premium-card relative overflow-hidden rounded-[2.1rem] border border-violet-200/9 bg-[#06091b]/76 p-6 shadow-[0_42px_120px_rgba(0,0,0,0.58),0_0_28px_rgba(76,29,149,0.075)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/13 bg-violet-200/7 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-100">
                <Sparkles size={14} /> Données DofusDB
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <div className="grid size-20 place-items-center rounded-[1.6rem] border border-violet-200/15 bg-[linear-gradient(145deg,rgba(196,181,253,0.14),rgba(76,29,149,0.08))] text-violet-50 shadow-[inset_0_1px_18px_rgba(196,181,253,0.045),0_0_24px_rgba(109,40,217,0.09)]">
                  <Icon size={34} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-200/82">
                    {profession.role}
                  </p>
                  <h1 className="mt-2 text-5xl font-black tracking-[0.14em] text-violet-50 sm:text-6xl">
                    {profession.name.fr}
                  </h1>
                </div>
              </div>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200/90">
                {profession.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-violet-100/8 bg-violet-50/[0.035] p-5 shadow-[inset_0_0_18px_rgba(196,181,253,0.024),0_18px_42px_rgba(0,0,0,0.26)]">
              <div className="flex items-center gap-4">
                <ItemImage
                  alt={profession.name.fr}
                  size="sm"
                  src={profession.imageUrl}
                />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                    Profession #{profession.jobId}
                  </p>
                  <p className="mt-2 text-2xl font-black text-violet-50">
                    {populatedRecipes} recettes
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">
                {populatedRecipes
                  ? "Recettes locales issues de la structure DofusDB, prêtes à être enrichies par profession."
                  : "Structure prête. Les recettes DofusDB de ce métier seront ajoutées dans le même format."}
              </p>
              <div className="mt-5 rounded-2xl border border-violet-100/8 bg-[#030512]/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-100/70">
                  Focus
                </p>
                <p className="mt-2 font-black text-violet-50">
                  {profession.focus}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-6">
          {profession.tiers.map((tier) => {
            const tierRecipes = getRecipesForTier(profession.recipes, tier);

            if (!tierRecipes.length) {
              return null;
            }

            return (
              <section
                className="premium-card relative overflow-hidden rounded-[1.75rem] border border-violet-200/8 bg-[#06091b]/70 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.055)] backdrop-blur-md"
                key={tier.id}
              >
                <div className="relative z-10 grid lg:grid-cols-[230px_1fr]">
                  <aside className="flex flex-col justify-between border-b border-violet-100/8 bg-[linear-gradient(180deg,rgba(124,58,237,0.14),rgba(2,4,16,0.66))] p-6 lg:border-b-0 lg:border-r">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200/78">
                        Palier
                      </p>
                      <p className="mt-3 text-3xl font-black text-violet-50">
                        {tier.label}
                      </p>
                    </div>
                    <div className="mt-8 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Objectif XP
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-200">
                          {tier.intent}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-violet-100/8 bg-[#030512]/72 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-violet-100/70">
                          Lot conseillé
                        </p>
                        <p className="mt-2 text-2xl font-black text-[#e8dcbd]">
                          {tier.recommendedCrafts}
                        </p>
                      </div>
                    </div>
                  </aside>

                  <div className="p-5 lg:p-6">
                    <div className="mb-5">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                        {tierRecipes.length} recette
                        {tierRecipes.length > 1 ? "s" : ""} authentique
                        {tierRecipes.length > 1 ? "s" : ""}
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-violet-50">
                        {tier.title}
                      </h2>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {tierRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </section>
      </div>
    </main>
  );
}
