"use client";

import { CheckCircle2, ScrollText } from "lucide-react";
import { createClient, type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import { PageSidebar } from "@/components/page-sidebar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const REGULATION_ACCEPTANCE_KEY = "lunaeria-reglement-accepted";

type DiscordValidationProfile = {
  discordUserId: string;
  discordUsername: string;
};

function getStringMetadataValue(
  source: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getDiscordValidationProfile(
  user: User | null | undefined,
): DiscordValidationProfile | null {
  if (!user) {
    return null;
  }

  const discordIdentity = user.identities?.find(
    (identity) => identity.provider === "discord",
  );

  if (!discordIdentity) {
    return null;
  }

  const userMetadata = user.user_metadata as Record<string, unknown> | undefined;
  const identityData = discordIdentity.identity_data as
    | Record<string, unknown>
    | undefined;
  const providerId =
    "provider_id" in discordIdentity
      ? String(discordIdentity.provider_id || "")
      : "";
  const discordUserId =
    providerId ||
    getStringMetadataValue(identityData, ["provider_id", "sub", "id"]) ||
    getStringMetadataValue(userMetadata, ["provider_id", "sub", "discord_id"]);

  if (!discordUserId) {
    return null;
  }

  const discordUsername =
    getStringMetadataValue(userMetadata, [
      "full_name",
      "name",
      "global_name",
      "preferred_username",
      "user_name",
      "username",
    ]) ||
    getStringMetadataValue(identityData, [
      "full_name",
      "name",
      "global_name",
      "preferred_username",
      "user_name",
      "username",
    ]) ||
    "Compte Discord";

  return { discordUserId, discordUsername };
}

const regulationSections = [
  {
    title: "1. Respect & Comportement",
    paragraphs: [
      "Le respect est obligatoire envers tous les membres.",
      "Aucun propos insultant, discriminatoire, agressif ou toxique ne sera toléré.",
      "Les conflits doivent être réglés calmement et en privé avec un responsable si nécessaire.",
      "La politesse est essentielle : un bonjour, merci ou au revoir ne coûte rien.",
      "Toute attitude nuisible à l’ambiance de la guilde pourra entraîner des sanctions.",
    ],
  },
  {
    title: "2. Esprit de Guilde",
    paragraphs: [
      "Lunaeria est une guilde d’entraide avant tout.",
      "Participer à la vie de la guilde est important : discussions, activités, aide, événements.",
      "L’égoïsme excessif et les comportements opportunistes ne correspondent pas à nos valeurs.",
      "Chacun progresse à son rythme, dans le respect des autres.",
    ],
  },
  {
    title: "⚔️ 3. Activité & Participation",
    paragraphs: [
      "Une activité régulière est demandée.",
      "Une absence prolongée sans prévenir peut entraîner une exclusion afin de garder une guilde active.",
      "Les membres sont encouragés à participer aux sorties, donjons, événements et projets de guilde.",
      "Les périodes d’essai sont observées attentivement afin de vérifier l’intégration et l’état d’esprit du joueur.",
    ],
  },
  {
    title: "️ 4. Période d’Essai",
    paragraphs: [
      "Toute nouvelle recrue passe par une période d’essai minimale d’une semaine.",
      "Cette période sert à évaluer :",
    ],
    items: [
      "Le comportement",
      "La mentalité",
      "L’implication",
      "La compatibilité avec les valeurs de Lunaeria",
      "Une bonne ambiance compte autant que le niveau ou l’optimisation",
    ],
  },
  {
    title: "5. Discord & Communication",
    paragraphs: [
      "Le Discord est un espace important de la guilde.",
      "Les règles de respect y sont identiques à celles en jeu.",
      "Le spam, les provocations inutiles ou les comportements dérangeants ne sont pas acceptés.",
      "Les annonces importantes doivent être lues régulièrement.",
    ],
  },
  {
    title: "6. Sanctions",
    paragraphs: ["Selon la gravité des faits :"],
    items: [
      "Rappel à l’ordre",
      "Avertissement",
      "Retrait de certains droits",
      "Bannissement définitif",
    ],
    footer:
      "Les décisions du staff sont prises dans l’intérêt de la stabilité et de l’ambiance de la guilde.",
  },
  {
    title: "Valeurs de Lunaeria",
    paragraphs: ["Chez Lunaeria nous privilégions :"],
    items: [
      "La loyauté",
      "Le respect",
      "L’entraide",
      "La maturité",
      "La bonne humeur",
      "La progression collective",
    ],
    footer:
      "Une guilde solide ne se construit pas uniquement avec des personnages puissants, mais surtout avec de bonnes personnes.",
  },
];

export default function ReglementPage() {
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [hasAcceptedRegulation, setHasAcceptedRegulation] = useState(false);
  const [discordValidationProfile, setDiscordValidationProfile] =
    useState<DiscordValidationProfile | null>(null);

  async function loadRegulationValidation(user: User | null | undefined) {
    const profile = getDiscordValidationProfile(user);

    setDiscordValidationProfile(profile);
    setIsDiscordConnected(Boolean(profile));

    if (!profile) {
      setHasAcceptedRegulation(false);
      return;
    }

    if (typeof window !== "undefined") {
      setHasAcceptedRegulation(
        window.localStorage.getItem(
          `${REGULATION_ACCEPTANCE_KEY}:${profile.discordUserId}`,
        ) === "true",
      );
    }

    const { data, error } = await supabase
      .from("reglement_validations")
      .select("id")
      .eq("discord_user_id", profile.discordUserId)
      .maybeSingle();

    if (error) {
      console.error(error);
      setHasAcceptedRegulation(false);
      return;
    }

    const isValidated = Boolean(data);

    setHasAcceptedRegulation(isValidated);

    if (isValidated && typeof window !== "undefined") {
      window.localStorage.setItem(
        `${REGULATION_ACCEPTANCE_KEY}:${profile.discordUserId}`,
        "true",
      );
    }
  }

  useEffect(() => {
    async function loadDiscordSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }

      await loadRegulationValidation(data.session?.user);
    }

    loadDiscordSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadRegulationValidation(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function acceptRegulation() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
      return;
    }

    const profile =
      discordValidationProfile ?? getDiscordValidationProfile(data.session?.user);

    if (!profile) {
      return;
    }

    const { error: validationError } = await supabase
      .from("reglement_validations")
      .upsert(
        {
          discord_user_id: profile.discordUserId,
          discord_username: profile.discordUsername,
          validated_at: new Date().toISOString(),
        },
        { onConflict: "discord_user_id" },
      );

    if (validationError) {
      console.error(validationError);
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `${REGULATION_ACCEPTANCE_KEY}:${profile.discordUserId}`,
        "true",
      );
    }

    setHasAcceptedRegulation(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      <PageSidebar
        items={[
          { label: "Règlement", href: "#reglement", icon: ScrollText, active: true },
        ]}
        subtitle="Charte"
        title="LUNAE"
      />

      <div className="relative z-10 min-h-screen px-4 py-8 pt-[8.25rem] sm:px-6 sm:pt-[8.5rem] lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-5xl">
          <header
            className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/76 p-7 text-center shadow-[0_42px_120px_rgba(0,0,0,0.55),0_0_28px_rgba(76,29,149,0.08)] backdrop-blur-md sm:p-10"
            id="reglement"
          >
            <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_22px_rgba(124,58,237,0.22)]">
              <LunaeriaLogo size={35} />
            </div>
            <p className="relative z-10 mt-6 text-xs font-black uppercase tracking-[0.3em] text-violet-200">
              Charte officielle
            </p>
            <h1 className="legend-title relative z-10 mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
              Règlement
            </h1>
          </header>

          <section className="mt-8 grid gap-7">
            <article className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-md sm:p-8">
              <div className="relative z-10 space-y-5 text-base leading-8 text-slate-300">
                <h2 className="text-2xl font-black text-violet-50">
                  Règlement Officiel de la Guilde Lunaeria
                </h2>
                <p className="font-bold text-violet-50">Bienvenue dans Lunaeria</p>
                <p>
                  Lunaeria est une guilde basée sur l’entraide, le respect, la
                  progression collective et une bonne ambiance durable.
                </p>
                <p>
                  Chaque membre représente l’image de la guilde : nous demandons
                  donc un comportement exemplaire envers les autres joueurs comme
                  envers les membres internes.
                </p>
              </div>
            </article>

            <article className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-md sm:p-8">
              <div className="relative z-10 space-y-8">
                {regulationSections.map((section, index) => (
                  <section
                    className="space-y-4 border-b border-violet-100/10 pb-8 last:border-b-0 last:pb-0"
                    key={section.title}
                  >
                    <h2 className="text-2xl font-black leading-tight text-violet-50">
                      {section.title}
                    </h2>
                    <div className="space-y-4 text-[15px] leading-8 text-slate-300 sm:text-base sm:leading-8">
                      {section.paragraphs.map((paragraph) => (
                        <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                      ))}
                      {section.items?.length ? (
                        <div className="grid gap-3 pt-1">
                          {section.items.map((item) => (
                            <p
                              className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.025] px-4 py-3 text-violet-100/90 before:mr-3 before:text-violet-300 before:content-['•']"
                              key={`${section.title}-${item}`}
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      ) : null}
                      {section.footer ? <p>{section.footer}</p> : null}
                    </div>
                    {index < regulationSections.length - 1 ? (
                      <div className="pt-2 text-center text-violet-100/35">
                        ---
                      </div>
                    ) : null}
                  </section>
                ))}

                <p className="text-2xl font-black text-violet-50">
                  Bienvenue dans l’aventure Lunaeria
                </p>
              </div>
            </article>

            {isDiscordConnected ? (
              <div className="premium-card rounded-[1.6rem] border border-violet-200/10 bg-[#06091b]/70 p-5 shadow-[0_18px_54px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-6">
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-violet-100" size={22} />
                    <div>
                      <p className="font-black text-violet-50">
                        Validation du règlement
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {hasAcceptedRegulation
                          ? "Règlement validé avec ce compte Discord."
                          : "Confirme que tu as lu et accepté la charte Lunaeria."}
                      </p>
                    </div>
                  </div>
                  <button
                    className="discord-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[linear-gradient(135deg,rgba(139,92,246,0.36),rgba(79,70,229,0.18))] px-5 text-sm font-black text-violet-50 transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-70"
                    disabled={hasAcceptedRegulation}
                    onClick={acceptRegulation}
                    type="button"
                  >
                    <CheckCircle2 size={18} />
                    {hasAcceptedRegulation ? "Validé" : "Valider"}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
