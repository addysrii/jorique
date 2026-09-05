export interface JoriqueCollection {
  id: string;
  name: string;
  shortName: string;
  background: string;
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  borderColor: string;
  innerBg: string;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const JORIQUE_COLLECTIONS: Record<string, JoriqueCollection> = {
  essential: {
    id: 'essential',
    name: 'JORIQUE Essential',
    shortName: 'Essential',
    background: '#7A8B72', // Sage
    primaryText: '#F5EDE3', // Warm Ivory
    secondaryText: 'rgba(245, 237, 227, 0.85)',
    accentColor: '#E8D8B8',
    borderColor: 'rgba(245, 237, 227, 0.35)',
    innerBg: '#6F8067',
    cardBg: 'rgba(0, 0, 0, 0.12)',
    badgeBg: '#7A8B72', // Sage
    badgeText: '#F5EDE3', // Warm Ivory
    description: 'Organic everyday luxury with timeless sage serenity',
  },
  signature: {
    id: 'signature',
    name: 'JORIQUE Signature',
    shortName: 'Signature',
    background: '#243B64', // Deep Royal Blue
    primaryText: '#F5EDE3', // Warm Ivory
    secondaryText: 'rgba(245, 237, 227, 0.85)',
    accentColor: '#D4AF37', // Gold
    borderColor: 'rgba(212, 175, 55, 0.45)',
    innerBg: '#1D3256',
    cardBg: 'rgba(0, 0, 0, 0.2)',
    badgeBg: '#243B64', // Deep Royal Blue
    badgeText: '#F5EDE3', // Warm Ivory
    description: 'Masterpiece jacquards and heritage deep royal weaves',
  },
  luxe: {
    id: 'luxe',
    name: 'JORIQUE Luxe',
    shortName: 'Luxe',
    background: '#641F2D', // Burgundy
    primaryText: '#F5EDE3', // Warm Ivory
    secondaryText: 'rgba(245, 237, 227, 0.85)',
    accentColor: '#E5C158', // Champagne Gold
    borderColor: 'rgba(229, 193, 88, 0.45)',
    innerBg: '#531824',
    cardBg: 'rgba(0, 0, 0, 0.22)',
    badgeBg: '#641F2D', // Burgundy
    badgeText: '#F5EDE3', // Warm Ivory
    description: 'Mulberry silks, rich velvet accents & ultra-high thread counts',
  },
  souvenir: {
    id: 'souvenir',
    name: 'JORIQUE Souvenir',
    shortName: 'Souvenir',
    background: '#B9787D', // Dusty Rose
    primaryText: '#1A1A1A', // Black
    secondaryText: 'rgba(26, 26, 26, 0.75)',
    accentColor: '#5C1D24', // Deep rose accent
    borderColor: 'rgba(26, 26, 26, 0.25)',
    innerBg: '#AC6B70',
    cardBg: 'rgba(255, 255, 255, 0.22)',
    badgeBg: '#B9787D', // Dusty Rose
    badgeText: '#1A1A1A', // Black
    description: 'Artisanal gift editions and keepsake bespoke treasures',
  },
  hospitality: {
    id: 'hospitality',
    name: 'JORIQUE Hospitality',
    shortName: 'Hospitality',
    background: '#4B5563', // Slate
    primaryText: '#FFFFFF', // White
    secondaryText: 'rgba(255, 255, 255, 0.85)',
    accentColor: '#E5C158',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    innerBg: '#3E4753',
    cardBg: 'rgba(0, 0, 0, 0.18)',
    badgeBg: '#4B5563', // Slate
    badgeText: '#FFFFFF', // White
    description: 'Commercial-grade luxury suites & boutique hotel collections',
  },
};

export const JORIQUE_COLLECTION_LIST = Object.values(JORIQUE_COLLECTIONS);

export function getCollectionTheme(keyOrName?: string): JoriqueCollection | null {
  if (!keyOrName) return null;
  const clean = keyOrName.toLowerCase().trim();
  if (JORIQUE_COLLECTIONS[clean]) return JORIQUE_COLLECTIONS[clean];

  for (const coll of JORIQUE_COLLECTION_LIST) {
    if (
      coll.name.toLowerCase() === clean ||
      coll.shortName.toLowerCase() === clean ||
      clean.includes(coll.shortName.toLowerCase())
    ) {
      return coll;
    }
  }

  return null;
}

/**
 * Get background and primary text colours for badges according to brand guidelines:
 * - JORIQUE Essential: Sage #7A8B72 | Warm Ivory #F5EDE3
 * - JORIQUE Signature: Deep Royal Blue #243B64 | Warm Ivory #F5EDE3
 * - JORIQUE Luxe: Burgundy #641F2D | Warm Ivory #F5EDE3
 * - JORIQUE Souvenir: Dusty Rose #B9787D | Black #1A1A1A
 * - JORIQUE Hospitality: Slate #4B5563 | White #FFFFFF
 */
export function getBadgeColors(badgeText?: string): { bg: string; text: string; border?: string } {
  if (!badgeText) return { bg: '#7A8B72', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.3)' };
  const clean = badgeText.toLowerCase().trim();

  // 1. Match Collection Badges
  if (clean.includes('essential')) {
    return { bg: '#7A8B72', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' };
  }
  if (clean.includes('signature')) {
    return { bg: '#243B64', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' };
  }
  if (clean.includes('luxe')) {
    return { bg: '#641F2D', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' };
  }
  if (clean.includes('souvenir')) {
    return { bg: '#B9787D', text: '#1A1A1A', border: 'rgba(26, 26, 26, 0.25)' };
  }
  if (clean.includes('hospitality') || clean.includes('suite')) {
    return { bg: '#4B5563', text: '#FFFFFF', border: 'rgba(255, 255, 255, 0.3)' };
  }

  // 2. Harmonious Mapping for Standard Badges
  if (clean.includes('new')) {
    return { bg: '#7A8B72', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' }; // Sage
  }
  if (clean.includes('featured')) {
    return { bg: '#243B64', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' }; // Deep Royal Blue
  }
  if (clean.includes('best') || clean.includes('seller')) {
    return { bg: '#641F2D', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' }; // Burgundy
  }
  if (clean.includes('limited')) {
    return { bg: '#B9787D', text: '#1A1A1A', border: 'rgba(26, 26, 26, 0.25)' }; // Dusty Rose
  }

  return { bg: '#7A8B72', text: '#F5EDE3', border: 'rgba(245, 237, 227, 0.35)' };
}
