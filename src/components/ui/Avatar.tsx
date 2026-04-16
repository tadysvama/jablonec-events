'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  ringColor?: string;
}

// Paleta barev – pestrá, ale souznějící s brand paletou
const PALETTE = [
  { bg: '#EEEDFE', text: '#3C3489' }, // purple
  { bg: '#E1F5EE', text: '#085041' }, // teal
  { bg: '#FBEAF0', text: '#4B1528' }, // pink
  { bg: '#E6F1FB', text: '#0C447C' }, // blue
  { bg: '#FAECE7', text: '#712B13' }, // coral
  { bg: '#FAEEDA', text: '#633806' }, // amber
  { bg: '#EAF3DE', text: '#27500A' }, // green
  { bg: '#FCEBEB', text: '#791F1F' }, // red
];

// Generuje iniciály z jména: "Tereza Nováková" -> "TN", "Jan" -> "J"
export function getInitials(name: string): string {
  if (!name?.trim()) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// Deterministicky vybere barvu z palety podle hashu jména
// Stejné jméno = vždy stejná barva (konzistence napříč stránkami)
export function getColorForName(name: string): { bg: string; text: string } {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl',
};

export function Avatar({ name, size = 'md', className, ringColor }: AvatarProps) {
  const initials = getInitials(name);
  const colors = getColorForName(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none',
        SIZE_CLASSES[size],
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        ...(ringColor ? { boxShadow: `0 0 0 2px ${ringColor}` } : {}),
      }}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
