"use client";

import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Images,
  Layers3,
  Link,
  LogOut,
  Megaphone,
  PackageOpen,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
  Users,
  WandSparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import NextLink from "next/link";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getSiteUrl } from "../lib/site-url";
import { supabase } from "../lib/supabase";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  children?: NavChild[];
};

type NavChild = {
  label: string;
  active?: boolean;
  href?: string;
  children?: NavChild[];
};

const metierLinks = [
  ["Paysan", "/metiers/paysan"],
  ["Alchimiste", "/metiers/alchimiste"],
  ["Mineur", "/metiers/mineur"],
  ["Pêcheur", "/metiers/pecheur"],
  ["Chasseur", "/metiers/chasseur"],
  ["Bûcheron", "/metiers/bucheron"],
].map(([label, href]) => ({ label, href }));

const legacyNavItems: NavItem[] = [
  { label: "Accueil", icon: HomeIcon, href: "/" },
  {
    label: "Services",
    icon: WandSparkles,
    children: [{ label: "Ventes", href: "/services/ventes" }],
  },
  {
    label: "Ressources",
    icon: PackageOpen,
    children: [{ label: "Métiers" }],
  },
  {
    label: "Stuffs & Builds",
    icon: ShieldCheck,
    children: [
      { label: "Encyclopédie", href: "/stuffs-builds/encyclopedie" },
    ],
  },
  { label: "Annonces", icon: Megaphone, href: "/annonces" },
  { label: "Évènements", icon: CalendarDays, href: "/evenements" },
  { label: "Règlement", icon: ScrollText, href: "/reglement" },
  { label: "Liens utiles", icon: Link, href: "/liens-utiles" },
];

const navItems: NavItem[] = legacyNavItems.slice(0, 0).concat([
  { label: "Accueil", icon: HomeIcon, href: "/" },
  { label: "Annonces", icon: Megaphone, href: "/annonces" },
  { label: "Événements", icon: CalendarDays, href: "/evenements" },
  { label: "Ventes", icon: WandSparkles, href: "/services/ventes" },
  { label: "Membres", icon: Users, href: "/#membres" },
  { label: "Métiers", icon: BriefcaseBusiness, href: "/metiers" },
  { label: "Élevage", icon: PackageOpen, href: "/ressources/elevage/muldos" },
  { label: "Builds", icon: ShieldCheck, href: "/stuffs-builds/encyclopedie" },
]);

const staticSearchItems = [
  { title: "Accueil", meta: "Page", href: "/" },
  { title: "Ventes", meta: "Services", href: "/services/ventes" },
  { title: "Annonces", meta: "Page", href: "/annonces" },
  { title: "Évènements", meta: "Page", href: "/evenements" },
  { title: "Règlement", meta: "Page", href: "/reglement" },
  { title: "Liens utiles", meta: "Page", href: "/liens-utiles" },
  { title: "Métiers", meta: "Onglet", href: "/metiers/paysan" },
  { title: "Ressources", meta: "Onglet", href: "/ressources/elevage/muldos" },
  { title: "Élevage", meta: "Ressources", href: "/ressources/elevage/muldos" },
  { title: "Stuffs & Builds", meta: "Onglet", href: "/stuffs-builds/encyclopedie" },
  { title: "Encyclopédie", meta: "Stuffs & Builds", href: "/stuffs-builds/encyclopedie" },
  { title: "Ajouter un stuff", meta: "Stuffs & Builds", href: "/stuffs-builds/ajouter" },
  { title: "Muldos", meta: "Ressources élevage", href: "/ressources/elevage/muldos" },
  { title: "Dragodindes", meta: "Ressources élevage", href: "/ressources/elevage/dragodindes" },
  { title: "Volkornes", meta: "Ressources élevage", href: "/ressources/elevage/volkornes" },
  ...metierLinks.map((item) => ({
    title: item.label,
    meta: "Métier",
    href: item.href,
  })),
];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const discordRolePriority = [
  "meneur",
  "bras droit",
  "tresorier",
  "protecteur",
  "artisan",
  "gardien",
  "recruteur",
  "eleveur",
  "reserviste",
  "recrue",
  "membre",
];

function getValidDiscordRole(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const role = value.trim();

  if (!role || role === "@everyone") {
    return null;
  }

  return role;
}

function getPrimaryDiscordRole(source: Record<string, unknown> | null | undefined) {
  if (!source) {
    return null;
  }

  const directRole =
    getValidDiscordRole(source.highest_role) ||
    getValidDiscordRole(source.primary_role) ||
    getValidDiscordRole(source.role_name) ||
    getValidDiscordRole(source.guild_role) ||
    getValidDiscordRole(source.role);

  if (directRole) {
    return directRole;
  }

  const roleList = [
    source.roles,
    source.role_names,
    source.guild_roles,
  ].flatMap((value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      return value.split(",").map((role) => role.trim());
    }

    return [];
  });

  const validRoles = roleList
    .map((role) => getValidDiscordRole(role))
    .filter((role): role is string => Boolean(role));

  if (validRoles.length === 0) {
    return null;
  }

  return [...validRoles].sort((leftRole, rightRole) => {
    const leftIndex = discordRolePriority.indexOf(normalizeSearchText(leftRole));
    const rightIndex = discordRolePriority.indexOf(normalizeSearchText(rightRole));

    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
  })[0] ?? null;
}

const eventIcons = [Swords, BriefcaseBusiness, ShieldCheck];
const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  announcement: Megaphone,
  build: ShieldCheck,
  event: CalendarDays,
  sale: WandSparkles,
};

type HomepageLayoutBlockKey =
  | "events"
  | "online"
  | "announcements"
  | "activity"
  | "discordBoost"
  | "guildGoals"
  | "almanax"
  | "gallery";

type HomepageSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  guildLevel: string;
  recruitmentIsOpen: boolean;
  recruitmentMessage: string;
  recruitmentServerName: string;
  guildObjectiveTitle: string;
  guildObjectiveText: string;
  guildObjectiveProgress: string;
};

type DiscordProfile = {
  discordId: string;
  display_name: string;
  displayName: string;
  username: string;
  avatar: string | null;
  role: string | null;
  source: "discord_profiles.display_name" | "discord_profiles.username" | "oauth_metadata" | "fallback";
};

type DiscordProfileRow = Record<string, unknown> & {
  discord_id?: string | null;
  display_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  role?: unknown;
  roles?: unknown;
  role_name?: unknown;
  role_names?: unknown;
  primary_role?: unknown;
  highest_role?: unknown;
  guild_role?: unknown;
  guild_roles?: unknown;
};

const discordDisplayNameFallback = "Compte lié";
const invalidDiscordDisplayNames = new Set([
  "discord",
  "compte discord",
]);

const almanaxApiBaseUrl = "https://api.dofusdu.de/dofus3/v1/fr/almanax";
const frenchDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});
const kamasFormatter = new Intl.NumberFormat("fr-FR");

const homepageSettingsFallback: HomepageSettings = {
  heroTitle: "LUNAERIA",
  heroSubtitle: "Portail de la Guilde Lunaeria",
  heroButtonText: "Rejoindre la guilde",
  heroButtonLink: "#recrutement",
  guildLevel: "20",
  recruitmentIsOpen: false,
  recruitmentMessage: "",
  recruitmentServerName: "Lunaeria",
  guildObjectiveTitle: "Objectifs de guilde",
  guildObjectiveText:
    "Préparer les prochaines sorties, renforcer l'entraide et faire progresser Lunaeria ensemble.",
  guildObjectiveProgress: "En cours",
};

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
};

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt?: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
};

type BuildItem = {
  id: string;
  title: string;
  className: string;
  mode: string;
  createdAt?: string;
};

type SaleItem = {
  id: string;
  itemName: string;
  quantity: string;
  price: string;
  createdAt?: string;
};

type OnlineMember = {
  discordId: string;
  avatarUrl: string | null;
  displayName: string;
  role: string | null;
  status: string;
  activityName: string | null;
  activityType: string | null;
};

type ActivityItem = {
  label: string;
  title: string;
  meta: string;
  type: "announcement" | "build" | "event" | "sale";
  timestamp?: string | null;
};

type SearchResult = {
  id: string;
  title: string;
  meta: string;
  href: string;
  type: string;
};

type AlmanaxEntry = {
  date: string;
  bonus?: {
    description?: string;
    type?: {
      name?: string;
    };
  };
  reward_kamas?: number;
  tribute?: {
    item?: {
      name?: string;
      image_urls?: {
        icon?: string;
        sd?: string;
      };
    };
    quantity?: number;
  };
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

function getValidDiscordDisplayName(value: string | null | undefined) {
  const displayName = value?.trim();

  if (!displayName) {
    return null;
  }

  if (invalidDiscordDisplayNames.has(displayName.toLowerCase())) {
    return null;
  }

  return displayName;
}

function getValidDiscordMetadataDisplayName(
  source: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];

    if (typeof value !== "string") {
      continue;
    }

    const displayName = getValidDiscordDisplayName(value);

    if (displayName) {
      return displayName;
    }
  }

  return null;
}

function formatOnlineStatus(status: string) {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "idle") {
    return "Absent";
  }

  if (normalizedStatus === "dnd" || normalizedStatus === "do_not_disturb") {
    return "Ne pas déranger";
  }

  return "En ligne";
}

function formatOnlineMemberActivity(member: OnlineMember) {
  const activityName = member.activityName?.trim();

  if (!activityName) {
    return null;
  }

  const normalizedActivityName = activityName.toLowerCase();
  const normalizedStatus = member.status.trim().toLowerCase();
  const statusLabel = formatOnlineStatus(member.status).toLowerCase();

  if (
    normalizedActivityName === "en ligne" ||
    normalizedActivityName === "online" ||
    normalizedActivityName === normalizedStatus ||
    normalizedActivityName === statusLabel
  ) {
    return null;
  }

  const normalizedType = member.activityType?.trim().toLowerCase();

  if (normalizedType === "playing" || normalizedType === "game" || normalizedType === "0") {
    return `Joue à ${activityName}`;
  }

  if (normalizedType === "listening" || normalizedType === "spotify" || normalizedType === "2") {
    return `Écoute ${activityName}`;
  }

  if (normalizedType === "streaming" || normalizedType === "1") {
    return `Stream ${activityName}`;
  }

  if (normalizedType === "watching" || normalizedType === "3") {
    return `Regarde ${activityName}`;
  }

  if (normalizedType === "competing" || normalizedType === "5") {
    return `Participe à ${activityName}`;
  }

  return activityName;
}

