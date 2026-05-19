"use client";

import { useState } from "react";
import { deleteSubmission } from "./actions";

type Item = {
  id: string;
  name: string;
  city: string;
  country: string;
  email: string;
  artist: string;
  story: string;
  created_at: string;
  imageUrls: string[];
};

export default function AdminClient({ items: initial, analyticsUrl }: { items: Item[]; analyticsUrl: string }) {
  const [tab, setTab] = useState<"submissions" | "analytics">("submissions");
  const [items, setItems] = useState(initial);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null);

  function exportCSV() {
    const headers = ["id", "name", "city", "country", "email", "artist", "story", "created_at"];
    const rows = items.map((r) => [
      r.id,
      r.name || "",
      r.city || "",
      r.country || "",
      r.email || "",
      r.artist || "",
      `"${(r.story || "").replace(/"/g, '""')}"`,
      r.created_at,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scam-proofs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    await deleteSubmission(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDelete(null);
  }

  return (
    <>
      <div className="admin__tabs">
        <button
          className={tab === "submissions" ? "active" : ""}
          onClick={() => setTab("submissions")}
        >
          submissions
        </button>
        <button
          className={tab === "analytics" ? "active" : ""}
          onClick={() => setTab("analytics")}
        >
          analytics
        </button>
      </div>

      {tab === "analytics" && (
        <div className="admin__analyticsPanel">
          <p>analytics visas i Vercel-dashboarden.</p>
          <a href={analyticsUrl} target="_blank" rel="noreferrer" className="admin__analyticsLink">
            öppna vercel analytics →
          </a>
        </div>
      )}

      {tab === "submissions" && (
        <>
          <div className="admin__controls">
            <div className="admin__viewToggle">
              <button onClick={() => setView("grid")} className={view === "grid" ? "active" : ""}>grid</button>
              <button onClick={() => setView("list")} className={view === "list" ? "active" : ""}>list</button>
            </div>
            <button className="admin__exportBtn" onClick={exportCSV}>export csv</button>
          </div>

          <div className={view === "grid" ? "admin__grid" : "admin__list"}>
            {items.map((item) => (
              <article key={item.id} className="admin__card">
                {item.imageUrls.length > 0 ? (
                  <div className="admin__images" onClick={() => setLightbox({ urls: item.imageUrls, index: 0 })}>
                    {item.imageUrls.map((url) => (
                      <img src={url} alt="Bilaga" key={url} />
                    ))}
                  </div>
                ) : (
                  <div className="admin__noimg">no attachments</div>
                )}
                <div className="admin__meta">
                  <time>{new Date(item.created_at).toLocaleString("sv-SE")}</time>
                  <p><strong>Name:</strong> {item.name || "—"}</p>
                  <p><strong>City:</strong> {item.city || "—"}</p>
                  <p><strong>Country:</strong> {item.country || "—"}</p>
                  <p><strong>Email:</strong> {item.email || "—"}</p>
                  <p><strong>Artist:</strong> {item.artist || "—"}</p>
                  <p className="admin__story">{item.story}</p>
                  {confirmDelete === item.id ? (
                    <div className="admin__confirm">
                      <span>are you sure?</span>
                      <button className="admin__btnDanger" onClick={() => handleDelete(item.id)}>yes, delete</button>
                      <button onClick={() => setConfirmDelete(null)}>cancel</button>
                    </div>
                  ) : (
                    <button className="admin__btnDelete" onClick={() => setConfirmDelete(item.id)}>delete</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {lightbox && (
        <div className="admin__lightbox" onClick={() => setLightbox(null)}>
          <div className="admin__lightboxInner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.urls[lightbox.index]} alt="" />
            {lightbox.urls.length > 1 && (
              <div className="admin__lightboxNav">
                {lightbox.urls.map((url, i) => (
                  <button
                    key={url}
                    className={i === lightbox.index ? "active" : ""}
                    onClick={() => setLightbox({ ...lightbox, index: i })}
                  />
                ))}
              </div>
            )}
            <button
              className="admin__lightboxClose"
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
