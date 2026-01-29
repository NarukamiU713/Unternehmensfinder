import React, { useState } from 'react';
import { Company } from '../types';
import { getCareerUrl, getLogoFallbacks, guessCompanyDomain } from '../utils';
import { X, ExternalLink, MapPin, Phone, Mail, User, Info, Globe, Building, Building2, CheckSquare, Square } from 'lucide-react';

interface CompanyModalProps {
  company: Company | null;
  isApplied: boolean;
  onToggleApplied: () => void;
  onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ company, isApplied, onToggleApplied, onClose }) => {
  const [logoErrorCount, setLogoErrorCount] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  if (!company) return null;

  const domain = guessCompanyDomain(company);
  const fallbacks = getLogoFallbacks(domain);
  const currentLogo = fallbacks[logoErrorCount];
  const careerUrl = getCareerUrl(company);

  // Contact Info
  const contactPerson = company.applicant_contact || company.contactPerson || company.ansprechpartner || company.contact_person || company.contactName;
  const contactTitle = company.contactTitle || company.anrede || company.contact_title || company.title;
  const phone = company.applicant_phone || company.phone || company.telefon || company.telephone || company.phoneNumber || company.tel;
  const email = company.applicant_email_display || company.applicant_email || company.email || company.mail || company.contactEmail || company.contact_email || company.e_mail;

  // Address
  const address = company.addresses?.[0];
  const street = address?.street || company.street;
  const city = address?.city || company.city;
  const zip = address?.zip || company.zipCode;
  const country = address?.country || company.country;
  const trainingLoc = company.trainingLocation || company.ausbildungsort || company.training_location || company.location;

  const fullAddress = [street, [zip, city].filter(Boolean).join(' '), country].filter(Boolean);

  // Handlers
  const handleLogoError = () => {
    if (logoErrorCount < fallbacks.length) {
      setLogoErrorCount(prev => prev + 1);
    }
  };

  const showLogo = logoErrorCount < fallbacks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white/80 backdrop-blur-xl w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border border-white/50 flex flex-col md:flex-row overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-red-50 hover:text-red-500 rounded-full border border-slate-200 transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Sidebar / Logo Area */}
        <div className="md:w-1/3 bg-slate-50/50 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
          {showLogo ? (
            <div className="w-full aspect-square max-w-[180px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-center mb-6">
              <img 
                src={currentLogo} 
                alt={company.name} 
                className="max-w-full max-h-full object-contain"
                onError={handleLogoError}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-300">
                <Building size={48} />
            </div>
          )}

          {/* Application Status Toggle */}
          <div className="w-full mb-4">
             <button
               onClick={onToggleApplied}
               className={`
                 w-full flex items-center justify-center gap-3 p-3 rounded-xl border transition-all duration-200 font-semibold text-sm
                 ${isApplied 
                    ? 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600'
                 }
               `}
             >
               {isApplied ? (
                 <>
                   <CheckSquare size={18} />
                   <span>Beworben</span>
                 </>
               ) : (
                 <>
                   <Square size={18} />
                   <span>Als beworben markieren</span>
                 </>
               )}
             </button>
          </div>
          
          <div className="w-full space-y-2">
            {careerUrl && (
              <a 
                href={careerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <ExternalLink size={16} />
                Karriereseite
              </a>
            )}
            {company.website && company.website !== careerUrl && (
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all"
              >
                <Globe size={16} />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
             <div className="flex flex-wrap gap-2 mb-3">
               {(company.categories || []).map((cat, i) => (
                 <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700">
                   {cat}
                 </span>
               ))}
               <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500">
                 ID: {company.id}
               </span>
             </div>
             <h2 className="font-heading text-3xl font-bold text-slate-900 leading-tight">
               {company.name}
             </h2>
          </div>

          <div className="space-y-6">
            {/* Description */}
            {(company.shorttext || company.description) && (
              <div className="bg-white/50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-600 leading-relaxed">
                  {company.shorttext || company.description}
                </p>
              </div>
            )}

            {/* Address */}
            {fullAddress.length > 0 && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Standort</h4>
                  <div className="text-slate-600 text-sm space-y-0.5">
                    {fullAddress.map((line, i) => <div key={i}>{line}</div>)}
                    {company.addressAddition && <div className="text-slate-500 italic mt-1">{company.addressAddition}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Training Location */}
            {trainingLoc && trainingLoc !== city && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <Building2 size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Ausbildungsort(e)</h4>
                  <div className="text-slate-600 text-sm">{trainingLoc}</div>
                </div>
              </div>
            )}

            {/* Contact */}
            {(contactPerson || phone || email) && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-slate-900 mb-1">Kontakt</h4>
                  <div className="text-slate-600 text-sm space-y-1">
                    {(contactTitle || contactPerson) && (
                       <div className="font-medium">{[contactTitle, contactPerson].filter(Boolean).join(' ')}</div>
                    )}
                    {phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        <a href={`tel:${phone}`} className="hover:text-primary-600">{phone}</a>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-2">
                         <Mail size={12} className="text-slate-400" />
                         <a href={`mailto:${email.replace('(at)', '@')}`} className="hover:text-primary-600 break-all">{email}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

             {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               {company.industry && (
                 <div>
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Branche</span>
                   <div className="text-slate-700 font-medium">{company.industry}</div>
                 </div>
               )}
               {company.size && (
                 <div>
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Größe</span>
                   <div className="text-slate-700 font-medium">{company.size}</div>
                 </div>
               )}
               {company.founded && (
                 <div>
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Gründung</span>
                   <div className="text-slate-700 font-medium">{company.founded}</div>
                 </div>
               )}
            </div>

            {/* Debug Toggle */}
            <div className="pt-8 mt-auto">
              <button 
                onClick={() => setShowDebug(!showDebug)} 
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              >
                <Info size={12} />
                {showDebug ? 'Debug ausblenden' : 'Debug anzeigen'}
              </button>
              
              {showDebug && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl overflow-hidden">
                  <div className="text-slate-400 text-xs font-mono mb-2 border-b border-slate-800 pb-2">
                    Raw Data for ID: {company.id}
                  </div>
                  <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(company, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;