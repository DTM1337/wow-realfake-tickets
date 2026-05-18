import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Tar emot scam-proof-formuläret (multipart/form-data):
 *  - laddar upp bildbilagor till storage-bucketen "scam-proof"
 *  - sparar en rad i tabellen scam_applications
 *
 * OBS: Vercels serverless-functions har ~4,5 MB body-gräns. Om bilderna
 * kan bli större — byt till en signerad uppladdnings-URL direkt mot Supabase
 * Storage och skicka bara metadata hit. Se README.
 */
export async function POST(req: Request) {
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase är inte konfigurerat ännu." },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const city = String(form.get("city") || "").trim();
  const country = String(form.get("country") || "").trim();
  const email = String(form.get("email") || "").trim();
  const artist = String(form.get("artist") || "").trim();
  const story = String(form.get("story") || "").trim();
  const attachments = form
    .getAll("attachments")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!name || !city || !country || !email || !artist || !story) {
    return NextResponse.json(
      { error: "Fyll i alla obligatoriska fält." },
      { status: 400 }
    );
  }

  const attachmentPaths: string[] = [];
  for (const file of attachments) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Bilagor måste vara bilder." },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = randomUUID() + "." + ext;

    const { error: upErr } = await supabase.storage
      .from("scam-proof")
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
      });

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    attachmentPaths.push(path);
  }

  const { error: insErr } = await supabase
    .from("scam_applications")
    .insert({
      name,
      city,
      country,
      email,
      artist,
      story,
      attachment_paths: attachmentPaths,
      ticket_image_path: attachmentPaths[0] || null,
      terms_accepted: true,
    });

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
