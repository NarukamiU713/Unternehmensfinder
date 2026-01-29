import { Company } from './types';

const categoryKeywords: Record<string, string[]> = {
  'IT': ['telekom', 'software', 'digital', 'tech', 'data', 'cyber', 'cloud', 'internet', 'system', 'computer', 'sap'],
  'Automotive': ['auto', 'porsche', 'mercedes', 'bmw', 'vw', 'volkswagen', 'audi', 'bosch', 'continental', 'zf'],
  'Beratung': ['consulting', 'beratung', 'advisory', 'pwc', 'deloitte', 'kpmg', 'ey', 'accenture', 'mckinsey', 'bcg'],
  'Finanz': ['bank', 'finance', 'versicherung', 'insurance', 'sparkasse', 'volksbank', 'allianz', 'axa', 'commerzbank'],
  'Pharma': ['pharma', 'medizin', 'medical', 'health', 'gesundheit', 'merck', 'bayer', 'roche', 'sanofi'],
  'Industrie': ['industrie', 'engineering', 'maschinen', 'siemens', 'thyssenkrupp', 'linde', 'basf'],
  'Energie': ['energie', 'energy', 'power', 'strom', 'eon', 'rwe', 'engie', 'vattenfall', 'mainova'],
  'Handel': ['handel', 'retail', 'edeka', 'rewe', 'aldi', 'lidl', 'metro', 'amazon'],
  'Logistik': ['logistik', 'logistics', 'transport', 'dhl', 'ups', 'fedex', 'schenker', 'kuehne']
};

// Coordinates for Hochschule Darmstadt (approx. Haardtring 100)
const HDA_COORDS = { lat: 49.8696, lon: 8.6366 };

