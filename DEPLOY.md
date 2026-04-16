# 🚀 Deploy na Render

Návod krok-po-kroku, jak dostat aplikaci z localhostu na veřejnou URL.
Celý proces trvá **10–15 minut** a je zdarma.

## 1. Připrav GitHub repo

```bash
cd jablonec-app
git init
git add .
git commit -m "Initial commit"
```

1. Jdi na **https://github.com/new**
2. Vytvoř nový repository (např. `jablonec-events`) – **Private nebo Public**, je to jedno
3. Zkopíruj příkazy ze sekce "…or push an existing repository" a spusť je

```bash
git remote add origin https://github.com/TVE_JMENO/jablonec-events.git
git branch -M main
git push -u origin main
```

## 2. Vytvoř PostgreSQL databázi na Renderu

1. Jdi na **https://dashboard.render.com** → přihlas se přes GitHub
2. Klik na **"+ New"** vpravo nahoře → **PostgreSQL**
3. Vyplň:
   - **Name:** `jbc-events-db`
   - **Database:** `jbc_events`
   - **User:** nech default
   - **Region:** `Frankfurt (EU Central)` (nejblíž ČR)
   - **Plan:** **Free** (1 GB, 90 dní expiry – stačí na prototyp)
4. Klik **"Create Database"**
5. Počkej ~30 sekund, až se databáze rozjede
6. V detailu databáze najdi sekci **"Connections"** a **zkopíruj "External Database URL"** (bude vypadat jako `postgresql://user:pass@dpg-xxx.frankfurt-postgres.render.com/jbc_events`)

## 3. Deploy Next.js aplikace na Render

1. V Render dashboardu klik **"+ New"** → **"Web Service"**
2. Vyber svůj GitHub repo `jablonec-events` → **Connect**
3. Vyplň:
   - **Name:** `jbc-events`
   - **Region:** `Frankfurt (EU Central)`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** **Free**
4. Scroll dolů na **"Environment Variables"**, klik **"Add Environment Variable"**:
   - **Key:** `DATABASE_URL`
   - **Value:** vlož ten "External Database URL" z kroku 2
5. Klik **"Create Web Service"**
6. Počkej ~3–5 minut, až se build dokončí. Sleduj logy – uvidíš `✓ Ready in X s`.

## 4. Nahraj data do databáze

Jakmile je aplikace nasazená, je potřeba naplnit DB seedem. Jedna z možností:

**Přes Render Shell (nejjednodušší):**
1. V detailu web service klikni na **"Shell"** v levém menu
2. Napiš:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

**Nebo lokálně proti production DB:**
1. Do svého `.env` dej `DATABASE_URL` z Renderu
2. Spusť:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

## 5. Hotovo! 🎉

Tvoje aplikace běží na adrese `https://jbc-events.onrender.com` (nebo podobné).
Render ti ji automaticky nasadí při každém `git push` do `main` větve.

---

## ⚠️ Důležité poznámky k Free tieru

- **Aplikace usne po 15 minutách nečinnosti** – první požadavek po spánku trvá ~30 s (studený start).
- **Databáze vyprší po 90 dnech** – musíš pak vytvořit novou (nebo upgradovat na placený plán).
- **Build má limit 512 MB paměti** – pokud by build spadl, upgraduj buď build memory nebo použij Starter plán ($7/měsíc).

## 💡 Tipy

- **Domain:** v Render Settings můžeš přidat custom doménu (`jblc-events.cz`) zdarma.
- **Logy:** V detailu služby klik **"Logs"** – uvidíš requesty, errory a výstupy z konzole.
- **Restart:** Když změníš env var, Render automaticky restartuje. Ruční restart přes **"Manual Deploy"** → **"Deploy latest commit"**.

## 🔧 Lokální vývoj proti cloud DB

V `.env` souboru (který NEPUSHE do Gitu – je v `.gitignore`):
```
DATABASE_URL="tvá-cloud-url-z-renderu"
```

Pak:
```bash
npm run dev  # frontend i API se rozjedou lokálně, ale DB je v cloudu
```

Jakmile ti to funguje lokálně, stačí `git push` a deploy proběhne sám.
