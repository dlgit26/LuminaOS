const ASPECTS = [
  { name: 'conjunction', symbol: '☌', angle: 0, orb: 8 },
  { name: 'sextile', symbol: '⚹', angle: 60, orb: 4 },
  { name: 'square', symbol: '□', angle: 90, orb: 6 },
  { name: 'trine', symbol: '△', angle: 120, orb: 6 },
  { name: 'opposition', symbol: '☍', angle: 180, orb: 8 },
];

export const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  pluto: '♇',
  ascendant: 'Asc',
};

export const NATAL_CHART = {
  sun: { sign: 'Virgo', longitude: 160.13 },
  moon: { sign: 'Libra', longitude: 186.82 },
  mercury: { sign: 'Libra', longitude: 186.83 },
  venus: { sign: 'Libra', longitude: 198.43 },
  mars: { sign: 'Virgo', longitude: 169.1 },
  jupiter: { sign: 'Cancer', longitude: 96.12 },
  saturn: { sign: 'Capricorn', longitude: 277.37 },
  pluto: { sign: 'Scorpio', longitude: 222.87 },
  ascendant: { sign: 'Scorpio', longitude: 219.65 },
};

export interface Aspect {
  transitPlanet: string;
  transitSymbol: string;
  natalPlanet: string;
  natalSymbol: string;
  aspect: string;
  aspectSymbol: string;
  exactness: number;
  transitSign: string;
}

export function findAspects(transitPlanets: any, natalChart: any): Aspect[] {
  const aspects: Aspect[] = [];

  for (const [transitPlanet, transitData] of Object.entries(transitPlanets)) {
    for (const [natalPlanet, natalData] of Object.entries(natalChart)) {
      const diff = Math.abs((transitData as any).longitude - (natalData as any).longitude);
      const normalized = diff > 180 ? 360 - diff : diff;

      for (const aspect of ASPECTS) {
        const orb = Math.abs(normalized - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            transitPlanet,
            transitSymbol: PLANET_SYMBOLS[transitPlanet] || '?',
            natalPlanet,
            natalSymbol: PLANET_SYMBOLS[natalPlanet] || '?',
            aspect: aspect.name,
            aspectSymbol: aspect.symbol,
            exactness: orb,
            transitSign: (transitData as any).sign,
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => a.exactness - b.exactness).slice(0, 3);
}
