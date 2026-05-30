"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilPage() {
  const [displayName, setDisplayName] = useState("Chargement...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [highestRole, setHighestRole] = useState("Membre");
  const [discordId, setDiscordId] = useState<string | null>(null);

const [ingameName, setIngameName] = useState("");
const [mainClass, setMainClass] = useState("");
const [level, setLevel] = useState("");
const [presentation, setPresentation] = useState("");
const [availability, setAvailability] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      const discordIdentity = user.identities?.find(
        (identity) => identity.provider === "discord",
      );

      const identityData = discordIdentity?.identity_data as
  | { provider_id?: string; sub?: string; id?: string }
  | undefined;

const discordId =
  identityData?.provider_id ||
  identityData?.sub ||
  identityData?.id;

      if (!discordId) return;

setDiscordId(discordId);

      const { data } = await supabase
        .from("discord_profiles")
        .select("display_name, username, avatar_url, highest_role")
        .eq("discord_id", discordId)
        .maybeSingle();

      if (!data) return;

      setDisplayName(data.display_name || data.username || "Membre Lunaeria");
      setAvatarUrl(data.avatar_url || null);
      setHighestRole(data.highest_role || "Membre");
      const { data: playerProfile } = await supabase
  .from("player_profiles")
  .select("*")
  .eq("discord_id", discordId)
  .maybeSingle();

if (playerProfile) {
  setIngameName(playerProfile.ingame_name ?? "");
  setMainClass(playerProfile.main_class ?? "");
  setLevel(playerProfile.level?.toString() ?? "");
  setPresentation(playerProfile.presentation ?? "");
  setAvailability(playerProfile.availability ?? "");
}
    }

    loadProfile();
  }, []);
  async function saveProfile() {
  if (!discordId) return;

  const { error } = await supabase
    .from("player_profiles")
    .upsert({
      discord_id: discordId,
      ingame_name: ingameName,
      main_class: mainClass,
      level: level ? Number(level) : null,
      presentation: presentation,
      availability: availability,
    });

  if (error) {
    console.error(error);
    alert("Erreur lors de la sauvegarde du profil.");
    return;
  }

  alert("Profil sauvegardé avec succès !");
}

  return (
    <main
      className="min-h-screen text-violet-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,5,17,0.65), rgba(3,5,17,0.78)), url('/fond2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-3xl border border-violet-300/20 bg-[#0b0718]/70 p-8 shadow-[0_0_60px_rgba(139,92,246,0.18)] backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Profil joueur
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Profil Lunaeria
          </h1>
          <p className="mt-3 max-w-2xl text-violet-100/70">
            Gérez votre identité, vos informations de joueur et votre présence au sein de la guilde.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)] backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-violet-300/30 bg-violet-900/40 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
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
              <p className="mt-1 text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                {highestRole}
              </p>

              <div className="mt-5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-bold text-emerald-200">
                Discord lié
              </div>

              <div className="mt-8 w-full space-y-3 text-left">
                <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                    Membre depuis
                  </p>
                  <p className="mt-1 font-black">À compléter</p>
                </div>

                <div className="rounded-2xl border border-violet-300/15 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">
                    Profil complété
                  </p>
                  <p className="mt-1 font-black">15%</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-violet-300/20 bg-[#0b0718]/80 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)] backdrop-blur-xl">
            <h2 className="text-2xl font-black">Informations joueur</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Pseudo en jeu
                </span>
                <input
  value={ingameName}
  onChange={(e) => setIngameName(e.target.value)}
  className="w-full rounded-2xl border border-violet-300/15 bg-black/35 p-4 outline-none transition focus:border-violet-300/40"
/>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Classe principale
                </span>
                <input
  value={mainClass}
  onChange={(e) => setMainClass(e.target.value)}
  className="w-full rounded-2xl border border-violet-300/15 bg-black/35 p-4 outline-none transition focus:border-violet-300/40"
/>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Niveau
                </span>
                <input
  value={level}
  onChange={(e) => setLevel(e.target.value)}
  className="w-full rounded-2xl border border-violet-300/15 bg-black/35 p-4 outline-none transition focus:border-violet-300/40"
/>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                  Disponibilités
                </span>
                <input
  value={availability}
  onChange={(e) => setAvailability(e.target.value)}
  className="w-full rounded-2xl border border-violet-300/15 bg-black/35 p-4 outline-none transition focus:border-violet-300/40"
/>
              </label>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-300/70">
                Présentation
              </span>
              <textarea
  value={presentation}
  onChange={(e) => setPresentation(e.target.value)}
  className="h-40 w-full rounded-2xl border border-violet-300/15 bg-black/35 p-4 outline-none transition focus:border-violet-300/40"
/>
            </label>

            <button
  onClick={saveProfile}
  className="mt-6 rounded-2xl bg-violet-600 px-7 py-4 font-black shadow-[0_0_30px_rgba(139,92,246,0.35)] transition hover:bg-violet-500"
>
  Sauvegarder le profil
</button>
          </section>
        </div>
      </div>
    </main>
  );
}