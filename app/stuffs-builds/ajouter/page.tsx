"use client";

import { ImagePlus, Send, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";
import { getLinkedDiscordProfile, type LinkedDiscordProfile } from "@/lib/discord-profile";
import { useHomepageContent } from "@/lib/lunaeria-content";
import { getSiteUrl } from "@/lib/site-url";
import { uploadPublicImage } from "@/lib/storage-images";
import { dofusClasses, getClassImage, getElement } from "@/lib/stuffs-data";
import { supabase } from "@/lib/supabase";
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

function inputClass() {
  return "min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition placeholder:text-slate-600 focus:border-violet-200/28";
}

export default function AjouterStuffPage() {
  const router = useRouter();
  const { setContent } = useHomepageContent();
  const [draft, setDraft] = useState(emptyDraft);
  const [linkedDiscordProfile, setLinkedDiscordProfile] =
    useState<LinkedDiscordProfile | null>(null);
  const [isDiscordProfileLoaded, setIsDiscordProfileLoaded] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const classImage = getClassImage(draft.className);

  useEffect(() => {
    async function loadLinkedDiscordProfile() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setIsDiscordProfileLoaded(true);
        return;
      }

      setLinkedDiscordProfile(
        await getLinkedDiscordProfile(supabase, data.session?.user ?? null),
      );
      setIsDiscordProfileLoaded(true);
    }

    loadLinkedDiscordProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void getLinkedDiscordProfile(supabase, session?.user ?? null).then(
        (profile) => {
          setLinkedDiscordProfile(profile);
          setIsDiscordProfileLoaded(true);
        },
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function connectDiscord() {
    setAuthMessage("Connecte ton compte Discord pour ajouter un stuff.");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback?next=/stuffs-builds/ajouter`,
      },
    });

    if (error) {
      console.error(error);
      setAuthMessage("Connexion Discord impossible pour le moment.");
    }
  }

  async function submitBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!linkedDiscordProfile) {
      await connectDiscord();
      return;
    }

    if (!draft.title.trim() || !draft.gamePseudo.trim()) {
      return;
    }

    const elements = draft.elements.length ? draft.elements : ["Multi"];
    let buildImageUrl = "";

    if (imageFile) {
      try {
        buildImageUrl = await uploadPublicImage(
          supabase,
          "builds",
          imageFile,
          draft.title,
        );
      } catch (error) {
        console.error("Erreur upload image build:", error);
        return;
      }
    }

    const payload = {
      title: draft.title.trim(),
      game_pseudo: draft.gamePseudo.trim(),
      discord_pseudo: draft.discordPseudo.trim() || linkedDiscordProfile.displayName,
      creator_discord_id: linkedDiscordProfile.discordId,
      creator_display_name: linkedDiscordProfile.displayName,
      class_name: draft.className,
      class_image: "",
      elements,
      element_icons: elements.map((item) => getElement(item)?.icon ?? "✦"),
      orientation: draft.orientation.trim(),
      mode: draft.mode,
      budget: draft.budget,
      level: draft.level,
      dofusbook_url: draft.dofusbookUrl.trim() || "https://www.dofusbook.net",
      description: draft.description.trim(),
      image: buildImageUrl,
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
      setContent((current) => ({
        ...current,
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
            creatorDiscordId: data.creator_discord_id || linkedDiscordProfile.discordId,
            creatorDisplayName:
              data.creator_display_name || linkedDiscordProfile.displayName,
          },
          ...current.builds,
        ],
      }));
    }

    router.push("/stuffs-builds/encyclopedie");
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
            label: "Encyclopédie",
            href: "/stuffs-builds/encyclopedie",
            icon: ShieldCheck,
          },
          { label: "Ajouter", href: "#ajouter", icon: Send, active: true },
        ]}
        subtitle="Builds"
        title="STUFFS"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-5xl">
        <form className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-6 shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-8" id="ajouter" onSubmit={submitBuild}>
          <div className="relative z-10 mb-6 flex items-center gap-5">
            <div className="grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820]">
              <LunaeriaLogo size={35} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">Nouveau build</p>
              <h1 className="legend-title mt-2 text-4xl font-black text-violet-50">Ajouter un Stuff</h1>
            </div>
          </div>
          {isDiscordProfileLoaded && !linkedDiscordProfile ? (
            <div className="relative z-10 mb-5 rounded-2xl border border-violet-100/10 bg-violet-100/[0.045] p-4 text-sm font-bold text-violet-100/82">
              <p>Connecte ton compte Discord pour ajouter un stuff.</p>
              <button
                className="discord-cta mt-3 inline-flex min-h-11 items-center justify-center rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-4 text-xs font-black text-violet-50"
                onClick={connectDiscord}
                type="button"
              >
                Lier avec Discord
              </button>
            </div>
          ) : null}
          {authMessage ? (
            <p className="relative z-10 mb-5 rounded-2xl border border-violet-100/10 bg-violet-100/[0.045] px-4 py-3 text-sm font-bold text-violet-100/80">
              {authMessage}
            </p>
          ) : null}
          <div className="relative z-10 grid gap-4 md:grid-cols-[220px_1fr]">
            <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-violet-100/18 bg-[#030512]/70 p-4 text-center text-sm font-black uppercase tracking-[0.16em] text-violet-100 shadow-[inset_0_0_14px_rgba(196,181,253,0.025)] transition hover:border-violet-200/32">
              <ImagePlus className="mb-3" size={24} />
              Image du build
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                type="file"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`Aperçu ${draft.className}`} className="mt-4 size-28 rounded-2xl object-contain" src={imagePreview || classImage} />
            </label>
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
              <button className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 text-sm font-black text-violet-50 disabled:cursor-wait disabled:opacity-70" disabled={!isDiscordProfileLoaded} type="submit">
                <Send size={17} />
                {linkedDiscordProfile ? "Publier le build" : "Lier Discord pour publier"}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </main>
  );
}
