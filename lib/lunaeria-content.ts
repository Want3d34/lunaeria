"use client";

import { useEffect, useState } from "react";
import { getClassImage } from "@/lib/stuffs-data";

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

const STORAGE_KEY = "lunaeria.homepage-content.v1";
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
  announcements: [
    {
      id: "announcement-1",
      title: "Rotation Songes",
      category: "Songes",
      content:
        "Groupe optimisé ce soir pour pousser les étages et redistribuer les coffres de fin de session.",
    },
    {
      id: "announcement-2",
      title: "Planning Kolizeum",
      category: "Kolizeum",
      content:
        "Créneaux 3v3 pour les membres réguliers avec compositions validées avant l'inscription.",
    },
  ],
  events: [
    {
      id: "event-1",
      title: "Donjons score équipe",
      date: "Ce soir - 21:00",
      description: "Objectifs score et succès selon les compositions présentes.",
    },
    {
      id: "event-2",
      title: "Session Métiers",
      date: "Samedi - 16:00",
      description: "Collecte et crafts groupés pour les stocks de guilde.",
    },
    {
      id: "event-3",
      title: "AvA de guilde",
      date: "Dimanche - 20:45",
      description: "Rassemblement défense et attaque selon les zones prioritaires.",
    },
  ],
  sales: [
    {
      id: "sale-1",
      itemName: "Potion de soin supérieure",
      category: "Consommable",
      price: "12500",
      quantity: "40",
      message: "Lot prêt pour les sorties de guilde.",
      imageUrl: "/file.svg",
      sellerGameName: "Azelya",
      sellerDiscordName: "azelya",
    },
    {
      id: "sale-2",
      itemName: "Minerai précieux",
      category: "Ressource",
      price: "89000",
      quantity: "100",
      message: "Stock négociable pour artisans.",
      imageUrl: "/globe.svg",
      sellerGameName: "Zyphor",
      sellerDiscordName: "zyphor",
    },
  ],
  regulation: {
    title: "Règlement Officiel de la Guilde Lunaeria",
    body: defaultRegulationText,
  },
  usefulLinks: [
    {
      id: "link-1",
      section: "general",
      title: "Dofus Wiki",
      description: "Le wiki officiel de Dofus",
      url: "https://www.dofus.com/fr/mmorpg/encyclopedie",
    },
    {
      id: "link-2",
      section: "general",
      title: "DofusDB",
      description: "Base de données complète des objets, monstres et donjons",
      url: "https://dofusdb.fr",
    },
    {
      id: "link-3",
      section: "general",
      title: "Dofusbook",
      description: "Créez et partagez vos stuffs",
      url: "https://www.dofusbook.net",
    },
    {
      id: "link-4",
      section: "general",
      title: "Dofus Map",
      description: "Carte interactive du monde de Dofus",
      url: "https://dofus-map.com",
    },
    {
      id: "link-5",
      section: "specific",
      title: "Songes pour les noobs",
      description: "Guide complet pour les songes",
      url: "https://www.dofuspourlesnoobs.com",
    },
    {
      id: "link-6",
      section: "specific",
      title: "Simulateur Comte Harebourg",
      description: "Simulateur de succès pour le donjon du Comte",
      url: "https://dofus.jeuxonline.info",
    },
    {
      id: "link-7",
      section: "specific",
      title: "Dofus pour les noobs",
      description: "Guides de quêtes et contenus Dofus",
      url: "https://www.dofuspourlesnoobs.com",
    },
    {
      id: "link-8",
      section: "specific",
      title: "Metamob",
      description: "Outil de gestion de l'ocre et des succès de donjons",
      url: "https://metamob.fr",
    },
  ],
  builds: [
    {
      id: "build-1",
      title: "Cra Feu distance",
      gamePseudo: "Azelya",
      discordPseudo: "azelya",
      className: "Cra",
      classImage: getClassImage("Cra"),
      elements: ["Feu", "Air"],
      elementIcons: ["✦", "◇"],
      orientation: "Distance",
      mode: "PvM",
      budget: "Moyen",
      level: "200",
      dofusbookUrl: "https://www.dofusbook.net",
      description:
        "Build distance confortable pour donjons, succès et farm de groupe.",
      image: getClassImage("Cra"),
      createdAt: "2026-05-23",
      views: 128,
    },
    {
      id: "build-2",
      title: "Feca tank utilitaire",
      gamePseudo: "Zyphor",
      discordPseudo: "zyphor",
      className: "Feca",
      classImage: getClassImage("Feca"),
      elements: ["Eau", "Terre"],
      elementIcons: ["●", "◆"],
      orientation: "Tank",
      mode: "PvP",
      budget: "Élevé",
      level: "200",
      dofusbookUrl: "https://www.dofusbook.net",
      description:
        "Stuff robuste orienté contrôle, protection et présence en mêlée.",
      image: getClassImage("Feca"),
      createdAt: "2026-05-23",
      views: 94,
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      title: "Veillée de guilde",
      description: "Archive visuelle Lunaeria",
      category: "Guilde",
      image: "",
      createdAt: "2026-05-23",
    },
    {
      id: "gallery-2",
      title: "Portail des Songes",
      description: "Session Songes et progression collective",
      category: "Songes",
      image: "",
      createdAt: "2026-05-23",
    },
    {
      id: "gallery-3",
      title: "Butin de donjon",
      description: "Récompenses de sortie et coffres partagés",
      category: "Donjon",
      image: "",
      createdAt: "2026-05-23",
    },
    {
      id: "gallery-4",
      title: "Défense AvA",
      description: "Mobilisation de guilde sur zone prioritaire",
      category: "AvA",
      image: "",
      createdAt: "2026-05-23",
    },
  ],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function mergeContent(content: Partial<HomepageContent>): HomepageContent {
  return {
    ...defaultHomepageContent,
    ...content,
    hero: {
      ...defaultHomepageContent.hero,
      ...content.hero,
    },
    recruitment: {
      ...defaultHomepageContent.recruitment,
      ...content.recruitment,
    },
    announcements: Array.isArray(content.announcements)
      ? content.announcements
      : defaultHomepageContent.announcements,
    events: Array.isArray(content.events)
      ? content.events
      : defaultHomepageContent.events,
    sales: Array.isArray(content.sales)
      ? content.sales
      : defaultHomepageContent.sales,
    regulation: {
      ...defaultHomepageContent.regulation,
      ...content.regulation,
    },
    usefulLinks: Array.isArray(content.usefulLinks)
      ? content.usefulLinks
      : defaultHomepageContent.usefulLinks,
    builds: Array.isArray(content.builds)
      ? content.builds
      : defaultHomepageContent.builds,
    gallery: Array.isArray(content.gallery)
      ? content.gallery
      : defaultHomepageContent.gallery,
  };
}

export function createContentId(
  prefix: "announcement" | "event" | "sale" | "link" | "build" | "gallery",
) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${randomPart}`;
}

export function readHomepageContent(): HomepageContent {
  if (!isBrowser()) {
    return defaultHomepageContent;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultHomepageContent;
  }

  try {
    return mergeContent(JSON.parse(stored) as Partial<HomepageContent>);
  } catch {
    return defaultHomepageContent;
  }
}

export function saveHomepageContent(content: HomepageContent) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
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

    function syncFromStorage(event?: StorageEvent) {
      if (event && event.key !== STORAGE_KEY) {
        return;
      }

      setContent(readHomepageContent());
    }

    function syncFromCustomEvent(event: EventListenerEvent) {
      setContent((event as CustomEvent<HomepageContent>).detail);
    }

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(UPDATE_EVENT, syncFromCustomEvent);

    return () => {
      window.clearTimeout(loadTimeout);
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(UPDATE_EVENT, syncFromCustomEvent);
    };
  }, []);

  function updateContent(nextContent: HomepageContent) {
    setContent(nextContent);
    saveHomepageContent(nextContent);
  }

  return { content, isLoaded, setContent: updateContent };
}

type EventListenerEvent = globalThis.Event;
