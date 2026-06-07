"use client";

import { Check, ChevronDown, Dna, GitBranch, HeartHandshake, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import {
  breedingSpeciesDefinitions,
  findMountByColors,
  getBreedingDefinition,
  getMountByLineage,
  getMountsByGeneration,
  normalizeBreedingName,
  type BreedingSpeciesSlug,
  type LocalBreedingMount,
} from "@/lib/breeding-database";

type MountType = BreedingSpeciesSlug;
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

type SimulatedChild = {
  lineage: string;
  generation: number;
  gestationHours: number;
  source: "heritage" | "new-lineage";
};

function getLineages(mountType: MountType, generation: number) {
  return getMountsByGeneration(mountType, generation).map((mount) => mount.lineage);
}

function getGenerationOptions(mountType: MountType) {
  const definition = getBreedingDefinition(mountType);

  return Array.from(
    { length: definition?.generationCount ?? 10 },
    (_, index) => index + 1,
  );
}

function getMountTypeLabel(mountType: MountType) {
  return getBreedingDefinition(mountType)?.title ?? mountType;
}

function getMountTypeName(mountType: MountType) {
  return getBreedingDefinition(mountType)?.mountType ?? getMountTypeLabel(mountType);
}

function simulateBreeding(input: SimulatorInput) {
  const generationGap = Math.abs(
    input.parentOneGeneration - input.parentTwoGeneration,
  );
  const sameLineage = input.parentOneLineage === input.parentTwoLineage;
  const compatibility =
    generationGap <= 1 ? "Excellente" : generationGap <= 3 ? "Stable" : "Faible";
  const parentOneMount = getMountByLineage(input.mountType, input.parentOneLineage);
  const parentTwoMount = getMountByLineage(input.mountType, input.parentTwoLineage);
  const inheritedChildren: SimulatedChild[] = sameLineage
    ? [
        {
          lineage: input.parentOneLineage,
          generation: parentOneMount?.generation ?? input.parentOneGeneration,
          gestationHours: parentOneMount?.gestationHours ?? 0,
          source: "heritage",
        },
      ]
    : [
        {
          lineage: input.parentOneLineage,
          generation: parentOneMount?.generation ?? input.parentOneGeneration,
          gestationHours: parentOneMount?.gestationHours ?? 0,
          source: "heritage",
        },
        {
          lineage: input.parentTwoLineage,
          generation: parentTwoMount?.generation ?? input.parentTwoGeneration,
          gestationHours: parentTwoMount?.gestationHours ?? 0,
          source: "heritage",
        },
      ];
  const inheritedKeys = new Set(
    inheritedChildren.map((child) => normalizeBreedingName(child.lineage)),
  );
  const crossedChildren = createCrossedChildren(
    input.mountType,
    parentOneMount,
    parentTwoMount,
  );
  const newLineageChildren = uniqueChildren(
    crossedChildren.filter(
      (child) => !inheritedKeys.has(normalizeBreedingName(child.lineage)),
    ),
  );
  const children = [...newLineageChildren, ...inheritedChildren];
  const possibleGenerations = Array.from(
    new Set(children.map((child) => child.generation)),
  ).sort((left, right) => left - right);
  const possibleGestationHours = Array.from(
    new Set(children.map((child) => child.gestationHours).filter(Boolean)),
  ).sort((left, right) => left - right);
  const probableChild = newLineageChildren[0] ?? inheritedChildren[0];

  return {
    children,
    compatibility,
    incompleteData: !parentOneMount || !parentTwoMount || crossedChildren.length === 0,
    possibleGenerations,
    possibleGestationHours,
    probableResult: probableChild
      ? `${getMountTypeName(input.mountType)} ${probableChild.lineage} Gen. ${probableChild.generation}`
      : "Données incomplètes",
  };
}

function createCrossedChildren(
  mountType: MountType,
  parentOneMount: LocalBreedingMount | undefined,
  parentTwoMount: LocalBreedingMount | undefined,
) {
  if (!parentOneMount || !parentTwoMount) {
    return [];
  }

  return parentOneMount.baseColors.flatMap((parentOneColor) =>
    parentTwoMount.baseColors.flatMap((parentTwoColor) => {
      const result = findMountByColors(mountType, parentOneColor, parentTwoColor);

      return result
        ? [
            {
              lineage: result.lineage,
              generation: result.generation,
              gestationHours: result.gestationHours,
              source: "new-lineage" as const,
            },
          ]
        : [];
    }),
  );
}

function uniqueChildren(children: SimulatedChild[]) {
  const seen = new Set<string>();

  return children.filter((child) => {
    const key = `${normalizeBreedingName(child.lineage)}-${child.generation}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function formatGestationHours(hours: number[]) {
  if (!hours.length) {
    return "Données incomplètes";
  }

  if (hours.length === 1) {
    return `Durée estimée : ${hours[0]} h`;
  }

  return `Durée estimée : ${hours[0]} h → ${hours[hours.length - 1]} h`;
}

function fieldClass() {
  return "min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition focus:border-violet-200/28 focus:bg-[#06091b]/86";
}

function LunaeriaDropdown({
  id,
  isOpen,
  onChange,
  onOpenChange,
  options,
  value,
}: {
  id: string;
  isOpen: boolean;
  onChange: (value: string) => void;
  onOpenChange: (id: string | undefined) => void;
  options: SelectOption[];
  value: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(undefined);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onOpenChange]);

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-20"}`} ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-left text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition hover:border-violet-200/24 hover:bg-[#06091b]/86"
        onClick={() => onOpenChange(isOpen ? undefined : id)}
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
                  onOpenChange(undefined);
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
  const [openDropdownId, setOpenDropdownId] = useState<string>();
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
    const nextGeneration = getGenerationOptions(nextMountType)[0];
    const nextParentLineages = getLineages(nextMountType, nextGeneration);

    setMountType(nextMountType);
    setParentOneGeneration(nextGeneration);
    setParentTwoGeneration(nextGeneration);
    setParentOneLineage(nextParentLineages[0]);
    setParentTwoLineage(nextParentLineages[1] ?? nextParentLineages[0]);
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
                    isOpen={openDropdownId === "mount-type"}
                    onChange={(value) => updateMountType(value as MountType)}
                    onOpenChange={setOpenDropdownId}
                    options={breedingSpeciesDefinitions.map((species) => ({
                      label: species.title,
                      value: species.slug,
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
                          isOpen={openDropdownId === `${parent.label}-generation`}
                          onChange={(value) => parent.updateGeneration(Number(value))}
                          onOpenChange={setOpenDropdownId}
                          options={getGenerationOptions(mountType).map((generation) => ({
                            label: `Generation ${generation}`,
                            value: String(generation),
                          }))}
                          value={String(parent.generation)}
                        />
                        <LunaeriaDropdown
                          id={`${parent.label}-lineage`}
                          isOpen={openDropdownId === `${parent.label}-lineage`}
                          onChange={parent.setLineage}
                          onOpenChange={setOpenDropdownId}
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
                  <h2 className="font-black text-violet-50">Compatibilité</h2>
                </div>
                <div className="relative z-10 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Type", getMountTypeLabel(mountType)],
                    ["Compatibilité", result.compatibility],
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
                  <h2 className="font-black text-violet-50">Résultats possibles</h2>
                </div>
                <div className="relative z-10 grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {[parentOne, parentTwo].map((parent, index) => (
                      <div
                        className="rounded-2xl border border-violet-100/9 bg-[#030512]/62 p-4"
                        key={`${parent}-${index}`}
                      >
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
                            key={`${child.source}-${child.lineage}-${child.generation}`}
                          >
                            {getMountTypeName(mountType)} {child.lineage} - Gen.{" "}
                            {child.generation}
                            {child.source === "new-lineage" ? " - Nouvelle lignée" : ""}
                          </span>
                        ))}
                        {result.incompleteData ? (
                          <span className="rounded-full border border-amber-100/10 bg-amber-100/[0.055] px-3 py-1 text-xs font-black text-amber-100">
                            Données incomplètes
                          </span>
                        ) : null}
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
                          ⏳ Temps de gestation
                        </p>
                        <p className="mt-2 text-lg font-black text-violet-50">
                          {formatGestationHours(result.possibleGestationHours)}
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
