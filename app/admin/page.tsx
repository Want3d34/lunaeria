"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  Home,
  ImagePlus,
  Images,
  Link as LinkIcon,
  Loader2,
  LockKeyhole,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { createClient, type Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";
import {
  type Announcement,
  type BuildItem,
  type Event,
  type GalleryItem,
  type UsefulLink,
  useHomepageContent,
} from "@/lib/lunaeria-content";
import { dofusClasses, dofusElements, getClassImage, getElement } from "@/lib/stuffs-data";
import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminSection,
  AdminTextarea,
} from "./_components";

type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { key: "overview", label: "Vue d'ensemble", icon: Home },
  { key: "accueil", label: "Accueil", icon: Home },
  { key: "annonces", label: "Annonces", icon: Megaphone },
  { key: "evenements", label: "Evénements", icon: CalendarDays },
  { key: "ventes", label: "Ventes", icon: ShoppingBag },
  { key: "galerie", label: "Galerie", icon: Images },
  { key: "stuffs", label: "Stuff & Build", icon: ShieldCheck },
  { key: "reglement", label: "Règlement", icon: FileText },
  { key: "liens", label: "Liens utiles", icon: LinkIcon },
  { key: "parametres", label: "Paramètres", icon: Settings },
];

const emptyAnnouncement = {
  title: "",
  content: "",
  category: "Guilde",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const ADMIN_EMAIL = "danou7434@gmail.com";

type HomepageSettingsRow = {
  id: number;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_button_text: string | null;
  hero_button_link: string | null;
  recruitment_is_open: boolean | null;
  recruitment_message: string | null;
  recruitment_server_name: string | null;
};

const emptyEvent = {
  title: "",
  date: "",
  description: "",
};

const emptyUsefulLink: Omit<UsefulLink, "id"> = {
  title: "",
  description: "",
  url: "",
  section: "general",
};

const emptyGallery = {
  title: "",
  description: "",
  category: "Guilde",
  image: "",
};

const emptyBuild = {
  title: "",
  gamePseudo: "",
  discordPseudo: "",
  className: "Cra",
  elements: ["Feu"],
  orientation: "",
  mode: "PvM" as "PvM" | "PvP",
  budget: "Moyen",
  level: "200",
  dofusbookUrl: "",
  description: "",
  image: "",
};

export default function AdminPage() {
  const { content, isLoaded, setContent } = useHomepageContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [toast, setToast] = useState("");
  const [heroDraft, setHeroDraft] = useState(content.hero);
  const [recruitmentDraft, setRecruitmentDraft] = useState(content.recruitment);
  const [announcementDraft, setAnnouncementDraft] = useState(emptyAnnouncement);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(
    null,
  );
  const [eventDraft, setEventDraft] = useState(emptyEvent);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [regulationDraft, setRegulationDraft] = useState(content.regulation.body);
  const [linkDraft, setLinkDraft] = useState(emptyUsefulLink);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [galleryDraft, setGalleryDraft] = useState(emptyGallery);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [buildDraft, setBuildDraft] = useState(emptyBuild);
  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminSession() {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session ?? null;
      const isAllowedAdmin = currentSession?.user.email === ADMIN_EMAIL;

      setSession(currentSession);
      setIsAdmin(Boolean(isAllowedAdmin));
      setAuthLoading(false);

      if (currentSession && !isAllowedAdmin) {
        await supabase.auth.signOut();
        setSession(null);
        setIsAdmin(false);
        setAuthError("Ce compte n'est pas autorisé à accéder au panel.");
      }
    }

    loadAdminSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const isAllowedAdmin = nextSession?.user.email === ADMIN_EMAIL;

      setSession(nextSession);
      setIsAdmin(Boolean(isAllowedAdmin));

      if (nextSession && !isAllowedAdmin) {
        supabase.auth.signOut();
        setAuthError("Ce compte n'est pas autorisé à accéder au panel.");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const syncTimeout = window.setTimeout(() => {
      setHeroDraft(content.hero);
      setRecruitmentDraft(content.recruitment);
      setRegulationDraft(content.regulation.body);
    }, 0);

    return () => window.clearTimeout(syncTimeout);
  }, [content.hero, content.recruitment, content.regulation.body]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 2400);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const stats = useMemo(
    () => [
      {
        label: "Annonces",
        value: content.announcements.length,
        detail: "Publiées",
        icon: Megaphone,
      },
      {
        label: "Evénements",
        value: content.events.length,
        detail: "Planifiés",
        icon: CalendarDays,
      },
      {
        label: "Builds",
        value: content.builds.length,
        detail: "Stuffs partagés",
        icon: ShieldCheck,
      },
      {
        label: "Galerie",
        value: content.gallery.length,
        detail: "Images publiées",
        icon: Images,
      },
    ],
    [
      content.announcements.length,
      content.builds.length,
      content.events.length,
      content.gallery.length,
    ],
  );

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });

    if (error) {
      setAuthError("Email ou mot de passe incorrect.");
      setAuthLoading(false);
      return;
    }

    if (data.session?.user.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setSession(null);
      setIsAdmin(false);
      setAuthError("Ce compte n'est pas autorisé à accéder au panel.");
      setAuthLoading(false);
      return;
    }

    setSession(data.session);
    setIsAdmin(true);
    setAuthPassword("");
    setAuthLoading(false);
    notify("Connexion admin réussie");
  }

  async function handleAdminLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setAuthPassword("");
    notify("Déconnexion réussie");
  }

  function notify(message: string) {
    setToast(message);
  }


  async function loadAnnouncementsFromSupabase() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement annonces");
      return;
    }

    setContent((current) => ({
      ...current,
      announcements: (data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        content: item.content,
        category: item.category || "Guilde",
      })),
    }));
  }

  async function loadEventsFromSupabase() {
    const { data, error } = await supabase
      .from("evenements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement événements");
      return;
    }

    setContent((current) => ({
      ...current,
      events: (data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        date: item.date,
        description: item.description || "Détails à compléter.",
      })),
    }));
  }

  async function loadSalesFromSupabase() {
    const { data, error } = await supabase
      .from("ventes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement ventes");
      return;
    }

    setContent((current) => ({
      ...current,
      sales: (data ?? []).map((item) => ({
        id: String(item.id),
        itemName: item.item_name,
        category: item.category || "Divers",
        price: item.price,
        quantity: item.quantity || "1",
        message: item.message || "",
        imageUrl: item.image_url || "/file.svg",
        sellerGameName: item.seller_game_name || "Anonyme",
        sellerDiscordName: item.seller_discord_name || "discord inconnu",
      })),
    }));
  }

  async function loadBuildsFromSupabase() {
    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement builds");
      return;
    }

    setContent((current) => ({
      ...current,
      builds: (data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        gamePseudo: item.game_pseudo || "",
        discordPseudo: item.discord_pseudo || "",
        className: item.class_name,
        classImage: item.class_image || getClassImage(item.class_name),
        elements: item.elements?.length ? item.elements : ["Multi"],
        elementIcons:
          item.element_icons?.length
            ? item.element_icons
            : (item.elements?.length ? item.elements : ["Multi"]).map(
                (entry: string) => getElement(entry)?.icon ?? "✦",
              ),
        orientation: item.orientation || "",
        mode: item.mode || "PvM",
        budget: item.budget || "Moyen",
        level: item.level || "200",
        dofusbookUrl: item.dofusbook_url || "https://www.dofusbook.net",
        description: item.description || "",
        image: item.image || item.class_image || getClassImage(item.class_name),
        createdAt: item.created_at || new Date().toISOString(),
        views: item.views ?? 0,
      })),
    }));
  }

  async function loadUsefulLinksFromSupabase() {
    const { data, error } = await supabase
      .from("useful_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement liens");
      return;
    }

    setContent((current) => ({
      ...current,
      usefulLinks: (data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || "",
        url: item.url,
        section: item.section || "general",
      })),
    }));
  }

  async function loadGalleryFromSupabase() {
    const { data, error } = await supabase
      .from("galerie")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      notify("Erreur chargement galerie");
      return;
    }

    setContent((current) => ({
      ...current,
      gallery: (data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || "",
        category: item.category || "Guilde",
        image: item.image || "",
        createdAt: item.created_at || new Date().toISOString(),
      })),
    }));
  }

  async function loadReglementFromSupabase() {
    const { data, error } = await supabase
      .from("reglement")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      notify("Erreur chargement règlement");
      return;
    }

    if (!data) {
      return;
    }

    const body = data.body ?? content.regulation.body;

    setRegulationDraft(body);
    setContent((current) => ({
      ...current,
      regulation: {
        ...current.regulation,
        body,
      },
    }));
  }

  async function loadHomepageSettingsFromSupabase() {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle<HomepageSettingsRow>();

    if (error) {
      console.error(error);
      notify("Erreur chargement homepage");
      return;
    }

    if (!data) {
      return;
    }

    const nextHero = {
      title: data.hero_title ?? content.hero.title,
      subtitle: data.hero_subtitle ?? content.hero.subtitle,
      buttonText: data.hero_button_text ?? content.hero.buttonText,
      buttonLink: data.hero_button_link ?? content.hero.buttonLink,
    };

    const nextRecruitment = {
      ...content.recruitment,
      isOpen:
        typeof data.recruitment_is_open === "boolean"
          ? data.recruitment_is_open
          : content.recruitment.isOpen,
      message: data.recruitment_message ?? content.recruitment.message,
      serverName:
        data.recruitment_server_name ?? content.recruitment.serverName,
    };

    setHeroDraft(nextHero);
    setRecruitmentDraft(nextRecruitment);
    setContent((current) => ({
      ...current,
      hero: nextHero,
      recruitment: nextRecruitment,
    }));
  }

  async function loadSupabaseContent() {
    const [
      announcementsResult,
      eventsResult,
      salesResult,
      buildsResult,
      usefulLinksResult,
      galleryResult,
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
        .from("ventes")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("builds")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("useful_links")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("galerie")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (announcementsResult.error) {
      console.error(announcementsResult.error);
      notify("Erreur chargement annonces");
      return;
    }

    if (eventsResult.error) {
      console.error(eventsResult.error);
      notify("Erreur chargement événements");
      return;
    }

    if (salesResult.error) {
      console.error(salesResult.error);
      notify("Erreur chargement ventes");
      return;
    }

    if (buildsResult.error) {
      console.error(buildsResult.error);
      notify("Erreur chargement builds");
      return;
    }

    if (usefulLinksResult.error) {
      console.error(usefulLinksResult.error);
      notify("Erreur chargement liens");
      return;
    }

    if (galleryResult.error) {
      console.error(galleryResult.error);
      notify("Erreur chargement galerie");
      return;
    }

    setContent((current) => ({
      ...current,
      announcements: (announcementsResult.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        content: item.content,
        category: item.category || "Guilde",
      })),
      events: (eventsResult.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        date: item.date,
        description: item.description || "Détails à compléter.",
      })),
      sales: (salesResult.data ?? []).map((item) => ({
        id: String(item.id),
        itemName: item.item_name,
        category: item.category || "Divers",
        price: item.price,
        quantity: item.quantity || "1",
        message: item.message || "",
        imageUrl: item.image_url || "/file.svg",
        sellerGameName: item.seller_game_name || "Anonyme",
        sellerDiscordName: item.seller_discord_name || "discord inconnu",
      })),
      builds: (buildsResult.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        gamePseudo: item.game_pseudo || "",
        discordPseudo: item.discord_pseudo || "",
        className: item.class_name,
        classImage: item.class_image || getClassImage(item.class_name),
        elements: item.elements?.length ? item.elements : ["Multi"],
        elementIcons:
          item.element_icons?.length
            ? item.element_icons
            : (item.elements?.length ? item.elements : ["Multi"]).map(
                (entry: string) => getElement(entry)?.icon ?? "✦",
              ),
        orientation: item.orientation || "",
        mode: item.mode || "PvM",
        budget: item.budget || "Moyen",
        level: item.level || "200",
        dofusbookUrl: item.dofusbook_url || "https://www.dofusbook.net",
        description: item.description || "",
        image: item.image || item.class_image || getClassImage(item.class_name),
        createdAt: item.created_at || new Date().toISOString(),
        views: item.views ?? 0,
      })),
      usefulLinks: (usefulLinksResult.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || "",
        url: item.url,
        section: item.section || "general",
      })),
      gallery: (galleryResult.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || "",
        category: item.category || "Guilde",
        image: item.image || "",
        createdAt: item.created_at || new Date().toISOString(),
      })),
    }));
  }

  async function persistHero() {
    const { error } = await supabase
      .from("homepage_settings")
      .upsert({
        id: 1,
        hero_title: heroDraft.title,
        hero_subtitle: heroDraft.subtitle,
        hero_button_text: heroDraft.buttonText,
        hero_button_link: heroDraft.buttonLink,
        recruitment_is_open: recruitmentDraft.isOpen,
        recruitment_message: recruitmentDraft.message,
        recruitment_server_name: recruitmentDraft.serverName,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(error);
      notify("Erreur sauvegarde accueil");
      return;
    }

    setContent((current) => ({
      ...current,
      hero: heroDraft,
      recruitment: recruitmentDraft,
    }));
    notify("Accueil sauvegardé");
  }

  async function submitAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!announcementDraft.title.trim() || !announcementDraft.content.trim()) {
      return;
    }

    const payload = {
      title: announcementDraft.title.trim(),
      content: announcementDraft.content.trim(),
      category: announcementDraft.category.trim() || "Guilde",
    };

    const { error } = editingAnnouncementId
      ? await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingAnnouncementId)
      : await supabase.from("announcements").insert(payload);

    if (error) {
      console.error(error);
      notify("Erreur Supabase");
      return;
    }

    const wasEditing = Boolean(editingAnnouncementId);

    setAnnouncementDraft(emptyAnnouncement);
    setEditingAnnouncementId(null);
    await loadAnnouncementsFromSupabase();
    notify(wasEditing ? "Annonce mise à jour" : "Annonce publiée");
  }

  function editAnnouncement(announcement: Announcement) {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementDraft({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
    });
  }

  async function deleteAnnouncement(id: string) {
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      console.error(error);
      notify("Erreur suppression");
      return;
    }

    if (editingAnnouncementId === id) {
      setEditingAnnouncementId(null);
      setAnnouncementDraft(emptyAnnouncement);
    }

    await loadAnnouncementsFromSupabase();
    notify("Annonce supprimée");
  }

  async function submitEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventDraft.title.trim() || !eventDraft.date.trim()) {
      return;
    }

    const payload = {
      title: eventDraft.title.trim(),
      date: eventDraft.date.trim(),
      description: eventDraft.description.trim() || "Détails à compléter.",
    };

    const { error } = editingEventId
      ? await supabase
          .from("evenements")
          .update(payload)
          .eq("id", Number(editingEventId))
      : await supabase.from("evenements").insert(payload);

    if (error) {
      console.error(error);
      notify("Erreur Supabase événements");
      return;
    }

    const wasEditing = Boolean(editingEventId);

    setEventDraft(emptyEvent);
    setEditingEventId(null);
    await loadEventsFromSupabase();
    notify(wasEditing ? "Evénement mis à jour" : "Evénement ajouté");
  }

  function editEvent(eventItem: Event) {
    setEditingEventId(eventItem.id);
    setEventDraft({
      title: eventItem.title,
      date: eventItem.date,
      description: eventItem.description,
    });
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("evenements").delete().eq("id", Number(id));

    if (error) {
      console.error(error);
      notify("Erreur suppression événement");
      return;
    }

    if (editingEventId === id) {
      setEditingEventId(null);
      setEventDraft(emptyEvent);
    }

    await loadEventsFromSupabase();
    notify("Evénement supprimé");
  }

  async function deleteSale(id: string) {
    const { error } = await supabase.from("ventes").delete().eq("id", Number(id));

    if (error) {
      console.error("Erreur suppression vente:", error);
      notify(`Erreur suppression: ${error.message}`);
      return;
    }

    await loadSalesFromSupabase();
    notify("Vente supprimée");
  }

  function readGalleryImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setGalleryDraft((current) => ({
          ...current,
          image: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitGallery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!galleryDraft.title.trim()) {
      return;
    }

    const payload = {
      title: galleryDraft.title.trim(),
      description: galleryDraft.description.trim() || "Archive visuelle Lunaeria",
      category: galleryDraft.category.trim() || "Guilde",
      image: galleryDraft.image,
    };

    const query = editingGalleryId
      ? supabase
          .from("galerie")
          .update(payload)
          .eq("id", editingGalleryId)
          .select()
      : supabase.from("galerie").insert(payload).select();

    const { error } = await query;

    if (error) {
      console.error("Erreur Supabase galerie:", error);
      notify(`Erreur galerie: ${error.message}`);
      return;
    }

    const wasEditing = Boolean(editingGalleryId);

    setGalleryDraft(emptyGallery);
    setEditingGalleryId(null);
    await loadGalleryFromSupabase();
    notify(wasEditing ? "Image mise à jour" : "Image ajoutée");
  }

  function editGallery(item: GalleryItem) {
    setEditingGalleryId(item.id);
    setGalleryDraft({
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image,
    });
  }

  async function deleteGallery(id: string) {
    const { error } = await supabase.from("galerie").delete().eq("id", id);

    if (error) {
      console.error("Erreur suppression galerie:", error);
      notify(`Erreur suppression: ${error.message}`);
      return;
    }

    if (editingGalleryId === id) {
      setEditingGalleryId(null);
      setGalleryDraft(emptyGallery);
    }

    await loadGalleryFromSupabase();
    notify("Image supprimée");
  }

  async function persistRegulation() {
    const { error } = await supabase
      .from("reglement")
      .upsert({
        id: 1,
        body: regulationDraft,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(error);
      notify("Erreur sauvegarde règlement");
      return;
    }

    setContent((current) => ({
      ...current,
      regulation: {
        ...current.regulation,
        body: regulationDraft,
      },
    }));
    notify("Règlement sauvegardé");
  }

  async function submitUsefulLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!linkDraft.title.trim() || !linkDraft.url.trim()) {
      return;
    }

    const payload = {
      title: linkDraft.title.trim(),
      description: linkDraft.description.trim(),
      url: linkDraft.url.trim(),
      section: linkDraft.section,
    };

    const query = editingLinkId
      ? supabase
          .from("useful_links")
          .update(payload)
          .eq("id", editingLinkId)
          .select()
      : supabase.from("useful_links").insert(payload).select();

    const { error } = await query;

    if (error) {
      console.error("Erreur Supabase liens:", error);
      notify(`Erreur liens: ${error.message}`);
      return;
    }

    const wasEditing = Boolean(editingLinkId);

    setLinkDraft(emptyUsefulLink);
    setEditingLinkId(null);
    await loadUsefulLinksFromSupabase();
    notify(wasEditing ? "Lien mis à jour" : "Lien ajouté");
  }

  function editUsefulLink(link: UsefulLink) {
    setEditingLinkId(link.id);
    setLinkDraft({
      title: link.title,
      description: link.description,
      url: link.url,
      section: link.section,
    });
  }

  async function deleteUsefulLink(id: string) {
    const { error } = await supabase.from("useful_links").delete().eq("id", id);

    if (error) {
      console.error("Erreur suppression lien:", error);
      notify(`Erreur suppression: ${error.message}`);
      return;
    }

    if (editingLinkId === id) {
      setEditingLinkId(null);
      setLinkDraft(emptyUsefulLink);
    }

    await loadUsefulLinksFromSupabase();
    notify("Lien supprimé");
  }

  function readBuildImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBuildDraft((current) => ({ ...current, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function submitBuild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!buildDraft.title.trim()) {
      notify("Nom du build obligatoire");
      return;
    }

    const classImage = getClassImage(buildDraft.className);
    const elements = buildDraft.elements.length ? buildDraft.elements : ["Multi"];
    const payload = {
      title: buildDraft.title.trim(),
      game_pseudo: buildDraft.gamePseudo.trim(),
      discord_pseudo: buildDraft.discordPseudo.trim(),
      class_name: buildDraft.className,
      class_image: classImage,
      elements,
      element_icons: elements.map((item) => getElement(item)?.icon ?? "✦"),
      orientation: buildDraft.orientation.trim(),
      mode: buildDraft.mode,
      budget: buildDraft.budget,
      level: buildDraft.level,
      dofusbook_url: buildDraft.dofusbookUrl.trim() || "https://www.dofusbook.net",
      description: buildDraft.description.trim(),
      image: buildDraft.image || classImage,
    };

    const query = editingBuildId
      ? supabase
          .from("builds")
          .update(payload)
          .eq("id", editingBuildId)
          .select()
      : supabase.from("builds").insert(payload).select();

    const { error } = await query;

    if (error) {
      console.error("Erreur Supabase builds:", error);
      notify(`Erreur builds: ${error.message}`);
      return;
    }

    const wasEditing = Boolean(editingBuildId);

    setBuildDraft(emptyBuild);
    setEditingBuildId(null);
    await loadBuildsFromSupabase();
    notify(wasEditing ? "Build mis à jour" : "Build ajouté");
  }

  function editBuild(build: BuildItem) {
    setEditingBuildId(build.id);
    setBuildDraft({
      title: build.title,
      gamePseudo: build.gamePseudo,
      discordPseudo: build.discordPseudo,
      className: build.className,
      elements: build.elements,
      orientation: build.orientation,
      mode: build.mode,
      budget: build.budget,
      level: build.level,
      dofusbookUrl: build.dofusbookUrl,
      description: build.description,
      image: build.image,
    });
  }

  async function deleteBuild(id: string) {
    const { error } = await supabase.from("builds").delete().eq("id", id)

    if (error) {
      console.error("Erreur suppression build:", error);
      notify(`Erreur suppression: ${error.message}`);
      return;
    }

    if (editingBuildId === id) {
      setEditingBuildId(null);
      setBuildDraft(emptyBuild);
    }

    await loadBuildsFromSupabase();
    notify("Build supprimé");
  }

  function activateSection(key: string) {
    setActiveSection(key);
  }

  useEffect(() => {
    if (isLoaded) {
      const timeout = window.setTimeout(() => {
        loadHomepageSettingsFromSupabase();
        loadReglementFromSupabase();
        loadSupabaseContent();
      }, 0);

      return () => window.clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030512] text-slate-100">
      <div className="aurora-bg fixed inset-0" />
      <div className="rune-grid fixed inset-0" />
      <div className="star-veil fixed inset-0 opacity-45" />
      <div className="fog-veil fixed inset-0" />

      {toast ? (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200/18 bg-[#071421]/92 px-4 py-3 text-sm font-black text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.18)] backdrop-blur-md">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      ) : null}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[290px_1fr]">
        <aside className="sidebar-shell relative border-b border-violet-200/8 bg-[#040719]/88 p-4 shadow-[24px_0_76px_rgba(0,0,0,0.48),0_0_24px_rgba(76,29,149,0.065)] backdrop-blur-md lg:min-h-screen lg:border-b-0 lg:border-r lg:p-5">
          <div className="relative z-10 flex items-center gap-3 rounded-[1.55rem] border border-violet-200/10 bg-violet-100/[0.032] p-3 shadow-[inset_0_1px_0_rgba(196,181,253,0.05),0_0_16px_rgba(76,29,149,0.055)]">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_18px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(237,233,254,0.42)]">
              <LunaeriaLogo size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black tracking-[0.22em] text-violet-50">
                LUNAERIA
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-violet-100/70">
                Admin v2
              </p>
            </div>
          </div>

          <nav className="relative z-10 mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;

              return (
                <a
                  className={`group/nav flex min-h-12 items-center gap-3 rounded-2xl border px-3 text-sm font-bold transition duration-300 ${
                    isActive
                      ? "border-violet-200/18 bg-violet-100/[0.07] text-violet-50 shadow-[0_0_16px_rgba(124,58,237,0.12)]"
                      : "border-transparent text-slate-400 hover:border-violet-200/14 hover:bg-violet-100/[0.04] hover:text-violet-100"
                  }`}
                  href={`#${item.key}`}
                  key={item.key}
                  onClick={() => activateSection(item.key)}
                >
                  <Icon
                    className="shrink-0 transition duration-300 group-hover/nav:scale-105 group-hover/nav:drop-shadow-[0_0_6px_rgba(196,181,253,0.26)]"
                    size={18}
                  />
                  <span className="min-w-0 truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="relative z-10 mt-5 rounded-[1.45rem] border border-violet-100/10 bg-[#030512]/64 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl border border-violet-100/12 bg-violet-100/[0.045] text-violet-100">
                <LockKeyhole size={17} />
              </div>
              <div>
                <p className="text-sm font-black text-violet-50">
                  Gate temporaire
                </p>
                <p className="text-xs text-slate-500">
                  Structure prête pour Discord OAuth.
                </p>
              </div>
            </div>
            <AdminButton
              className="mt-4 w-full"
              onClick={isAdmin ? handleAdminLogout : undefined}
              variant={isAdmin ? "ghost" : "primary"}
            >
              <ShieldCheck size={17} />
              {isAdmin ? "Déconnexion" : "Connexion requise"}
            </AdminButton>
          </div>
        </aside>

        <div className="relative px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {!isAdmin ? (
            <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-3xl place-items-center">
              <div className="premium-card rounded-[2rem] border border-violet-200/12 bg-[#06091b]/78 p-7 text-center shadow-[0_42px_120px_rgba(0,0,0,0.58),0_0_30px_rgba(76,29,149,0.09)] backdrop-blur-md sm:p-10">
                <div className="relative z-10 mx-auto grid size-16 place-items-center rounded-3xl border border-violet-100/18 bg-violet-100/[0.055] text-violet-100 shadow-[0_0_24px_rgba(139,92,246,0.18)]">
                  <LockKeyhole size={26} />
                </div>
                <p className="relative z-10 mt-6 text-xs font-black uppercase tracking-[0.28em] text-violet-200">
                  Accès administrateur
                </p>
                <h1 className="legend-title relative z-10 mt-3 text-3xl font-black text-violet-50 sm:text-5xl">
                  Lunaeria Command Center
                </h1>
                <p className="relative z-10 mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  Connecte-toi avec ton compte Supabase Auth pour accéder au
                  panel d&apos;administration Lunaeria.
                </p>

                <form className="relative z-10 mt-7 grid gap-3 text-left" onSubmit={handleAdminLogin}>
                  <AdminField label="Email admin">
                    <AdminInput
                      autoComplete="email"
                      onChange={(event) => setAuthEmail(event.target.value)}
                      placeholder="email@exemple.com"
                      type="email"
                      value={authEmail}
                    />
                  </AdminField>
                  <AdminField label="Mot de passe">
                    <AdminInput
                      autoComplete="current-password"
                      onChange={(event) => setAuthPassword(event.target.value)}
                      placeholder="Mot de passe"
                      type="password"
                      value={authPassword}
                    />
                  </AdminField>

                  {authError ? (
                    <p className="rounded-2xl border border-rose-200/20 bg-rose-300/[0.06] px-4 py-3 text-sm font-bold text-rose-100">
                      {authError}
                    </p>
                  ) : null}

                  <AdminButton className="w-full" disabled={authLoading} type="submit">
                    {authLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                    {authLoading ? "Vérification..." : "Se connecter"}
                  </AdminButton>
                </form>
              </div>
            </section>
          ) : (
            <div className="mx-auto max-w-7xl">
              <header className="premium-card rounded-[2rem] border border-violet-200/10 bg-[#06091b]/72 p-6 shadow-[0_42px_120px_rgba(0,0,0,0.5),0_0_28px_rgba(76,29,149,0.075)] backdrop-blur-md sm:p-8">
                <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-200">
                      Dashboard administrateur
                    </p>
                    <h1 className="legend-title mt-3 text-4xl font-black text-violet-50 sm:text-6xl">
                      Piloter Lunaeria
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                      Toutes les éditions écrivent maintenant dans Supabase et sont
                      synchronisées avec le site public.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-violet-200/12 bg-[#030512]/68 px-4 py-3 text-sm font-black text-violet-100">
                    {isLoaded ? (
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 size={17} /> Données chargées
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="animate-spin" size={17} /> Chargement
                      </span>
                    )}
                  </div>
                </div>
              </header>

              <AdminSection className="mt-5" id="overview">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <article
                        className="premium-card rounded-[1.35rem] border border-violet-200/9 bg-[#06091b]/66 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/18"
                        key={stat.label}
                      >
                        <div className="relative z-10 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-violet-50">
                              {stat.label}
                            </p>
                            <p className="mt-3 text-3xl font-black text-violet-100">
                              {stat.value}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              {stat.detail}
                            </p>
                          </div>
                          <Icon className="shrink-0 text-violet-100/72" size={19} />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </AdminSection>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <AdminSection className="xl:col-span-2" id="accueil">
                  <AdminCard
                    action={
                      <AdminButton onClick={persistHero}>
                        <Save size={17} />
                        Sauvegarder
                      </AdminButton>
                    }
                    icon={Home}
                    title="Editeur homepage"
                  >
                    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                      <div className="grid gap-4">
                        <AdminField label="Titre principal">
                          <AdminInput
                            onChange={(event) =>
                              setHeroDraft((current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                            }
                            value={heroDraft.title}
                          />
                        </AdminField>
                        <AdminField label="Sous-titre">
                          <AdminTextarea
                            onChange={(event) =>
                              setHeroDraft((current) => ({
                                ...current,
                                subtitle: event.target.value,
                              }))
                            }
                            value={heroDraft.subtitle}
                          />
                        </AdminField>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <AdminField label="Texte bouton">
                            <AdminInput
                              onChange={(event) =>
                                setHeroDraft((current) => ({
                                  ...current,
                                  buttonText: event.target.value,
                                }))
                              }
                              value={heroDraft.buttonText}
                            />
                          </AdminField>
                          <AdminField label="Lien bouton">
                            <AdminInput
                              onChange={(event) =>
                                setHeroDraft((current) => ({
                                  ...current,
                                  buttonLink: event.target.value,
                                }))
                              }
                              value={heroDraft.buttonLink}
                            />
                          </AdminField>
                        </div>
                        <button
                          className={`flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-4 text-left transition ${
                            recruitmentDraft.isOpen
                              ? "border-emerald-200/18 bg-emerald-300/[0.055] text-emerald-100"
                              : "border-rose-200/18 bg-rose-300/[0.055] text-rose-100"
                          }`}
                          onClick={() =>
                            setRecruitmentDraft((current) => ({
                              ...current,
                              isOpen: !current.isOpen,
                            }))
                          }
                          type="button"
                        >
                          <span>
                            <span className="block text-sm font-black">
                              {recruitmentDraft.isOpen
                                ? "Recrutement ouvert"
                                : "Recrutement fermé"}
                            </span>
                            <span className="mt-1 block text-xs opacity-75">
                              Ce statut apparaît dans le hero public.
                            </span>
                          </span>
                          <CheckCircle2 size={20} />
                        </button>
                      </div>
                      <div className="rounded-[1.45rem] border border-violet-100/10 bg-[#030512]/66 p-5 shadow-[inset_0_0_18px_rgba(196,181,253,0.026)]">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-200">
                          Aperçu live
                        </p>
                        <h3 className="mt-4 text-3xl font-black text-violet-50">
                          {heroDraft.title || "Titre vide"}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {heroDraft.subtitle || "Sous-titre vide"}
                        </p>
                        <span className="mt-5 inline-flex rounded-full border border-violet-100/10 bg-violet-100/[0.045] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-violet-100">
                          {heroDraft.buttonText || "Bouton vide"}
                        </span>
                      </div>
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection id="annonces">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.announcements.length} annonces
                      </span>
                    }
                    icon={Megaphone}
                    title="Annonces"
                  >
                    <form className="grid gap-3" onSubmit={submitAnnouncement}>
                      <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                        <AdminInput
                          onChange={(event) =>
                            setAnnouncementDraft((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          placeholder="Titre de l'annonce"
                          value={announcementDraft.title}
                        />
                        <AdminInput
                          onChange={(event) =>
                            setAnnouncementDraft((current) => ({
                              ...current,
                              category: event.target.value,
                            }))
                          }
                          placeholder="Catégorie"
                          value={announcementDraft.category}
                        />
                      </div>
                      <AdminTextarea
                        onChange={(event) =>
                          setAnnouncementDraft((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        placeholder="Contenu"
                        value={announcementDraft.content}
                      />
                      <div className="flex flex-wrap gap-3">
                        <AdminButton type="submit">
                          {editingAnnouncementId ? <Save size={17} /> : <Plus size={17} />}
                          {editingAnnouncementId ? "Mettre à jour" : "Créer"}
                        </AdminButton>
                        {editingAnnouncementId ? (
                          <AdminButton
                            onClick={() => {
                              setEditingAnnouncementId(null);
                              setAnnouncementDraft(emptyAnnouncement);
                            }}
                            variant="ghost"
                          >
                            <X size={17} />
                            Annuler
                          </AdminButton>
                        ) : null}
                      </div>
                    </form>

                    <div className="mt-5 grid gap-3">
                      {content.announcements.map((item) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/16"
                          key={item.id}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-violet-50">
                                {item.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {item.content}
                              </p>
                              <span className="mt-3 inline-flex rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-200">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <AdminButton
                                aria-label={`Modifier ${item.title}`}
                                className="size-10 p-0"
                                onClick={() => editAnnouncement(item)}
                                variant="ghost"
                              >
                                <Pencil size={15} />
                              </AdminButton>
                              <AdminButton
                                aria-label={`Supprimer ${item.title}`}
                                className="size-10 p-0"
                                onClick={() => deleteAnnouncement(item.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection id="evenements">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.events.length} événements
                      </span>
                    }
                    icon={CalendarDays}
                    title="Evénements"
                  >
                    <form className="grid gap-3" onSubmit={submitEvent}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminInput
                          onChange={(event) =>
                            setEventDraft((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          placeholder="Titre"
                          value={eventDraft.title}
                        />
                        <AdminInput
                          onChange={(event) =>
                            setEventDraft((current) => ({
                              ...current,
                              date: event.target.value,
                            }))
                          }
                          placeholder="Date ou créneau"
                          value={eventDraft.date}
                        />
                      </div>
                      <AdminTextarea
                        onChange={(event) =>
                          setEventDraft((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Description"
                        value={eventDraft.description}
                      />
                      <div className="flex flex-wrap gap-3">
                        <AdminButton type="submit">
                          {editingEventId ? <Save size={17} /> : <Plus size={17} />}
                          {editingEventId ? "Mettre à jour" : "Ajouter"}
                        </AdminButton>
                        {editingEventId ? (
                          <AdminButton
                            onClick={() => {
                              setEditingEventId(null);
                              setEventDraft(emptyEvent);
                            }}
                            variant="ghost"
                          >
                            <X size={17} />
                            Annuler
                          </AdminButton>
                        ) : null}
                      </div>
                    </form>

                    <div className="mt-5 grid gap-3">
                      {content.events.map((item) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/16"
                          key={item.id}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-violet-50">
                                {item.title}
                              </p>
                              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#e8dcbd]">
                                {item.date}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <AdminButton
                                aria-label={`Modifier ${item.title}`}
                                className="size-10 p-0"
                                onClick={() => editEvent(item)}
                                variant="ghost"
                              >
                                <Pencil size={15} />
                              </AdminButton>
                              <AdminButton
                                aria-label={`Supprimer ${item.title}`}
                                className="size-10 p-0"
                                onClick={() => deleteEvent(item.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection id="ventes">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.sales.length} ventes
                      </span>
                    }
                    icon={ShoppingBag}
                    title="Ventes"
                  >
                    <div className="grid gap-3">
                      {content.sales.map((sale) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4"
                          key={sale.id}
                        >
                          <div className="flex items-start gap-3">
                            <Image
                              alt={sale.itemName}
                              className="size-16 rounded-2xl border border-violet-100/10 bg-[#030512]/70 object-contain p-2"
                              height={64}
                              src={sale.imageUrl}
                              width={64}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-violet-50">
                                {sale.itemName}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {sale.category} · x{sale.quantity} · {sale.price} k
                              </p>
                              <p className="mt-2 text-sm text-slate-400">
                                {sale.sellerGameName} / {sale.sellerDiscordName}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => deleteSale(sale.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                      {content.sales.length === 0 ? (
                        <div className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4 text-sm font-bold text-violet-100/65">
                          Aucune vente publiée.
                        </div>
                      ) : null}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection className="xl:col-span-2" id="galerie">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.gallery.length} images
                      </span>
                    }
                    icon={Images}
                    title="Galerie"
                  >
                    <form className="grid gap-3" onSubmit={submitGallery}>
                      <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                        <label className="grid min-h-40 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-violet-100/18 bg-[#030512]/70 p-3 text-center text-xs text-violet-100">
                          {galleryDraft.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt="Aperçu galerie"
                              className="size-full max-h-40 rounded-xl object-cover"
                              src={galleryDraft.image}
                            />
                          ) : (
                            <span className="grid place-items-center">
                              <ImagePlus className="mb-2" size={22} />
                              Image galerie
                            </span>
                          )}
                          <input
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                readGalleryImage(file);
                              }
                            }}
                            type="file"
                          />
                        </label>
                        <div className="grid gap-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <AdminInput
                              onChange={(event) =>
                                setGalleryDraft((current) => ({
                                  ...current,
                                  title: event.target.value,
                                }))
                              }
                              placeholder="Titre"
                              value={galleryDraft.title}
                            />
                            <AdminInput
                              onChange={(event) =>
                                setGalleryDraft((current) => ({
                                  ...current,
                                  category: event.target.value,
                                }))
                              }
                              placeholder="Catégorie"
                              value={galleryDraft.category}
                            />
                          </div>
                          <AdminTextarea
                            onChange={(event) =>
                              setGalleryDraft((current) => ({
                                ...current,
                                description: event.target.value,
                              }))
                            }
                            placeholder="Description"
                            value={galleryDraft.description}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <AdminButton type="submit">
                          {editingGalleryId ? <Save size={17} /> : <Plus size={17} />}
                          {editingGalleryId ? "Mettre à jour" : "Ajouter"}
                        </AdminButton>
                        {editingGalleryId ? (
                          <AdminButton
                            onClick={() => {
                              setEditingGalleryId(null);
                              setGalleryDraft(emptyGallery);
                            }}
                            variant="ghost"
                          >
                            <X size={17} />
                            Annuler
                          </AdminButton>
                        ) : null}
                      </div>
                    </form>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {content.gallery.map((item) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4"
                          key={item.id}
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-violet-100/10 bg-[linear-gradient(135deg,#060b22,#240a42_54%,#030512)]">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt={item.title}
                                  className="size-full object-cover"
                                  src={item.image}
                                />
                              ) : (
                                <Images className="text-violet-100/70" size={22} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-violet-50">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-violet-200/80">
                                {item.category}
                              </p>
                              <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => editGallery(item)}
                                variant="ghost"
                              >
                                <Pencil size={15} />
                              </AdminButton>
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => deleteGallery(item.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection id="stuffs">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.builds.length} builds
                      </span>
                    }
                    icon={ShieldCheck}
                    title="Stuff & Build"
                  >
                    <form className="grid gap-3" onSubmit={submitBuild}>
                      <div className="grid gap-3 md:grid-cols-[130px_1fr]">
                        <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-violet-100/18 bg-[#030512]/70 p-3 text-center text-xs text-violet-100">
                          <ImagePlus className="mb-2" size={20} />
                          Image
                          <input
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                readBuildImage(file);
                              }
                            }}
                            type="file"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt="Aperçu build"
                            className="mt-3 size-20 rounded-2xl object-cover"
                            src={buildDraft.image || getClassImage(buildDraft.className)}
                          />
                        </label>
                        <div className="grid gap-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  title: event.target.value,
                                }))
                              }
                              placeholder="Nom du stuff"
                              value={buildDraft.title}
                            />
                            <select
                              className="min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none"
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  className: event.target.value,
                                }))
                              }
                              value={buildDraft.className}
                            >
                              {dofusClasses.map((item) => (
                                <option key={item.name} value={item.name}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  gamePseudo: event.target.value,
                                }))
                              }
                              placeholder="Pseudo en jeu"
                              value={buildDraft.gamePseudo}
                            />
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  discordPseudo: event.target.value,
                                }))
                              }
                              placeholder="Pseudo Discord"
                              value={buildDraft.discordPseudo}
                            />
                            <select
                              className="min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none"
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  mode: event.target.value as "PvM" | "PvP",
                                }))
                              }
                              value={buildDraft.mode}
                            >
                              <option value="PvM">PvM</option>
                              <option value="PvP">PvP</option>
                            </select>
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  budget: event.target.value,
                                }))
                              }
                              placeholder="Budget"
                              value={buildDraft.budget}
                            />
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  level: event.target.value,
                                }))
                              }
                              placeholder="Niveau"
                              value={buildDraft.level}
                            />
                            <AdminInput
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  orientation: event.target.value,
                                }))
                              }
                              placeholder="Orientation"
                              value={buildDraft.orientation}
                            />
                            <AdminInput
                              className="sm:col-span-2"
                              onChange={(event) =>
                                setBuildDraft((current) => ({
                                  ...current,
                                  dofusbookUrl: event.target.value,
                                }))
                              }
                              placeholder="URL Dofusbook"
                              value={buildDraft.dofusbookUrl}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {dofusElements.map((item) => {
                              const active = buildDraft.elements.includes(item.label);
                              return (
                                <button
                                  className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                                    active ? "bg-violet-100/[0.08]" : "bg-[#030512]/60"
                                  }`}
                                  key={item.label}
                                  onClick={() =>
                                    setBuildDraft((current) => ({
                                      ...current,
                                      elements: active
                                        ? current.elements.filter(
                                            (entry) => entry !== item.label,
                                          )
                                        : [...current.elements, item.label],
                                    }))
                                  }
                                  style={{
                                    borderColor: `${item.accent}66`,
                                    color: item.accent,
                                  }}
                                  type="button"
                                >
                                  {item.icon} {item.label}
                                </button>
                              );
                            })}
                          </div>
                          <AdminTextarea
                            onChange={(event) =>
                              setBuildDraft((current) => ({
                                ...current,
                                description: event.target.value,
                              }))
                            }
                            placeholder="Description"
                            value={buildDraft.description}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <AdminButton type="submit">
                          {editingBuildId ? <Save size={17} /> : <Plus size={17} />}
                          {editingBuildId ? "Mettre à jour" : "Ajouter"}
                        </AdminButton>
                        {editingBuildId ? (
                          <AdminButton
                            onClick={() => {
                              setEditingBuildId(null);
                              setBuildDraft(emptyBuild);
                            }}
                            variant="ghost"
                          >
                            <X size={17} />
                            Annuler
                          </AdminButton>
                        ) : null}
                      </div>
                    </form>

                    <div className="mt-5 grid gap-3">
                      {content.builds.map((build) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4"
                          key={build.id}
                        >
                          <div className="flex items-start gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt={build.className}
                              className="size-16 rounded-2xl border border-violet-100/10 bg-[#030512]/70 object-cover"
                              src={build.classImage}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-violet-50">
                                {build.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {build.className} · {build.mode} · Niv. {build.level}
                              </p>
                              <p className="mt-2 text-sm text-slate-400">
                                {build.elements.join(", ")} · {build.budget}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => editBuild(build)}
                                variant="ghost"
                              >
                                <Pencil size={15} />
                              </AdminButton>
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => deleteBuild(build.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection className="xl:col-span-2" id="reglement">
                  <AdminCard
                    action={
                      <AdminButton onClick={persistRegulation}>
                        <Save size={17} />
                        Sauvegarder
                      </AdminButton>
                    }
                    icon={FileText}
                    title="Règlement"
                  >
                    <AdminTextarea
                      className="min-h-[420px] font-mono text-sm leading-7"
                      onChange={(event) => setRegulationDraft(event.target.value)}
                      value={regulationDraft}
                    />
                  </AdminCard>
                </AdminSection>

                <AdminSection className="xl:col-span-2" id="liens">
                  <AdminCard
                    action={
                      <span className="rounded-full border border-violet-100/10 bg-[#030512]/70 px-3 py-1 text-xs font-black text-violet-100">
                        {content.usefulLinks.length} liens
                      </span>
                    }
                    icon={LinkIcon}
                    title="Liens utiles"
                  >
                    <form className="grid gap-3" onSubmit={submitUsefulLink}>
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_170px]">
                        <AdminInput
                          onChange={(event) =>
                            setLinkDraft((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          placeholder="Titre"
                          value={linkDraft.title}
                        />
                        <AdminInput
                          onChange={(event) =>
                            setLinkDraft((current) => ({
                              ...current,
                              url: event.target.value,
                            }))
                          }
                          placeholder="URL"
                          value={linkDraft.url}
                        />
                        <select
                          className="min-h-12 rounded-2xl border border-violet-100/10 bg-[#030512]/72 px-4 text-sm font-semibold text-violet-50 outline-none"
                          onChange={(event) =>
                            setLinkDraft((current) => ({
                              ...current,
                              section: event.target.value as "general" | "specific",
                            }))
                          }
                          value={linkDraft.section}
                        >
                          <option value="general">Outils généraux</option>
                          <option value="specific">Guides spécifiques</option>
                        </select>
                      </div>
                      <AdminTextarea
                        onChange={(event) =>
                          setLinkDraft((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Description"
                        value={linkDraft.description}
                      />
                      <div className="flex flex-wrap gap-3">
                        <AdminButton type="submit">
                          {editingLinkId ? <Save size={17} /> : <Plus size={17} />}
                          {editingLinkId ? "Mettre à jour" : "Ajouter"}
                        </AdminButton>
                        {editingLinkId ? (
                          <AdminButton
                            onClick={() => {
                              setEditingLinkId(null);
                              setLinkDraft(emptyUsefulLink);
                            }}
                            variant="ghost"
                          >
                            <X size={17} />
                            Annuler
                          </AdminButton>
                        ) : null}
                      </div>
                    </form>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {content.usefulLinks.map((link) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4"
                          key={link.id}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-black text-violet-50">
                                {link.title}
                              </p>
                              <p className="mt-2 text-sm text-slate-400">
                                {link.description}
                              </p>
                              <p className="mt-2 truncate text-xs text-violet-200/80">
                                {link.url}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => editUsefulLink(link)}
                                variant="ghost"
                              >
                                <Pencil size={15} />
                              </AdminButton>
                              <AdminButton
                                className="size-10 p-0"
                                onClick={() => deleteUsefulLink(link.id)}
                                variant="danger"
                              >
                                <Trash2 size={15} />
                              </AdminButton>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>

                <AdminSection className="xl:col-span-2" id="parametres">
                  <AdminCard icon={Settings} title="Paramètres">
                    <div className="grid gap-4 lg:grid-cols-3">
                      {[
                        ["Authentification", "Fake gate actif, Discord OAuth prévu."],
                        ["Stockage", "Supabase partagé entre admin et homepage."],
                        ["Publication", "Refresh homepage suffisant, live entre onglets."],
                      ].map(([title, detail]) => (
                        <article
                          className="rounded-2xl border border-violet-100/9 bg-violet-50/[0.035] p-4"
                          key={title}
                        >
                          <Bell className="text-violet-100/70" size={18} />
                          <p className="mt-4 text-sm font-black text-violet-50">
                            {title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {detail}
                          </p>
                        </article>
                      ))}
                    </div>
                  </AdminCard>
                </AdminSection>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
