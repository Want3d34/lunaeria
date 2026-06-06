"use client";

import { Check, ChevronDown, Dna, GitBranch, HeartHandshake, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";

const mountTypes = {
  dragodindes: {
    label: "Dragodindes",
    generations: {
      1: ["Rousse Sauvage", "Amande Sauvage", "Doree Sauvage"],
      2: ["Rousse", "Amande", "Doree"],
      3: ["Amande et Rousse", "Amande et Doree", "Rousse et Doree"],
      4: ["Doree et Rousse", "Doree et Amande", "Doree et Indigo"],
      5: ["Ebene et Rousse", "Ebene et Amande", "Ebene et Doree"],
      6: ["Emeraude et Rousse", "Emeraude et Amande", "Emeraude et Doree"],
      7: ["Indigo et Rousse", "Indigo et Amande", "Indigo et Doree"],
      8: ["Ivoire et Rousse", "Ivoire et Amande", "Turquoise et Doree"],
      9: ["Orchidee et Rousse", "Orchidee et Amande", "Pourpre et Doree"],
      10: ["Prune et Rousse", "Prune et Amande", "Prune et Emeraude"],
    },
  },
  muldos: {
    label: "Muldos",
    generations: {
      1: ["Muldo Roux Sauvage", "Muldo Amande Sauvage", "Muldo Dore Sauvage"],
      2: ["Roux", "Amande", "Dore", "Ebene"],
      3: ["Pourpre et Roux", "Pourpre et Amande", "Pourpre et Dore"],
      4: ["Orchidee et Roux", "Orchidee et Amande", "Orchidee et Dore"],
      5: ["Indigo et Roux", "Indigo et Ebene", "Ebene et Amande"],
      6: ["Roux et Pourpre", "Roux et Orchidee", "Roux et Indigo"],
      7: ["Amande et Pourpre", "Amande et Orchidee", "Amande et Indigo"],
      8: ["Ivoire et Roux", "Ivoire et Amande", "Ivoire et Pourpre"],
      9: ["Turquoise et Roux", "Turquoise et Amande", "Turquoise et Ivoire"],
      10: ["Prune et Emeraude", "Prune et Turquoise", "Emeraude et Ivoire"],
    },
  },
  volkornes: {
    label: "Volkornes",
    generations: {
      1: ["Volkorne Pourpre Sauvage", "Volkorne Emeraude Sauvage", "Volkorne Indigo Sauvage"],
      2: ["Pourpre", "Emeraude", "Indigo", "Orchidee", "Ebene"],
      3: ["Pourpre et Orchidee", "Indigo et Ebene", "Orchidee et Ebene"],
      4: ["Amande et Pourpre", "Amande et Indigo", "Amande et Orchidee"],
      5: ["Roux et Pourpre", "Roux et Amande", "Roux et Ebene"],
      6: ["Ivoire et Pourpre", "Ivoire et Turquoise", "Turquoise et Amande"],
      7: ["Prune et Emeraude", "Prune et Ivoire", "Emeraude et Turquoise"],
      8: ["Dore et Roux", "Dore et Ivoire", "Dore et Emeraude"],
      9: ["Jade et Dore", "Jade et Prune", "Jade et Emeraude"],
      10: ["Rubis et Jade", "Saphir et Jade", "Amethyste et Rubis"],
    },
  },
} as const;

type MountType = keyof typeof mountTypes;
type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type SelectOption = {
  label: string;
  value: string;
};

type SimulatorInput = {
  mountType: MountType;
  parentOne: string;
  parentTwo: string;
  parentOneGeneration: number;
  parentTwoGeneration: number;
  parentOneLineage: string;
  parentTwoLineage: string;
};

function getLineages(mountType: MountType, generation: number) {
  return mountTypes[mountType].generations[generation as Generation] ?? [];
}

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

function LunaeriaDropdown({
  id,
  onChange,
  options,
  value,
}: {
  id: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-20"}`}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-left text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition hover:border-violet-200/24 hover:bg-[#06091b]/86"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{selectedOption?.label ?? "Selectionner"}</span>
        <ChevronDown
          className={`shrink-0 text-violet-100/70 transition ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </button>
      {isOpen ? (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-violet-200/14 bg-[#050817]/98 p-1 shadow-[0_18px_42px_rgba(0,0,0,0.5),0_0_18px_rgba(124,58,237,0.13)] backdrop-blur-md"
          role="listbox"
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                aria-selected={active}
                className={`flex min-h-10 w-full items-center justify-between rounded-xl px-3.5 text-left text-sm font-bold transition ${
                  active
                    ? "bg-violet-100/[0.09] text-violet-50"
                    : "text-slate-400 hover:bg-violet-100/[0.055] hover:text-violet-100"
                }`}
                id={`${id}-${option.value}`}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                type="button"
              >
                {option.label}
                {active ? <Check size={15} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function BreedingSimulatorPage() {
  const [mountType, setMountType] = useState<MountType>("dragodindes");
  const [parentOne, setParentOne] = useState("Parent 1");
  const [parentTwo, setParentTwo] = useState("Parent 2");
  const [parentOneGeneration, setParentOneGeneration] = useState(1);
  const [parentTwoGeneration, setParentTwoGeneration] = useState(1);
  const [parentOneLineage, setParentOneLineage] = useState<string>(
    getLineages("dragodindes", 1)[0],
  );
  const [parentTwoLineage, setParentTwoLineage] = useState<string>(
    getLineages("dragodindes", 1)[1],
  );

  const parentOneLineages = getLineages(mountType, parentOneGeneration);
  const parentTwoLineages = getLineages(mountType, parentTwoGeneration);
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
    const nextParentOneLineages = getLineages(nextMountType, parentOneGeneration);
    const nextParentTwoLineages = getLineages(nextMountType, parentTwoGeneration);

    setMountType(nextMountType);
    setParentOneLineage(nextParentOneLineages[0]);
    setParentTwoLineage(nextParentTwoLineages[0]);
  }

  function updateParentOneGeneration(nextGeneration: number) {
    const nextLineages = getLineages(mountType, nextGeneration);

    setParentOneGeneration(nextGeneration);
    setParentOneLineage(nextLineages[0]);
  }

  function updateParentTwoGeneration(nextGeneration: number) {
    const nextLineages = getLineages(mountType, nextGeneration);

    setParentTwoGeneration(nextGeneration);
    setParentTwoLineage(nextLineages[0]);
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
                  <LunaeriaDropdown
                    id="mount-type"
                    onChange={(value) => updateMountType(value as MountType)}
                    options={(Object.keys(mountTypes) as MountType[]).map((key) => ({
                      label: mountTypes[key].label,
                      value: key,
                    }))}
                    value={mountType}
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      generation: parentOneGeneration,
                      label: "Parent 1",
                      lineage: parentOneLineage,
                      name: parentOne,
                      setGeneration: setParentOneGeneration,
                      updateGeneration: updateParentOneGeneration,
                      setLineage: setParentOneLineage,
                      setName: setParentOne,
                      lineages: parentOneLineages,
                    },
                    {
                      generation: parentTwoGeneration,
                      label: "Parent 2",
                      lineage: parentTwoLineage,
                      name: parentTwo,
                      setGeneration: setParentTwoGeneration,
                      updateGeneration: updateParentTwoGeneration,
                      setLineage: setParentTwoLineage,
                      setName: setParentTwo,
                      lineages: parentTwoLineages,
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
                        <LunaeriaDropdown
                          id={`${parent.label}-generation`}
                          onChange={(value) => parent.updateGeneration(Number(value))}
                          options={Array.from(
                            { length: 10 },
                            (_, index) => index + 1,
                          ).map((generation) => ({
                            label: `Generation ${generation}`,
                            value: String(generation),
                          }))}
                          value={String(parent.generation)}
                        />
                        <LunaeriaDropdown
                          id={`${parent.label}-lineage`}
                          onChange={parent.setLineage}
                          options={parent.lineages.map((lineage) => ({
                            label: lineage,
                            value: lineage,
                          }))}
                          value={parent.lineage}
                        />
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
