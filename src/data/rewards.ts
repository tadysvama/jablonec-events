export type RewardTier = 'discount' | 'digital' | 'physical';

export interface Reward {
  id: string;
  tier: RewardTier;
  name: string;
  description: string;
  cost: number; // body potřebné k získání
  image: string; // emoji nebo ikona
  stockLimit?: number; // kolik je dostupných (null = neomezeno)
  claimedCount?: number; // kolik si jich uživatelé vyzvedli
  partner?: string; // např. "Městské divadlo Jablonec"
  expiresIn?: string; // platnost, např. "30 dní"
  featured?: boolean;
}

export const MOCK_REWARDS: Reward[] = [
  // ===== SLEVY NA VSTUPY =====
  {
    id: 'rw_001',
    tier: 'discount',
    name: '10% sleva na vstupné',
    description: 'Platí na libovolný koncert v Městském divadle Jablonec.',
    cost: 500,
    image: '🎵',
    partner: 'Městské divadlo Jablonec',
    expiresIn: '60 dní',
  },
  {
    id: 'rw_002',
    tier: 'discount',
    name: '50 Kč sleva na FK Jablonec',
    description: 'Sleva na vstupenku na domácí zápas Fortuna ligy.',
    cost: 400,
    image: '⚽',
    partner: 'FK Jablonec',
    expiresIn: '90 dní',
  },
  {
    id: 'rw_003',
    tier: 'discount',
    name: 'Volný vstup do muzea',
    description: 'Jednorázový volný vstup do Muzea skla a bižuterie.',
    cost: 800,
    image: '🏛️',
    partner: 'Muzeum skla a bižuterie',
    expiresIn: '180 dní',
    featured: true,
  },
  {
    id: 'rw_004',
    tier: 'discount',
    name: '20% sleva na workshop',
    description: 'Sleva na libovolný workshop v partnerských studiích.',
    cost: 1000,
    image: '🛠️',
    partner: 'Studio Na Rynku',
    expiresIn: '45 dní',
  },
  {
    id: 'rw_005',
    tier: 'discount',
    name: 'Dva lístky za cenu jednoho',
    description: 'Na vybrané divadelní představení s kamarádem.',
    cost: 1500,
    image: '🎭',
    partner: 'Divadlo F. X. Šaldy',
    expiresIn: '60 dní',
    stockLimit: 50,
    claimedCount: 23,
  },

  // ===== VIRTUÁLNÍ ODZNAKY =====
  {
    id: 'rw_101',
    tier: 'digital',
    name: 'Zlatý odznak sběratele',
    description: 'Exkluzivní odznak viditelný na tvém profilu.',
    cost: 2000,
    image: '🏅',
  },
  {
    id: 'rw_102',
    tier: 'digital',
    name: 'Titul „Místní legenda"',
    description: 'Zvláštní titul zobrazený u tvého jména.',
    cost: 3000,
    image: '👑',
  },
  {
    id: 'rw_103',
    tier: 'digital',
    name: 'Animovaný avatar rámeček',
    description: 'Zářící rámeček okolo tvé profilové fotky.',
    cost: 1500,
    image: '✨',
  },
  {
    id: 'rw_104',
    tier: 'digital',
    name: 'Custom barevné téma',
    description: 'Odemkne speciální barevný motiv aplikace.',
    cost: 2500,
    image: '🎨',
  },

  // ===== FYZICKÉ ODMĚNY (MERCH) =====
  {
    id: 'rw_201',
    tier: 'physical',
    name: 'Tričko JBC Events',
    description: 'Bavlněné tričko s logem, velikosti S–XXL. Vyzvedni v TIC.',
    cost: 5000,
    image: '👕',
    stockLimit: 100,
    claimedCount: 34,
  },
  {
    id: 'rw_202',
    tier: 'physical',
    name: 'Nálepky na notebook (sada)',
    description: '5 stylových nálepek s motivy Jablonce.',
    cost: 1200,
    image: '🏷️',
    stockLimit: 200,
    claimedCount: 87,
  },
  {
    id: 'rw_203',
    tier: 'physical',
    name: 'Plátěná taška',
    description: 'Eko plátěnka s designem Jizerských hor.',
    cost: 3500,
    image: '👜',
    stockLimit: 75,
    claimedCount: 19,
    featured: true,
  },
  {
    id: 'rw_204',
    tier: 'physical',
    name: 'Termohrnek',
    description: 'Nerezový termohrnek s logem JBC Events, 400 ml.',
    cost: 4000,
    image: '☕',
    stockLimit: 60,
    claimedCount: 12,
  },
  {
    id: 'rw_205',
    tier: 'physical',
    name: 'Batoh JBC Explorer',
    description: 'Turistický batoh 25 L. Limitovaná edice.',
    cost: 8000,
    image: '🎒',
    stockLimit: 30,
    claimedCount: 8,
  },
];

export const TIER_META: Record<RewardTier, { label: string; icon: string; color: string; description: string }> = {
  discount: {
    label: 'Slevy na vstupy',
    icon: '🎟️',
    color: 'from-brand-500 to-brand-700',
    description: 'Uplatni u partnerů při nákupu vstupenek.',
  },
  digital: {
    label: 'Virtuální odměny',
    icon: '✨',
    color: 'from-accent-500 to-accent-700',
    description: 'Exkluzivní odznaky, tituly a kustomizace profilu.',
  },
  physical: {
    label: 'Fyzický merch',
    icon: '👕',
    color: 'from-flame-500 to-flame-600',
    description: 'Trička, tašky, doplňky. Vyzvedni v Turistickém infocentru.',
  },
};
