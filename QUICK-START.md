# ⚡ Quick Start – co udělat po stažení patche

Tenhle patch **přepíná aplikaci ze SQLite na PostgreSQL** a přidává spoustu
oprav. Je to větší změna než předchozí patche, tak čti pozorně.

---

## 🎯 Co tenhle patch dělá

1. ✅ Opravuje **odečítání bodů** u odměn (klik "Získat" teď vážně sníží zůstatek)
2. ✅ Komentáře se **ukládají do databáze** (ne jen do prohlížeče) – po deploy
   je uvidí všichni uživatelé
3. ✅ Streak se počítá **po týdnech**, ne po dnech
4. ✅ **Historie** v profilu seřazená od nejnovější, s roky u dat
5. ✅ **Mobilní rozhraní** optimalizované – menší paddingy, adaptivní grid,
   safe-area padding pro iPhone home indicator
6. ✅ Připravené na **deploy na Render** (detailní návod v DEPLOY.md)

---

## 📦 Soubory v patchi (13 kusů)

```
jbc-patch-v3/
├── .env.example              # Šablona pro DATABASE_URL
├── DEPLOY.md                 # Návod na deploy na Render (10 min)
├── package.json              # Aktualizovaný s build skriptem
├── prisma/
│   ├── schema.prisma         # PŘEPSAT – teď je to Postgres, ne SQLite
│   └── seed.ts               # PŘEPSAT – se seed komentáři
└── src/
    ├── app/
    │   ├── globals.css       # PŘEPSAT – mobilní safe-area, lepší responzivita
    │   ├── page.tsx          # PŘEPSAT – homepage optimalizovaná pro mobil
    │   ├── api/
    │   │   └── comments/
    │   │       └── [eventId]/
    │   │           └── route.ts        # NOVÝ – API endpoint pro komentáře
    │   ├── events/
    │   │   └── [id]/
    │   │       └── page.tsx            # PŘEPSAT – real komentáře přes fetch()
    │   ├── profile/
    │   │   └── page.tsx                # PŘEPSAT – historie s roky + týdny
    │   └── rewards/
    │       └── page.tsx                # PŘEPSAT – odečítání bodů funguje
    ├── components/
    │   ├── events/
    │   │   └── EventCard.tsx           # PŘEPSAT – mobil optimalizace
    │   └── layout/
    │       └── Navbar.tsx              # PŘEPSAT – "12t" místo "12"
    ├── data/
    │   └── users.ts                    # PŘEPSAT – streak v týdnech
    └── lib/
        ├── prisma.ts                   # NOVÝ – Prisma singleton client
        └── store.ts                    # PŘEPSAT – spendPoints + claimReward
```

---

## 🚀 KROK 1: Aplikuj patch (2 minuty)

1. **Zastav server**: v terminálu `Ctrl + C`
2. **Rozbal** `jbc-patch-v3.zip`
3. **Překopíruj obsah** do složky `jablonec-app` (přepíše staré soubory,
   přidá nové). Nejsnadnější: přetáhni vše ze `jbc-patch-v3/` do
   `jablonec-app/` a potvrď přepsání.

---

## 🗄️ KROK 2: Nastav PostgreSQL databázi

**Tohle je nutné!** SQLite už nefunguje – potřebuješ Postgres.

### Varianta A: Render (pro produkci i dev) – DOPORUČUJI

Přečti si `DEPLOY.md` v patchi, je tam celý návod. Kratší verze:

1. Jdi na **https://dashboard.render.com** → přihlas se
2. **+ New** → **PostgreSQL** → vyplň:
   - Name: `jbc-events-db`
   - Database: `jbc_events`
   - Region: **Frankfurt**
   - Plan: **Free**
3. Klikni **Create Database**, počkej 30 s
4. Zkopíruj **"External Database URL"** z detailu DB

### Varianta B: Lokální Postgres přes Docker (jen pro dev)

Pokud máš Docker nainstalovaný:
```bash
docker run -d --name jbc-postgres -e POSTGRES_PASSWORD=devpass -p 5432:5432 postgres
```

Connection string pak je:
```
postgresql://postgres:devpass@localhost:5432/postgres
```

---

## 🔐 KROK 3: Vytvoř `.env` soubor

Ve složce `jablonec-app` vytvoř soubor `.env` (v editoru, ne ve Windows Explorer
– kvůli příponě):

```
DATABASE_URL="postgresql://tvůj_string_z_kroku_2"
```

> 💡 Tip pro Windows: v terminálu spusť `echo DATABASE_URL="..." > .env`

---

## 📥 KROK 4: Nainstaluj nové balíčky (není nutné, ale neškodí)

```bash
npm install
```

---

## 🌱 KROK 5: Vytvoř tabulky v DB a nahraj data

```bash
npx prisma db push
npm run db:seed
```

- `db push` vytvoří tabulky podle `schema.prisma`
- `db:seed` naplní databázi uživateli, akcemi, odznaky, výzvami a ukázkovými
  komentáři

---

## ▶️ KROK 6: Spusť aplikaci

```bash
npm run dev
```

Otevři **http://localhost:3000**.

---

## 🧪 Jak otestovat, že to funguje

- **Odečítání bodů:** jdi na `/rewards`, klikni na levnou odměnu ("Nálepky
  1200 b."), potvrď. Zůstatek bodů v hero banneru by měl klesnout o 1200.
- **Real komentáře:** jdi na detail akce (např. Derby FK Jablonec), napiš
  komentář, odešli. **Obnov stránku** (F5). Komentář tam pořád je. To znamená,
  že se uložil do databáze, ne do prohlížeče.
- **Historie:** jdi na `/profile` → záložka "Historie". Akce seřazené od
  nejnovější s plnými daty včetně roku.
- **Mobil:** otevři stránku v prohlížeči, stiskni **F12**, klikni na ikonu
  telefonu/tabletu (DevTools) a zvol **iPhone 14 Pro** nebo **Pixel 7**. Projdi
  všechny sekce – layout by měl být vertikální a přehledný.

---

## 🌍 KROK 7 (volitelný): Deploy na veřejnou URL

Až budeš spokojený, přečti `DEPLOY.md` a za 10 minut máš `https://jbc-events.onrender.com`.
Stačí `git push` a Render deploy sám.

---

## ❓ Problémy?

**`Error: Environment variable not found: DATABASE_URL`**
→ Nemáš `.env` soubor, nebo ho máš s chybným jménem (třeba `.env.txt` na Windows).

**`Error: P1001: Can't reach database server`**
→ Špatný connection string, nebo databáze ještě nenastartovala (u Renderu chvilku trvá).

**Komentář se nepřidá, Loader se točí navždycky**
→ Otevři DevTools (F12) → záložka Console. Zkontroluj error. Pravděpodobně
DB není připojená nebo seed neproběhl.

**Bílá obrazovka / Cannot find module '@prisma/client'**
→ Spusť `npx prisma generate` a pak znovu `npm run dev`.