function getDiscordProfileFromUser(user: User): DiscordProfile | null {
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
  const discordId =
    providerId ||
    getStringMetadataValue(identityData, ["provider_id", "sub", "id"]) ||
    getStringMetadataValue(userMetadata, ["provider_id", "sub", "discord_id"]);

  if (!discordId) {
    return null;
  }

  const username =
    getValidDiscordMetadataDisplayName(userMetadata, [
      "full_name",
      "name",
      "global_name",
      "preferred_username",
      "user_name",
      "username",
    ]) || discordDisplayNameFallback;

  const avatar =
    getStringMetadataValue(userMetadata, ["avatar_url", "picture"]) ||
    getStringMetadataValue(identityData, ["avatar_url", "picture"]);

  return {
    discordId,
    display_name: username,
    displayName: username,
    username,
    avatar,
    role: "Membre",
    source: username === discordDisplayNameFallback ? "fallback" : "oauth_metadata",
  };
}

function PremiumCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`premium-card group rounded-[1.35rem] border border-violet-100/12 bg-[#070414]/76 p-5 shadow-[0_28px_82px_rgba(0,0,0,0.46),0_0_30px_rgba(124,58,237,0.12),inset_0_1px_0_rgba(237,233,254,0.055)] backdrop-blur-xl transition duration-500 hover:-translate-y-0.5 hover:border-violet-100/22 hover:bg-[#0a061b]/84 hover:shadow-[0_34px_92px_rgba(0,0,0,0.52),0_0_42px_rgba(168,85,247,0.16),inset_0_1px_0_rgba(237,233,254,0.075)] ${className}`}
    >
      <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-violet-100/18 bg-[linear-gradient(145deg,rgba(216,180,254,0.18),rgba(109,40,217,0.08))] text-violet-100 shadow-[inset_0_1px_12px_rgba(237,233,254,0.07),0_0_18px_rgba(139,92,246,0.18)] transition duration-500 group-hover:scale-105 group-hover:text-violet-50 group-hover:shadow-[inset_0_1px_14px_rgba(237,233,254,0.09),0_0_24px_rgba(168,85,247,0.24)]">
            <Icon size={19} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-violet-100">
            {title}
          </h2>
        </div>
        <ChevronRight
          className="text-violet-100/65 transition duration-500 group-hover:translate-x-1 group-hover:text-cyan-100"
          size={18}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function galleryPlaceholder(index: number) {
  return index % 2 === 0
    ? "bg-[radial-gradient(circle_at_35%_30%,rgba(167,139,250,0.18),transparent_26%),linear-gradient(135deg,#060b22,#240a42_54%,#030512)]"
    : "bg-[radial-gradient(circle_at_65%_25%,rgba(196,181,253,0.19),transparent_26%),linear-gradient(135deg,#030512,#171638_52%,#2b135f)]";
}

function ContentSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] shadow-[inset_0_0_13px_rgba(196,181,253,0.022),0_14px_32px_rgba(0,0,0,0.2)] ${className}`}
    >
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 rounded-full bg-violet-100/[0.075]" />
        <div className="h-4 w-2/3 rounded-full bg-violet-100/[0.06]" />
        <div className="h-3 w-full rounded-full bg-violet-100/[0.045]" />
        <div className="h-3 w-4/5 rounded-full bg-violet-100/[0.035]" />
      </div>
    </div>
  );
}


const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const weekdayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + days);

  return formatDateKey(date);
}

function formatAlmanaxDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const formattedDate = frenchDateFormatter.format(new Date(year, month - 1, day));

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function parseEventDate(date: string) {
  const value = date.trim();

  const frenchDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (frenchDate) {
    return new Date(
      Number(frenchDate[3]),
      Number(frenchDate[2]) - 1,
      Number(frenchDate[1]),
    );
  }

  const isoDate = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoDate) {
    return new Date(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
    );
  }

  return null;
}

function formatActivityDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} à ${formattedTime}`;
}

function buildCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const calendarStart = new Date(firstDay);

  calendarStart.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
}


function NavChildrenList({
  children,
  pathname,
}: {
  children?: NavChild[];
  pathname: string;
}) {
  return (
    <div className="overflow-hidden">
      <div className="space-y-2.5 lg:ml-3 lg:mt-2 lg:space-y-2 lg:border-l lg:border-violet-100/12 lg:pl-3">
        {children?.map((child) =>
          child.children?.length ? (
            <div className="rounded-2xl border border-violet-100/8 bg-[#030512]/42 p-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0" key={child.label}>
              <div className="mb-2 flex min-h-11 items-center rounded-xl border border-violet-200/10 bg-violet-100/[0.035] px-3 text-xs font-black uppercase tracking-[0.16em] text-violet-100 lg:h-10 lg:min-h-0">
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_5px_currentColor]" />
                {child.label}
              </div>
              <div className="grid gap-2 pl-2 lg:ml-3 lg:block lg:space-y-2 lg:border-l lg:border-violet-100/10 lg:pl-3">
                {child.children.map((nestedChild) => (
                  <NextLink
                    className={`group/sub relative flex min-h-11 items-center rounded-xl border px-3 text-xs font-black uppercase tracking-[0.14em] transition duration-300 lg:h-10 lg:min-h-0 lg:tracking-[0.16em] ${
                      nestedChild.href === pathname || nestedChild.active
                        ? "border-violet-200/16 bg-violet-200/8 text-violet-50 shadow-[inset_0_0_12px_rgba(196,181,253,0.045),0_0_11px_rgba(109,40,217,0.06)]"
                        : "border-transparent text-slate-500 hover:border-violet-200/12 hover:bg-violet-100/[0.035] hover:text-violet-100"
                    }`}
                    href={nestedChild.href ?? "#"}
                    key={nestedChild.label}
                  >
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_5px_currentColor]" />
                    {nestedChild.label}
                  </NextLink>
                ))}
              </div>
            </div>
          ) : (
            <NextLink
              className={`group/sub relative flex min-h-11 items-center rounded-xl border px-3 text-xs font-black uppercase tracking-[0.14em] transition duration-300 lg:h-10 lg:min-h-0 lg:tracking-[0.16em] ${
                child.href === pathname || child.active
                  ? "border-violet-200/16 bg-violet-200/8 text-violet-50 shadow-[inset_0_0_12px_rgba(196,181,253,0.045),0_0_11px_rgba(109,40,217,0.06)]"
                  : "border-transparent text-slate-500 hover:border-violet-200/12 hover:bg-violet-100/[0.035] hover:text-violet-100"
              }`}
              href={child.href ?? "#"}
              key={child.label}
            >
              <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_5px_currentColor]" />
              {child.label}
            </NextLink>
          ),
        )}
      </div>
    </div>
  );
}