// Extensive dictionary for coordinates of German cities, towns, and municipalities
// Focused on Rhein-Main-Neckar but covers nationwide hubs.
const CITY_COORDS: Record<string, { lat: number, lon: number }> = {
  // --- Rhein-Main / Südhessen Core ---
  'darmstadt': { lat: 49.8728, lon: 8.6512 },
  'weiterstadt': { lat: 49.8714, lon: 8.5916 },
  'griesheim': { lat: 49.8580, lon: 8.5574 },
  'pfungstadt': { lat: 49.8055, lon: 8.6041 },
  'mühltal': { lat: 49.8333, lon: 8.7000 },
  'rossdorf': { lat: 49.8583, lon: 8.7569 },
  'roßdorf': { lat: 49.8583, lon: 8.7569 },
  'ober-ramstadt': { lat: 49.8294, lon: 8.7492 },
  'erzhausen': { lat: 49.9500, lon: 8.6333 },
  'egelsbach': { lat: 49.9667, lon: 8.6667 },
  'messel': { lat: 49.9333, lon: 8.7500 },
  'gross-zimmern': { lat: 49.8722, lon: 8.8333 },
  'groß-zimmern': { lat: 49.8722, lon: 8.8333 },
  'dieburg': { lat: 49.8984, lon: 8.8415 },
  'münster': { lat: 49.9167, lon: 8.8667 }, // Münster (Hessen) - rough approx is fine vs Münster Westf.
  'münster (hessen)': { lat: 49.9167, lon: 8.8667 },
  'eppertshausen': { lat: 49.9458, lon: 8.8486 },
  'babenhausen': { lat: 49.9636, lon: 8.9536 },
  'schaafheim': { lat: 49.9167, lon: 9.0000 },
  'reinheim': { lat: 49.8333, lon: 8.8333 },
  'gross-bieberau': { lat: 49.8000, lon: 8.8333 },
  'groß-bieberau': { lat: 49.8000, lon: 8.8333 },
  'fischbachtal': { lat: 49.7667, lon: 8.8167 },
  'seeheim-jugenheim': { lat: 49.7667, lon: 8.6500 },
  'alsbach-hähnlein': { lat: 49.7333, lon: 8.6000 },
  'bickenbach': { lat: 49.7500, lon: 8.6167 },
  'zwingenberg': { lat: 49.7225, lon: 8.6133 },
  'bensheim': { lat: 49.6815, lon: 8.6190 },
  'heppenheim': { lat: 49.6417, lon: 8.6432 },
  'lorsch': { lat: 49.6500, lon: 8.5667 },
  'einhausen': { lat: 49.6667, lon: 8.5500 },
  'bürstadt': { lat: 49.6500, lon: 8.4500 },
  'biblis': { lat: 49.6833, lon: 8.4500 },
  'gross-rohrheim': { lat: 49.7167, lon: 8.4833 },
  'groß-rohrheim': { lat: 49.7167, lon: 8.4833 },
  'gernsheim': { lat: 49.7500, lon: 8.4833 },
  'biebesheim': { lat: 49.7833, lon: 8.4667 },
  'stockstadt': { lat: 49.8167, lon: 8.4667 },
  'riedstadt': { lat: 49.8333, lon: 8.5000 },
  'gross-gerau': { lat: 49.9229, lon: 8.4830 },
  'groß-gerau': { lat: 49.9229, lon: 8.4830 },
  'büttelborn': { lat: 49.9000, lon: 8.5167 },
  'nauheim': { lat: 49.9500, lon: 8.4500 },
  'trebur': { lat: 49.9167, lon: 8.4167 },
  'rüsselsheim': { lat: 49.9961, lon: 8.4137 },
  'rüsselsheim am main': { lat: 49.9961, lon: 8.4137 },
  'raunheim': { lat: 50.0167, lon: 8.4500 },
  'kelsterbach': { lat: 50.0716, lon: 8.5348 },
  'mörfelden-walldorf': { lat: 49.9922, lon: 8.5684 },
  'langen': { lat: 49.9904, lon: 8.6687 },
  'dreieich': { lat: 50.0163, lon: 8.6974 },
  'neu-isenburg': { lat: 50.0536, lon: 8.6946 },
  'dietzenbach': { lat: 50.0084, lon: 8.7753 },
  'rödermark': { lat: 49.9667, lon: 8.8167 },
  'rodgau': { lat: 50.0249, lon: 8.8795 },
  'hainburg': { lat: 50.0833, lon: 8.9667 },
  'seligenstadt': { lat: 50.0435, lon: 8.9757 },
  'mainhausen': { lat: 50.0167, lon: 9.0167 },
  'offenbach': { lat: 50.1006, lon: 8.7667 },
  'offenbach am main': { lat: 50.1006, lon: 8.7667 },
  'mühlheim': { lat: 50.1167, lon: 8.8333 },
  'mühlheim am main': { lat: 50.1167, lon: 8.8333 },
  'obertshausen': { lat: 50.0667, lon: 8.8500 },
  'heusenstamm': { lat: 50.0500, lon: 8.8000 },
  'hanau': { lat: 50.1327, lon: 8.9169 },
  'bruchköbel': { lat: 50.1833, lon: 8.9167 },
  'erlensee': { lat: 50.1667, lon: 8.9833 },
  'maintal': { lat: 50.1500, lon: 8.8333 },
  'frankfurt': { lat: 50.1109, lon: 8.6821 },
  'frankfurt am main': { lat: 50.1109, lon: 8.6821 },
  'eschborn': { lat: 50.1417, lon: 8.5681 },
  'schwalbach': { lat: 50.1500, lon: 8.5333 },
  'schwalbach am taunus': { lat: 50.1500, lon: 8.5333 },
  'sulzbach': { lat: 50.1333, lon: 8.5167 },
  'bad soden': { lat: 50.1433, lon: 8.5000 },
  'bad soden am taunus': { lat: 50.1433, lon: 8.5000 },
  'kelkheim': { lat: 50.1333, lon: 8.4500 },
  'hofheim': { lat: 50.0864, lon: 8.4485 },
  'hofheim am taunus': { lat: 50.0864, lon: 8.4485 },
  'kriftel': { lat: 50.0833, lon: 8.4667 },
  'hattersheim': { lat: 50.0667, lon: 8.4833 },
  'flörsheim': { lat: 50.0167, lon: 8.4333 },
  'hochheim': { lat: 50.0167, lon: 8.3500 },
  'wiesbaden': { lat: 50.0782, lon: 8.2398 },
  'mainz': { lat: 49.9929, lon: 8.2473 },
  'oberursel': { lat: 50.2017, lon: 8.5770 },
  'bad homburg': { lat: 50.2291, lon: 8.6111 },
  'bad homburg v. d. höhe': { lat: 50.2291, lon: 8.6111 },
  'friedrichsdorf': { lat: 50.2667, lon: 8.6333 },
  'steinbach': { lat: 50.1667, lon: 8.5667 },
  'kronberg': { lat: 50.1833, lon: 8.5167 },
  'königstein': { lat: 50.1833, lon: 8.4667 },
  'bad vilbel': { lat: 50.1837, lon: 8.7454 },
  'karben': { lat: 50.2333, lon: 8.7667 },
  'bad nauheim': { lat: 50.3662, lon: 8.7397 },
  'friedberg': { lat: 50.3347, lon: 8.7538 },
  'butzbach': { lat: 50.4333, lon: 8.6667 },
  'giessen': { lat: 50.5841, lon: 8.6784 },
  'gießen': { lat: 50.5841, lon: 8.6784 },
  'wetzlar': { lat: 50.5516, lon: 8.5034 },
  'marburg': { lat: 50.8022, lon: 8.7709 },
  'limbburg': { lat: 50.3833, lon: 8.0500 },
  'limburg an der lahn': { lat: 50.3833, lon: 8.0500 },
  'montabaur': { lat: 50.4333, lon: 7.8333 },
  'koblenz': { lat: 50.3569, lon: 7.5938 },
  'aschaffenburg': { lat: 49.9742, lon: 9.1478 },
  'michelstadt': { lat: 49.6780, lon: 9.0064 },
  'erbach': { lat: 49.6575, lon: 8.9917 },
  'bad könig': { lat: 49.7500, lon: 9.0167 },
  'höchst': { lat: 49.8000, lon: 8.9833 },
  'breuberg': { lat: 49.8167, lon: 9.0333 },
  'weinheim': { lat: 49.5552, lon: 8.6669 },
  'viernheim': { lat: 49.5379, lon: 8.5786 },
  'lampertheim': { lat: 49.5937, lon: 8.4682 },
  'mannheim': { lat: 49.4875, lon: 8.4660 },
  'heidelberg': { lat: 49.3988, lon: 8.6724 },
  'ludwigshafen': { lat: 49.4774, lon: 8.4452 },
  'speyer': { lat: 49.3175, lon: 8.4322 },
  'worms': { lat: 49.6356, lon: 8.3561 },
  'kaiserslautern': { lat: 49.4447, lon: 7.7689 },
  'karlsruhe': { lat: 49.0069, lon: 8.4037 },
  'bruchsal': { lat: 49.1231, lon: 8.5978 },
  'walldorf': { lat: 49.3082, lon: 8.6425 },
  'sinsheim': { lat: 49.2522, lon: 8.8778 },
  'heilbronn': { lat: 49.1427, lon: 9.2109 },
  'neckarsulm': { lat: 49.1917, lon: 9.2231 },
  'stuttgart': { lat: 48.7758, lon: 9.1829 },
  'ludwigsburg': { lat: 48.8975, lon: 9.1919 },
  'esslingen': { lat: 48.7406, lon: 9.3114 },
  'böblingen': { lat: 48.6833, lon: 9.0167 },
  'sindelfingen': { lat: 48.7075, lon: 9.0044 },
  'reutlingen': { lat: 48.4914, lon: 9.2043 },
  'tübingen': { lat: 48.5216, lon: 9.0576 },
  'ulm': { lat: 48.4011, lon: 9.9876 },
  'neu-ulm': { lat: 48.3978, lon: 10.0053 },
  'freiburg': { lat: 47.9990, lon: 7.8421 },
  
  // --- Rest of Germany ---
  'berlin': { lat: 52.5200, lon: 13.4050 },
  'hamburg': { lat: 53.5511, lon: 9.9937 },
  'münchen': { lat: 48.1351, lon: 11.5820 },
  'munich': { lat: 48.1351, lon: 11.5820 },
  'unterföhring': { lat: 48.1931, lon: 11.6494 },
  'ismaning': { lat: 48.2267, lon: 11.6739 },
  'garching': { lat: 48.2492, lon: 11.6525 },
  'köln': { lat: 50.9375, lon: 6.9603 },
  'cologne': { lat: 50.9375, lon: 6.9603 },
  'düsseldorf': { lat: 51.2277, lon: 6.7735 },
  'essen': { lat: 51.4556, lon: 7.0116 },
  'dortmund': { lat: 51.5136, lon: 7.4653 },
  'leipzig': { lat: 51.3397, lon: 12.3731 },
  'bremen': { lat: 53.0793, lon: 8.8017 },
  'dresden': { lat: 51.0504, lon: 13.7373 },
  'hannover': { lat: 52.3759, lon: 9.7320 },
  'nürnberg': { lat: 49.4521, lon: 11.0767 },
  'erlangen': { lat: 49.6012, lon: 11.0231 },
  'fürth': { lat: 49.4761, lon: 10.9903 },
  'duisburg': { lat: 51.4344, lon: 6.7623 },
  'bochum': { lat: 51.4818, lon: 7.2162 },
  'wuppertal': { lat: 51.2562, lon: 7.1508 },
  'bielefeld': { lat: 52.0302, lon: 8.5325 },
  'bonn': { lat: 50.7374, lon: 7.0982 },
  'münster (westf)': { lat: 51.9607, lon: 7.6261 },
  'augsburg': { lat: 48.3705, lon: 10.8978 },
  'gelsenkirchen': { lat: 51.5177, lon: 7.0857 },
  'mönchengladbach': { lat: 51.1854, lon: 6.4417 },
  'braunschweig': { lat: 52.2689, lon: 10.5268 },
  'chemnitz': { lat: 50.8278, lon: 12.9214 },
  'kiel': { lat: 54.3233, lon: 10.1228 },
  'aachen': { lat: 50.7753, lon: 6.0839 },
  'halle': { lat: 51.4828, lon: 11.9646 },
  'halle (saale)': { lat: 51.4828, lon: 11.9646 },
  'magdeburg': { lat: 52.1205, lon: 11.6276 },
  'freiburg im breisgau': { lat: 47.9990, lon: 7.8421 },
  'krefeld': { lat: 51.3383, lon: 6.5629 },
  'lübeck': { lat: 53.8655, lon: 10.6866 },
  'erfurt': { lat: 50.9848, lon: 11.0299 },
  'oberhausen': { lat: 51.4700, lon: 6.8710 },
  'rostock': { lat: 54.0924, lon: 12.0991 },
  'kassel': { lat: 51.3127, lon: 9.4797 },
  'hagen': { lat: 51.3671, lon: 7.4633 },
  'hamm': { lat: 51.6811, lon: 7.8194 },
  'saarbrücken': { lat: 49.2402, lon: 6.9969 },
  'mülheim': { lat: 51.4291, lon: 6.8807 },
  'potsdam': { lat: 52.3906, lon: 13.0645 },
  'ludwigshafen am rhein': { lat: 49.4774, lon: 8.4452 },
  'oldenburg': { lat: 53.1435, lon: 8.2146 },
  'leverkusen': { lat: 51.0459, lon: 7.0001 },
  'osnabrück': { lat: 52.2799, lon: 8.0472 },
  'solingen': { lat: 51.1714, lon: 7.0847 },
  'herne': { lat: 51.5426, lon: 7.2190 },
  'neuss': { lat: 51.1983, lon: 6.6917 },
  'regensburg': { lat: 49.0134, lon: 12.1016 },
  'paderborn': { lat: 51.7189, lon: 8.7575 },
  'ingolstadt': { lat: 48.7665, lon: 11.4258 },
  'würzburg': { lat: 49.7913, lon: 9.9534 },
  'wolfsburg': { lat: 52.4227, lon: 10.7865 },
  'pforzheim': { lat: 48.8906, lon: 8.7029 },
  'göttingen': { lat: 51.5413, lon: 9.9158 },
  'bottrop': { lat: 51.5233, lon: 6.9425 },
  'trier': { lat: 49.7499, lon: 6.6371 },
  'recklinghausen': { lat: 51.6144, lon: 7.1981 },
  'bremerhaven': { lat: 53.5396, lon: 8.5809 },
  'bergisch gladbach': { lat: 50.9928, lon: 7.1378 },
  'jena': { lat: 50.9271, lon: 11.5892 },
  'remscheid': { lat: 51.1794, lon: 7.1894 },
  'salzgitter': { lat: 52.1500, lon: 10.3333 },
  'moers': { lat: 51.4508, lon: 6.6267 },
  'siegen': { lat: 50.8744, lon: 8.0169 },
  'hildesheim': { lat: 52.1508, lon: 9.9511 },
  'cottbus': { lat: 51.7563, lon: 14.3329 },
  'gütersloh': { lat: 51.9061, lon: 8.3783 },
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistanceToHda(company: Company): number | null {
  // Normalize city input: lowercase, trim
  let city = (company.addresses?.[0]?.city || company.city || '').toLowerCase().trim();
  
  // Remove zip codes (5 digits at start or end) to improve matching chances
  // e.g., "64293 Darmstadt" -> "Darmstadt"
  city = city.replace(/^\d{5}\s+/, '').replace(/\s+\d{5}$/, '');
  
  if (!city) return null;

  // Try direct match
  let coords = CITY_COORDS[city];
  
  // Try finding a key that is contained in the city string
  // This helps with "Frankfurt (Oder)" -> "frankfurt" if defined, or "Frankfurt am Main" -> "frankfurt"
  // Prioritize exact substring match from our DB
  if (!coords) {
    // 1. Try to see if our city string is a known key with some extra text
    // e.g. input: "Darmstadt, Germany" -> key: "darmstadt"
    const key = Object.keys(CITY_COORDS).find(k => city.includes(k));
    if (key) coords = CITY_COORDS[key];
  }

  // If still no match, try reverse: see if input is part of a key (e.g. "Frankfurt" input for "Frankfurt am Main" key)
  if (!coords) {
     const key = Object.keys(CITY_COORDS).find(k => k.includes(city));
     if (key) coords = CITY_COORDS[key];
  }

  if (coords) {
    return Math.round(getDistanceFromLatLonInKm(HDA_COORDS.lat, HDA_COORDS.lon, coords.lat, coords.lon));
  }

  return null;
}

export function categorizeCompany(company: Company): string[] {
  const name = (company.name || '').toLowerCase();
  
  // Use offered_studies if available
  if (company.offered_studies && Array.isArray(company.offered_studies) && company.offered_studies.length > 0) {
      return company.offered_studies;
  }

  const categories: string[] = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
          categories.push(category);
      }
  }

  return categories.length > 0 ? categories : ['Sonstige'];
}

