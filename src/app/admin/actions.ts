"use server";

import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { isValidToken, COOKIE } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const token = (await cookies()).get(COOKIE)?.value ?? "";
  if (!isValidToken(token)) {
    throw new Error("Unauthorized");
  }
}

export async function deleteSubmission(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Din session har gått ut. Logga ut och in igen." };
  }

  const supabase = createServiceClient();
  if (!supabase) return { error: "Supabase är inte konfigurerat." };

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
      const { error: removeErr } = await supabase.storage.from("scam-proof").remove(paths);
      if (removeErr) {
        return { error: `Kunde inte ta bort bilagor: ${removeErr.message}` };
      }
    }
  }

  const { error: delErr } = await supabase.from("scam_applications").delete().eq("id", id);
  if (delErr) {
    return { error: `Kunde inte ta bort raden: ${delErr.message}` };
  }

  revalidatePath("/admin");
  return {};
}
