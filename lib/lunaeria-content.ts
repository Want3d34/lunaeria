"use client";

import { useEffect, useState, type SetStateAction } from "react";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type RecruitmentSettings = {
  isOpen: boolean;
  message: string;
  serverName: string;
};

export type SaleItem = {
  id: string;
  itemName: string;
  category: string;
  price: string;
  quantity: string;
  message: string;
  imageUrl: string;
  sellerGameName: string;
  sellerDiscordName: string;
};

export type RegulationContent = {
  title: string;
  body: string;
};

export type UsefulLinkSection = "general" | "specific";

export type UsefulLink = {
  id: string;
  section: UsefulLinkSection;
  title: string;
  description: string;
  url: string;
};

export type BuildItem = {
  id: string;
  title: string;
  gamePseudo: string;
  discordPseudo: string;
  className: string;
  classImage: string;
  elements: string[];
  elementIcons: string[];
  orientation: string;
  mode: "PvM" | "PvP";
  budget: string;
  level: string;
  dofusbookUrl: string;
  description: string;
  image: string;
  createdAt: string;
  views: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: string;
};

export type HomepageContent = {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  recruitment: RecruitmentSettings;
  announcements: Announcement[];
  events: Event[];
  sales: SaleItem[];
  regulation: RegulationContent;
  usefulLinks: UsefulLink[];
  builds: BuildItem[];
  gallery: GalleryItem[];
};

const UPDATE_EVENT = "lunaeria-content-updated";

export const defaultRegulationText = `Règlement Officiel de la Guilde Lunaeria

Bienvenue dans Lunaeria

Lunaeria est une guilde basée sur l'entraide, le respect, la progression collective et une bonne ambiance durable.
Chaque membre représente l'image de la guilde : nous demandons donc un comportement exemplaire envers les autres joueurs comme envers les membres internes.

1. Respect & Comportement

Le respect est obligatoire envers tous les membres.
Aucun propos insultant, discriminatoire, agressif ou toxique ne sera toléré.
Les conflits doivent être réglés calmement et en privé avec un responsable si nécessaire.
La politesse est essentielle : un bonjour, merci ou au revoir ne coûte rien.
Toute attitude nuisible à l'ambiance de la guilde pourra entraîner des sanctions.

2. Esprit de Guilde

Lunaeria est une guilde d'entraide avant tout.
Participer à la vie de la guilde est important : discussions, activités, aide, événements.
L'égoïsme excessif et les comportements opportunistes ne correspondent pas à nos valeurs.
Chacun progresse à son rythme, dans le respect des autres.

3. Activité & Participation

Une activité régulière est demandée.
Une absence prolongée sans prévenir peut entraîner une exclusion afin de garder une guilde active.
Les membres sont encouragés à participer aux sorties, donjons, événements et projets de guilde.
Les périodes d'essai sont observées attentivement afin de vérifier l'intégration et l'état d'esprit du joueur.

4. Période d'Essai

Toute nouvelle recrue passe par une période d'essai minimale d'une semaine.
Cette période sert à évaluer :
- Le comportement
- La mentalité
- L'implication
- La compatibilité avec les valeurs de Lunaeria
- Une bonne ambiance compte autant que le niveau ou l'optimisation

5. Discord & Communication

Le Discord est un espace important de la guilde.
Les règles de respect y sont identiques à celles en jeu.
Le spam, les provocations inutiles ou les comportements dérangeants ne sont pas acceptés.
Les annonces importantes doivent être lues régulièrement.

6. Sanctions

Selon la gravité des faits :
- Rappel à l'ordre
- Avertissement
- Retrait de certains droits
- Bannissement définitif

Les décisions du staff sont prises dans l'intérêt de la stabilité et de l'ambiance de la guilde.

Valeurs de Lunaeria

Chez Lunaeria nous privilégions :
- La loyauté
- Le respect
- L'entraide
- La maturité
- La bonne humeur
- La progression collective

Une guilde solide ne se construit pas uniquement avec des personnages puissants, mais surtout avec de bonnes personnes.

Bienvenue dans l'aventure Lunaeria`;

export const defaultHomepageContent: HomepageContent = {
  hero: {
    title: "LUNAERIA",
    subtitle: "Portail de la Guilde Lunaeria",
    buttonText: "Rejoindre le Discord",
    buttonLink: "#",
  },
  recruitment: {
    isOpen: true,
    message:
      "Le recrutement est ouvert aux joueurs actifs, autonomes et bienveillants.",
    serverName: "Mikhal",
  },
  announcements: [],
  events: [],
  sales: [],
  regulation: {
    title: "Règlement Officiel de la Guilde Lunaeria",
    body: defaultRegulationText,
  },
  usefulLinks: [],
  builds: [],
  gallery: [],
};

export function readHomepageContent(): HomepageContent {
  return defaultHomepageContent;
}

export function saveHomepageContent(content: HomepageContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: content }));
}

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTimeout = window.setTimeout(() => {
      setContent(readHomepageContent());
      setIsLoaded(true);
    }, 0);

    function syncFromCustomEvent(event: globalThis.Event) {
      setContent((event as unknown as CustomEvent<HomepageContent>).detail);
    }

    window.addEventListener(UPDATE_EVENT, syncFromCustomEvent);

    return () => {
      window.clearTimeout(loadTimeout);
      window.removeEventListener(UPDATE_EVENT, syncFromCustomEvent);
    };
  }, []);

  function updateContent(nextContent: SetStateAction<HomepageContent>) {
    setContent((currentContent) => {
      const resolvedContent =
        typeof nextContent === "function"
          ? (nextContent as (current: HomepageContent) => HomepageContent)(
              currentContent,
            )
          : nextContent;

      saveHomepageContent(resolvedContent);
      return resolvedContent;
    });
  }

  return { content, isLoaded, setContent: updateContent };
}
