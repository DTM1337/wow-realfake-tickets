"use server";

import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteSubmission(id: string) {
  const supabase = createServiceClient();
  if (!supabase) return;

  const { data } = await supabase
    .from("scam_applications")
    .select("attachment_paths, ticket_image_path")
    .eq("id", id)
    .single();

  if (data) {
    const paths = Array.isArray(data.attachment_paths)
      ? data.attachment_paths
      : data.ticket_image_path
        ? [data.ticket_image_path]
        : [];
    if (paths.length > 0) {
      await supabase.storage.from("scam-proof").remove(paths);
    }
  }

  await supabase.from("scam_applications").delete().eq("id", id);
  revalidatePath("/admin");
}
