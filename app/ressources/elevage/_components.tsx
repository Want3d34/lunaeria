import { GitBranch, Sparkles } from "lucide-react";
import Image from "next/image";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import type {
  BreedingGeneration,
  BreedingMount,
  BreedingSpecies,
  BreedingSpecialMount,
} from "@/lib/breeding-data";

export function BreedingMountCard({ mount }: { mount: BreedingMount }) {
  return (
    <article className="relative rounded-[1.25rem] border border-violet-100/9 bg-violet-50/[0.035] p-4 shadow-[inset_0_0_14px_rgba(196,181,253,0.02),0_16px_38px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/16">
      <div className="grid size-20 place-items-center rounded-2xl border border-violet-100/10 bg-[#030512]/72">
        <Image
          alt={mount.name}
          className="h-14 w-14 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
          height={56}
          src={mount.imageUrl}
          width={56}
        />
      </div>
      <span className="mt-4 inline-flex rounded-full border border-violet-100/10 bg-[#030512]/72 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-200">
        Gén. {mount.generation}
      </span>
      <h3 className="mt-3 text-sm font-black text-violet-50">{mount.name}</h3>
      <p className="mt-1 text-xs text-slate-400">{mount.type}</p>
    </article>
  );
}

export function BreedingGenerationSection({
  generation,
}: {
  generation: BreedingGeneration;
}) {
  return (
    <section className="premium-card relative overflow-hidden rounded-[1.75rem] border border-violet-200/8 bg-[#06091b]/70 p-5 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.055)] backdrop-blur-md sm:p-6">
      <div className="relative z-10 mb-5 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl border border-violet-100/14 bg-violet-100/[0.055] text-violet-100">
          <GitBranch size={19} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
            Génération {generation.generation}
          </p>
          <h2 className="mt-1 text-xl font-black text-violet-50">
            {generation.title}
          </h2>
        </div>
      </div>
      <div className="relative z-10 before:absolute before:left-6 before:right-6 before:top-1/2 before:hidden before:h-px before:bg-violet-200/10 md:before:block">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generation.mounts.map((mount) => (
            <BreedingMountCard key={mount.id} mount={mount} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialMountCard({ mount }: { mount: BreedingSpecialMount }) {
  return (
    <article className="rounded-[1.35rem] border border-emerald-200/16 bg-[linear-gradient(145deg,rgba(16,185,129,0.11),rgba(6,78,59,0.08),rgba(3,5,18,0.78))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35),0_0_20px_rgba(16,185,129,0.08)]">
      <Image
        alt={mount.name}
        className="h-24 w-24 object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)]"
        height={96}
        src={mount.imageUrl}
        width={96}
      />
      <span className="mt-4 inline-flex rounded-full border border-emerald-100/18 bg-emerald-300/[0.08] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100">
        {mount.badge}
      </span>
      <h3 className="mt-3 text-lg font-black text-emerald-50">{mount.name}</h3>
    </article>
  );
}

export function BreedingTreePage({ species }: { species: BreedingSpecies }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          ...species.generations.slice(0, 8).map((generation) => ({
            label: `Gén. ${generation.generation}`,
            href: `#generation-${generation.generation}`,
            icon: GitBranch,
            active: generation.generation === species.generations[0]?.generation,
          })),
          ...(species.specialMounts?.length
            ? [{ label: "Spécial", href: "#special", icon: Sparkles }]
            : []),
        ]}
        subtitle="Élevage"
        title={species.title}
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
        <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
              <LunaeriaLogo size={35} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                Élevage · {species.subtitle}
              </p>
              <h1 className="mt-3 text-4xl font-black text-violet-50 drop-shadow-[0_0_14px_rgba(167,139,250,0.18)] [text-shadow:0_0_10px_rgba(196,181,253,0.16),0_10px_30px_rgba(0,0,0,0.78)] sm:text-6xl">
                {species.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                {species.description}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5">
          {species.generations.map((generation) => (
            <div id={`generation-${generation.generation}`} key={generation.generation}>
              <BreedingGenerationSection generation={generation} />
            </div>
          ))}
        </section>

        {species.specialMounts?.length ? (
          <section className="mt-8" id="special">
            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="text-emerald-100" size={20} />
              <h2 className="text-2xl font-black uppercase tracking-[0.12em] text-emerald-50">
                SPÉCIAL
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {species.specialMounts.map((mount) => (
                <SpecialMountCard key={mount.id} mount={mount} />
              ))}
            </div>
          </section>
        ) : null}
        </div>
      </div>
    </main>
  );
}
