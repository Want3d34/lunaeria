import { supabase } from "./supabase";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) {
  console.warn("Erreur Supabase annonces:", error.message);
  return [];
}

  return data as Announcement[];
}

export async function createAnnouncement(
  announcement: Omit<Announcement, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(announcement)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data as Announcement;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}