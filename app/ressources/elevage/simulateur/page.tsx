"use client";

import { Dna, GitBranch, HeartHandshake, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";

const mountTypes = {
  dragodindes: {
    label: "Dragodindes",
    lineages: ["Rousse", "Amande", "Doree", "Ebene", "Indigo", "Pourpre", "Orchidee", "Ivoire", "Turquoise", "Emeraude"],
  },
  muldos: {
    label: "Muldos",
    lineages: ["Roux", "Amande", "Dore", "Ebene", "Indigo", "Pourpre", "Orchidee", "Ivoire", "Turquoise", "Emeraude"],
  },
  volkornes: {
    label: "Volkornes",
    lineages: ["Pourpre", "Emeraude", "Indigo", "Orchidee", "Ivoire", "Ebene", "Prune", "Amande", "Roux", "Dore"],
  },
} as const;

type MountType = keyof typeof mountTypes;

type SimulatorInput = {
  mountType: MountType;
  parentOne: string;
  parentTwo: string;
  parentOneGeneration: number;
  parentTwoGeneration: number;
  parentOneLineage: string;
  parentTwoLineage: string;
};

function simulateBreeding(input: SimulatorInput) {
  const highestGeneration = Math.max(
    input.parentOneGeneration,
    input.parentTwoGeneration,
  );
  const generationGap = Math.abs(
    input.parentOneGeneration - input.parentTwoGeneration,
  );
  const sameLineage = input.parentOneLineage === input.parentTwoLineage;
  const compatibility =
    generationGap <= 1 ? "Excellente" : generationGap <= 3 ? "Stable" : "Faible";
  const probableGeneration = Math.min(10, highestGeneration + (sameLineage ? 0 : 1));
  const possibleGenerations = Array.from(
    new Set([
      Math.max(1, highestGeneration - 1),
      highestGeneration,
      probableGeneration,
    ]),
  ).sort((left, right) => left - right);
  const possibleLineages = sameLineage
    ? [input.parentOneLineage]
    : [
        input.parentOneLineage,
        input.parentTwoLineage,
        `${input.parentOneLineage} / ${input.parentTwoLineage}`,
      ];

  return {
    children: possibleLineages.map(
      (lineage) => `${mountTypes[input.mountType].label} ${lineage}`,
    ),
    compatibility,
    possibleGenerations,
    possibleLineages,
    probableResult: `${mountTypes[input.mountType].label} ${
      sameLineage ? input.parentOneLineage : `${input.parentOneLineage} dominante`
    } Gen. ${probableGeneration}`,
  };
}

function fieldClass() {
  return "min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition focus:border-violet-200/28 focus:bg-[#06091b]/86";
}

export default function BreedingSimulatorPage() {
  const [mountType, setMountType] = useState<MountType>("dragodindes");
  const [parentOne, setParentOne] = useState("Parent 1");
  const [parentTwo, setParentTwo] = useState("Parent 2");
  const [parentOneGeneration, setParentOneGeneration] = useState(1);
  const [parentTwoGeneration, setParentTwoGeneration] = useState(1);
  const [parentOneLineage, setParentOneLineage] = useState<string>(
    mountTypes.dragodindes.lineages[0],
  );
  const [parentTwoLineage, setParentTwoLineage] = useState<string>(
    mountTypes.dragodindes.lineages[1],
  );

  const lineages = mountTypes[mountType].lineages;
  const result = useMemo(
    () =>
      simulateBreeding({
        mountType,
        parentOne,
        parentTwo,
        parentOneGeneration,
        parentTwoGeneration,
        parentOneLineage,
        parentTwoLineage,
      }),
    [
      mountType,
      parentOne,
      parentTwo,
      parentOneGeneration,
      parentTwoGeneration,
      parentOneLineage,
      parentTwoLineage,
    ],
  );

  function updateMountType(nextMountType: MountType) {
    const nextLineages = mountTypes[nextMountType].lineages;

    setMountType(nextMountType);
    setParentOneLineage(nextLineages[0]);
    setParentTwoLineage(nextLineages[1] ?? nextLineages[0]);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          {
            label: "Simulateur",
            href: "#simulateur",
            icon: Sparkles,
            active: true,
          },
        ]}
        subtitle="Elevage"
        title="Simulateur"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-60 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <header
            className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10"
            id="simulateur"
          >
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
                <LunaeriaLogo size={35} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                  Elevage
                </p>
                <h1 className="mt-3 text-4xl font-black text-violet-50 drop-shadow-[0_0_14px_rgba(167,139,250,0.18)] [text-shadow:0_0_10px_rgba(196,181,253,0.16),0_10px_30px_rgba(0,0,0,0.78)] sm:text-6xl">
                  Simulateur d&apos;accouplement
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  Previsualise les lignees, generations et resultats probables avant de planifier un croisement.
                </p>
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="premium-card rounded-[1.75rem] border border-violet-200/10 bg-[#06091b]/74 p-5 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.055)] backdrop-blur-md sm:p-6">
              <div className="relative z-10 mb-5 flex items-center gap-3">
                <Dna className="text-violet-100" size={21} />
                <h2 className="font-black text-violet-50">Parents</h2>
              </div>

              <div className="relative z-10 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                    Type de monture
                  </span>
                  <select
                    className={fieldClass()}
                    onChange={(event) => updateMountType(event.target.value as MountType)}
                    value={mountType}
                  >
                    {(Object.keys(mountTypes) as MountType[]).map((key) => (
                      <option key={key} value={key}>
                        {mountTypes[key].label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      generation: parentOneGeneration,
                      label: "Parent 1",
                      lineage: parentOneLineage,
                      name: parentOne,
                      setGeneration: setParentOneGeneration,
                      setLineage: setParentOneLineage,
                      setName: setParentOne,
                    },
                    {
                      generation: parentTwoGeneration,
                      label: "Parent 2",
                      lineage: parentTwoLineage,
                      name: parentTwo,
                      setGeneration: setParentTwoGeneration,
                      setLineage: setParentTwoLineage,
                      setName: setParentTwo,
                    },
                  ].map((parent) => (
                    <div
                      className="rounded-[1.35rem] border border-violet-100/9 bg-[#030512]/62 p-4"
                      key={parent.label}
                    >
                      <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                        {parent.label}
                      </p>
                      <div className="grid gap-3">
                        <input
                          className={fieldClass()}
                          onChange={(event) => parent.setName(event.target.value)}
                          value={parent.name}
                        />
                        <select
                          className={fieldClass()}
                          onChange={(event) =>
                            parent.setGeneration(Number(event.target.value))
                          }
                          value={parent.generation}
                        >
                          {Array.from({ length: 10 }, (_, index) => index + 1).map(
                            (generation) => (
                              <option key={generation} value={generation}>
                                Generation {generation}
                              </option>
                            ),
                          )}
                        </select>
                        <select
                          className={fieldClass()}
                          onChange={(event) => parent.setLineage(event.target.value)}
                          value={parent.lineage}
                        >
                          {lineages.map((lineage) => (
                            <option key={lineage} value={lineage}>
                              {lineage}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              <section className="premium-card rounded-[1.75rem] border border-cyan-200/10 bg-[#06091b]/74 p-5 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(34,211,238,0.055)] backdrop-blur-md sm:p-6">
                <div className="relative z-10 mb-5 flex items-center gap-3">
                  <HeartHandshake className="text-cyan-100" size={21} />
                  <h2 className="font-black text-violet-50">Compatibilite</h2>
                </div>
                <div className="relative z-10 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Type", mountTypes[mountType].label],
                    ["Compatibilite", result.compatibility],
                    ["Resultat probable", result.probableResult],
                  ].map(([label, value]) => (
                    <div
                      className="rounded-2xl border border-violet-100/9 bg-[#030512]/62 p-4"
                      key={label}
                    >
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-black text-violet-50">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="premium-card rounded-[1.75rem] border border-violet-200/10 bg-[#06091b]/74 p-5 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.055)] backdrop-blur-md sm:p-6">
                <div className="relative z-10 mb-5 flex items-center gap-3">
                  <GitBranch className="text-violet-100" size={21} />
                  <h2 className="font-black text-violet-50">Resultats possibles</h2>
                </div>
                <div className="relative z-10 grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[parentOne, parentTwo].map((parent, index) => (
                      <div
                        className="rounded-2xl border border-violet-100/9 bg-[#030512]/62 p-4"
                        key={`${parent}-${index}`}
                      >
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                          Parent {index + 1}
                        </p>
                        <p className="mt-2 font-black text-violet-50">{parent}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {index === 0 ? parentOneLineage : parentTwoLineage} - Gen.{" "}
                          {index === 0
                            ? parentOneGeneration
                            : parentTwoGeneration}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                        Enfants possibles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.children.map((child) => (
                          <span
                            className="rounded-full border border-violet-100/10 bg-violet-100/[0.055] px-3 py-1 text-xs font-black text-violet-100"
                            key={child}
                          >
                            {child}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-violet-100/9 bg-[#030512]/62 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                          Generations possibles
                        </p>
                        <p className="mt-2 font-black text-violet-50">
                          {result.possibleGenerations
                            .map((generation) => `Gen. ${generation}`)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-violet-100/9 bg-[#030512]/62 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                          Lignees possibles
                        </p>
                        <p className="mt-2 font-black text-violet-50">
                          {result.possibleLineages.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
