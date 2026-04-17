# 🐛 Patch v8 – Bug fixy (body, přátelé, invite modal)

## Co tento patch opravuje

### 1. ✅ Body v odměnách = body v profilu
Dřív: Odměny počítaly body z Terezy (2340) + earnedPoints, profil jen earnedPoints.
Teď: Obojí čte ze **stejné hodnoty ve store** – `earnedPoints`.

### 2. ✅ Nenulové startovní hodnoty pro prototyp
Nový profil po onboardingu dostane:
- 💰 **500 bodů** (jako "uvítací bonus")
- 🔥 **3 týdny streak**
- 🏆 **3 získané odznaky** (první 3 z mocku)
- 🎯 **5 akcí v historii** (pro prototypní demo)

V produkci by začínalo vše na nule – startovní hodnoty jsou v `store.ts`
konstanty `STARTER_POINTS` a `STARTER_STREAK`.

### 3. ✅ Přátelé dostupní z mobilu
Mobilní nav má jen 5 pozic. Teď je v **profilu karta "Přátelé"**
(viditelná jen na mobilu) + v profilu pod záložkou **Nastavení**.

### 4. ✅ Invite modal – QR se zobrazí, link funguje
Dřív: `api.qrserver.com` nebyl v `next.config.js` allowlistu → modal byl prázdný.
Teď:
- Primární QR server **qrserver.com**
- Fallback na **Google Charts** (automatický při chybě)
- Fallback na **text s odkazem** (vždy viditelný)
- Tlačítko **Kopírovat** (funguje i v non-secure kontextu)
- Tlačítko **Sdílet přes aplikaci** (pokud browser podporuje Web Share API)
- Tlačítko **Otevřít odkaz v nové záložce** (pokud ne)
- Safe-area-pb pro iPhone home indicator

### 5. ✅ Tlačítka Sdílet a Pozvat otevírají invite modal
V detailu akce:
- Ikonka **Share2** (kompas vpravo nahoře v obrázku) → otevře invite modal
- Tlačítko **Pozvat** (na tlačítkové řadě) → otevře invite modal

## Soubory v patchi (7)

```
jbc-patch-v8/
├── next.config.js                              # PŘEPSAT – přidá qrserver + google
└── src/
    ├── app/
    │   ├── events/[id]/page.tsx                # PŘEPSAT – ověřený invite modal
    │   ├── friends/page.tsx                    # PŘEPSAT – Avatar iniciály
    │   ├── profile/page.tsx                    # PŘEPSAT – body ze store, přátelé link
    │   └── rewards/page.tsx                    # PŘEPSAT – body ze store
    ├── components/events/InviteModal.tsx       # PŘEPSAT – robustní QR s fallbacky
    └── lib/store.ts                            # PŘEPSAT – startovní bonus
```

## Jak aplikovat

### 1. Zastav dev server (Ctrl+C)

### 2. Rozbal ZIP, překopíruj obsah jbc-patch-v8/ do jablonec-app

### 3. Vymaž localStorage (POZOR – důležité!)
Protože měníme strukturu store (přidáváme `currentStreak`), starý stav by
mohl způsobit problémy:
- DevTools (F12) → Application → Local Storage → **Clear All**
- Obnov stránku → projedeš onboarding → dostaneš 500 b. + streak

### 4. Restart
```bash
npm run dev
```

### 5. Otestuj
- **Body:** V profilu a v odměnách má být **stejné číslo** (po onboardingu 500)
- **Mobilní přátelé:** Otevři profil na telefonu / mobile view → viditelná karta
- **Invite modal:** Klikni na ikonku **Share2** u detailu akce → QR + link
- **Pozvat:** Klikni na tlačítko **Pozvat** → stejný modal
- **Startovní hodnoty:** Po onboardingu uvidíš 500 b., 🔥 3 týdny, 3 odznaky

### 6. Deploy
```bash
git add .
git commit -m "v8: Opravy bodů, invite modalu a mobilních přátel"
git push
```

## 💡 Detaily

- **Streak v produkci:** Aktuálně je to v storu pevná hodnota. V produkční
  verzi by se počítala z `checkins` (kolik týdnů po sobě jsi byl na akci).
- **QR kódy:** Oba servery jsou zdarma i pro produkci, bez API klíče,
  stovky tisíc requestů měsíčně bez problému.
- **Share API:** Funguje na mobilu (iOS i Android), na desktopu často ne –
  tam se automaticky přepne na "Otevřít odkaz v nové záložce".
