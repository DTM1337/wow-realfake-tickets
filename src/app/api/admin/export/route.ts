import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { isValidToken, COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get(COOKIE)?.value ?? "";
  if (!isValidToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: rows, error } = await supabase
    .from("scam_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate signed URLs (6h) for each submission's attachments
  const submissions = await Promise.all(
    (rows ?? []).map(async (row) => {
      const paths: string[] = Array.isArray(row.attachment_paths)
        ? row.attachment_paths
        : row.ticket_image_path
          ? [row.ticket_image_path]
          : [];

      const attachments = (
        await Promise.all(
          paths.map(async (p, i) => {
            const ext = p.split(".").pop() ?? "jpg";
            const filename = `${row.id}-${i + 1}.${ext}`;
            const { data } = await supabase.storage.from("scam-proof").createSignedUrl(p, 21600);
            return data?.signedUrl ? { filename, url: data.signedUrl } : null;
          })
        )
      ).filter(Boolean) as { filename: string; url: string }[];

      return {
        id: row.id,
        name: row.name,
        city: row.city,
        country: row.country,
        email: row.email,
        age: row.age,
        artist: row.artist,
        story: row.story,
        created_at: row.created_at,
        attachments,
      };
    })
  );

  return NextResponse.json({ submissions });
}
