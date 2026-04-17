# 🔥 Patch v9 – Společné streaky + randomizované body

## Co tento patch přidává

### 1. ✅ Náhodné startovní body 2000-2500
Každý nový profil dostane po onboardingu náhodné body v rozmezí 2000-2500,
vždy zaokrouhlené na **5** nebo **0** (např. 2155, 2370, 2445).

### 2. ✅ Společné streaky s kamarády
Úplně nová fičura:
- **1 streak automaticky** s Martinem Kovářem po onboardingu (7 týdnů, aktivní)
- **Tlačítko "Streak"** u každého kamaráda (založí nový nebo otevře existující)
- **Dedikovaná stránka `/friends/streak/[id]`** s:
  - Ukazatel týdnů v kuse + rekord
  - Status tohoto týdne (splněno ✓ / čeká ⏳)
  - Tlačítko "Označit tento týden jako splněný" (+50 b. bonus)
  - Progress k další milestone (4t, 12t, 26t, 52t)
  - Vizuální mřížka 12 posledních týdnů
  - Tlačítko ukončit streak
- **Nová záložka "Streaky"** v sekci Přátelé
- **Blok v profilu** s aktivními streaky (viditelný jen když něco máš)

## Soubory v patchi (4)

```
jbc-patch-v9/
└── src/
    ├── app/
    │   ├── friends/page.tsx                    # PŘEPSAT – streaky + tlačítka
    │   ├── friends/streak/[id]/page.tsx        # NOVÝ – detail streaku
    │   └── profile/page.tsx                    # PŘEPSAT – sekce streaků
    └── lib/store.ts                            # PŘEPSAT – buddyStreaks + random body
```

## Jak aplikovat

### 1. Zastav dev server (Ctrl+C)

### 2. Rozbal ZIP, překopíruj obsah jbc-patch-v9/ do jablonec-app

### 3. DŮLEŽITÉ: Vymaž localStorage
Protože přidáváme do store nové pole (`buddyStreaks`) a měníme výchozí body:
- DevTools (F12) → Application → Local Storage → **Clear All**
- Obnov stránku → projdi onboardingem znovu → dostaneš:
  - Náhodné body 2000-2500
  - 3 týdny osobní streak
  - 1 aktivní streak s Martinem Kovářem (7 týdnů v kuse)

### 4. Restart
```bash
npm run dev
```

### 5. Otestuj
- **Profil:** Uvidíš randomizované body (ne 500) a sekci "Společné streaky" s jedním záznamem
- **Klik na streak v profilu** → detail streaku s Martinem
- **Sekce Přátelé:**
  - U Martina Kováře uvidíš tlačítko "🔥 Streak" (už aktivní)
  - U ostatních kamarádů tlačítko "+ Streak" → založí nový
  - Záložka "Streaky" zobrazí všechny aktivní streaky
- **Detail streaku:**
  - Hero s avatary obou + 🔥 mezi nimi
  - Tlačítko "Označit tento týden jako splněný" → +50 b. a zvýší počítadlo
  - Mřížka 12 týdnů s ✓ u splněných, ⏳ u aktuálního

### 6. Deploy
```bash
git add .
git commit -m "v9: Společné streaky + randomizované body"
git push
```

## 💡 Jak streak funguje

- Každý týden oba musíte splnit → streak pokračuje
- Pokud někdo nesplní → streak se resetuje na 0 (ale rekord zůstane)
- Za každý splněný týden bonus **+50 bodů** navíc
- Za milníky speciální odznaky (v produkci – zatím jen vizualizace):
  - 🥉 4 týdny – měsíční
  - 🥈 12 týdnů – kvartální
  - 🥇 26 týdnů – půlroční
  - 💎 52 týdnů – roční
  - 👑 100 týdnů – legendární

## 🎲 Proč 5/0 zakončení?

Body končící na 5 nebo 0 vypadají "hezčí" a "úmyslnější" než náhodné
(2347 vs 2345). Je to jemný psychologický efekt – vypadá to jako reálné
skóre, ne jako test.
