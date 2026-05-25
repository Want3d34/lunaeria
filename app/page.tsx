"use client";

import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gem,
  Home as HomeIcon,
  Images,
  Layers3,
  Link,
  Megaphone,
  Moon,
  PackageOpen,
  ScrollText,
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
  { label: "Règlement", icon: ScrollText, href: "/reglement" },
  { label: "Liens utiles", icon: Link, href: "/liens-utiles" },
];

const navItems: NavItem[] = legacyNavItems.slice(0, 0).concat([
  { label: "Accueil", icon: HomeIcon, href: "/" },
  {
    label: "Services",
    icon: WandSparkles,
    children: [{ label: "Ventes", href: "/services/ventes" }],
  },
  {
    label: "Métiers",
    icon: BriefcaseBusiness,
    children: metierLinks,
  },
  {
    label: "Ressources",
    icon: PackageOpen,
    children: [
      {
        label: "Élevage",
        children: [
          { label: "Muldos", href: "/ressources/elevage/muldos" },
          { label: "Dragodindes", href: "/ressources/elevage/dragodindes" },
          { label: "Volkornes", href: "/ressources/elevage/volkornes" },
        ],
      },
    ],
  },
  {
    label: "Stuffs & Builds",
    icon: ShieldCheck,
    children: [
      { label: "Encyclopédie", href: "/stuffs-builds/encyclopedie" },
    ],
  },
  { label: "Annonces", icon: Megaphone, href: "/annonces" },
  { label: "Règlement", icon: ScrollText, href: "/reglement" },
  { label: "Liens utiles", icon: Link, href: "/liens-utiles" },
]);

const eventIcons = [Swords, BriefcaseBusiness, ShieldCheck];
const activityIcons: Record<ActivityItem["type"], LucideIcon> = {
  announcement: Megaphone,
  build: ShieldCheck,
  event: CalendarDays,
  sale: WandSparkles,
};

type HomepageSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  recruitmentIsOpen: boolean;
  recruitmentMessage: string;
  recruitmentServerName: string;
};

type DiscordProfile = {
  discordId: string;
  username: string;
  avatar: string | null;
};

const homepageSettingsFallback: HomepageSettings = {
  heroTitle: "LUNAERIA",
  heroSubtitle: "Portail de la Guilde Lunaeria",
  heroButtonText: "Rejoindre la guilde",
  heroButtonLink: "#recrutement",
  recruitmentIsOpen: false,
  recruitmentMessage: "",
  recruitmentServerName: "Lunaeria",
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

type ActivityItem = {
  label: string;
  title: string;
  meta: string;
  type: "announcement" | "build" | "event" | "sale";
  timestamp?: string | null;
};

const onlineMembers = [
  { name: "Azelya", role: "Meneuse", status: "Songes" },
  { name: "Zyphor", role: "Bras droit", status: "AvA" },
  { name: "Helya", role: "Trésorière", status: "Métiers" },
  { name: "Kyzen", role: "Protecteur", status: "Kolizeum" },
  { name: "Lumya", role: "Artisane", status: "Donjons" },
];

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M7.8 6.7c1.35-.62 2.68-.92 4.2-.92s2.85.3 4.2.92c1.26 1.86 1.88 3.93 1.72 6.2a7.1 7.1 0 0 1-3.5 1.74l-.76-1.13c.42-.13.82-.32 1.2-.56-1.88.87-3.85.87-5.72 0 .38.24.78.43 1.2.56l-.76 1.13a7.1 7.1 0 0 1-3.5-1.75c-.16-2.26.46-4.33 1.72-6.19Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.55 11.15h.02M14.43 11.15h.02"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.8"
      />
    </svg>
  );
}

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