export function getCareerUrl(company: Company): string | null {
  return company.applicant_website || 
         company.application_website ||
         company.careerUrl || 
         company.applicationUrl || 
         company.website || 
         company.url || 
         company.homepage || 
         null;
}

export function extractDomain(url: string): string | null {
  if (!url) return null;
  try {
      let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
      domain = domain.split('/')[0];
      return domain;
  } catch (e) {
      return null;
  }
}

export function guessCompanyDomain(company: Company): string | null {
  const websiteUrl = getCareerUrl(company);
  if (websiteUrl) {
      const domain = extractDomain(websiteUrl);
      if (domain) return domain;
  }

  const name = company.name || '';
  if (name) {
      const lowerName = name.toLowerCase();
      
      const knownDomains: Record<string, string> = {
          'telekom': 'telekom.de',
          'deutsche telekom': 'telekom.de',
          'siemens': 'siemens.com',
          'bosch': 'bosch.com',
          'bmw': 'bmw.de',
          'mercedes': 'mercedes-benz.com',
          'volkswagen': 'volkswagen.de',
          'vw': 'volkswagen.de',
          'audi': 'audi.de',
          'porsche': 'porsche.com',
          'sap': 'sap.com',
          'allianz': 'allianz.de',
          'lufthansa': 'lufthansa.com',
          'deutsche bank': 'db.com',
          'commerzbank': 'commerzbank.de',
          'adidas': 'adidas.com',
          'puma': 'puma.com',
          'basf': 'basf.com',
          'bayer': 'bayer.com',
          'dhl': 'dhl.com',
          'deutsche bahn': 'bahn.de',
          'mainova': 'mainova.de',
          'sparkasse': 'sparkasse.de',
          'ikea': 'ikea.com',
      };
      
      for (const [key, domain] of Object.entries(knownDomains)) {
          if (lowerName.includes(key)) return domain;
      }
      
      const cleanName = lowerName
          .replace(/\s+/g, '')
          .replace(/gmbh|ag|kg|ohg|gbr|ug|se|&co\.|mbh|gesellschaft|für/g, '')
          .replace(/[^a-z0-9-]/g, '');
      
      if (cleanName && cleanName.length > 2) {
          return cleanName + '.de';
      }
  }

  return null;
}

