# 🎯 Patch v4 – Per-device profily + onboarding

## Co tento patch dělá

1. ✅ **Onboarding při první návštěvě** – každé zařízení projde 4-krokový setup
2. ✅ **Per-device profil** – data uložená v localStorage prohlížeče
3. ✅ **Iniciály místo obrázků** – konzistentní barvy podle hash jména
4. ✅ **Odstranění Terezy** jako default usera – nový návštěvník začíná čistě
5. ✅ **Komentáře s reálnými jmény** – každé zařízení má jiného autora
6. ✅ **Edit profilu** – klikem v profilu znovu projít onboardingem

## Co se s čím děje

- **1. návštěva:** dostaneš onboarding → vyplníš jméno + věk + pohlaví + 3 zájmy → uloží se do prohlížeče → pustí tě na feed
- **Další návštěvy na stejném zařízení:** onboarding přeskočen, jdeš rovnou do appky
- **Jiný prohlížeč / zařízení:** onboarding znovu (jiný profil)
- **Smazání dat:** v profilu → Nastavení → "Smazat profil a odhlásit"

## Soubory v patchi

```
jbc-patch-v4/
└── src/
    ├── app/
    │   ├── layout.tsx                           # PŘEPSAT – přidá OnboardingGate
    │   ├── page.tsx                             # PŘEPSAT – čte profile ze store
    │   ├── onboarding/page.tsx                  # PŘEPSAT – ukládá do store
    │   ├── profile/page.tsx                     # PŘEPSAT – zobrazuje store data
    │   ├── events/[id]/page.tsx                 # PŘEPSAT – Avatary u komentářů
    │   └── api/comments/[eventId]/route.ts      # PŘEPSAT – přijímá user data
    ├── components/
    │   ├── ui/Avatar.tsx                        # NOVÝ – iniciály + hash barva
    │   └── layout/
    │       ├── Navbar.tsx                       # PŘEPSAT – čte store + Avatar
    │       └── OnboardingGate.tsx               # NOVÝ – redirect logic
    └── lib/store.ts                             # PŘEPSAT – přidá profile
```

## Jak to aplikovat

### 1. Rozbal ZIP a překopíruj soubory
Přetáhni obsah `jbc-patch-v4/` do složky `jablonec-app`, potvrď přepsání.

### 2. Lokálně vyzkoušej
```bash
npm run dev
```

Otevři **http://localhost:3000**. Protože máš v prohlížeči starý stav
(čekiny, lajky od Terezy), **vymaž localStorage**:

- Otevři DevTools (F12)
- Záložka **Application** (Chrome) nebo **Storage** (Firefox)
- Vlevo **Local Storage** → `http://localhost:3000` → pravým tlačítkem **Clear**
- Obnov stránku (F5)

Teď bys měl vidět onboarding.

### 3. Nasaď na Render
Ve složce `jablonec-app`:
```bash
git add .
git commit -m "Per-device profiles + avatars"
git push
```

Render automaticky detekuje push a během ~3 minut nasadí novou verzi.

### 4. Testuj na produkci
Otevři `https://jbc-events.onrender.com` **v incognito oknu** – jako nový
uživatel dostaneš onboarding. Vyplň jiné jméno. Napiš komentář.

Pak otevři normální okno a uvidíš komentář od tebe (Tereza) i od nového
uživatele z incognito okna. 🎉

## ⚠️ Poznámka k existujícím datům

V databázi na Renderu pořád leží "Tereza Nováková" a pár mock přátel ze seedu.
Nevadí to – pouze se objeví jako autor starých komentářů. Pokud chceš úplně
čistou DB, spusť lokálně proti produkční DB:

```bash
npx tsx prisma/seed.ts
```

Nebo si upravím seed tak, aby ty mock uživatele nevytvářel. Stačí říct.
