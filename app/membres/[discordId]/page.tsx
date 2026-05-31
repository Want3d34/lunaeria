"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type DiscordProfile = {
  discord_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  highest_role: string | null;
};

type PlayerProfile = {
  ingame_name: string | null;
  main_class: string | null;
  level: number | null;
  presentation: string | null;
  availability: string | null;
  professions: string[] | null;
};

export default function PublicMemberProfilePage() {
  const params = useParams();
  const discordId = String(params.discordId);

  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    async function loadMemberProfile() {
      const { data: discordData } = await supabase
        .from("discord_profiles")
        .select("discord_id, display_name, username, avatar_url, highest_role")
        .eq("discord_id", discordId)
        .maybeSingle();

      const { data: playerData } = await supabase
        .from("player_profiles")
        .select("ingame_name, main_class, level, presentation, availability, professions")
        .eq("discord_id", discordId)
        .maybeSingle();

      setDiscordProfile(discordData);
      setPlayerProfile(playerData);
    }

    loadMemberProfile();
  }, [discordId]);

  const displayName =
    discordProfile?.display_name ||
    discordProfile?.username ||
    "Membre Lunaeria";

  const role = discordProfile?.highest_role || "Membre";

  const completedFields = [
    playerProfile?.ingame_name,
    playerProfile?.main_class,
    playerProfile?.level?.toString(),
    playerProfile?.presentation,
    playerProfile?.availability,
    playerProfile?.professions?.join(", "),
  ].filter((value) => value && value.trim().length > 0).length;

  const profileCompletion = Math.round((completedFields / 6) * 100);

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
        <section className="mb-8 rounded-3xl border border-violet-300/20 bg-[#0b0718]/75 p-8 shadow-[0_0_60px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Profil membre
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-violet-100/70">
            Fiche publique du membre Lunaeria.
          </p>
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
                <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                    Profil complété
                  </p>
                  <p className="mt-1 font-black">{profileCompletion}%</p>
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