import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase";
import AdminClient from "./AdminClient";
import "./admin.css";

export const dynamic = "force-dynamic";

const COOKIE = "wow_admin";

/*
 * OBS: detta är ett enkelt scaffold-skydd — ett lösenord i en cookie.
 * Innan lansering: byt mot Supabase Auth, eller slå på Vercels
 * deployment-protection / password-protection på /admin-routen.
 */

async function login(formData: FormData) {
  "use server";
  const pw = String(formData.get("password") || "");
  if (pw && pw === process.env.ADMIN_PASSWORD) {
    (await cookies()).set(COOKIE, pw, {
      httpOnly: true,
      sameSite: "lax",
      path: "/admin",
    });
  }
  revalidatePath("/admin");
}

async function logout() {
  "use server";
  (await cookies()).delete(COOKIE);
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const authed =
    !!process.env.ADMIN_PASSWORD &&
    (await cookies()).get(COOKIE)?.value === process.env.ADMIN_PASSWORD;

  if (!authed) {
    return (
      <main className="admin admin--login">
        <form action={login} className="admin__loginForm">
          <h1>Admin</h1>
          <input
            name="password"
            type="password"
            placeholder="Lösenord"
            autoFocus
          />
          <button type="submit">Logga in</button>
          {!process.env.ADMIN_PASSWORD && (
            <p className="admin__warn">
              Sätt ADMIN_PASSWORD i .env.local för att aktivera inloggning.
            </p>
          )}
        </form>
      </main>
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return (
      <main className="admin">
        <p className="admin__warn">
          Supabase är inte konfigurerat. Lägg in nycklarna i .env.local.
        </p>
      </main>
    );
  }

  const { data: rows, error } = await supabase
    .from("scam_applications")
    .select("*")
    .order("created_at", { ascending: false });

  // Signerade URL:er för bilagorna (privat bucket, giltiga 1 h).
  const items = await Promise.all(
    (rows || []).map(async (r) => {
      const paths = Array.isArray(r.attachment_paths)
        ? r.attachment_paths
        : r.ticket_image_path
          ? [r.ticket_image_path]
          : [];

      const imageUrls = await Promise.all(
        paths.map(async (path: string) => {
          const { data } = await supabase.storage
            .from("scam-proof")
            .createSignedUrl(path, 3600);
          return data?.signedUrl ?? null;
        })
      );

      return { ...r, imageUrls: imageUrls.filter(Boolean) as string[] };
    })
  );

  return (
    <main className="admin">
      <header className="admin__head">
        <h1>submitted scam proofs ({items.length})</h1>
        <form action={logout}>
          <button type="submit">logout</button>
        </form>
      </header>

      {error && <p className="admin__warn">Fel: {error.message}</p>}
      {items.length === 0 && !error && <p>no submissions yet.</p>}

      <AdminClient
        items={items}
        analyticsUrl="https://vercel.com/dtm1337s-projects/wow-realfake-tickets/analytics"
      />
    </main>
  );
}
