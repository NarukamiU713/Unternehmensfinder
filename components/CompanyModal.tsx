import React, { useState } from 'react';
import { Company } from '../types';
import { getCareerUrl, getLogoFallbacks, guessCompanyDomain } from '../utils';
import { X, ExternalLink, MapPin, Phone, Mail, User, Globe, Building, Building2, CheckSquare, Square, StickyNote } from 'lucide-react';

interface CompanyModalProps {
  company: Company | null;
  isApplied: boolean;
  onToggleApplied: () => void;
  note: string;
  onUpdateNote: (text: string) => void;
  onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ company, isApplied, onToggleApplied, note, onUpdateNote, onClose }) => {
  const [logoErrorCount, setLogoErrorCount] = useState(0);

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
        <div className="flex-1 p-8 overflow-y-auto flex flex-col">
          <div className="mb-6">
             <div className="flex flex-wrap gap-2 mb-3">
               {(company.categories || []).map((cat, i) => (
                 <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700">
                   {cat}
                 </span>
               ))}
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

            {/* Notes Section with Top Border (The "White Line") */}
            <div className="pt-6 mt-auto border-t border-slate-100">
              <h4 className="flex items-center gap-2 font-heading font-semibold text-slate-900 mb-3">
                 <StickyNote size={16} className="text-primary-500" />
                 Eigene Notizen
              </h4>
              <textarea
                value={note}
                onChange={(e) => onUpdateNote(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-300 focus:ring-4 focus:ring-primary-50/50 outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400 resize-y"
                placeholder="Hier persönliche Anmerkungen zum Unternehmen eintragen... (wird automatisch gespeichert)"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;