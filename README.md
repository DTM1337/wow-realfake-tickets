# WOW — Real Fake Tickets

Kampanjsajt för Way Out West. Next.js (App Router) + Supabase, byggd för Vercel.

Designen är ett collage — sajten är en vertikal stack av sex helbreddssektioner.
Varje sektion är en bild med desktop- och mobilvariant som byts vid 768px. Bara
de interaktiva delarna är riktig DOM.

## Kom igång

```bash
npm install
cp .env.local.example .env.local   # fyll i Supabase-nycklarna
npm run dev
```

Sajten kör direkt med platshållarbilder. Supabase behövs bara för
upload-formuläret och `/admin`.

## Byt ut platshållarbilderna

Lägg dina Figma-exporter i `public/images/` med exakt dessa filnamn — då
behövs inga kodändringar:

| Sektion           | Desktop                | Mobil                 |
| ----------------- | ---------------------- | --------------------- |
| Ticker-strip      | `ticker-strip.png`     | (samma — loopar)      |
| Hero              | `hero-desktop.png`     | `hero-mobile.png`     |
| Real Fake Tickets | `realfake-desktop.png` | `realfake-mobile.png` |
| Upload scam proof | `upload-desktop.png`   | `upload-mobile.png`   |
| Scam tickets      | `scam-desktop.png`     | `scam-mobile.png`     |
| Footer            | `footer-desktop.png`   | `footer-mobile.png`   |

PNG funkar; WebP är vassare på filstorlek om du vill konvertera (ändra då
filändelserna i `Section.tsx`, `Hero.tsx` och `UploadSection.tsx`).

## Supabase

1. Skapa ett projekt på supabase.com.
2. Kör `supabase/schema.sql` i SQL-editorn — skapar tabellen
   `scam_applications` och storage-bucketen `scam-proof`.
3. Kopiera Project URL + anon key + service_role key till `.env.local`.
4. Sätt ett `ADMIN_PASSWORD` i `.env.local`.

## Admin

`/admin` listar alla inskickade ansökningar med biljettbilder.
Lösenordsskyddat via cookie.

> **Innan lansering:** cookie-skyddet är en enkel scaffold-lösning. Byt mot
> Supabase Auth, eller slå på Vercels password-/deployment-protection.

## Vad som är stubbat

- **Hero-video** — play-knappen är inkopplad men gör inget. `handlePlay()` i
  `Hero.tsx` väntar på beslut: modal med `<video>` eller YouTube/Vimeo-embed.
- **Upload-formulärets position** — ligger centrerat över sektionen. Finjustera
  mot den riktiga ticket-bilden via `.upload__overlay` / `.scamForm` i
  `globals.css`.
- **Stora bilduppladdningar** — `/api/submit` tar emot filen via multipart.
  Vercels serverless-functions har ~4,5 MB body-gräns. Om biljettbilder kan bli
  större: låt klienten ladda upp direkt till Supabase Storage via en signerad
  uppladdnings-URL och skicka bara metadata till API-routen.

## Struktur

```
src/
  app/
    layout.tsx          metadata
    page.tsx            staplar de sex sektionerna
    globals.css
    api/submit/route.ts tar emot formuläret, sparar i Supabase
    admin/page.tsx      adminvy (lösenordsskyddad)
    admin/admin.css
  components/
    Ticker.tsx          loopande ticker (ren CSS)
    Section.tsx         generisk bildsektion, desktop/mobil-swap
    Hero.tsx            hero + play-knapp
    UploadSection.tsx   upload-sektion + formulär
  lib/
    supabase.ts         service-role-klient (server-side)
supabase/
  schema.sql            tabell + storage-bucket
public/images/          sektionsbilder (platshållare nu)
```

## Deploy

Pusha till GitHub, importera i Vercel, lägg in samma fyra miljövariabler i
Vercel-projektet. Klart.
