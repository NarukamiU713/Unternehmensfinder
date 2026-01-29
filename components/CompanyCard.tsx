import React, { useState } from 'react';
import { Company } from '../types';
import { getCareerUrl, getLogoFallbacks, guessCompanyDomain, getDistanceToHda, getMissingInfo, getFoundedYear } from '../utils';
import { ExternalLink, MapPin, Building2, Check, Route, AlertTriangle } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  viewed: boolean;
  isApplied: boolean;
  showFounded?: boolean;
  onClick: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, viewed, isApplied, showFounded, onClick }) => {
  const [logoErrorCount, setLogoErrorCount] = useState(0);
  const domain = guessCompanyDomain(company);
  const fallbacks = getLogoFallbacks(domain);
  const currentLogo = fallbacks[logoErrorCount];
  const careerUrl = getCareerUrl(company);
  const distance = getDistanceToHda(company);
  const missingInfo = getMissingInfo(company);
  const isIncomplete = missingInfo.length > 0;
  
  // Reuse util for consistency
  const foundedYear = getFoundedYear(company);

  // Address logic
  const address = company.addresses?.[0];
  const street = address?.street || company.street;
  const city = address?.city || company.city;
  const zip = address?.zip || company.zipCode;
  const country = address?.country || company.country;

  const displayLocation = [
    street,
    [zip, city].filter(Boolean).join(' '),
    country
  ].filter(Boolean).join(', ');

  const handleLogoError = () => {
    if (logoErrorCount < fallbacks.length) {
      setLogoErrorCount(prev => prev + 1);
    }
  };

  const showLogo = logoErrorCount < fallbacks.length;

  return (
    <div 
      onClick={onClick}
      className={`
        group relative flex flex-col p-4 sm:p-6 rounded-2xl border transition-all duration-300 ease-out cursor-pointer overflow-hidden
        ${viewed 
          ? 'bg-blue-50/40 border-blue-100/50 backdrop-blur-xl' 
          : `bg-white/40 backdrop-blur-xl border-white/40 hover:-translate-y-2 hover:bg-white/50 ${isIncomplete ? 'hover:border-amber-400/50 hover:shadow-amber-500/10' : 'hover:border-primary-400/60 hover:shadow-primary-500/20'} hover:shadow-xl`
        }
      `}
    >
      {/* Viewed Indicator (Top Right) */}
      {viewed && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-sm z-10">
          <Check size={12} className="sm:w-[14px] sm:h-[14px]" strokeWidth={3} />
        </div>
      )}

      {/* Missing Info Indicator (Top Left) */}
      {isIncomplete && !viewed && (
        <div 
          className="absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm z-10 cursor-help"
          title={`Fehlende Infos: ${missingInfo.join(', ')}`}
        >
          <AlertTriangle size={10} className="sm:w-3 sm:h-3" fill="currentColor" />
        </div>
      )}

      {/* Logo */}
      {showLogo && (
        <div className="h-14 sm:h-16 w-full mb-3 sm:mb-4 bg-white/80 rounded-lg p-2 flex items-center justify-center shadow-sm border border-white/60 group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
          <img 
            src={currentLogo} 
            alt={`${company.name} logo`} 
            className="max-h-full max-w-full object-contain"
            onError={handleLogoError}
            loading="lazy"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-2 sm:mb-3">
        <h3 className="font-heading font-semibold text-lg sm:text-xl text-slate-800 leading-tight group-hover:text-primary-700 transition-colors break-words">
          {company.name}
        </h3>
        {/* Status Badge replaces ID */}
        <span 
            className={`
                shrink-0 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md transition-colors
                ${isApplied 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }
            `}
        >
            {isApplied ? 'Beworben' : 'Offen'}
        </span>
      </div>

      {/* Tags & Founded Badge */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {showFounded && foundedYear && (
          <span className="text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
             Est. {foundedYear}
          </span>
        )}
        {(company.categories || []).slice(0, 3).map((cat, idx) => (
          <span key={idx} className="text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary-600 text-white shadow-sm shadow-primary-500/20">
            {cat}
          </span>
        ))}
        {(company.categories?.length || 0) > 3 && (
          <span className="text-xs font-semibold px-2 py-0.5 sm:px-2 sm:py-1 rounded-full bg-slate-200 text-slate-600">
            +{company.categories!.length - 3}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 sm:gap-2 text-sm text-slate-500 flex-1">
        {displayLocation ? (
          <>
           <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
            <span className="line-clamp-2 text-xs sm:text-sm">{displayLocation}</span>
          </div>
          {distance !== null && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pl-[24px]">
              <Route size={12} className="shrink-0" />
              <span>ca. {distance} km zur h_da</span>
            </div>
          )}
          </>
        ) : (
          <div className="flex items-center gap-2 italic opacity-60 text-amber-600/70">
             <Building2 size={16} />
             <span>Standort fehlt</span>
          </div>
        )}
      </div>

      {/* Footer Action */}
      {careerUrl && (
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100/50">
           <a 
            href={careerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
           >
             Karriereseite
           </a>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;