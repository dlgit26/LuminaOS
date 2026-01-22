import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Aspect } from '../lib/astrology';
import { getInterpretation } from '../data/interpretations';
import { TransitFeedback } from './TransitFeedback';

interface TransitCardProps {
  aspect: Aspect;
  userId: string;
}

export function TransitCard({ aspect, userId }: TransitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const interpretation = getInterpretation(
    aspect.transitPlanet,
    aspect.aspect,
    aspect.natalPlanet
  );

  const transitType = `${aspect.transitPlanet} ${aspect.aspect} ${aspect.natalPlanet}`;
  const hasLongInterpretation = interpretation.long && interpretation.long !== "This transit interpretation is being added. Check back later.";

  return (
    <div className="py-3 border-t border-gray-100 first:border-t-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-medium text-gray-900">
          {aspect.transitSymbol} {aspect.transitPlanet.charAt(0).toUpperCase() + aspect.transitPlanet.slice(1)}
        </span>
        <span className="text-gray-400">{aspect.aspectSymbol}</span>
        <span className="text-lg font-medium text-gray-900">
          {aspect.natalSymbol} {aspect.natalPlanet.charAt(0).toUpperCase() + aspect.natalPlanet.slice(1)}
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {aspect.exactness.toFixed(1)}° orb
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {interpretation.short}
      </p>

      <TransitFeedback
        userId={userId}
        transitType={transitType}
        transitingPlanet={aspect.transitPlanet}
        natalPoint={aspect.natalPlanet}
        aspect={aspect.aspect}
      />

      {hasLongInterpretation && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-medium mt-3 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Read More</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-blue-200 bg-blue-50 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {interpretation.long}
              </p>
              {interpretation.source && (
                <p className="text-xs text-gray-500 mt-3 italic">
                  — {interpretation.source}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