function getDiscordProfileFromUser(user: User): DiscordProfile | null {
  const discordIdentity = user.identities?.find(
    (identity) => identity.provider === "discord",
  );

  if (!discordIdentity) {
    return null;
  }

  const identityData = discordIdentity.identity_data as
    | Record<string, unknown>
    | undefined;
  const userMetadata = user.user_metadata as Record<string, unknown> | undefined;
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
    getStringMetadataValue(userMetadata, [
      "server_display_name",
      "guild_display_name",
      "guild_nickname",
      "guild_nick",
      "member_nickname",
      "member_nick",
      "nickname",
      "nick",
    ]) ||
    getStringMetadataValue(identityData, [
      "server_display_name",
      "guild_display_name",
      "guild_nickname",
      "guild_nick",
      "member_nickname",
      "member_nick",
      "nickname",
      "nick",
    ]) ||
    getStringMetadataValue(userMetadata, ["display_name"]) ||
    getStringMetadataValue(identityData, ["display_name"]) ||
    getStringMetadataValue(userMetadata, ["global_name"]) ||
    getStringMetadataValue(identityData, ["global_name"]) ||
    getStringMetadataValue(userMetadata, [
      "username",
      "user_name",
      "preferred_username",
      "custom_name",
      "full_name",
      "name",
    ]) ||
    getStringMetadataValue(identityData, [
      "username",
      "user_name",
      "preferred_username",
      "custom_name",
      "full_name",
      "name",
    ]) ||
    "Discord";

  const avatar =
    getStringMetadataValue(userMetadata, ["avatar_url", "picture"]) ||
    getStringMetadataValue(identityData, ["avatar_url", "picture"]);

  return {
    discordId,
    username,
    avatar,
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
      className={`premium-card group rounded-[1.75rem] border border-violet-200/8 bg-[#06091b]/70 p-5 shadow-[0_26px_68px_rgba(0,0,0,0.42),0_0_24px_rgba(76,29,149,0.055)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-violet-200/16 hover:bg-[#090c22]/78 ${className}`}
    >
      <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl border border-violet-200/12 bg-[linear-gradient(145deg,rgba(196,181,253,0.105),rgba(76,29,149,0.055))] text-violet-100 shadow-[inset_0_1px_12px_rgba(196,181,253,0.045),0_0_14px_rgba(109,40,217,0.09)] transition duration-500 group-hover:scale-105 group-hover:text-violet-50 group-hover:shadow-[inset_0_1px_14px_rgba(196,181,253,0.055),0_0_18px_rgba(139,92,246,0.1)]">
            <Icon size={19} />
          </div>
          <h2 className="text-base font-black tracking-[0.08em] text-slate-50">
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
      <div className="ml-3 mt-2 space-y-2 border-l border-violet-100/12 pl-3">
        {children?.map((child) =>
          child.children?.length ? (
            <div key={child.label}>
              <div className="mb-2 flex h-10 items-center rounded-xl border border-violet-200/10 bg-violet-100/[0.035] px-3 text-xs font-black uppercase tracking-[0.16em] text-violet-100">
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current opacity-70 shadow-[0_0_5px_currentColor]" />
                {child.label}
              </div>
              <div className="ml-3 space-y-2 border-l border-violet-100/10 pl-3">
                {child.children.map((nestedChild) => (
                  <NextLink
                    className={`group/sub relative flex h-10 items-center rounded-xl border px-3 text-xs font-black uppercase tracking-[0.16em] transition duration-300 ${
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
              className={`group/sub relative flex h-10 items-center rounded-xl border px-3 text-xs font-black uppercase tracking-[0.16em] transition duration-300 ${
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
  const controlClassName = `group/nav relative flex h-12 min-w-14 items-center justify-center gap-3 overflow-visible rounded-2xl border px-3 text-sm font-bold transition duration-300 lg:w-full lg:overflow-hidden lg:justify-start ${
    isActive
      ? "border-violet-200/20 bg-[linear-gradient(90deg,rgba(124,58,237,0.16),rgba(91,33,182,0.07))] text-violet-50 shadow-[inset_0_1px_14px_rgba(196,181,253,0.055),0_0_16px_rgba(139,92,246,0.1)]"
      : "border-transparent text-slate-400 hover:border-violet-200/18 hover:bg-violet-100/[0.055] hover:text-violet-50 hover:shadow-[0_0_16px_rgba(139,92,246,0.095)]"
  }`;
  const controlContent = (
    <>
      <span className="absolute inset-y-2 left-0 w-px bg-violet-200/0 transition duration-300 group-hover/nav:bg-violet-200/45" />
      <Icon
        className="shrink-0 transition duration-300 group-hover/nav:scale-105 group-hover/nav:drop-shadow-[0_0_6px_rgba(196,181,253,0.26)]"
        size={19}
      />
      <span className="hidden flex-1 text-left lg:inline">{item.label}</span>
      {hasChildren ? (
        <ChevronDown
          className={`hidden text-violet-100/58 transition duration-300 lg:block ${
            open ? "rotate-180" : ""
          }`}
          size={16}
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
  const [homepageSettings, setHomepageSettings] =
    useState<HomepageSettings | null>(null);

  const [galleryItemsState, setGalleryItemsState] = useState<GalleryItem[]>([]);
  const [isDynamicContentLoaded, setIsDynamicContentLoaded] = useState(false);
  const [isGalleryLoaded, setIsGalleryLoaded] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
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

      setDiscordProfile(profile);

      const { error } = await supabase.from("discord_profiles").upsert(
        {
          discord_id: profile.discordId,
          username: profile.username,
          avatar: profile.avatar,
        },
        { onConflict: "discord_id" },
      );

      if (error) {
        setDiscordAuthError("Compte lié, synchronisation à réessayer.");
        console.error(error);
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
        recruitmentIsOpen:
          typeof data.recruitment_is_open === "boolean"
            ? data.recruitment_is_open
            : false,
        recruitmentMessage:
          data.recruitment_message ?? "",
        recruitmentServerName:
          data.recruitment_server_name ?? "Lunaeria",
      });
    }

    loadHomepageSettings();
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

  const homepageAnnouncements = announcements;

  const recruitmentLabel = homepageSettings?.recruitmentIsOpen ? "Ouvert" : "Fermé";
  const recentActivity: ActivityItem[] = [
    ...builds.slice(0, 2).map((build) => ({
      label: "Nouveau build ajouté",
      title: build.title,
      meta: `${build.className} · ${build.mode}`,
      type: "build" as const,
      timestamp: formatActivityDate(build.createdAt),
    })),
    ...sales.slice(0, 1).map((sale) => ({
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
  ].slice(0, 5);
  const activityItems = recentActivity;
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

  async function handleDiscordSignOut() {
    setDiscordAuthError(null);
    setIsDiscordSubmitting(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setDiscordAuthError("Déconnexion impossible.");
      console.error(error);
    } else {
      setDiscordProfile(null);
    }

    setIsDiscordSubmitting(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
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

        .sidebar-premium::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.34;
          background:
            radial-gradient(circle at 50% 0%, rgba(167, 139, 250, 0.12), transparent 34%),
            radial-gradient(circle at 15% 32%, rgba(99, 102, 241, 0.08), transparent 28%),
            radial-gradient(circle at 85% 72%, rgba(168, 85, 247, 0.07), transparent 30%);
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
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-42" />
      <div className="fog-veil fixed inset-0" />

      <aside className="sidebar-shell sidebar-premium fixed left-0 top-0 z-[9999] flex h-24 w-full flex-row items-center gap-3 overflow-visible border-b border-violet-200/8 bg-[#040719]/94 px-3 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.44),0_0_24px_rgba(76,29,149,0.065)] backdrop-blur-md lg:h-screen lg:w-72 lg:flex-col lg:items-stretch lg:overflow-visible lg:border-b-0 lg:border-r lg:px-5 lg:py-2 lg:shadow-[24px_0_76px_rgba(0,0,0,0.54),0_0_24px_rgba(76,29,149,0.065)]">
        <div className="relative z-10 -mt-2 flex shrink-0 items-center justify-center py-0 lg:mb-2 lg:w-full">
          <img
            src="/newlogo.png"
            alt="Lunaeria"
            className="relative z-10 w-[136%] max-w-none object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.16)]"
          />
        </div>

        <div className="relative z-10 mx-auto mb-3 hidden h-px w-4/5 overflow-hidden rounded-full bg-gradient-to-r from-transparent via-violet-200/28 to-transparent shadow-[0_0_14px_rgba(167,139,250,0.18)] lg:block" />

        <nav className="mobile-menu-scrollbar relative z-[10000] flex min-w-0 flex-1 flex-row gap-2 overflow-x-auto overflow-y-visible pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:min-w-0 lg:flex-col lg:overflow-visible lg:pr-0">
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
          <div className="fixed left-3 right-3 top-[6.75rem] z-[99999] max-h-[calc(100svh-8rem)] overflow-y-auto rounded-2xl border border-violet-200/12 bg-[#050719]/98 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-md lg:hidden">
            <NavChildrenList pathname={pathname}>
              {activeMobileSection.children}
            </NavChildrenList>
          </div>
        ) : null}

        <div className="relative z-10 hidden rounded-[1.6rem] border border-violet-200/10 bg-[linear-gradient(145deg,rgba(124,58,237,0.075),rgba(49,46,129,0.065))] p-4 text-sm text-violet-100 shadow-[inset_0_0_16px_rgba(196,181,253,0.035),0_0_14px_rgba(76,29,149,0.055)] lg:block">
          <p className="font-black tracking-wide text-violet-50">
  Développement & Design
</p>

<p className="mt-1 text-xs leading-5 text-cyan-100/70">
   <span className="font-black text-violet-200">BY AZELYA</span>
</p>
        </div>
      </aside>

      <div className="relative z-0 min-h-screen max-w-full p-3 pt-28 sm:p-5 sm:pt-30 lg:ml-72 lg:max-w-none lg:p-8">
        <section className="hero-shell relative min-h-[520px] overflow-hidden rounded-[1.45rem] border border-violet-200/9 bg-slate-950 shadow-[0_42px_120px_rgba(0,0,0,0.58),0_0_28px_rgba(76,29,149,0.075)] sm:rounded-[2.1rem] lg:min-h-[560px]">
          <div className="hero-artwork absolute inset-0 bg-[url('/fond.png')] bg-cover bg-[center_42%]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,5,18,0.82)_0%,rgba(7,8,25,0.54)_34%,rgba(8,7,24,0.07)_74%,rgba(4,5,18,0.16)_100%)]" />
          <div className="hero-depth absolute inset-0" />
          <div className="hero-light absolute inset-0" />

          {discordProfile ? (
            <div className="absolute left-4 right-4 top-4 z-20 flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-violet-100/14 bg-[#07091d]/62 p-2 text-xs font-bold text-violet-50/86 shadow-[inset_0_0_18px_rgba(196,181,253,0.035),0_16px_44px_rgba(0,0,0,0.3),0_0_18px_rgba(124,58,237,0.12)] backdrop-blur-md sm:left-auto sm:max-w-[min(30rem,calc(100%-2rem))]">
              {discordProfile.avatar ? (
                <div
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 rounded-full border border-violet-100/20 shadow-[0_0_14px_rgba(139,92,246,0.18)]"
                  style={{
                    backgroundImage: `url(${discordProfile.avatar})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-100/20 bg-violet-100/10">
                  <DiscordIcon size={15} />
                </div>
              )}
              <span className="min-w-0 max-w-32 truncate sm:max-w-40">
                {discordProfile.username}
              </span>
              <span className="shrink-0 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-100">
                Compte lié
              </span>
              <button
                className="shrink-0 rounded-full border border-violet-200/16 bg-violet-100/[0.055] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-violet-50/78 transition hover:border-violet-200/28 hover:bg-violet-200/10"
                disabled={isDiscordSubmitting}
                onClick={handleDiscordSignOut}
                type="button"
              >
                Déconnexion
              </button>
            </div>
          ) : null}

          <div className="relative z-10 flex min-h-[520px] max-w-full flex-col justify-between p-5 sm:p-10 lg:min-h-[560px] lg:max-w-4xl lg:p-14">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200/13 bg-violet-200/7 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-100 shadow-[inset_0_0_10px_rgba(196,181,253,0.032),0_0_11px_rgba(109,40,217,0.06)] backdrop-blur-sm">
                <Sparkles size={14} /> Dofus 3
              </span>
             <span className="rounded-full border border-violet-200/11 bg-indigo-200/6 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-100/90 shadow-[0_0_10px_rgba(99,102,241,0.055)] backdrop-blur-sm">
  Portail Lunaeria
</span>
            </div>

            <div className="py-8 sm:py-12">
              <div className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.32em] text-violet-100/76">
                <Moon size={16} />
                Sanctuaire de guilde
              </div>
              {homepageSettings ? (
                <>
                  <h1 className="legend-title max-w-full break-words text-[2.7rem] font-black tracking-[0.14em] text-violet-50 sm:text-7xl sm:tracking-[0.2em] lg:text-8xl">
                    {homepageSettings.heroTitle}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100/90 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] sm:mt-6 sm:text-xl sm:leading-8">
                    {homepageSettings.heroSubtitle}
                    <br />
                    Recrutement [{recruitmentLabel}]
                  </p>
                  {homepageSettings.recruitmentMessage ? (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100/78 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                      {homepageSettings.recruitmentMessage}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="mt-5 max-w-2xl space-y-4" aria-hidden="true">
                  <div className="h-16 w-4/5 rounded-2xl bg-violet-100/[0.055] shadow-[inset_0_0_18px_rgba(196,181,253,0.035)] sm:h-24" />
                  <div className="h-5 w-2/3 rounded-full bg-violet-100/[0.045]" />
                  <div className="h-5 w-1/2 rounded-full bg-violet-100/[0.035]" />
                </div>
              )}
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                {homepageSettings ? (
                  <div className="w-full sm:w-auto">
                    <button
                      aria-busy={isDiscordBusy}
                      className="discord-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#b9a7ea] px-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[#09071a] shadow-[inset_0_1px_0_rgba(237,233,254,0.48),0_0_18px_rgba(124,58,237,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#c9b9f2] hover:shadow-[inset_0_1px_0_rgba(237,233,254,0.55),0_0_22px_rgba(167,139,250,0.22)] disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:px-6 sm:tracking-[0.16em]"
                      disabled={isDiscordBusy}
                      onClick={handleDiscordOAuth}
                      type="button"
                    >
                      <DiscordIcon /> {discordButtonLabel}
                    </button>
                    {discordAuthError && !discordProfile ? (
                      <p className="mt-3 max-w-sm text-xs font-semibold text-rose-100/78">
                        {discordAuthError}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="h-14 w-full rounded-2xl bg-violet-100/[0.055] sm:w-56" aria-hidden="true" />
                )}
                <button
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-violet-200/15 bg-violet-100/[0.045] px-4 text-center text-sm font-black uppercase tracking-[0.14em] text-violet-50 shadow-[inset_0_0_15px_rgba(196,181,253,0.026),0_0_12px_rgba(109,40,217,0.045)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200/24 hover:bg-violet-200/8 hover:shadow-[inset_0_0_17px_rgba(196,181,253,0.04),0_0_15px_rgba(124,58,237,0.075)] sm:w-auto sm:px-6 sm:tracking-[0.16em]"
                  onClick={() => setIsCalendarOpen(true)}
                  type="button"
                >
                  <CalendarDays size={18} /> Voir le calendrier
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Niveau max", "20"],
                ["Membres", "86"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.045] p-4 shadow-[inset_0_0_15px_rgba(196,181,253,0.032),0_14px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200/16 hover:bg-violet-100/[0.06] hover:shadow-[inset_0_0_17px_rgba(196,181,253,0.04),0_0_13px_rgba(109,40,217,0.06)]"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-violet-100/74">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-violet-50 drop-shadow-[0_0_6px_rgba(196,181,253,0.15)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          <PremiumCard
            title="Dernières annonces"
            icon={Bell}
            className="xl:col-span-2"
          >
            <div className="grid gap-3 md:grid-cols-2">
              {!isDynamicContentLoaded
                ? [0, 1].map((item) => (
                    <ContentSkeleton className="min-h-[154px]" key={item} />
                  ))
                : null}
              {isDynamicContentLoaded && homepageAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.032] p-4 text-sm font-bold text-violet-100/65 md:col-span-2">
                  Aucune annonce publiée pour le moment.
                </div>
              ) : null}
              {isDynamicContentLoaded ? homepageAnnouncements.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-violet-100/8 bg-violet-50/[0.036] p-4 shadow-[inset_0_0_13px_rgba(196,181,253,0.024),0_14px_32px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/16 hover:bg-violet-200/[0.055] hover:shadow-[inset_0_0_15px_rgba(196,181,253,0.032),0_0_13px_rgba(109,40,217,0.06)]"
                >
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                    {item.category}
                  </span>
                  <h3 className="mt-3 text-sm font-black text-violet-50">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.content}
                  </p>
                </article>
              )) : null}
            </div>
          </PremiumCard>

          <PremiumCard title="Membres en ligne" icon={Users}>
            <div className="space-y-3">
              {onlineMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-3 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)]"
                >
                  <div className="grid size-10 place-items-center rounded-xl border border-violet-100/14 bg-gradient-to-br from-violet-200 to-indigo-300 text-sm font-black text-[#09071a] shadow-[0_0_12px_rgba(124,58,237,0.11)]">
                    {member.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-violet-50">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {member.role}
                    </p>
                  </div>
                  <span className="rounded-full border border-violet-100/10 bg-violet-200/7 px-3 py-1 text-xs font-bold text-violet-100 shadow-[0_0_8px_rgba(124,58,237,0.055)]">
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </PremiumCard>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-5">
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

                return (
                  <div
                    key={eventItem.id}
                    className="flex items-start gap-3 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052] hover:shadow-[0_0_12px_rgba(109,40,217,0.055)] sm:items-center sm:gap-4"
                  >
                    <div className="grid size-11 place-items-center rounded-2xl border border-violet-200/10 bg-violet-300/7 text-violet-100 shadow-[inset_0_0_12px_rgba(196,181,253,0.04)]">
                      <Icon size={19} />
                    </div>
                    <div>
                      <p className="font-black text-violet-50">
                        {eventItem.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {eventItem.date}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {eventItem.description}
                      </p>
                    </div>
                  </div>
                );
              }) : null}
            </div>
          </PremiumCard>

          <PremiumCard
            title="Activité récente"
            icon={Layers3}
            className="xl:col-span-2"
          >
            <div className="space-y-3">
              {!isDynamicContentLoaded
                ? [0, 1, 2].map((item) => (
                    <ContentSkeleton className="min-h-[82px]" key={item} />
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
                    className="flex items-center gap-4 rounded-2xl border border-violet-100/8 bg-violet-50/[0.034] p-4 shadow-[inset_0_0_12px_rgba(196,181,253,0.022)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/15 hover:bg-violet-200/[0.052]"
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
                        <p className="mt-1 text-xs font-semibold text-violet-100/58">
                          Ajouté le {activity.timestamp}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              }) : null}
            </div>
          </PremiumCard>

          <PremiumCard title="Booster le serveur Discord" icon={Gem}>
            <div className="rounded-2xl border border-violet-200/11 bg-[linear-gradient(145deg,rgba(196,181,253,0.075),rgba(76,29,149,0.06))] p-5 shadow-[inset_0_0_16px_rgba(196,181,253,0.035),0_0_13px_rgba(76,29,149,0.055)]">
              <p className="text-sm font-bold text-violet-100/86">
                Soutenir Lunaeria
              </p>
              <p className="mt-3 text-sm leading-6 text-violet-50/70">
                Les boosts aident à améliorer le Discord Lunaeria, renforcer la
                visibilité de la guilde et soutenir les espaces communautaires.
              </p>
              {homepageSettings ? (
                <a
                  className="discord-cta mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-violet-200/18 bg-[#b9a7ea] px-5 text-sm font-black uppercase tracking-[0.14em] text-[#09071a] transition duration-300 hover:-translate-y-1 hover:bg-[#c9b9f2]"
                  href={homepageSettings.heroButtonLink}
                >
                  <DiscordIcon />
                  Booster le Discord
                </a>
              ) : (
                <div className="mt-5 h-12 w-full rounded-2xl bg-violet-100/[0.045]" aria-hidden="true" />
              )}
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
