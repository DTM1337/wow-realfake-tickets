"use client";

import { useState } from "react";
import JSZip from "jszip";
import { deleteSubmission } from "./actions";

function esc(s: unknown) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Item = {
  id: string;
  name: string;
  city: string;
  country: string;
  email: string;
  age?: number | null;
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

  const [exportingHTML, setExportingHTML] = useState(false);

  async function exportHTML() {
    setExportingHTML(true);
    try {
      // 1. Fetch submissions + signed URLs from server
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/admin/export`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert("Export misslyckades: " + (data.error ?? res.statusText));
        return;
      }
      const { submissions } = await res.json();

      // 2. Fetch all images in parallel client-side
      const zip = new JSZip();
      const imgFolder = zip.folder("images")!;

      const cards: string[] = await Promise.all(
        submissions.map(async (row: {
          id: string; name: string; city: string; country: string;
          email: string; age?: number | null; artist: string; story: string;
          created_at: string; attachments: { filename: string; url: string }[];
        }) => {
          const localFiles = await Promise.all(
            row.attachments.map(async ({ filename, url }) => {
              try {
                const imgRes = await fetch(url);
                if (imgRes.ok) {
                  imgFolder.file(filename, await imgRes.arrayBuffer());
                  return filename;
                }
              } catch { /* skip */ }
              return null;
            })
          ).then((r) => r.filter(Boolean) as string[]);

          const imgPaths = localFiles.map((f) => `images/${f}`);
          const imagesHtml = localFiles.length > 0
            ? `<div class="images" data-imgs="${esc(JSON.stringify(imgPaths))}" onclick="openLightbox(JSON.parse(this.dataset.imgs),0)">${localFiles.map((f) => `<img src="images/${f}" alt=""/>`).join("")}</div>`
            : `<div class="noimg">no attachments</div>`;

          return `<article class="card" data-search="${esc([row.name, row.city, row.country, row.email, row.artist, row.story].join(" ").toLowerCase())}">
            ${imagesHtml}
            <div class="meta">
              <time>${new Date(row.created_at).toLocaleString("sv-SE")}</time>
              <p><strong>Name:</strong> ${esc(row.name)}</p>
              <p><strong>City:</strong> ${esc(row.city)}</p>
              <p><strong>Country:</strong> ${esc(row.country)}</p>
              <p><strong>Email:</strong> ${esc(row.email)}</p>
              <p><strong>Age:</strong> ${row.age ?? "—"}</p>
              <p><strong>Artist:</strong> ${esc(row.artist)}</p>
              <p class="story">${esc(row.story)}</p>
            </div>
          </article>`;
        })
      );

      // 3. Build HTML
      const css = `body{margin:0;background:#0a0a0a;color:#ffb4dd;font-family:"Helvetica Neue",Arial,sans-serif;padding:2rem}h1{text-transform:lowercase;margin:0 0 1.5rem}.controls{display:flex;gap:.75rem;margin-bottom:1.25rem;align-items:center;flex-wrap:wrap}.view-toggle{display:flex;border:1px solid #ffb4dd}.view-toggle button{padding:.4rem .9rem;background:transparent;color:#ffb4dd;border:0;cursor:pointer;font-size:.85rem;text-transform:lowercase}.view-toggle button.active{background:#ffb4dd;color:#0a0a0a}.search-input{padding:.4rem .7rem;background:transparent;border:1px solid #ffb4dd;color:#ffb4dd;font-size:.85rem;width:200px}.search-input::placeholder{color:#6e4a5e}.count{font-size:.8rem;color:#6e4a5e}#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem}#grid.list{display:flex;flex-direction:column;gap:.5rem}.card{border:1px solid #ffb4dd;display:flex;flex-direction:column}#grid.list .card{flex-direction:row}.images{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;background:#ffb4dd;cursor:pointer}#grid.list .images{width:120px;flex-shrink:0}.images:hover{opacity:.85}.card img{width:100%;height:200px;object-fit:cover;display:block}#grid.list .card img{height:100px}.noimg{height:200px;display:flex;align-items:center;justify-content:center;background:#1a1a1a;font-size:.8rem;color:#6e4a5e}#grid.list .noimg{width:120px;height:100px;flex-shrink:0}.meta{padding:.85rem;display:flex;flex-direction:column;gap:.3rem;flex:1}.meta p{font-size:.85rem;margin:0}.meta time{font-size:.72rem;color:#6e4a5e}.story{white-space:pre-wrap;margin-top:.3rem}.lightbox{display:none;position:fixed;inset:0;background:rgba(0,0,0,.92);align-items:center;justify-content:center;z-index:1000;cursor:pointer}.lightbox.open{display:flex}.lb-inner{position:relative;max-width:90vw;max-height:90vh;cursor:default}.lb-inner img{max-width:90vw;max-height:85vh;object-fit:contain;display:block}.lb-close{position:absolute;top:-1.5rem;right:0;background:transparent;border:0;color:#fff;font-size:1.8rem;cursor:pointer}.lb-nav{display:flex;justify-content:center;gap:.4rem;margin-top:.5rem}.lb-nav button{width:8px;height:8px;border-radius:50%;border:1px solid #ffb4dd;background:transparent;cursor:pointer;padding:0}.lb-nav button.active{background:#ffb4dd}`;

      const html = `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Real Fake Tickets — Export ${new Date().toLocaleDateString("sv-SE")}</title><style>${css}</style></head><body><h1>submitted scam proofs (${submissions.length})</h1><div class="controls"><div class="view-toggle"><button class="active" onclick="setView('grid',this)">grid</button><button onclick="setView('list',this)">list</button></div><input class="search-input" type="search" placeholder="search..." oninput="filterCards(this.value)"/><span class="count" id="count">${submissions.length} submissions</span></div><div id="grid">${cards.join("")}</div><div class="lightbox" id="lightbox" onclick="closeLightbox()"><div class="lb-inner" onclick="event.stopPropagation()"><img id="lb-img" src="" alt=""/><div class="lb-nav" id="lb-nav"></div><button class="lb-close" onclick="closeLightbox()">×</button></div></div><script>var lbImages=[],lbIndex=0;function openLightbox(imgs,i){lbImages=imgs;lbIndex=i;document.getElementById('lb-img').src=imgs[i];var nav=document.getElementById('lb-nav');nav.innerHTML=imgs.map(function(_,j){return'<button class="'+(j===i?'active':'')+'" onclick="goLb('+j+')"></button>';}).join('');document.getElementById('lightbox').classList.add('open');}function goLb(i){lbIndex=i;openLightbox(lbImages,i);}function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox();});function setView(v,btn){document.getElementById('grid').className=v==='list'?'list':'';document.querySelectorAll('.view-toggle button').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');}function filterCards(q){var cards=document.querySelectorAll('.card'),count=0;cards.forEach(function(c){var match=!q||c.dataset.search.includes(q.toLowerCase());c.style.display=match?'':'none';if(match)count++;});document.getElementById('count').textContent=count+' submissions';}<\/script></body></html>`;

      zip.file("index.html", html);

      // 4. Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `scam-proofs-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      alert("Export misslyckades: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExportingHTML(false);
    }
  }

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

  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const result = await deleteSubmission(id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Kunde inte radera:", err);
      alert("Kunde inte radera bidraget: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setDeleting(null);
    }
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
            <button className="admin__exportBtn" onClick={exportHTML} disabled={exportingHTML}>
              {exportingHTML ? "exporting…" : "export html"}
            </button>
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
                  <p><strong>Age:</strong> {item.age ?? "—"}</p>
                  <p><strong>Artist:</strong> {item.artist || "—"}</p>
                  <p className="admin__story">{item.story}</p>
                  {confirmDelete === item.id ? (
                    <div className="admin__confirm">
                      <span>are you sure?</span>
                      <button
                        type="button"
                        className="admin__btnDanger"
                        disabled={deleting === item.id}
                        onClick={() => handleDelete(item.id)}
                      >
                        {deleting === item.id ? "deleting…" : "yes, delete"}
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(null)}>cancel</button>
                    </div>
                  ) : (
                    <button type="button" className="admin__btnDelete" onClick={() => setConfirmDelete(item.id)}>delete</button>
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
