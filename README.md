# JBC Events – Jablonec Events App

Gamifikovaná aplikace pro kulturní a sportovní akce v Jablonci nad Nisou.
Kombinuje mechaniku Pokémon GO (sbírání zážitků z míst, QR kódy) s Duolingem
(streaky, ligy, týdenní výzvy, komunita přátel).

## ✨ Klíčové funkce

- 🗺️ **Feed akcí** s filtry podle kategorie (koncerty, sport, výstavy, divadlo, festivaly, prohlídky, workshopy)
- 📍 **Detail akce** s komentáři, lajky, QR skenováním na místě
- ✅ **Checkin systém** – Zúčastním se / Zajímá mě + potvrzení přes QR
- 🔥 **Streaky** s freezy jako v Duolingu
- ⚡ **Bodový systém** – různé velikosti akcí = různé body
- 🏆 **Ligy** (bronz → stříbro → zlato → diamant) s týdenním soupeřením
- 🎯 **Týdenní výzvy** s progress bary a bonusovými body
- 🦋 **Odznaky** za milníky, kolekce, sezónní akce
- 👥 **Přátelé** s návrhy, žádostmi a pozvánkami
- 💌 **Pozvánka s bonusem** – 200 bodů pro oba
- 🎨 **Light/Dark mode** s jemnou barevnou paletou
- 🧭 **Onboarding** v 4 krocích s výběrem 3 zájmů
- 📊 **Profil** se statistikami, historií, soukromím

## 🛠️ Technologie

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** s custom design tokeny
- **Prisma ORM** + **SQLite** (snadno swapnout za Postgres)
- **Zustand** pro client-side state
- **Framer Motion** + **Lucide Icons**
- **next-themes** pro dark mode

## 🚀 Jak to spustit

```bash
# 1. Nainstaluj závislosti
npm install

# 2. Vytvoř databázi a nahraj mock data
npm run db:push
npm run db:seed

# 3. Spusť dev server
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

### Stránky k prohlédnutí

- `/` – Feed akcí s doporučením
- `/onboarding` – 4krokový registrační flow
- `/events/evt_001` – Detail akce (Divokej Bill)
- `/challenges` – Týdenní výzvy
- `/leaderboard` – Stříbrná liga
- `/friends` – Přátelé
- `/profile` – Profil s odznaky

## 📁 Struktura projektu

```
jablonec-app/
├── prisma/
│   ├── schema.prisma       # DB modely
│   └── seed.ts             # Seed s mock daty
├── src/
│   ├── app/                # Next.js App Router stránky
│   │   ├── page.tsx        # Feed akcí
│   │   ├── onboarding/     # Registrace
│   │   ├── events/[id]/    # Detail akce
│   │   ├── challenges/     # Týdenní výzvy
│   │   ├── leaderboard/    # Liga
│   │   ├── friends/        # Přátelé
│   │   └── profile/        # Profil
│   ├── components/
│   │   ├── events/         # EventCard
│   │   └── layout/         # Navbar, ThemeProvider, ThemeToggle
│   ├── lib/
│   │   ├── types.ts        # TypeScript typy
│   │   ├── utils.ts        # Utility + doporučovací algoritmus
│   │   └── store.ts        # Zustand store
│   ├── data/
│   │   ├── events.ts       # Mock akce z Jablonce
│   │   └── users.ts        # Mock uživatel, přátelé, odznaky
│   └── app/globals.css     # Design tokeny pro light/dark
└── package.json
```

## 🎨 Design system

- **Primární:** indigová `#4f46e5` (důvěra)
- **Akcent:** korálová `#f43f5e` (akce, energie)
- **Streak:** smaragdová `#10b981`
- **Plamen:** oranžová `#f97316` (streak ikony)
- **Fonty:** Fraunces (display, serif), Manrope (body, sans)

## 🔜 Další kroky

V MVP zatím nejsou:
- Reálné napojení na 365jablonec API (místo mock)
- Google/Apple OAuth (aktuálně demo)
- Push notifikace (service worker)
- Mapy s clustering markery (Leaflet připraven)
- Profily ostatních uživatelů `/profile/[username]`
- Týmové / duo streaky
- Fotogalerie z akcí s upload
- Slevy / merch marketplace
- Admin panel pro pořadatele

## 📝 Poznámky k mock datům

Akce a uživatelé v `src/data/` jsou realistické pro Jablonec (Městská hala,
Stadion Střelnice, Muzeum bižuterie, Mírové náměstí, Jizerské hory…), ale
**všechna jména, ceny a účastníci jsou smyšlené**. V produkci se nahradí
API calls na `https://www.365jablonec.cz/api/events`.