function SidebarNavItem({
  item,
  open,
  onToggle,
  pathname,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const isActive =
    item.active ||
    (Boolean(item.href) && pathname === item.href) ||
    (hasChildren && open);
  const controlClassName = `group/nav relative flex h-12 min-w-[4.35rem] items-center justify-center gap-1 overflow-visible rounded-xl border px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] transition duration-300 lg:h-9 lg:min-w-0 lg:w-full lg:flex-row lg:justify-start lg:gap-2.5 lg:overflow-hidden lg:rounded-xl lg:px-3 lg:py-0 lg:text-xs lg:font-medium lg:normal-case lg:tracking-normal ${
    isActive
      ? "border-violet-300/24 bg-violet-400/[0.12] text-violet-50 shadow-[inset_0_1px_8px_rgba(196,181,253,0.045),0_0_14px_rgba(139,92,246,0.12)]"
      : "border-transparent text-violet-100/58 hover:border-violet-200/12 hover:bg-violet-100/[0.045] hover:text-violet-50"
  }`;
  const controlContent = (
    <>
      <span className="absolute inset-y-2 left-0 w-px bg-violet-200/0 transition duration-300 group-hover/nav:bg-violet-200/45" />
      <Icon
        className="shrink-0 transition duration-300 group-hover/nav:scale-105 group-hover/nav:drop-shadow-[0_0_6px_rgba(196,181,253,0.26)]"
        size={16}
      />
      <span className="block max-w-[4.1rem] text-center leading-3 lg:inline lg:max-w-none lg:flex-1 lg:text-left lg:leading-normal">
        {item.label}
      </span>
      {hasChildren ? (
        <ChevronDown
          className={`absolute right-1.5 top-1.5 text-violet-100/58 transition duration-300 lg:static lg:block ${
            open ? "rotate-180" : ""
          }`}
          size={14}
        />
      ) : null}
    </>
  );

  return (
    <div className="relative z-[10001] shrink-0">
      {item.href && !hasChildren ? (
        <NextLink className={controlClassName} href={item.href}>
          {controlContent}
        </NextLink>
      ) : (
        <button
          className={controlClassName}
          onClick={hasChildren ? onToggle : undefined}
          type="button"
        >
          {controlContent}
        </button>
      )}

      {hasChildren ? (
        <div
          className={`hidden transition-[opacity,transform] duration-300 lg:left-auto lg:right-auto lg:top-auto lg:z-auto lg:mt-0 lg:block lg:max-h-none lg:w-auto lg:overflow-hidden lg:border-0 lg:bg-transparent lg:p-0 lg:pl-5 lg:shadow-none lg:backdrop-blur-0 ${
            open ? "pointer-events-auto translate-x-0 opacity-100 lg:grid lg:grid-rows-[1fr]" : "pointer-events-none translate-x-2 opacity-0 lg:pointer-events-auto lg:grid lg:grid-rows-[0fr] lg:translate-x-0 lg:opacity-55"
          }`}
        >
          <NavChildrenList pathname={pathname}>{item.children}</NavChildrenList>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Services: false,
    Ressources: false,
    Métiers: false,
    "Stuffs & Builds": false,
  });
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [guildMemberCount, setGuildMemberCount] = useState("0");
  const [homepageSettings, setHomepageSettings] =
    useState<HomepageSettings | null>(null);

  const [galleryItemsState, setGalleryItemsState] = useState<GalleryItem[]>([]);
  const [isDynamicContentLoaded, setIsDynamicContentLoaded] = useState(false);
  const [isOnlineMembersLoaded, setIsOnlineMembersLoaded] = useState(false);
  const [isGalleryLoaded, setIsGalleryLoaded] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [almanaxDate, setAlmanaxDate] = useState(() => formatDateKey(new Date()));
  const [almanaxEntry, setAlmanaxEntry] = useState<AlmanaxEntry | null>(null);
  const [isAlmanaxLoading, setIsAlmanaxLoading] = useState(true);
  const [almanaxError, setAlmanaxError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() =>
    formatDateKey(new Date()),
  );
  const [discordProfile, setDiscordProfile] = useState<DiscordProfile | null>(
    null,
  );
  const [isDiscordAuthLoading, setIsDiscordAuthLoading] = useState(true);
  const [isDiscordSubmitting, setIsDiscordSubmitting] = useState(false);
  const [discordAuthError, setDiscordAuthError] = useState<string | null>(null);
  const [seenNotificationKeys, setSeenNotificationKeys] = useState<string[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const syncDiscordProfile = useCallback(
    async (user: User | null, showMissingProfileError = false) => {
      if (!user) {
        setDiscordProfile(null);
        return;
      }

      const profile = getDiscordProfileFromUser(user);

      if (!profile) {
        setDiscordProfile(null);

        if (showMissingProfileError) {
          setDiscordAuthError("Profil Discord introuvable.");
        }

        return;
      }

      const {
        data: existingProfile,
        error: readProfileError,
      } = await supabase
        .from("discord_profiles")
        .select("username, display_name, avatar_url, highest_role")
        .eq("discord_id", profile.discordId)
        .maybeSingle<DiscordProfileRow>();

      if (readProfileError) {
        setDiscordAuthError("Compte lié, profil serveur indisponible.");
        console.error(readProfileError);
        return;
      }

      const profileDisplayName = getValidDiscordDisplayName(
        existingProfile?.display_name,
      );
      const profileUsername = getValidDiscordDisplayName(existingProfile?.username);
      const oauthUsername = getValidDiscordDisplayName(profile.username);
      const displayName = existingProfile
        ? profileDisplayName || profileUsername || discordDisplayNameFallback
        : oauthUsername || discordDisplayNameFallback;
      const avatar = existingProfile?.avatar_url?.trim() || profile.avatar;
      const role = getPrimaryDiscordRole(existingProfile);
      const displaySource = existingProfile
        ? profileDisplayName
          ? "discord_profiles.display_name"
          : profileUsername
            ? "discord_profiles.username"
            : "fallback"
        : oauthUsername
          ? "oauth_metadata"
          : "fallback";

      console.log("[Discord profile overlay]", {
        discordId: profile.discordId,
        source: displaySource,
        displayName,
        hasDiscordProfilesRow: Boolean(existingProfile),
      });

      setDiscordProfile({
        discordId: profile.discordId,
        display_name: displayName,
        displayName,
        username: profileUsername || oauthUsername || discordDisplayNameFallback,
        avatar,
        role,
        source: displaySource,
      });

      if (!existingProfile) {
        const insertPayload: DiscordProfileRow = {
          discord_id: profile.discordId,
          avatar_url: profile.avatar,
        };

        if (oauthUsername) {
          insertPayload.username = oauthUsername;
        }

        const { error } = await supabase.from("discord_profiles").insert(insertPayload);

        if (error) {
          setDiscordAuthError("Compte lié, synchronisation à réessayer.");
          console.error(error);
        }

        return;
      }

      const profilePatch: Partial<DiscordProfileRow> = {};

      if (!getValidDiscordDisplayName(existingProfile.username) && oauthUsername) {
        profilePatch.username = oauthUsername;
      }

      if (!existingProfile.avatar_url?.trim() && profile.avatar) {
        profilePatch.avatar_url = profile.avatar;
      }

      if (Object.keys(profilePatch).length > 0) {
        const { error } = await supabase
          .from("discord_profiles")
          .update(profilePatch)
          .eq("discord_id", profile.discordId);

        if (error) {
          setDiscordAuthError("Compte lié, synchronisation à réessayer.");
          console.error(error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDiscordSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setDiscordAuthError("Session Discord indisponible.");
        console.error(error);
      } else {
        await syncDiscordProfile(data.session?.user ?? null);
      }

      if (isMounted) {
        setIsDiscordAuthLoading(false);
      }
    }

    loadDiscordSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setDiscordAuthError(null);
      void syncDiscordProfile(session?.user ?? null, true);
      setIsDiscordSubmitting(false);
      setIsDiscordAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncDiscordProfile]);

  useEffect(() => {
    async function loadHomepageSettings() {
      const { data, error } = await supabase
        .from("homepage_settings")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        setHomepageSettings(homepageSettingsFallback);
        return;
      }

      if (!data) {
        setHomepageSettings(homepageSettingsFallback);
        return;
      }

      setHomepageSettings({
        heroTitle: data.hero_title ?? "LUNAERIA",
        heroSubtitle: data.hero_subtitle ?? "Portail de la Guilde Lunaeria",
        heroButtonText: data.hero_button_text ?? "Rejoindre la guilde",
        heroButtonLink: data.hero_button_link ?? "#recrutement",
        guildLevel: data.guild_level ? String(data.guild_level) : "20",
        recruitmentIsOpen:
          typeof data.recruitment_is_open === "boolean"
            ? data.recruitment_is_open
            : false,
        recruitmentMessage:
          data.recruitment_message ?? "",
        recruitmentServerName:
          data.recruitment_server_name ?? "Lunaeria",
        guildObjectiveTitle:
          data.guild_objective_title ?? homepageSettingsFallback.guildObjectiveTitle,
        guildObjectiveText:
          data.guild_objective_text ?? homepageSettingsFallback.guildObjectiveText,
        guildObjectiveProgress:
          data.guild_objective_progress ?? homepageSettingsFallback.guildObjectiveProgress,
      });
    }

    loadHomepageSettings();
  }, []);

  useEffect(() => {
    const storedKeys = window.localStorage.getItem("lunaeria-seen-notifications");

    if (!storedKeys) {
      return;
    }

    try {
      const parsedKeys = JSON.parse(storedKeys);

      if (Array.isArray(parsedKeys)) {
        setSeenNotificationKeys(
          parsedKeys.filter((key): key is string => typeof key === "string"),
        );
      }
    } catch {
      window.localStorage.removeItem("lunaeria-seen-notifications");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAlmanax() {
      setIsAlmanaxLoading(true);
      setAlmanaxError(null);

      try {
        const response = await fetch(`${almanaxApiBaseUrl}/${almanaxDate}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Almanax API ${response.status}`);
        }

        const data = (await response.json()) as AlmanaxEntry;
        setAlmanaxEntry(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
        setAlmanaxEntry(null);
        setAlmanaxError("Almanax indisponible pour le moment.");
      } finally {
        if (!controller.signal.aborted) {
          setIsAlmanaxLoading(false);
        }
      }
    }

    loadAlmanax();

    return () => {
      controller.abort();
    };
  }, [almanaxDate]);

  useEffect(() => {
    async function loadGuildStats() {
      const { data, error } = await supabase
        .from("guild_stats")
        .select("member_count")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      const memberCount = data?.member_count;

      if (typeof memberCount === "number" || typeof memberCount === "string") {
        setGuildMemberCount(String(memberCount));
      } else {
        setGuildMemberCount("0");
      }
    }

    loadGuildStats();
  }, []);

  useEffect(() => {
    async function loadHomepageDynamicContent() {
      const [
        announcementsResult,
        eventsResult,
        buildsResult,
        salesResult,
      ] = await Promise.all([
        supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("evenements")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("builds")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("ventes")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (announcementsResult.error) {
        console.error(announcementsResult.error);
      } else {
        setAnnouncements(
          (announcementsResult.data ?? []).map((item) => ({
            id: String(item.id),
            title: item.title,
            content: item.content,
            category: item.category || "Guilde",
            createdAt: item.created_at ?? item.updated_at ?? undefined,
          })),
        );
      }

      if (eventsResult.error) {
        console.error(eventsResult.error);
      } else {
        setEvents(
          (eventsResult.data ?? []).map((item) => ({
            id: String(item.id),
            title: item.title,
            date: item.date,
            description: item.description || "Détails à compléter.",
          })),
        );
      }

      if (buildsResult.error) {
        console.error(buildsResult.error);
      } else {
        setBuilds(
          (buildsResult.data ?? []).map((item) => ({
            id: String(item.id),
            title: item.title,
            className: item.class_name,
            mode: item.mode || "PvM",
            createdAt: item.created_at ?? item.updated_at ?? undefined,
          })),
        );
      }

      if (salesResult.error) {
        console.error(salesResult.error);
      } else {
        setSales(
          (salesResult.data ?? []).map((item) => ({
            id: String(item.id),
            itemName: item.item_name,
            quantity: item.quantity || "1",
            price: item.price,
            createdAt: item.created_at ?? item.updated_at ?? undefined,
          })),
        );
      }

      setIsDynamicContentLoaded(true);
    }

    loadHomepageDynamicContent();
  }, []);

  useEffect(() => {
    async function loadOnlineMembers() {
      const { data, error } = await supabase
        .from("online_members")
        .select("*")
        .order("display_name", { ascending: true });

      if (error) {
        console.error(error);
        setOnlineMembers([]);
        setIsOnlineMembersLoaded(true);
        return;
      }

      const members = (data ?? [])
        .filter((item) => {
          const status = String(item.status ?? "").trim().toLowerCase();

          return status !== "offline" && status !== "invisible";
        })
        .map((item) => ({
          discordId: String(item.discord_id ?? item.display_name ?? crypto.randomUUID()),
          avatarUrl:
            typeof item.avatar_url === "string" && item.avatar_url.trim()
              ? item.avatar_url.trim()
              : null,
          displayName:
            typeof item.display_name === "string" && item.display_name.trim()
              ? item.display_name.trim()
              : "Membre Discord",
          role: getPrimaryDiscordRole(item),
          status:
            typeof item.status === "string" && item.status.trim()
              ? item.status.trim()
              : "online",
          activityName:
            typeof item.activity_name === "string" && item.activity_name.trim()
              ? item.activity_name.trim()
              : null,
          activityType:
            typeof item.activity_type === "string" && item.activity_type.trim()
              ? item.activity_type.trim()
              : null,
        }));

      setOnlineMembers(members);
      setIsOnlineMembersLoaded(true);
    }

    loadOnlineMembers();
  }, []);

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase
        .from("galerie")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setIsGalleryLoaded(true);
        return;
      }

      setGalleryItemsState(
        (data ?? []).map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || "",
          category: item.category || "Guilde",
          image: item.image || "",
        })),
      );
      setIsGalleryLoaded(true);
    }

    loadGallery();
  }, []);

  const homepageAnnouncements = announcements.slice(0, 1);
  const homepageEvents = events.slice(0, 1);

  const recruitmentBadgeLabel = homepageSettings?.recruitmentIsOpen
    ? "RECRUTEMENT OUVERT"
    : "RECRUTEMENT FERME";
  const recentActivity: ActivityItem[] = [
    ...builds.slice(0, 2).map((build) => ({
      label: "Nouveau build ajouté",
      title: build.title,
      meta: `${build.className} · ${build.mode}`,
      type: "build" as const,
      timestamp: formatActivityDate(build.createdAt),
    })),
    ...sales.slice(0, 2).map((sale) => ({
      label: "Nouvelle vente ajoutée",
      title: sale.itemName,
      meta: `${sale.quantity}x · ${sale.price} kamas`,
      type: "sale" as const,
      timestamp: formatActivityDate(sale.createdAt),
    })),
    ...events.slice(0, 1).map((eventItem) => ({
      label: "Nouvel événement",
      title: eventItem.title,
      meta: eventItem.date,
      type: "event" as const,
    })),
    ...homepageAnnouncements.slice(0, 1).map((announcement) => ({
      label: "Nouvelle annonce",
      title: announcement.title,
      meta: announcement.category,
      type: "announcement" as const,
      timestamp: formatActivityDate(announcement.createdAt),
    })),
  ].slice(0, 6);
  const activityItems = recentActivity;
  const notificationItems = activityItems;
  const notificationKeys = notificationItems.map((activity, index) =>
    `${activity.type}:${activity.label}:${activity.title}:${activity.meta}:${activity.timestamp ?? index}`,
  );
  const unreadNotificationCount = isDynamicContentLoaded
    ? notificationKeys.filter((key) => !seenNotificationKeys.includes(key)).length
    : 0;
  const normalizedSearchQuery = normalizeSearchText(searchQuery.trim());
  const searchResults: SearchResult[] = normalizedSearchQuery
    ? [
        ...staticSearchItems.map((item) => ({
          id: `static-${item.href}`,
          title: item.title,
          meta: item.meta,
          href: item.href,
          type: "Page",
        })),
        ...sales.map((sale) => ({
          id: `sale-${sale.id}`,
          title: sale.itemName,
          meta: `${sale.quantity}x · ${sale.price} kamas`,
          href: "/services/ventes",
          type: "Vente",
        })),
        ...builds.map((build) => ({
          id: `build-${build.id}`,
          title: build.title,
          meta: `${build.className} · ${build.mode}`,
          href: "/stuffs-builds/encyclopedie",
          type: "Stuff / Build",
        })),
        ...announcements.map((announcement) => ({
          id: `announcement-${announcement.id}`,
          title: announcement.title,
          meta: announcement.category,
          href: "/annonces",
          type: "Annonce",
        })),
        ...events.map((eventItem) => ({
          id: `event-${eventItem.id}`,
          title: eventItem.title,
          meta: eventItem.date,
          href: "/evenements",
          type: "Évènement",
        })),
      ]
        .filter((item) =>
          normalizeSearchText(`${item.title} ${item.meta} ${item.type}`).includes(normalizedSearchQuery),
        )
        .slice(0, 8)
    : [];
  const galleryItems = galleryItemsState.slice(0, 4);
  const activeMobileSection = navItems.find(
    (item) => item.children?.length && openSections[item.label],
  );
  const eventsByDate = events.reduce<Record<string, EventItem[]>>(
    (accumulator, eventItem) => {
      const eventDate = parseEventDate(eventItem.date);

      if (!eventDate) {
        return accumulator;
      }

      const dateKey = formatDateKey(eventDate);
      accumulator[dateKey] = [...(accumulator[dateKey] ?? []), eventItem];

      return accumulator;
    },
    {},
  );
  const calendarDays = buildCalendarDays(calendarMonth);
  const selectedDateEvents = eventsByDate[selectedCalendarDate] ?? [];
  const selectedDate = new Date(`${selectedCalendarDate}T00:00:00`);
  const selectedDateLabel = selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const isDiscordBusy = isDiscordAuthLoading || isDiscordSubmitting;
  const discordButtonLabel = isDiscordBusy
    ? "Connexion..."
    : discordProfile
      ? "Compte Discord lié"
      : "Lier avec Discord";
  const discordSupportHref =
    homepageSettings?.heroButtonLink?.trim() || "https://discord.com/channels/@me";
  const linkedDiscordRole =
    discordProfile?.role ||
    onlineMembers.find((member) => member.discordId === discordProfile?.discordId)?.role ||
    "Membre";
  async function handleDiscordOAuth() {
    if (discordProfile) {
      return;
    }

    setDiscordAuthError(null);
    setIsDiscordSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${getSiteUrl()}/auth/callback?next=/`,
      },
    });

    if (error) {
      setDiscordAuthError("Connexion Discord impossible.");
      setIsDiscordSubmitting(false);
      console.error(error);
    }
  }

  function handleNotificationsToggle() {
    const nextOpenState = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpenState);
    setIsProfileMenuOpen(false);

    if (!nextOpenState) {
      return;
    }

    setSeenNotificationKeys(notificationKeys);
    window.localStorage.setItem(
      "lunaeria-seen-notifications",
      JSON.stringify(notificationKeys),
    );
  }

  async function handleDiscordSignOut() {
    setDiscordAuthError(null);
    setIsDiscordSubmitting(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setDiscordAuthError("Déconnexion impossible.");
      console.error(error);
    } else {
      setDiscordProfile(null);
      setIsProfileMenuOpen(false);
    }

    setIsDiscordSubmitting(false);
  }

  void guildMemberCount;
  function renderHomepageLayoutBlock(blockKey: HomepageLayoutBlockKey) {
    switch (blockKey) {
      case "events":
        return (
          <PremiumCard
            title="Prochains events"
            icon={CalendarDays}
            className="h-full"
          >
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[150px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && events.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 md:col-span-2 xl:col-span-3">
                  Aucun événement planifié.
                </div>
              ) : null}
              {isDynamicContentLoaded ? homepageEvents.map((eventItem, index) => {
                const Icon = eventIcons[index % eventIcons.length];
                const isLongEvent =
                  eventItem.description.trim().length > 170 ||
                  eventItem.description.includes("\n");

                return (
                  <div
                    key={eventItem.id}
                    className="flex min-h-[12rem] items-start gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)] sm:gap-4"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                      <Icon size={19} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col self-stretch">
                      <p className="font-black leading-5 text-violet-50">
                        {eventItem.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {eventItem.date}
                      </p>
                      <p className="mt-1 overflow-hidden text-xs leading-5 text-slate-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                        {eventItem.description}
                      </p>
                      {isLongEvent ? (
                        <button
                          className="mt-auto pt-4 text-left text-xs font-black uppercase tracking-[0.16em] text-violet-200 transition hover:text-violet-50"
                          onClick={() => setSelectedEvent(eventItem)}
                          type="button"
                        >
                          Lire la suite →
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              }) : null}
              <NextLink
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-violet-200/12 bg-violet-50/[0.045] px-4 text-xs font-black uppercase tracking-[0.13em] text-violet-100 transition hover:border-violet-200/24 hover:bg-violet-200/[0.08] md:col-span-2 xl:col-span-3"
                href="/evenements"
              >
                Voir tous les événements
              </NextLink>
            </div>
          </PremiumCard>
        );

      case "online":
        return (
          <PremiumCard
            title="Membres en ligne"
            icon={Users}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="homepage-layout-scroll min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {!isOnlineMembersLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[66px]" key={item} />
                  ))
                : null}
              {isOnlineMembersLoaded && onlineMembers.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65">
                  Aucun membre en ligne pour le moment.
                </div>
              ) : null}
              {isOnlineMembersLoaded
                ? onlineMembers.slice(0, 4).map((member) => {
                    const activityLabel = formatOnlineMemberActivity(member);

                    return (
                      <div
                        key={member.discordId}
                        className="flex min-h-[4.65rem] items-center gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-3.5 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)]"
                      >
                        {member.avatarUrl ? (
                          <div
                            aria-hidden="true"
                            className="size-10 shrink-0 rounded-xl border border-violet-100/14 bg-violet-200/10 shadow-[0_0_12px_rgba(124,58,237,0.11)]"
                            style={{
                              backgroundImage: `url(${member.avatarUrl})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          />
                        ) : (
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100/14 bg-gradient-to-br from-violet-200 to-indigo-300 text-sm font-black text-[#09071a] shadow-[0_0_12px_rgba(124,58,237,0.11)]">
                            {member.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-violet-50">
                            {member.displayName}
                          </p>
                          {activityLabel ? (
                            <p className="truncate text-xs text-slate-400">
                              {activityLabel}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 rounded-full border border-violet-100/10 bg-violet-200/7 px-3 py-1 text-xs font-bold text-violet-100 shadow-[0_0_8px_rgba(124,58,237,0.055)]">
                          {formatOnlineStatus(member.status)}
                        </span>
                      </div>
                    );
                  })
                : null}
            </div>
          </PremiumCard>
        );

      case "announcements":
        return (
          <PremiumCard
            title="Dernières annonces"
            icon={Bell}
            className="h-full"
          >
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[190px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && homepageAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 md:col-span-2 xl:col-span-3">
                  Aucune annonce publiée pour le moment.
                </div>
              ) : null}
              {isDynamicContentLoaded ? homepageAnnouncements.map((item) => {
                const isLongAnnouncement =
                  item.content.trim().length > 170 || item.content.includes("\n");

                return (
                  <article
                    key={item.id}
                    className="flex min-h-[12rem] flex-col rounded-2xl border border-violet-100/8 bg-violet-50/[0.036] p-5 shadow-[inset_0_0_13px_rgba(196,181,253,0.024),0_14px_32px_rgba(0,0,0,0.24)] transition duration-300 hover:border-violet-200/16 hover:bg-violet-200/[0.055] hover:shadow-[inset_0_0_15px_rgba(196,181,253,0.032),0_0_13px_rgba(109,40,217,0.06)]"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                      {item.category}
                    </span>
                    <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-violet-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 overflow-hidden text-sm leading-6 text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                      {item.content}
                    </p>
                    {isLongAnnouncement ? (
                      <button
                        className="mt-auto pt-4 text-left text-xs font-black uppercase tracking-[0.16em] text-violet-200 transition hover:text-violet-50"
                        onClick={() => setSelectedAnnouncement(item)}
                        type="button"
                      >
                        Lire la suite
                      </button>
                    ) : null}
                  </article>
                );
              }) : null}
              <NextLink
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-violet-200/12 bg-violet-50/[0.045] px-4 text-xs font-black uppercase tracking-[0.13em] text-violet-100 transition hover:border-violet-200/24 hover:bg-violet-200/[0.08] md:col-span-2 xl:col-span-3"
                href="/annonces"
              >
                Voir toutes les annonces
              </NextLink>
            </div>
          </PremiumCard>
        );

      case "activity":
        return (
          <PremiumCard
            title="Activité récente"
            icon={Layers3}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="homepage-layout-scroll min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[104px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && activityItems.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65">
                  Aucune activité récente.
                </div>
              ) : null}
              {isDynamicContentLoaded ? activityItems.slice(0, 3).map((activity, index) => {
                const ActivityIcon = activityIcons[activity.type];

                return (
                  <div
                    className="flex min-h-[6.1rem] items-center gap-4 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052]"
                    key={`${activity.label}-${activity.title}-${index}`}
                  >
                    <div className="grid size-10 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                      <ActivityIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                        {activity.label}
                      </p>
                      <p className="mt-1 truncate font-black text-violet-50">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {activity.meta}
                      </p>
                      {activity.timestamp ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Ajouté le {activity.timestamp}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              }) : null}
            </div>
          </PremiumCard>
        );

      case "almanax":
        return (
          <section className="homepage-almanax-shell flex h-full min-h-0 flex-col overflow-hidden">
            <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl border border-violet-100/18 bg-[linear-gradient(145deg,rgba(216,180,254,0.18),rgba(109,40,217,0.08))] text-violet-100 shadow-[inset_0_1px_12px_rgba(237,233,254,0.07),0_0_18px_rgba(139,92,246,0.18)]">
                  <CalendarDays size={19} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-violet-100">
                  Almanax Lunaeria
                </h2>
              </div>
              <ChevronRight
                className="text-violet-100/65"
                size={18}
              />
            </div>
            <div className="homepage-layout-scroll min-h-0 flex-1 overflow-y-auto rounded-2xl border border-violet-100/12 bg-[#070414]/76 p-5 shadow-[0_24px_74px_rgba(0,0,0,0.54),0_0_32px_rgba(124,58,237,0.14),inset_0_1px_0_rgba(237,233,254,0.08)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-violet-200/12 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                  {almanaxEntry?.tribute?.item?.image_urls?.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={almanaxEntry?.tribute?.item?.name ?? "Offrande Almanax"}
                      className="size-14 object-contain"
                      src={almanaxEntry?.tribute?.item?.image_urls?.icon}
                    />
                  ) : (
                    <Sparkles size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">
                    {formatAlmanaxDate(almanaxEntry?.date ?? almanaxDate)}
                  </p>
                  <p className="mt-2 text-sm font-black leading-5 text-violet-50">
                    {isAlmanaxLoading
                      ? "Chargement du bonus..."
                      : almanaxEntry?.bonus?.type?.name ?? "Bonus du jour"}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                    Bonus
                  </p>
                  <p className="mt-2 overflow-hidden leading-5 text-violet-50/76 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                    {isAlmanaxLoading
                      ? "Récupération des données Almanax."
                      : almanaxEntry?.bonus?.description ?? almanaxError ?? "Bonus non disponible."}
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                      Offrande
                    </p>
                    <p className="mt-1 overflow-hidden text-sm font-black leading-5 text-violet-50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {almanaxEntry?.tribute
                        ? `${almanaxEntry?.tribute?.quantity ?? 1} x ${
                            almanaxEntry?.tribute?.item?.name ?? "Objet requis"
                          }`
                        : isAlmanaxLoading
                          ? "Chargement..."
                          : "Non disponible"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                      Récompense
                    </p>
                    <p className="mt-1 text-sm font-black leading-5 text-violet-50">
                      {typeof almanaxEntry?.reward_kamas === "number"
                        ? `${kamasFormatter.format(almanaxEntry?.reward_kamas ?? 0)} kamas`
                        : isAlmanaxLoading
                          ? "Chargement..."
                          : "Non disponible"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/12 bg-violet-50/[0.045] px-3 text-xs font-black uppercase tracking-[0.11em] text-violet-100 transition hover:border-violet-200/22 hover:bg-violet-200/[0.08] disabled:cursor-wait disabled:opacity-60"
                  disabled={isAlmanaxLoading}
                  onClick={() => setAlmanaxDate((current) => shiftDateKey(current, -1))}
                  type="button"
                >
                  <ChevronLeft size={17} />
                  Précédent
                </button>
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/12 bg-[#b9a7ea] px-3 text-xs font-black uppercase tracking-[0.11em] text-[#09071a] transition hover:bg-[#c9b9f2] disabled:cursor-wait disabled:opacity-70"
                  disabled={isAlmanaxLoading}
                  onClick={() => setAlmanaxDate((current) => shiftDateKey(current, 1))}
                  type="button"
                >
                  Suivant
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>
        );

      case "discordBoost":
        return (
          <PremiumCard
            title="Soutenir Lunaeria"
            icon={Sparkles}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="flex h-full min-h-0 flex-col justify-between rounded-2xl border border-violet-200/11 bg-[linear-gradient(145deg,rgba(196,181,253,0.085),rgba(76,29,149,0.065))] p-5 shadow-[inset_0_0_18px_rgba(196,181,253,0.04),0_0_13px_rgba(76,29,149,0.055)]">
              <div>
                <p className="text-sm font-black leading-5 text-violet-50">
                  Aide le Discord Lunaeria à rester actif, visible et accueillant.
                </p>
                <p className="mt-3 text-xs leading-5 text-violet-100/62">
                  Un boost soutient la communauté et accompagne les prochains projets de guilde.
                </p>
              </div>
              <NextLink
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-violet-200/12 bg-[#b9a7ea] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#09071a] transition hover:bg-[#c9b9f2]"
                href={discordSupportHref}
              >
                Booster le Discord
              </NextLink>
            </div>
          </PremiumCard>
        );

      case "guildGoals":
        return (
          <PremiumCard
            title={homepageSettings?.guildObjectiveTitle || homepageSettingsFallback.guildObjectiveTitle}
            icon={ShieldCheck}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="flex h-full min-h-0 flex-col justify-between rounded-2xl border border-violet-200/11 bg-[linear-gradient(145deg,rgba(196,181,253,0.085),rgba(76,29,149,0.065))] p-5 shadow-[inset_0_0_18px_rgba(196,181,253,0.04),0_0_13px_rgba(76,29,149,0.055)]">
              <div>
                <p className="text-sm leading-6 text-violet-50/78">
                  {homepageSettings?.guildObjectiveText || homepageSettingsFallback.guildObjectiveText}
                </p>
              </div>
              <span className="mt-5 inline-flex w-fit rounded-full border border-violet-100/14 bg-violet-100/[0.055] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-100">
                {homepageSettings?.guildObjectiveProgress || homepageSettingsFallback.guildObjectiveProgress}
              </span>
            </div>
          </PremiumCard>
        );

      case "gallery":
        return (
          <PremiumCard
            title="Galerie"
            icon={Images}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div className="homepage-layout-scroll grid min-h-0 flex-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-4">
              {!isGalleryLoaded
                ? [0, 1, 2, 3].map((item) => (
                    <div
                      aria-hidden="true"
                      className="min-h-44 rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] shadow-[0_22px_54px_rgba(0,0,0,0.28)]"
                      key={item}
                    />
                  ))
                : null}
              {isGalleryLoaded && galleryItems.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 sm:col-span-2 xl:col-span-4">
                  Aucune image publiée pour le moment.
                </div>
              ) : null}
              {isGalleryLoaded ? galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group/gallery relative min-h-44 overflow-hidden rounded-2xl border border-violet-100/8 bg-slate-950 shadow-[0_22px_54px_rgba(0,0,0,0.38)]"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={item.title}
                      className="absolute inset-0 size-full object-cover transition duration-700 group-hover/gallery:scale-110"
                      src={item.image}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 ${galleryPlaceholder(index)} transition duration-700 group-hover/gallery:scale-110`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                  <div className="absolute inset-0 opacity-0 shadow-[inset_0_0_26px_rgba(196,181,253,0.075)] transition duration-500 group-hover/gallery:opacity-100" />
                  <div className="absolute left-4 top-4 rounded-full border border-violet-100/12 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-violet-100 backdrop-blur-sm">
                    {item.category}
                  </div>
                  <div className="absolute bottom-0 p-4">
                    <p className="text-sm font-black text-violet-50">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  {item.image ? (
                    <button
                      aria-label={`Ouvrir ${item.title}`}
                      className="absolute inset-0"
                      onClick={() => setSelectedGalleryItem(item)}
                      type="button"
                    />
                  ) : null}
                </div>
              )) : null}
            </div>
          </PremiumCard>
        );

      default:
        return null;
    }
  }

  return (
    <main className="home-reference-page min-h-screen overflow-x-hidden bg-[#030512] text-slate-100">
      <style jsx global>{`
        .mobile-menu-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mobile-menu-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .lunae-scrollbar {
          scrollbar-color: rgba(196, 181, 253, 0.2) rgba(15, 23, 42, 0.16);
          scrollbar-width: thin;
        }

        .lunae-scrollbar::-webkit-scrollbar {
          width: 7px;
        }

        .lunae-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.16);
          border-radius: 999px;
        }

        .lunae-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(196, 181, 253, 0.2);
          border-radius: 999px;
        }

        .lunae-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(196, 181, 253, 0.3);
        }

        .sidebar-premium::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background:
            radial-gradient(circle at 50% 0%, rgba(167, 139, 250, 0.08), transparent 34%),
            radial-gradient(circle at 15% 32%, rgba(99, 102, 241, 0.045), transparent 28%),
            radial-gradient(circle at 85% 72%, rgba(168, 85, 247, 0.04), transparent 30%);
          animation: sidebarAuraDrift 16s ease-in-out infinite alternate;
        }

        @keyframes sidebarAuraDrift {
          from {
            transform: translate3d(0, -8px, 0) scale(1);
            opacity: 0.25;
          }

          to {
            transform: translate3d(0, 10px, 0) scale(1.035);
            opacity: 0.42;
          }
        }
      `}</style>
      <aside className="home-sidebar sidebar-shell sidebar-premium fixed left-0 top-0 z-[9999] flex h-24 w-full flex-row items-center gap-2.5 overflow-visible border-b border-violet-200/8 bg-[#050513]/96 px-3 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.44),0_0_20px_rgba(76,29,149,0.05)] backdrop-blur-md lg:h-screen lg:w-60 lg:flex-col lg:items-stretch lg:overflow-visible lg:border-b-0 lg:border-r lg:px-4 lg:py-3 lg:shadow-[18px_0_58px_rgba(0,0,0,0.52),0_0_18px_rgba(76,29,149,0.055)]">
        <div className="relative z-10 flex w-16 shrink-0 items-center justify-center py-0 lg:mb-2 lg:w-full">
          <img
            src="/newlogo.png"
            alt="Lunaeria"
            className="relative z-10 w-full max-w-none object-contain drop-shadow-[0_0_10px_rgba(167,139,250,0.14)] lg:w-[112%]"
          />
        </div>

        <div className="relative z-10 mx-auto mb-3 hidden h-px w-4/5 overflow-hidden rounded-full bg-gradient-to-r from-transparent via-violet-200/18 to-transparent shadow-[0_0_10px_rgba(167,139,250,0.12)] lg:block" />

        <nav className="mobile-menu-scrollbar relative z-[10000] flex min-w-0 flex-1 snap-x flex-row gap-2 overflow-x-auto overflow-y-visible px-1 pb-1 pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:min-w-0 lg:snap-none lg:flex-col lg:gap-1 lg:overflow-visible lg:p-0 lg:pr-0">
          {navItems.map((item) => (
            <SidebarNavItem
              item={item}
              key={item.label}
              onToggle={() =>
                setOpenSections((current) => {
                  const nextOpenState = !current[item.label];

                  return navItems.reduce<Record<string, boolean>>((sections, navItem) => {
                    sections[navItem.label] = navItem.label === item.label ? nextOpenState : false;
                    return sections;
                  }, {});
                })
              }
              open={Boolean(openSections[item.label])}
              pathname={pathname}
            />
          ))}
        </nav>

        {activeMobileSection ? (
          <div className="fixed left-3 right-3 top-[7.75rem] z-[99999] max-h-[calc(100svh-8.75rem)] overflow-y-auto overscroll-contain rounded-[1.35rem] border border-violet-200/12 bg-[#050719]/98 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-md lg:hidden">
            <NavChildrenList pathname={pathname}>
              {activeMobileSection.children}
            </NavChildrenList>
          </div>
        ) : null}

        <div className="relative z-10 hidden rounded-xl border border-violet-200/8 bg-violet-100/[0.035] p-3 text-xs text-violet-100/76 shadow-[inset_0_0_12px_rgba(196,181,253,0.025)] lg:block">
          <p className="font-semibold tracking-wide text-violet-50/90">
  Développement & Design
</p>

<p className="mt-1 text-[11px] leading-4 text-cyan-100/60">
   <span className="font-semibold text-violet-200/90">BY AZELYA</span>
</p>
        </div>
      </aside>

      <div className="home-content min-h-screen max-w-full p-3 pt-[7.25rem] sm:p-5 sm:pt-[7.5rem] lg:ml-60 lg:max-w-none lg:p-5">
        <div className="home-userbar">
          <div className="home-search" role="search">
            <Search size={17} />
            <input
              aria-label="Rechercher"
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsNotificationsOpen(false);
                setIsProfileMenuOpen(false);
              }}
              placeholder="Rechercher un objet, un membre..."
              type="search"
              value={searchQuery}
            />
            {normalizedSearchQuery ? (
              <div className="home-dropdown home-search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <NextLink
                      className="home-search-result"
                      href={result.href}
                      key={result.id}
                      onClick={() => setSearchQuery("")}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-violet-50">
                          {result.title}
                        </span>
                        <span className="mt-1 block truncate text-xs font-semibold text-violet-100/58">
                          {result.meta}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full border border-violet-200/14 bg-violet-200/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-violet-100/75">
                        {result.type}
                      </span>
                    </NextLink>
                  ))
                ) : (
                  <div className="rounded-xl border border-violet-100/10 bg-violet-50/[0.045] p-3 text-sm font-semibold text-violet-100/72">
                    Aucun résultat trouvé.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="home-userbar-popover">
            <button
              aria-label="Notifications"
              className="home-icon-button"
              onClick={handleNotificationsToggle}
              type="button"
            >
              <Bell size={18} />
              {unreadNotificationCount > 0 ? (
                <span className="home-notification-badge">
                  {unreadNotificationCount}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="home-dropdown home-notifications-panel">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-100">
                    Notifications
                  </p>
                  <span className="rounded-full border border-violet-200/14 bg-violet-200/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-violet-100/75">
                    Consultées
                  </span>
                </div>
                <div className="space-y-2">
                  {isDynamicContentLoaded && notificationItems.length === 0 ? (
                    <div className="rounded-xl border border-violet-100/10 bg-violet-50/[0.045] p-3 text-sm font-semibold text-violet-100/72">
                      Aucune nouvelle notification.
                    </div>
                  ) : null}
                  {!isDynamicContentLoaded ? (
                    <div className="rounded-xl border border-violet-100/10 bg-violet-50/[0.045] p-3 text-sm font-semibold text-violet-100/72">
                      Chargement des notifications...
                    </div>
                  ) : null}
                  {isDynamicContentLoaded
                    ? notificationItems.map((activity, index) => {
                        const ActivityIcon = activityIcons[activity.type];

                        return (
                          <div
                            className="flex items-start gap-3 rounded-xl border border-violet-100/10 bg-violet-50/[0.045] p-3"
                            key={`${activity.label}-${activity.title}-${index}`}
                          >
                            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-violet-200/12 bg-violet-300/10 text-violet-100">
                              <ActivityIcon size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-200">
                                {activity.label}
                              </p>
                              <p className="mt-1 truncate text-sm font-black text-violet-50">
                                {activity.title}
                              </p>
                              <p className="mt-1 text-xs text-violet-100/58">
                                {activity.meta}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="home-userbar-popover">
            <button
              className="home-profile-button"
              onClick={() => {
                if (!discordProfile) {
                  void handleDiscordOAuth();
                  return;
                }

                setIsProfileMenuOpen((current) => !current);
                setIsNotificationsOpen(false);
              }}
              type="button"
            >
              {discordProfile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={discordProfile.displayName}
                  className="size-10 rounded-xl object-cover"
                  src={discordProfile.avatar}
                />
              ) : (
                <div className="grid size-10 place-items-center rounded-xl border border-violet-200/14 bg-violet-300/10 text-violet-100">
                  <Users size={17} />
                </div>
              )}
              <span className="min-w-0 text-left">
                <span className="block truncate text-sm font-black text-violet-50">
                  {discordProfile?.displayName ?? "Non connecté"}
                </span>
                <span className="block text-xs font-bold text-violet-100/60">
                  {discordProfile ? linkedDiscordRole : "Lier Discord"}
                </span>
              </span>
              <ChevronDown size={16} />
            </button>

            {isProfileMenuOpen && discordProfile ? (
              <div className="home-dropdown home-profile-menu">
  <NextLink
    className="mb-2 flex w-full items-center gap-2 rounded-xl border border-violet-100/10 bg-violet-50/[0.045] px-3 py-2 text-left text-sm font-black text-violet-50 transition hover:border-violet-200/20 hover:bg-violet-200/[0.08]"
    href="/profil"
    onClick={() => setIsProfileMenuOpen(false)}
  >
    <Users size={15} />
    Profil
  </NextLink>

  <button
    className="flex w-full items-center gap-2 rounded-xl border border-violet-100/10 bg-violet-50/[0.045] px-3 py-2 text-left text-sm font-black text-violet-50 transition hover:border-violet-200/20 hover:bg-violet-200/[0.08]"
    disabled={isDiscordSubmitting}
    onClick={handleDiscordSignOut}
    type="button"
  >
    <LogOut size={15} />
    Déconnexion
  </button>
</div>
            ) : null}
          </div>
        </div>

        <section className="home-free-hero">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/18 bg-violet-950/35 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-100 shadow-[0_0_18px_rgba(168,85,247,0.18)] backdrop-blur-sm">
                <Sparkles size={14} /> Dofus 3
              </span>
              <span className="rounded-full border border-violet-100/14 bg-violet-950/28 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-50/90 shadow-[0_0_14px_rgba(168,85,247,0.14)] backdrop-blur-sm">
                Portail Lunaeria
              </span>
              <span className="inline-flex min-w-[12.5rem] justify-center rounded-full border border-violet-100/14 bg-violet-950/28 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-50/90 shadow-[0_0_14px_rgba(168,85,247,0.14)] backdrop-blur-sm">
                {recruitmentBadgeLabel}
              </span>
            </div>

            {homepageSettings ? (
              <>
                <h1 className="legend-title max-w-full break-words bg-[linear-gradient(180deg,#ffffff_0%,#efe7ff_30%,#c7b8ff_64%,#8b5cf6_100%)] bg-clip-text text-[clamp(2.35rem,10vw,5.75rem)] font-black tracking-[0.14em] text-transparent sm:tracking-[0.2em]">
                  {homepageSettings.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/90 drop-shadow-[0_2px_16px_rgba(0,0,0,0.86)] sm:text-lg">
                  {homepageSettings.heroSubtitle}
                </p>
                {homepageSettings.recruitmentMessage ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100/82 drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
                    {homepageSettings.recruitmentMessage}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="space-y-4" aria-hidden="true">
                <div className="h-16 w-72 max-w-full rounded-2xl bg-violet-100/[0.055]" />
                <div className="h-5 w-96 max-w-full rounded-full bg-violet-100/[0.04]" />
              </div>
            )}

            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              {homepageSettings ? (
                <div className="w-full sm:w-auto">
                  <button
                    aria-busy={isDiscordBusy}
                    className="discord-cta inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-violet-50/42 bg-[linear-gradient(135deg,#ffffff_0%,#eadfff_28%,#c7b6ff_58%,#8b5cf6_100%)] px-5 text-center text-sm font-black uppercase tracking-[0.14em] text-[#080619] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-12px_20px_rgba(76,29,149,0.18),0_18px_42px_rgba(76,29,149,0.36),0_0_42px_rgba(196,181,253,0.42)] transition duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:border-white/70 hover:brightness-110 disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:px-7"
                    disabled={isDiscordBusy}
                    onClick={handleDiscordOAuth}
                    type="button"
                  >
                    {discordButtonLabel}
                  </button>
                  {discordAuthError && !discordProfile ? (
                    <p className="mt-3 max-w-sm text-xs font-semibold text-rose-100/78">
                      {discordAuthError}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="h-13 w-full rounded-2xl bg-violet-100/[0.055] sm:w-56" aria-hidden="true" />
              )}
              <button
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-violet-100/28 bg-violet-950/45 px-5 text-center text-sm font-black uppercase tracking-[0.14em] text-violet-50 shadow-[inset_0_1px_0_rgba(237,233,254,0.12),0_16px_34px_rgba(0,0,0,0.36),0_0_28px_rgba(124,58,237,0.18)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-violet-50/42 hover:bg-violet-100/[0.09] sm:w-auto sm:px-7"
                onClick={() => setIsCalendarOpen(true)}
                type="button"
              >
                <CalendarDays size={18} /> Voir le calendrier
              </button>
            </div>
          </div>
        </section>

        <section className="home-dashboard homepage-fixed-layout">
          <div className="homepage-fixed-card homepage-fixed-card--announcements">
            {renderHomepageLayoutBlock("announcements")}
          </div>

          <div className="homepage-fixed-card homepage-fixed-card--events">
            {renderHomepageLayoutBlock("events")}
          </div>

          <div className="homepage-fixed-split">
            <div className="homepage-fixed-card homepage-fixed-card--split">
              {renderHomepageLayoutBlock("almanax")}
            </div>
            <div className="homepage-fixed-card homepage-fixed-card--split homepage-fixed-card--support">
              {renderHomepageLayoutBlock("discordBoost")}
            </div>
            <div className="homepage-fixed-card homepage-fixed-card--split homepage-fixed-card--goals">
              {renderHomepageLayoutBlock("guildGoals")}
            </div>
          </div>

        </section>

        {false ? (
          <>
        <section className="mt-6 grid items-start gap-6 xl:grid-cols-3">
          <PremiumCard
            title="Prochains events"
            icon={CalendarDays}
            className="xl:col-span-2"
          >
            <div className="space-y-3">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[86px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && events.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65">
                  Aucun événement planifié.
                </div>
              ) : null}
              {isDynamicContentLoaded ? events.map((eventItem, index) => {
                const Icon = eventIcons[index % eventIcons.length];
                const isLongEvent =
                  eventItem.description.trim().length > 170 ||
                  eventItem.description.includes("\n");

                return (
                  <div
                    key={eventItem.id}
                    className="flex max-h-60 min-h-40 items-start gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)] sm:gap-4"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                      <Icon size={19} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col self-stretch">
                      <p className="line-clamp-2 font-black leading-5 text-violet-50">
                        {eventItem.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {eventItem.date}
                      </p>
                      <p className="mt-1 overflow-hidden text-xs leading-5 text-slate-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                        {eventItem.description}
                      </p>
                      {isLongEvent ? (
                        <button
                          className="mt-auto pt-4 text-left text-xs font-black uppercase tracking-[0.16em] text-violet-200 transition hover:text-violet-50"
                          onClick={() => setSelectedEvent(eventItem)}
                          type="button"
                        >
                          Lire la suite →
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              }) : null}
            </div>
          </PremiumCard>

          <PremiumCard
            title="Membres en ligne"
            icon={Users}
            className="min-h-[31rem]"
          >
            <div className="lunae-scrollbar min-h-[24.5rem] max-h-[28rem] space-y-3 overflow-y-auto pr-1 sm:min-h-[26.5rem] sm:max-h-[30rem]">
              {!isOnlineMembersLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[66px]" key={item} />
                  ))
                : null}
              {isOnlineMembersLoaded && onlineMembers.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65">
                  Aucun membre en ligne pour le moment.
                </div>
              ) : null}
              {isOnlineMembersLoaded
                ? onlineMembers.map((member) => {
                    const activityLabel = formatOnlineMemberActivity(member);

                    return (
                      <div
                        key={member.discordId}
                        className="flex min-h-[4.65rem] items-center gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-3.5 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)]"
                      >
                        {member.avatarUrl ? (
                          <div
                            aria-hidden="true"
                            className="size-10 shrink-0 rounded-xl border border-violet-100/14 bg-violet-200/10 shadow-[0_0_12px_rgba(124,58,237,0.11)]"
                            style={{
                              backgroundImage: `url(${member.avatarUrl})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          />
                        ) : (
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-100/14 bg-gradient-to-br from-violet-200 to-indigo-300 text-sm font-black text-[#09071a] shadow-[0_0_12px_rgba(124,58,237,0.11)]">
                            {member.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-violet-50">
                            {member.displayName}
                          </p>
                          {activityLabel ? (
                            <p className="truncate text-xs text-slate-400">
                              {activityLabel}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 rounded-full border border-violet-100/10 bg-violet-200/7 px-3 py-1 text-xs font-bold text-violet-100 shadow-[0_0_8px_rgba(124,58,237,0.055)]">
                          {formatOnlineStatus(member.status)}
                        </span>
                      </div>
                    );
                  })
                : null}
            </div>
          </PremiumCard>
        </section>

        <section className="mt-6 grid items-start gap-6 xl:grid-cols-5">
          <PremiumCard
            title="Dernières annonces"
            icon={Bell}
            className="min-h-[31rem] xl:col-span-2"
          >
            <div className="grid min-h-[26rem] items-start gap-4 md:grid-cols-2">
              {!isDynamicContentLoaded
                ? [0, 1].map((item) => (
                    <ContentSkeleton className="min-h-[190px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && homepageAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 md:col-span-2">
                  Aucune annonce publiée pour le moment.
                </div>
              ) : null}
              {isDynamicContentLoaded ? homepageAnnouncements.map((item) => {
                const isLongAnnouncement =
                  item.content.trim().length > 170 || item.content.includes("\n");

                return (
                  <article
                    key={item.id}
                    className="flex max-h-72 min-h-[13rem] flex-col rounded-2xl border border-violet-100/8 bg-violet-50/[0.036] p-5 shadow-[inset_0_0_13px_rgba(196,181,253,0.024),0_14px_32px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/16 hover:bg-violet-200/[0.055] hover:shadow-[inset_0_0_15px_rgba(196,181,253,0.032),0_0_13px_rgba(109,40,217,0.06)]"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                      {item.category}
                    </span>
                    <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 text-violet-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 overflow-hidden text-sm leading-6 text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                      {item.content}
                    </p>
                    {isLongAnnouncement ? (
                      <button
                        className="mt-auto pt-4 text-left text-xs font-black uppercase tracking-[0.16em] text-violet-200 transition hover:text-violet-50"
                        onClick={() => setSelectedAnnouncement(item)}
                        type="button"
                      >
                        Lire la suite
                      </button>
                    ) : null}
                  </article>
                );
              }) : null}
            </div>
          </PremiumCard>

          <PremiumCard
            title="Activité récente"
            icon={Layers3}
            className="min-h-[31rem] xl:col-span-2"
          >
            <div className="min-h-[26rem] space-y-4">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[104px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && activityItems.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65">
                  Aucune activité récente.
                </div>
              ) : null}
              {isDynamicContentLoaded ? activityItems.map((activity, index) => {
                const ActivityIcon = activityIcons[activity.type];

                return (
                  <div
                    className="flex min-h-[6.1rem] items-center gap-4 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052]"
                    key={`${activity.label}-${activity.title}-${index}`}
                  >
                    <div className="grid size-10 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                      <ActivityIcon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                        {activity.label}
                      </p>
                      <p className="mt-1 truncate font-black text-violet-50">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {activity.meta}
                      </p>
                      {activity.timestamp ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Ajouté le {activity.timestamp}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              }) : null}
            </div>
          </PremiumCard>

          <PremiumCard title="Almanax Lunaeria" icon={CalendarDays}>
            <div className="rounded-2xl border border-violet-200/11 bg-[linear-gradient(145deg,rgba(196,181,253,0.085),rgba(76,29,149,0.065))] p-5 shadow-[inset_0_0_18px_rgba(196,181,253,0.04),0_0_13px_rgba(76,29,149,0.055)]">
              <div className="flex items-start gap-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-violet-200/12 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                  {almanaxEntry?.tribute?.item?.image_urls?.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={almanaxEntry?.tribute?.item?.name ?? "Offrande Almanax"}
                      className="size-14 object-contain"
                      src={almanaxEntry?.tribute?.item?.image_urls?.icon}
                    />
                  ) : (
                    <Sparkles size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-200">
                    {formatAlmanaxDate(almanaxEntry?.date ?? almanaxDate)}
                  </p>
                  <p className="mt-2 text-sm font-black leading-5 text-violet-50">
                    {isAlmanaxLoading
                      ? "Chargement du bonus..."
                      : almanaxEntry?.bonus?.type?.name ?? "Bonus du jour"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                    Bonus
                  </p>
                  <p className="mt-2 overflow-hidden leading-5 text-violet-50/76 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                    {isAlmanaxLoading
                      ? "Récupération des données Almanax."
                      : almanaxEntry?.bonus?.description ?? almanaxError ?? "Bonus non disponible."}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                      Offrande
                    </p>
                    <p className="mt-1 overflow-hidden text-sm font-black leading-5 text-violet-50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {almanaxEntry?.tribute
                        ? `${almanaxEntry?.tribute?.quantity ?? 1} x ${
                            almanaxEntry?.tribute?.item?.name ?? "Objet requis"
                          }`
                        : isAlmanaxLoading
                          ? "Chargement..."
                          : "Non disponible"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-violet-200/80">
                      Récompense
                    </p>
                    <p className="mt-1 text-sm font-black leading-5 text-violet-50">
                      {typeof almanaxEntry?.reward_kamas === "number"
                        ? `${kamasFormatter.format(almanaxEntry?.reward_kamas ?? 0)} kamas`
                        : isAlmanaxLoading
                          ? "Chargement..."
                          : "Non disponible"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/12 bg-violet-50/[0.045] px-3 text-xs font-black uppercase tracking-[0.11em] text-violet-100 transition hover:border-violet-200/22 hover:bg-violet-200/[0.08] disabled:cursor-wait disabled:opacity-60"
                  disabled={isAlmanaxLoading}
                  onClick={() => setAlmanaxDate((current) => shiftDateKey(current, -1))}
                  type="button"
                >
                  <ChevronLeft size={17} />
                  Précédent
                </button>
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-violet-200/12 bg-[#b9a7ea] px-3 text-xs font-black uppercase tracking-[0.11em] text-[#09071a] transition hover:bg-[#c9b9f2] disabled:cursor-wait disabled:opacity-70"
                  disabled={isAlmanaxLoading}
                  onClick={() => setAlmanaxDate((current) => shiftDateKey(current, 1))}
                  type="button"
                >
                  Suivant
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </PremiumCard>
        </section>

        <PremiumCard title="Galerie" icon={Images} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {!isGalleryLoaded
              ? [0, 1, 2, 3].map((item) => (
                  <div
                    aria-hidden="true"
                    className="min-h-44 rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] shadow-[0_22px_54px_rgba(0,0,0,0.28)]"
                    key={item}
                  />
                ))
              : null}
            {isGalleryLoaded && galleryItems.length === 0 ? (
              <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 sm:col-span-2 xl:col-span-4">
                Aucune image publiée pour le moment.
              </div>
            ) : null}
            {isGalleryLoaded ? galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group/gallery relative min-h-44 overflow-hidden rounded-2xl border border-violet-100/8 bg-slate-950 shadow-[0_22px_54px_rgba(0,0,0,0.38)]"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.title}
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover/gallery:scale-110"
                    src={item.image}
                  />
                ) : (
                  <div
                    className={`absolute inset-0 ${galleryPlaceholder(index)} transition duration-700 group-hover/gallery:scale-110`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                <div className="absolute inset-0 opacity-0 shadow-[inset_0_0_26px_rgba(196,181,253,0.075)] transition duration-500 group-hover/gallery:opacity-100" />
                <div className="absolute left-4 top-4 rounded-full border border-violet-100/12 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-violet-100 backdrop-blur-sm">
                  {item.category}
                </div>
                <div className="absolute bottom-0 p-4">
                  <p className="text-sm font-black text-violet-50">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    {item.description}
                  </p>
                </div>
                {item.image ? (
                  <button
                    aria-label={`Ouvrir ${item.title}`}
                    className="absolute inset-0 z-30 cursor-zoom-in"
                    onClick={() => setSelectedGalleryItem(item)}
                    type="button"
                  />
                ) : null}
              </div>
            )) : null}
          </div>
        </PremiumCard>
          </>
        ) : null}
      </div>

      {isCalendarOpen ? (
        <div className="fixed inset-0 z-[100000] grid place-items-center bg-[#020410]/88 p-3 backdrop-blur-md sm:p-4">
          <button
            aria-label="Fermer le calendrier"
            className="absolute inset-0"
            onClick={() => setIsCalendarOpen(false)}
            type="button"
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem] border border-violet-200/14 bg-[#06091b]/94 p-4 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)] sm:p-6">
            <button
              aria-label="Fermer le calendrier"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-[#030512]/80 text-violet-100 backdrop-blur-md transition hover:bg-violet-100/[0.08]"
              onClick={() => setIsCalendarOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 pr-12">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                Calendrier Lunaeria
              </p>
              <h2 className="mt-2 text-2xl font-black text-violet-50 sm:text-3xl">
                {monthNames[calendarMonth.getMonth()]}{" "}
                {calendarMonth.getFullYear()}
              </h2>
            </div>

            <div className="relative z-10 mt-5 grid min-h-0 gap-5 overflow-y-auto lg:grid-cols-[1.35fr_0.9fr] lg:overflow-hidden">
              <section className="min-w-0 rounded-[1.35rem] border border-violet-100/10 bg-[#030512]/58 p-3 shadow-[inset_0_0_18px_rgba(196,181,253,0.024)] sm:p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    className="grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-violet-100/[0.045] text-violet-100 transition hover:bg-violet-100/[0.08]"
                    onClick={() =>
                      setCalendarMonth(
                        (current) =>
                          new Date(
                            current.getFullYear(),
                            current.getMonth() - 1,
                            1,
                          ),
                      )
                    }
                    type="button"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-violet-100">
                    {monthNames[calendarMonth.getMonth()]}
                  </p>
                  <button
                    className="grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-violet-100/[0.045] text-violet-100 transition hover:bg-violet-100/[0.08]"
                    onClick={() =>
                      setCalendarMonth(
                        (current) =>
                          new Date(
                            current.getFullYear(),
                            current.getMonth() + 1,
                            1,
                          ),
                      )
                    }
                    type="button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {weekdayNames.map((weekday) => (
                    <div
                      className="pb-1 text-center text-[10px] font-black uppercase tracking-[0.16em] text-violet-100/55 sm:text-xs"
                      key={weekday}
                    >
                      {weekday}
                    </div>
                  ))}

                  {calendarDays.map((day) => {
                    const dateKey = formatDateKey(day);
                    const dayEvents = eventsByDate[dateKey] ?? [];
                    const isCurrentMonth =
                      day.getMonth() === calendarMonth.getMonth();
                    const isSelected = dateKey === selectedCalendarDate;
                    const isToday = dateKey === formatDateKey(new Date());

                    return (
                      <button
                        className={`relative min-h-14 rounded-2xl border p-2 text-left transition sm:min-h-20 ${
                          isSelected
                            ? "border-violet-200/28 bg-violet-200/12 text-violet-50 shadow-[0_0_18px_rgba(139,92,246,0.16)]"
                            : isCurrentMonth
                              ? "border-violet-100/9 bg-violet-50/[0.035] text-violet-50 hover:border-violet-200/18 hover:bg-violet-100/[0.06]"
                              : "border-violet-100/[0.04] bg-transparent text-slate-600"
                        }`}
                        key={dateKey}
                        onClick={() => setSelectedCalendarDate(dateKey)}
                        type="button"
                      >
                        <span
                          className={`inline-grid size-7 place-items-center rounded-xl text-xs font-black ${
                            isToday
                              ? "bg-[#b9a7ea] text-[#09071a]"
                              : "bg-[#030512]/45 text-current"
                          }`}
                        >
                          {day.getDate()}
                        </span>

                        {dayEvents.length ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {dayEvents.slice(0, 3).map((eventItem) => (
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_8px_rgba(196,181,253,0.75)]"
                                key={eventItem.id}
                              />
                            ))}
                            {dayEvents.length > 3 ? (
                              <span className="text-[10px] font-black text-violet-100">
                                +{dayEvents.length - 3}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </section>

              <aside className="min-h-0 rounded-[1.35rem] border border-violet-100/10 bg-violet-50/[0.035] p-4 shadow-[inset_0_0_18px_rgba(196,181,253,0.024)] lg:overflow-y-auto">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                  Jour sélectionné
                </p>
                <h3 className="mt-2 text-xl font-black capitalize text-violet-50">
                  {selectedDateLabel}
                </h3>

                <div className="mt-5 space-y-3">
                  {selectedDateEvents.length ? (
                    selectedDateEvents.map((eventItem, index) => {
                      const Icon = eventIcons[index % eventIcons.length];

                      return (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-[#030512]/70 p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)]"
                          key={eventItem.id}
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                              <Icon size={19} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-violet-50">
                                {eventItem.title}
                              </p>
                              <p className="mt-1 text-sm font-bold text-[#e8dcbd]">
                                {eventItem.date}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {eventItem.description}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-violet-100/9 bg-[#030512]/70 p-5 text-sm leading-6 text-slate-400">
                      Aucun événement prévu ce jour.
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}

      {selectedAnnouncement ? (
        <div className="fixed inset-0 z-[100000] grid place-items-center bg-[#020410]/88 p-4 backdrop-blur-md">
          <button
            aria-label="Fermer l'annonce"
            className="absolute inset-0"
            onClick={() => setSelectedAnnouncement(null)}
            type="button"
          />
          <article className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-violet-200/14 bg-[#06091b]/94 p-5 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)] sm:p-6">
            <button
              aria-label="Fermer l'annonce"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-[#030512]/80 text-violet-100 backdrop-blur-md transition hover:bg-violet-100/[0.08]"
              onClick={() => setSelectedAnnouncement(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="relative z-10 pr-12">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                {selectedAnnouncement.category}
              </span>
              <h2 className="mt-3 break-words text-2xl font-black leading-tight text-violet-50 sm:text-3xl">
                {selectedAnnouncement.title}
              </h2>
            </div>
            <div className="relative z-10 mt-5 max-h-[60vh] overflow-y-auto rounded-2xl border border-violet-100/10 bg-[#030512]/64 p-4 text-sm leading-7 text-slate-300 shadow-[inset_0_0_18px_rgba(196,181,253,0.024)] sm:p-5 sm:text-base sm:leading-8">
              {selectedAnnouncement.content}
            </div>
          </article>
        </div>
      ) : null}

      {selectedEvent ? (
        <div className="fixed inset-0 z-[100000] grid place-items-center bg-[#020410]/88 p-4 backdrop-blur-md">
          <button
            aria-label="Fermer l'évènement"
            className="absolute inset-0"
            onClick={() => setSelectedEvent(null)}
            type="button"
          />
          <article className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-violet-200/14 bg-[#06091b]/94 p-5 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)] sm:p-6">
            <button
              aria-label="Fermer l'évènement"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-[#030512]/80 text-violet-100 backdrop-blur-md transition hover:bg-violet-100/[0.08]"
              onClick={() => setSelectedEvent(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="relative z-10 pr-12">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-violet-200">
                Évènement
              </span>
              <h2 className="mt-3 break-words text-2xl font-black leading-tight text-violet-50 sm:text-3xl">
                {selectedEvent.title}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#e8dcbd]">
                {selectedEvent.date}
              </p>
            </div>
            <div className="relative z-10 mt-5 max-h-[60vh] overflow-y-auto rounded-2xl border border-violet-100/10 bg-[#030512]/64 p-4 text-sm leading-7 text-slate-300 shadow-[inset_0_0_18px_rgba(196,181,253,0.024)] sm:p-5 sm:text-base sm:leading-8">
              {selectedEvent.description}
            </div>
          </article>
        </div>
      ) : null}

      {selectedGalleryItem ? (
        <div className="fixed inset-0 z-[100000] grid place-items-center bg-[#020410]/88 p-4 backdrop-blur-md">
          <button
            aria-label="Fermer l'image"
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setSelectedGalleryItem(null)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-violet-200/14 bg-[#06091b]/92 p-4 shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_30px_rgba(76,29,149,0.14)]">
            <button
              aria-label="Fermer l'image"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-xl border border-violet-100/12 bg-[#030512]/80 text-violet-100 backdrop-blur-md transition hover:bg-violet-100/[0.08]"
              onClick={() => setSelectedGalleryItem(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="relative grid max-h-[78vh] place-items-center overflow-hidden rounded-2xl border border-violet-100/10 bg-[#030512]/75">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedGalleryItem.title}
                className="max-h-[78vh] w-full object-contain"
                src={selectedGalleryItem.image}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-black text-violet-50">
                {selectedGalleryItem.title}
              </p>
              {selectedGalleryItem.description ? (
                <p className="mt-1 text-sm text-slate-300">
                  {selectedGalleryItem.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
