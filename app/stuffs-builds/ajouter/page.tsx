"use client";

import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { useHomepageContent } from "@/lib/lunaeria-content";
import { dofusClasses, getClassImage, getElement } from "@/lib/stuffs-data";
import { ElementChips, LunaeriaSelect } from "../_components";

const emptyDraft = {
  gamePseudo: "",
  discordPseudo: "",
  title: "",
  className: "Cra",
  elements: ["Feu"],
  orientation: "",
  mode: "PvM" as "PvM" | "PvP",
  budget: "Moyen",
  level: "200",
  dofusbookUrl: "",
  description: "",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function inputClass() {
  return "min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition placeholder:text-slate-600 focus:border-violet-200/28";
}

export default function AjouterStuffPage() {
  const router = useRouter();
  const { content, setContent } = useHomepageContent();
  const [draft, setDraft] = useState(emptyDraft);
  const classImage = getClassImage(draft.className);

  async function submitBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.gamePseudo.trim()) {
      return;
    }

    const elements = draft.elements.length ? draft.elements : ["Multi"];
    const payload = {
      title: draft.title.trim(),
      game_pseudo: draft.gamePseudo.trim(),
      discord_pseudo: draft.discordPseudo.trim(),
      class_name: draft.className,
      class_image: classImage,
      elements,
      element_icons: elements.map((item) => getElement(item)?.icon ?? "✦"),
      orientation: draft.orientation.trim(),
      mode: draft.mode,
      budget: draft.budget,
      level: draft.level,
      dofusbook_url: draft.dofusbookUrl.trim() || "https://www.dofusbook.net",
      description: draft.description.trim(),
      image: classImage,
    };

    const { data, error } = await supabase
      .from("builds")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase builds:", error);
      return;
    }

    if (data) {
      setContent({
  ...content,
  builds: [
          {
            id: String(data.id),
            title: data.title,
            gamePseudo: data.game_pseudo || "",
            discordPseudo: data.discord_pseudo || "",
            className: data.class_name,
            classImage: data.class_image || classImage,
            elements: data.elements?.length ? data.elements : ["Multi"],
            elementIcons:
              data.element_icons?.length
                ? data.element_icons
                : elements.map((item) => getElement(item)?.icon ?? "✦"),
            orientation: data.orientation || "",
            mode: data.mode || "PvM",
            budget: data.budget || "Moyen",
            level: data.level || "200",
            dofusbookUrl: data.dofusbook_url || "https://www.dofusbook.net",
            description: data.description || "",
            image: data.image || data.class_image || getClassImage(data.class_name),
            createdAt: data.created_at || new Date().toISOString(),
            views: data.views ?? 0,
          },
          ...content.builds,
        ],
      });
    }

    router.push("/stuffs-builds/encyclopedie");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-violet-100 transition hover:text-violet-50" href="/stuffs-builds/encyclopedie">
          <ArrowLeft size={17} />
          Retour à l&apos;encyclopédie
        </Link>
        <form className="premium-card mt-6 rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-6 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-8" onSubmit={submitBuild}>
          <div className="relative z-10 mb-6 flex items-center gap-5">
            <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
              <LunaeriaLogo size={35} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">Nouveau build</p>
              <h1 className="legend-title mt-2 text-4xl font-black text-violet-50">Ajouter un Stuff</h1>
            </div>
          </div>
          <div className="relative z-10 grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="grid place-items-center rounded-2xl border border-violet-100/18 bg-[#030512]/70 p-4 text-center text-sm font-black uppercase tracking-[0.16em] text-violet-100 shadow-[inset_0_0_14px_rgba(196,181,253,0.025)]">
              Image de classe
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`Aperçu ${draft.className}`} className="mt-4 size-28 rounded-2xl object-contain" src={classImage} />
            </div>
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inputClass()} onChange={(event) => setDraft((current) => ({ ...current, gamePseudo: event.target.value }))} placeholder="Pseudo en jeu" value={draft.gamePseudo} />
                <input className={inputClass()} onChange={(event) => setDraft((current) => ({ ...current, discordPseudo: event.target.value }))} placeholder="Pseudo Discord" value={draft.discordPseudo} />
                <input className={inputClass()} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Nom du stuff" value={draft.title} />
                <LunaeriaSelect
                  label="Classe"
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, className: value }))
                  }
                  options={dofusClasses.map((item) => item.name)}
                  value={draft.className}
                />
                <input className={inputClass()} onChange={(event) => setDraft((current) => ({ ...current, orientation: event.target.value }))} placeholder="Orientation" value={draft.orientation} />
                <LunaeriaSelect
                  label="Mode"
                  onChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      mode: value as "PvM" | "PvP",
                    }))
                  }
                  options={["PvM", "PvP"]}
                  value={draft.mode}
                />
                <LunaeriaSelect
                  label="Budget"
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, budget: value }))
                  }
                  options={["Petit", "Moyen", "Gros"]}
                  value={draft.budget}
                />
                <input className={inputClass()} onChange={(event) => setDraft((current) => ({ ...current, level: event.target.value }))} placeholder="Niveau" value={draft.level} />
                <input className={`${inputClass()} sm:col-span-2`} onChange={(event) => setDraft((current) => ({ ...current, dofusbookUrl: event.target.value }))} placeholder="URL Dofusbook" value={draft.dofusbookUrl} />
              </div>
              <ElementChips
                onChange={(elements) =>
                  setDraft((current) => ({ ...current, elements }))
                }
                selected={draft.elements}
              />
              <textarea className={`${inputClass()} min-h-32 py-3`} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Description" value={draft.description} />
              <button className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 text-sm font-black text-violet-50" type="submit">
                <Send size={17} />
                Publier le build
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
