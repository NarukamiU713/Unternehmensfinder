export interface Address {
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
}

export interface Company {
  id: string;
  name: string;
  institutionId?: string;
  
  // Contact & Web
  applicant_website?: string;
  application_website?: string;
  careerUrl?: string;
  applicationUrl?: string;
  website?: string;
  url?: string;
  homepage?: string;
  
  applicant_contact?: string;
  contactPerson?: string;
  ansprechpartner?: string;
  contact_person?: string;
  contactName?: string;
  
  contactTitle?: string;
  anrede?: string;
  contact_title?: string;
  title?: string;
  
  applicant_phone?: string;
  phone?: string;
  telefon?: string;
  telephone?: string;
  phoneNumber?: string;
  tel?: string;
  
  applicant_email_display?: string;
  applicant_email?: string;
  email?: string;
  mail?: string;
  contactEmail?: string;
  contact_email?: string;
  e_mail?: string;
  
  // Location
  addresses?: Address[];
  street?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  trainingLocation?: string;
  ausbildungsort?: string;
  training_location?: string;
  location?: string;
  addressAddition?: string;
  
  // Meta
  offered_studies?: string[];
  shorttext?: string;
  description?: string;
  industry?: string;
  size?: string;
  founded?: string;
  
  // Derived properties
  categories?: string[];
}
