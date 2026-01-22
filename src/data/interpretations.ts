import transitInterpretationsData from './transit-interpretations-hand-optiona.json';

export interface Interpretation {
  short: string;
  long: string;
  source: string;
}

interface TransitData {
  transitToNatal: {
    [transitPlanet: string]: {
      [natalKey: string]: {
        [aspect: string]: Interpretation;
      };
    };
  };
  houseTransits?: {
    [planet: string]: {
      [house: string]: Interpretation;
    };
  };
}

const interpretations = transitInterpretationsData as TransitData;

export function getInterpretation(
  transitPlanet: string,
  aspect: string,
  natalPlanet: string
): Interpretation {
  const planetKey = transitPlanet.toLowerCase();
  const natalKey = `to${natalPlanet.charAt(0).toUpperCase()}${natalPlanet.slice(1).toLowerCase()}`;

  const entry = interpretations.transitToNatal?.[planetKey]?.[natalKey]?.[aspect];

  if (!entry) {
    const transitName = transitPlanet.charAt(0).toUpperCase() + transitPlanet.slice(1);
    const natalName = natalPlanet.charAt(0).toUpperCase() + natalPlanet.slice(1);
    return {
      short: `${transitName} ${aspect} ${natalName} - Interpretation coming soon`,
      long: "This transit interpretation is being added. Check back later.",
      source: ""
    };
  }

  return entry;
}
