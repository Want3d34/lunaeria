"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type DiscordProfile = {
  discord_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  highest_role: string | null;
  discord_role_ids?: string[] | string | null;
};

type PlayerProfile = {
  ingame_name: string | null;
  main_class: string | null;
  level: number | null;
  presentation: string | null;
  availability: string | null;
  professions: string[] | null;
};

function normalizeRole(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const discordBadgeRoles = [
  { id: "1459875674016845867", label: "Staff", icon: ShieldCheck },
  { id: "1510719003373473792", label: "Recruteur", icon: UserPlus },
  { id: "1510718646509375600", label: "Vétéran", icon: Swords },
  { id: "1510718451453399280", label: "Membre Actif", icon: Sparkles },
] satisfies { id: string; label: string; icon: LucideIcon }[];

function getDiscordRoleIds(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value.split(",").map((roleId) => roleId.trim());
  }

  return [];
}

export default function PublicMemberProfilePage() {
  const params = useParams();
  const discordId = String(params.discordId);

  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    async function loadMemberProfile() {
      const { data: discordData } = await supabase
        .from("discord_profiles")
        // Also retrieves discord_role_ids automatically once synchronization
        // adds the optional column to discord_profiles.
        .select("*")
        .eq("discord_id", discordId)
        .maybeSingle();

      const { data: playerData } = await supabase
        .from("player_profiles")
        .select("ingame_name, main_class, level, presentation, availability, professions")
        .eq("discord_id", discordId)
        .maybeSingle();

      setDiscordProfile(
        discordData
          ? {
              ...discordData,
              discord_role_ids: discordData.discord_role_ids ?? null,
            }
          : null,
      );
      setPlayerProfile(playerData);
    }

    loadMemberProfile();
  }, [discordId]);

  const displayName =
    discordProfile?.display_name ||
    discordProfile?.username ||
    "Membre Lunaeria";

  const role = discordProfile?.highest_role || "Membre";

  const profileFields = [
    displayName,
    discordProfile?.avatar_url,
    discordProfile?.highest_role,
    playerProfile?.ingame_name,
    playerProfile?.main_class,
    playerProfile?.level?.toString(),
    playerProfile?.professions?.join(", "),
    playerProfile?.presentation,
    playerProfile?.availability,
  ];
  const completedFields = profileFields.filter(
    (value) => value && value.trim().length > 0,
  ).length;
  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100,
  );
  const automaticBadges: { label: string; icon: LucideIcon }[] = [];
  const discordRoleIds = getDiscordRoleIds(discordProfile?.discord_role_ids);

  if (normalizeRole(role) === "meneur") {
    automaticBadges.push({ label: "Meneur", icon: Crown });
  }

  discordBadgeRoles.forEach((badge) => {
    if (discordRoleIds.includes(badge.id)) {
      automaticBadges.push({ label: badge.label, icon: badge.icon });
    }
  });

  if (profileCompletion === 100) {
    automaticBadges.push({ label: "Membre Assidu", icon: Star });
  }

  const profileBadges = [
    { label: "Rôle Discord", value: role },
    { label: "Classe", value: playerProfile?.main_class || "Non renseignée" },
    {
      label: "Niveau",
      value: playerProfile?.level?.toString() || "Non renseigné",
    },
    {
      label: "Métiers",
      value: playerProfile?.professions?.length
        ? playerProfile.professions.join(", ")
        : "Non renseignés",
    },
  ];

  return (
    <main
      className="min-h-screen text-violet-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,5,17,0.65), rgba(3,5,17,0.82)), url('/fond2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        <NextLink
          className="mb-5 inline-flex items-center rounded-xl border border-violet-300/20 bg-[#0b0718]/75 px-4 py-2 text-sm font-black text-violet-100 shadow-[0_0_18px_rgba(124,58,237,0.12)] backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-violet-900/30 hover:text-violet-50"
          href="/membres"
        >
          ← Retour
        </NextLink>

        <section className="mb-8 rounded-3xl border border-violet-300/20 bg-[#0b0718]/75 p-8 shadow-[0_0_60px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Profil membre
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {displayName}
          </h1>
          {automaticBadges.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {automaticBadges.map((badge) => {
                const BadgeIcon = badge.icon;

                return (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-950/58 px-3 py-1.5 text-xs font-black text-violet-100 shadow-[inset_0_1px_8px_rgba(196,181,253,0.05),0_0_14px_rgba(124,58,237,0.12)]"
                    key={badge.label}
                  >
                    <BadgeIcon className="text-violet-200" size={14} />
                    {badge.label}
                  </span>
                );
              })}
            </div>
          ) : null}
          <p className="mt-3 max-w-2xl text-violet-100/70">
            Fiche publique du membre Lunaeria.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {profileBadges.map((badge) => (
              <div
                className="rounded-full border border-violet-300/18 bg-violet-950/48 px-3.5 py-2 shadow-[inset_0_1px_8px_rgba(196,181,253,0.035),0_0_14px_rgba(124,58,237,0.1)]"
                key={badge.label}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-300/70">
                  {badge.label}
                </span>
                <span className="ml-2 text-xs font-black text-violet-50">
                  {badge.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)] backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-violet-300/30 bg-violet-900/40 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                {discordProfile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={discordProfile.avatar_url}
                    alt={displayName}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black">
                    {displayName.charAt(0)}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-3xl font-black">{displayName}</h2>

              <p className="mt-1 font-sans text-sm font-semibold text-violet-300">
                {role}
              </p>

              <div className="mt-8 w-full space-y-3 text-left">
                <div className="rounded-2xl border border-violet-300/18 bg-[linear-gradient(145deg,rgba(76,29,149,0.2),rgba(3,5,17,0.48))] p-4 shadow-[inset_0_1px_12px_rgba(196,181,253,0.04)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/76">
                    Profil complété
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-2xl font-black text-violet-50">
                      {profileCompletion}%
                    </p>
                    <p className="text-xs font-semibold text-violet-100/62">
                      {completedFields}/{profileFields.length} informations
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full border border-violet-200/12 bg-[#030512]/78">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#c4b5fd,#a855f7)] shadow-[0_0_14px_rgba(168,85,247,0.5)] transition-[width] duration-700 ease-out"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                    Classe
                  </p>
                  <p className="mt-1 font-black">
                    {playerProfile?.main_class || "Non renseignée"}
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                    Niveau
                  </p>
                  <p className="mt-1 font-black">
                    {playerProfile?.level || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)] backdrop-blur-xl">
            <h2 className="text-2xl font-black">Informations joueur</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Pseudo en jeu
                </p>
                <p className="mt-2 font-black">
                  {playerProfile?.ingame_name || "Non renseigné"}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Disponibilités
                </p>
                <p className="mt-2 font-black">
                  {playerProfile?.availability || "Non renseignées"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                Métiers
              </p>
              <p className="mt-2 font-black">
                {playerProfile?.professions?.length
                  ? playerProfile.professions.join(", ")
                  : "Non renseignés"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                Présentation
              </p>
              <p className="mt-2 whitespace-pre-line leading-7 text-violet-50/85">
                {playerProfile?.presentation || "Aucune présentation renseignée."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
