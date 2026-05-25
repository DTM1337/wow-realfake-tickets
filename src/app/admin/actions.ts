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

export async function deleteSubmission(id: string) {
  await assertAdmin();

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
