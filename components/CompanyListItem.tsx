import React, { useState } from 'react';
import { Company } from '../types';
import { getCareerUrl, getLogoFallbacks, guessCompanyDomain, getDistanceToHda, getMissingInfo, getFoundedYear } from '../utils';
import { ExternalLink, MapPin, Building2, Check, Route, AlertTriangle, ChevronRight } from 'lucide-react';

interface CompanyListItemProps {
  company: Company;
  viewed: boolean;
  isApplied: boolean;
  showFounded?: boolean;
  onClick: () => void;
}

const CompanyListItem: React.FC<CompanyListItemProps> = ({ company, viewed, isApplied, showFounded, onClick }) => {
  const [logoErrorCount, setLogoErrorCount] = useState(0);
  const domain = guessCompanyDomain(company);
  const fallbacks = getLogoFallbacks(domain);
  const currentLogo = fallbacks[logoErrorCount];
  const careerUrl = getCareerUrl(company);
  const distance = getDistanceToHda(company);
  const missingInfo = getMissingInfo(company);
  const isIncomplete = missingInfo.length > 0;

  // Reuse util
  const foundedYear = getFoundedYear(company);

  // Address logic
  const address = company.addresses?.[0];
  const street = address?.street || company.street;
  const city = address?.city || company.city;
  const zip = address?.zip || company.zipCode;

  const shortLocation = [zip, city].filter(Boolean).join(' ');

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
        group relative flex items-center gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 ease-out cursor-pointer
        ${viewed 
          ? 'bg-blue-50/40 border-blue-100/50 backdrop-blur-xl' 
          : `bg-white/60 backdrop-blur-xl border-white/50 hover:bg-white/80 ${isIncomplete ? 'hover:border-amber-400/50' : 'hover:border-primary-300'} hover:shadow-md`
        }
      `}
    >
      {/* Viewed Indicator (Absolute Left strip) */}
      {viewed && (
        <div className="absolute left-0 inset-y-0 w-1 bg-primary-500 rounded-l-xl" />
      )}

      {/* Logo (Compact) */}
      <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-sm border border-slate-100">
        {showLogo ? (
          <img 
            src={currentLogo} 
            alt={`${company.name} logo`} 
            className="max-h-full max-w-full object-contain"
            onError={handleLogoError}
            loading="lazy"
          />
        ) : (
          <Building2 size={20} className="text-slate-300" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
        
        {/* Name & ID */}
        <div className="sm:w-1/3 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-base sm:text-lg text-slate-800 truncate group-hover:text-primary-700 transition-colors">
              {company.name}
            </h3>
            {isIncomplete && !viewed && (
              <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            )}
            {viewed && (
               <Check size={14} className="text-primary-500 shrink-0" strokeWidth={3} />
            )}
          </div>
          {/* Status instead of ID */}
          <span className={`
            inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded border
            ${isApplied 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-slate-100 text-slate-400 border-slate-200'}
          `}>
             {isApplied ? 'BEWERBUNG VERSCHICKT' : 'OFFEN'}
          </span>
        </div>

        {/* Location & Distance */}
        <div className="sm:w-1/4 min-w-0 flex flex-col justify-center">
            {shortLocation ? (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 truncate">
                    <MapPin size={14} className="text-primary-400 shrink-0" />
                    <span className="truncate">{shortLocation}</span>
                </div>
            ) : (
                <span className="text-xs text-slate-400 italic">Kein Ort</span>
            )}
            {distance !== null && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-0.5">
                    <Route size={12} className="shrink-0" />
                    <span>{distance} km</span>
                </div>
            )}
        </div>

        {/* Tags (Desktop only mostly) */}
        <div className="hidden md:flex flex-wrap gap-1.5 flex-1">
          {showFounded && foundedYear && (
             <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
               Est. {foundedYear}
             </span>
          )}
          {(company.categories || []).slice(0, 3).map((cat, idx) => (
            <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {cat}
            </span>
          ))}
          {(company.categories?.length || 0) > 3 && (
            <span className="text-xs font-medium px-1.5 py-0.5 text-slate-400">
              +{company.categories!.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {careerUrl && (
          <a 
            href={careerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 bg-white hover:bg-primary-50 text-primary-600 border border-primary-100 hover:border-primary-200 rounded-lg text-xs font-medium transition-colors"
            title="Zur Karriereseite"
          >
            <ExternalLink size={14} className="sm:mr-1.5" />
            <span className="hidden sm:inline">Jobs</span>
          </a>
        )}
        <div className="text-slate-300 group-hover:text-primary-400 transition-colors">
            <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default CompanyListItem;