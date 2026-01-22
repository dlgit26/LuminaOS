import { useMemo } from 'react';
import { Moon } from 'lucide-react';
import { getLogicalDateString } from '../lib/date-utils';
import { NATAL_CHART, findAspects, PLANET_SYMBOLS } from '../lib/astrology';
import { TransitCard } from './TransitCard';
import ephemerisData from '../lib/ephemeris-2026-2027.min.json';

interface CosmicWeatherProps {
  userId: string;
}

export function CosmicWeather({ userId }: CosmicWeatherProps) {
  const transits = useMemo(() => {
    const today = getLogicalDateString();
    const todayData = (ephemerisData as any).data[today];

    if (!todayData) {
      console.warn(`No ephemeris data for ${today}`);
      return null;
    }

    const aspects = findAspects(todayData, NATAL_CHART);

    return {
      moon: todayData.moon,
      aspects,
    };
  }, []);

  if (!transits) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Cosmic Weather</h2>
        </div>
        <p className="text-sm text-gray-500">
          Cosmic weather data not available for today
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Cosmic Weather</h2>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{PLANET_SYMBOLS.moon}</span>
          <span className="text-sm text-gray-700">
            Moon in <span className="font-medium">{transits.moon.sign}</span>
          </span>
        </div>
      </div>

      {transits.aspects.length > 0 ? (
        <div className="space-y-1">
          {transits.aspects.map((aspect, index) => (
            <TransitCard key={index} aspect={aspect} userId={userId} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No major transits today - enjoy the quiet cosmic weather
        </p>
      )}
    </div>
  );
}