export function getLogoFallbacks(domain: string | null): string[] {
  if (!domain) return [];
  return [
      `https://logo.clearbit.com/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icon.horse/icon/${domain}`
  ];
}

export function getFoundedYear(company: Company): number | null {
  if (!company.founded) return null;
  const val = String(company.founded);
  // Match a 4 digit year between 1000 and 2099
  // Allow for years like 1668 which were previously excluded by (17|18|19|20).
  // Also handles if text contains things like "Seit 1990"
  const match = val.match(/\b(1\d|20)\d{2}\b/);
  return match ? parseInt(match[0], 10) : null;
}

export function getMissingInfo(company: Company): string[] {
  const missing: string[] = [];
  
  // Check location (City or Street should be present)
  const hasLocation = (company.addresses?.[0]?.city || company.city) || (company.addresses?.[0]?.street || company.street);
  if (!hasLocation) missing.push('Standort');

  // Check website (re-use logic that checks multiple fields)
  const hasWeb = getCareerUrl(company);
  if (!hasWeb) missing.push('Webseite');

  // Check contact
  const hasContact = company.contactPerson || company.applicant_contact || 
                     company.email || company.applicant_email || company.contactEmail || 
                     company.phone || company.applicant_phone;
  if (!hasContact) missing.push('Kontakt');

  return missing;
}