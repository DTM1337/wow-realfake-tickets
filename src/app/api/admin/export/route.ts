import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import JSZip from "jszip";
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

  const zip = new JSZip();
  const imgFolder = zip.folder("images")!;

  const cards: string[] = [];

  for (const row of rows ?? []) {
    const paths: string[] = Array.isArray(row.attachment_paths)
      ? row.attachment_paths
      : row.ticket_image_path
        ? [row.ticket_image_path]
        : [];

    const localFilenames: string[] = [];

    for (let i = 0; i < paths.length; i++) {
      const storagePath = paths[i];
      const ext = storagePath.split(".").pop() ?? "jpg";
      const filename = `${row.id}-${i + 1}.${ext}`;

      try {
        const { data } = await supabase.storage
          .from("scam-proof")
          .download(storagePath);

        if (data) {
          const arrayBuffer = await data.arrayBuffer();
          imgFolder.file(filename, arrayBuffer);
          localFilenames.push(filename);
        }
      } catch {
        // skip failed image
      }
    }

    const imagesHtml =
      localFilenames.length > 0
        ? `<div class="images" onclick="openLightbox(${JSON.stringify(localFilenames.map((f) => `images/${f}`))}, 0)">${localFilenames.map((f) => `<img src="images/${f}" alt="" />`).join("")}</div>`
        : `<div class="noimg">no attachments</div>`;

    const escape = (s: string) =>
      String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    cards.push(`<article class="card" data-search="${escape([row.name, row.city, row.country, row.email, row.artist, row.story].join(" ").toLowerCase())}">
      ${imagesHtml}
      <div class="meta">
        <time>${new Date(row.created_at).toLocaleString("sv-SE")}</time>
        <p><strong>Name:</strong> ${escape(row.name)}</p>
        <p><strong>City:</strong> ${escape(row.city)}</p>
        <p><strong>Country:</strong> ${escape(row.country)}</p>
        <p><strong>Email:</strong> ${escape(row.email)}</p>
        <p><strong>Age:</strong> ${row.age ?? "—"}</p>
        <p><strong>Artist:</strong> ${escape(row.artist)}</p>
        <p class="story">${escape(row.story ?? "")}</p>
      </div>
    </article>`);
  }

  const css = `
    body { margin: 0; background: #0a0a0a; color: #ffb4dd; font-family: "Helvetica Neue", Arial, sans-serif; padding: 2rem; }
    h1 { text-transform: lowercase; margin: 0 0 1.5rem; }
    .controls { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; align-items: center; flex-wrap: wrap; }
    .view-toggle { display: flex; border: 1px solid #ffb4dd; }
    .view-toggle button { padding: 0.4rem 0.9rem; background: transparent; color: #ffb4dd; border: 0; cursor: pointer; font-size: 0.85rem; text-transform: lowercase; }
    .view-toggle button.active { background: #ffb4dd; color: #0a0a0a; }
    .search-input { padding: 0.4rem 0.7rem; background: transparent; border: 1px solid #ffb4dd; color: #ffb4dd; font-size: 0.85rem; width: 200px; }
    .search-input::placeholder { color: #6e4a5e; }
    .count { font-size: 0.8rem; color: #6e4a5e; }
    #grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    #grid.list { display: flex; flex-direction: column; gap: 0.5rem; }
    .card { border: 1px solid #ffb4dd; display: flex; flex-direction: column; }
    #grid.list .card { flex-direction: row; }
    .images { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1px; background: #ffb4dd; cursor: pointer; }
    #grid.list .images { width: 120px; flex-shrink: 0; }
    .images:hover { opacity: 0.85; }
    .card img { width: 100%; height: 200px; object-fit: cover; display: block; }
    #grid.list .card img { height: 100px; }
    .noimg { height: 200px; display: flex; align-items: center; justify-content: center; background: #1a1a1a; font-size: 0.8rem; color: #6e4a5e; }
    #grid.list .noimg { width: 120px; height: 100px; flex-shrink: 0; }
    .meta { padding: 0.85rem; display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
    .meta p { font-size: 0.85rem; margin: 0; }
    .meta time { font-size: 0.72rem; color: #6e4a5e; }
    .story { white-space: pre-wrap; margin-top: 0.3rem; }
    .lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); align-items: center; justify-content: center; z-index: 1000; cursor: pointer; }
    .lightbox.open { display: flex; }
    .lb-inner { position: relative; max-width: 90vw; max-height: 90vh; cursor: default; }
    .lb-inner img { max-width: 90vw; max-height: 85vh; object-fit: contain; display: block; }
    .lb-close { position: absolute; top: -1.5rem; right: 0; background: transparent; border: 0; color: #fff; font-size: 1.8rem; cursor: pointer; }
    .lb-nav { display: flex; justify-content: center; gap: 0.4rem; margin-top: 0.5rem; }
    .lb-nav button { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #ffb4dd; background: transparent; cursor: pointer; padding: 0; }
    .lb-nav button.active { background: #ffb4dd; }
  `;

  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Real Fake Tickets — Export ${new Date().toLocaleDateString("sv-SE")}</title>
<style>${css}</style>
</head>
<body>
<h1>submitted scam proofs (${(rows ?? []).length})</h1>
<div class="controls">
  <div class="view-toggle">
    <button class="active" onclick="setView('grid',this)">grid</button>
    <button onclick="setView('list',this)">list</button>
  </div>
  <input class="search-input" type="search" placeholder="search..." oninput="filterCards(this.value)" />
  <span class="count" id="count">${(rows ?? []).length} submissions</span>
</div>
<div id="grid">${cards.join("\n")}</div>
<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <div class="lb-inner" onclick="event.stopPropagation()">
    <img id="lb-img" src="" alt="" />
    <div class="lb-nav" id="lb-nav"></div>
    <button class="lb-close" onclick="closeLightbox()">×</button>
  </div>
</div>
<script>
  var lbImages=[], lbIndex=0;
  function openLightbox(imgs,i){ lbImages=imgs; lbIndex=i; document.getElementById('lb-img').src=imgs[i]; var nav=document.getElementById('lb-nav'); nav.innerHTML=imgs.map(function(_,j){ return '<button class="'+(j===i?'active':'')+'" onclick="goLb('+j+')"></button>'; }).join(''); document.getElementById('lightbox').classList.add('open'); }
  function goLb(i){ lbIndex=i; openLightbox(lbImages,i); }
  function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeLightbox(); });
  function setView(v,btn){ document.getElementById('grid').className=v==='list'?'list':''; document.querySelectorAll('.view-toggle button').forEach(function(b){ b.classList.remove('active'); }); btn.classList.add('active'); }
  function filterCards(q){ var cards=document.querySelectorAll('.card'), count=0; cards.forEach(function(c){ var match=!q||c.dataset.search.includes(q.toLowerCase()); c.style.display=match?'':'none'; if(match) count++; }); document.getElementById('count').textContent=count+' submissions'; }
<\/script>
</body>
</html>`;

  zip.file("index.html", html);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(zipBuffer.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="scam-proofs-${date}.zip"`,
    },
  });
}
