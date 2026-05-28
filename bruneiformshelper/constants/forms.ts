export type FormCategory =
  | 'identity'
  | 'immigration'
  | 'vehicle'
  | 'business'
  | 'health'
  | 'education'
  | 'tax'
  | 'property'
  | 'other';

export interface BruneiForm {
  id: string;
  name: string;
  nameMalay: string;
  department: string;
  departmentMalay: string;
  category: FormCategory;
  description: string;
  descriptionMalay: string;
  documents: string[];
  steps: string[];
  fee: string;
  processingTime: string;
  officeHours: string;
  location: string;
  tips: string[];
}

export const CATEGORY_LABELS: Record<FormCategory, { en: string; ms: string; icon: string }> = {
  identity: { en: 'Identity', ms: 'Identiti', icon: '🪪' },
  immigration: { en: 'Immigration', ms: 'Imigresen', icon: '✈️' },
  vehicle: { en: 'Vehicles', ms: 'Kenderaan', icon: '🚗' },
  business: { en: 'Business', ms: 'Perniagaan', icon: '🏢' },
  health: { en: 'Health', ms: 'Kesihatan', icon: '🏥' },
  education: { en: 'Education', ms: 'Pendidikan', icon: '📚' },
  tax: { en: 'Tax', ms: 'Cukai', icon: '📋' },
  property: { en: 'Property', ms: 'Hartanah', icon: '🏠' },
  other: { en: 'Other', ms: 'Lain-lain', icon: '📄' },
};

export const FORMS: BruneiForm[] = [
  {
    id: 'ic-replacement',
    name: 'IC Replacement',
    nameMalay: 'Penggantian Kad Pengenalan',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'identity',
    description: 'Replace a lost, damaged, or stolen Brunei identity card (IC).',
    descriptionMalay: 'Gantikan kad pengenalan Brunei yang hilang, rosak, atau dicuri.',
    documents: [
      'Completed KP/IC/1 form (available at JPIN office)',
      'One (1) recent passport-sized photo (blue background)',
      'Police report (if lost or stolen)',
      'Original damaged IC (if applicable)',
      'Birth certificate (for first-time IC applicants)',
    ],
    steps: [
      'Obtain and fill in the KP/IC/1 form at the JPIN counter or download from JPIN website.',
      'Attach your passport-sized photo (blue background, taken within the last 3 months).',
      'If IC was lost or stolen, attach a copy of the police report.',
      'Submit the completed form at any JPIN office during working hours.',
      'Pay the replacement fee at the payment counter.',
      'Collect your new IC within the processing period (or arrange for it to be sent to your address).',
    ],
    fee: 'BND $5 (first replacement) / BND $20 (subsequent replacements)',
    processingTime: '3–5 working days',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN Office, Old Airport Road, Bandar Seri Begawan',
    tips: [
      'Bring more than one passport photo — the officer may ask for extras.',
      'Blue background photos are required; white or grey will be rejected.',
      'The police report must be obtained within 24 hours of discovering the loss.',
      'Saturday counter service is available but may be busier — go on weekday mornings.',
    ],
  },
  {
    id: 'ic-renewal',
    name: 'IC Renewal (Expired)',
    nameMalay: 'Pembaharuan Kad Pengenalan (Tamat Tempoh)',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'identity',
    description: 'Renew your Brunei IC that has expired or is about to expire.',
    descriptionMalay: 'Baharukan IC Brunei anda yang telah atau hampir tamat tempoh.',
    documents: [
      'Completed KP/IC/1 renewal form',
      'One (1) passport-sized photo (blue background)',
      'Current (expiring) IC — do not surrender until told',
    ],
    steps: [
      'Visit any JPIN office and request the IC renewal form (KP/IC/1).',
      'Fill in all sections accurately — name and address must match official records.',
      'Submit form with photo and current IC.',
      'Pay the renewal fee.',
      'You will be informed of the collection date — usually 3–5 working days.',
      'Surrender old IC when collecting the new one.',
    ],
    fee: 'BND $5',
    processingTime: '3–5 working days',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN Office, Old Airport Road, BSB (main); district offices also available',
    tips: [
      'You can renew up to 6 months before expiry.',
      'IC is valid for 10 years for adults, 5 years for minors.',
      'Check that your address on record is up to date before visiting.',
    ],
  },
  {
    id: 'passport-renewal',
    name: 'Passport Renewal',
    nameMalay: 'Pembaharuan Pasport',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'immigration',
    description: 'Renew your Brunei passport for citizens and permanent residents.',
    descriptionMalay: 'Baharukan pasport Brunei anda untuk warganegara dan pemastautin tetap.',
    documents: [
      'Completed passport application form (available at JPIN)',
      'Two (2) recent passport-sized photos (white background, 35mm × 45mm)',
      'Current passport (original)',
      'IC (original + 1 photocopy)',
      'For minors: parents\' ICs and birth certificate',
    ],
    steps: [
      'Obtain the passport application form from JPIN or the official website.',
      'Fill in the form clearly in block letters. Do not sign the form yet.',
      'Attach two passport photos — white background, no glasses, no head covering (unless for religious reasons).',
      'Bring originals of your current passport and IC.',
      'Submit at the JPIN passport section counter.',
      'Sign the form in front of the officer.',
      'Pay the fee and receive a collection slip.',
      'Return to collect your passport on the stated date. Bring collection slip and IC.',
    ],
    fee: 'BND $30 (standard) / BND $50 (urgent — same day or next day)',
    processingTime: 'Standard: 3–5 days. Urgent: same day or next day.',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN Office, Old Airport Road, BSB',
    tips: [
      'Do not sign the form at home — you must sign it in front of the officer.',
      'Renewal is recommended at least 6 months before expiry for international travel.',
      'Brunei passport is valid for 5 years for adults.',
      'For urgency, bring documentation proving your need (e.g., flight ticket).',
    ],
  },
  {
    id: 'visit-pass-extension',
    name: 'Visit Pass Extension',
    nameMalay: 'Lanjutan Pas Lawatan',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'immigration',
    description: 'Extend your stay in Brunei beyond the initial visit pass period.',
    descriptionMalay: 'Lanjutkan penginapan anda di Brunei melebihi tempoh pas lawatan awal.',
    documents: [
      'Completed visit pass extension form (JPIN/IMM/14)',
      'Valid passport with at least 6 months validity',
      'Current visit pass / entry stamp',
      'Proof of purpose (e.g., letter from host, medical appointment, business letter)',
      'Return flight ticket or onward travel proof',
      'Sufficient funds evidence (bank statement or cash)',
    ],
    steps: [
      'Visit JPIN before your current pass expires — do not overstay.',
      'Collect and complete form JPIN/IMM/14.',
      'Attach all required documents.',
      'Submit at the Immigration counter. State your reason clearly.',
      'You may be asked questions — remain polite and honest.',
      'If approved, the new validity will be stamped into your passport.',
    ],
    fee: 'BND $10 per extension (fees may vary)',
    processingTime: 'Same day (subject to officer discretion)',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN Immigration Division, BSB',
    tips: [
      'Apply at least 2–3 days before your current pass expires — overstaying has serious consequences.',
      'Extensions are at the discretion of the immigration officer — no guarantee.',
      'Bring a local host\'s contact number and letter if visiting family or friends.',
      'Medical reasons (with hospital letter) are typically approved more readily.',
    ],
  },
  {
    id: 'driving-license-new',
    name: 'Driving Licence (New)',
    nameMalay: 'Lesen Memandu (Baru)',
    department: 'Land Transport Department (JPD)',
    departmentMalay: 'Jabatan Pengangkutan Darat',
    category: 'vehicle',
    description: 'Apply for a new Brunei driving licence after passing the test.',
    descriptionMalay: 'Mohon lesen memandu Brunei baharu selepas lulus ujian.',
    documents: [
      'Completed application form (JPD/LL/1 or JPD/DL/1)',
      'IC (original + photocopy)',
      'Provisional licence (if applicable)',
      'Theory test pass certificate',
      'Road test pass certificate',
      'Medical certificate (JPD health form)',
      'Two (2) passport-sized photos',
    ],
    steps: [
      'Enrol at an approved driving school and complete the required training hours.',
      'Pass the theory (computer) test at JPD.',
      'Pass the road test (conducted by approved examiner).',
      'Obtain the medical certificate from a JPD-approved doctor.',
      'Submit all documents to JPD with the completed application form.',
      'Pay the licence fee.',
      'Collect your licence — usually issued the same day after verification.',
    ],
    fee: 'BND $20 (Class B — motorcycle) / BND $25 (Class D — car)',
    processingTime: 'Same day after document submission',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPD Office, Jalan Gadong, BSB',
    tips: [
      'Driving schools typically handle most of the paperwork for you — confirm what you need to bring personally.',
      'Your provisional licence must be valid on the day of the road test.',
      'The medical form expires after 3 months — time it with your test.',
    ],
  },
  {
    id: 'vehicle-registration',
    name: 'Vehicle Registration',
    nameMalay: 'Pendaftaran Kenderaan',
    department: 'Land Transport Department (JPD)',
    departmentMalay: 'Jabatan Pengangkutan Darat',
    category: 'vehicle',
    description: 'Register a new or imported vehicle in Brunei.',
    descriptionMalay: 'Daftarkan kenderaan baharu atau import di Brunei.',
    documents: [
      'Vehicle purchase invoice / Bill of Lading (for imports)',
      'Customs clearance certificate (for imported vehicles)',
      'Insurance certificate (must be in place before registration)',
      'IC (original + photocopy)',
      'Completed JPD vehicle registration form',
      'Payment for road tax (at point of registration)',
    ],
    steps: [
      'Ensure the vehicle has passed customs (for imports) and obtain the clearance certificate.',
      'Obtain motor insurance from an approved insurer before visiting JPD.',
      'Complete the JPD vehicle registration form.',
      'Submit all documents at JPD — the officer will inspect the VIN/chassis number.',
      'Pay the registration fee and road tax.',
      'Collect your number plates (or arrange for a dealer to collect).',
    ],
    fee: 'Varies by vehicle type and CC. Road tax: BND $40–$200+ per year.',
    processingTime: '1–3 working days',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPD Office, Jalan Gadong, BSB',
    tips: [
      'Insurance must be active before registration — get your policy first.',
      'For imported cars, Customs clearance can take time — budget extra weeks.',
      'Car dealers in Brunei usually handle registration on your behalf for new purchases.',
    ],
  },
  {
    id: 'business-registration-sole',
    name: 'Sole Proprietorship Registration',
    nameMalay: 'Pendaftaran Perniagaan Tunggal',
    department: 'Registry of Companies & Business Names (ROCBN)',
    departmentMalay: 'Pendaftaran Syarikat dan Nama Perniagaan',
    category: 'business',
    description: 'Register a sole proprietorship business in Brunei.',
    descriptionMalay: 'Daftarkan perniagaan milikan tunggal di Brunei.',
    documents: [
      'Completed BN1 form (Business Registration form)',
      'IC (original + photocopy)',
      'Business address proof (tenancy agreement or letter of consent from property owner)',
      'Trade licence application (if required for your business type)',
      'Halal certification documentation (if selling food)',
    ],
    steps: [
      'Choose a unique business name and check availability on the ROCBN online portal.',
      'Complete the BN1 registration form — available online or at ROCBN.',
      'Prepare all supporting documents listed above.',
      'Submit the application online via the ROCBN Business Registration Portal or in person.',
      'Pay the registration fee.',
      'Receive your Business Registration Certificate (typically within 1–3 days).',
      'Apply for any required trade licences from your district municipality (Majlis Daerah).',
    ],
    fee: 'BND $10 per year (sole proprietorship) / BND $25 per year (partnership)',
    processingTime: '1–3 working days',
    officeHours: 'Monday–Friday: 8:00am – 12:00pm, 1:30pm – 4:30pm',
    location: 'ROCBN, Kementerian Kewangan dan Ekonomi, BSB',
    tips: [
      'Business registration must be renewed annually — mark the expiry date.',
      'Check if your business type needs a special trade licence before registering.',
      'Food businesses need approval from BAFRA (Brunei Agri-Food and Veterinary Authority).',
      'For home-based businesses, you still need a trade licence from your district office.',
    ],
  },
  {
    id: 'birth-certificate',
    name: 'Birth Registration',
    nameMalay: 'Pendaftaran Kelahiran',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'identity',
    description: 'Register a newborn child\'s birth and obtain a birth certificate.',
    descriptionMalay: 'Daftarkan kelahiran bayi dan dapatkan sijil kelahiran.',
    documents: [
      'Hospital notification of birth (given by hospital at discharge)',
      "Father's IC (original + photocopy)",
      "Mother's IC (original + photocopy)",
      'Marriage certificate (if parents are married)',
      'For non-citizen parent: valid passport and entry pass',
    ],
    steps: [
      'The hospital will issue a "Notification of Birth" form at discharge — keep this safe.',
      'Visit JPIN within 14 days of birth (late registration incurs a fine).',
      'Complete the birth registration form at the JPIN counter.',
      'Both parents should be present if possible; if not, a letter of authorisation is needed.',
      'The name chosen must follow naming conventions (check with officer if unsure).',
      'Receive the birth certificate — it is issued immediately or within 1–2 days.',
    ],
    fee: 'Free (within 14 days) / Fine applies for late registration',
    processingTime: 'Same day or 1–2 working days',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN Office, BSB (or district offices)',
    tips: [
      'Register within 14 days to avoid a late registration fine.',
      'The birth certificate is essential for the child\'s future IC, passport, and school enrolment.',
      'Bring the hospital notification of birth — without it, the process is significantly more complex.',
    ],
  },
  {
    id: 'marriage-registration',
    name: 'Marriage Registration (Civil)',
    nameMalay: 'Pendaftaran Perkahwinan (Sivil)',
    department: 'Department of Immigration & National Registration (JPIN)',
    departmentMalay: 'Jabatan Imigresen dan Pendaftaran Negara',
    category: 'identity',
    description: 'Register a civil marriage in Brunei. For Muslim marriages, this is handled separately by the Religious Affairs Department (JKAM).',
    descriptionMalay: 'Daftarkan perkahwinan sivil di Brunei. Perkahwinan Islam diuruskan oleh JKAM.',
    documents: [
      'Completed marriage registration form',
      'ICs of both parties (originals + photocopies)',
      'Passport (for non-citizens)',
      'Proof of single status (if previously married: divorce or death certificate)',
      'Two (2) witnesses with valid ICs',
    ],
    steps: [
      'Both parties must give 21 days\' notice of intent to marry at JPIN.',
      'Complete and submit the notice of marriage form with all documents.',
      'JPIN will display the notice for 21 days — if no objections, proceed.',
      'Book the marriage appointment at JPIN.',
      'Attend with two witnesses on the appointed date.',
      'Complete the marriage ceremony/registration in front of the registrar.',
      'Receive the marriage certificate.',
    ],
    fee: 'BND $10 (registration fee)',
    processingTime: 'Minimum 21 days (notice period) + ceremony date',
    officeHours: 'Monday–Thursday & Saturday: 7:45am – 12:15pm, 1:30pm – 4:30pm',
    location: 'JPIN, BSB',
    tips: [
      'Muslim couples should contact the Ministry of Religious Affairs (JKAM) — this process is separate.',
      'The 21-day notice period is mandatory — start early.',
      'Both parties must be present in person at JPIN to give notice.',
      'Foreign nationals may need additional documents from their embassy — verify in advance.',
    ],
  },
  {
    id: 'medical-certificate-fitness',
    name: 'Medical Certificate of Fitness',
    nameMalay: 'Sijil Kesihatan / Keupayaan Fizikal',
    department: 'Ministry of Health (MOH) / Government Clinics',
    departmentMalay: 'Kementerian Kesihatan',
    category: 'health',
    description: 'Obtain a medical fitness certificate required for employment, driving licences, or government applications.',
    descriptionMalay: 'Dapatkan sijil kecergasan fizikal untuk pekerjaan, lesen memandu, atau permohonan kerajaan.',
    documents: [
      'IC (original)',
      'Completed health declaration form (provided at clinic)',
      'Referral letter from employer (if required by employer)',
      'Any previous medical history documents (if relevant)',
    ],
    steps: [
      'Visit your nearest government clinic or polyclinic (e.g., Berakas Health Centre, Pengiran Anak Puteri Hajah Rashidah Sa\'adatul Bolkiah Polyclinic).',
      'Register at the reception and state you need a medical fitness certificate.',
      'Fill in the health declaration form.',
      'Undergo a basic medical examination (blood pressure, eyesight, height/weight).',
      'Doctor will assess and issue the certificate if you meet the requirements.',
      'Pay the fee at the cashier.',
    ],
    fee: 'BND $5–$15 (government clinic rate; varies by clinic)',
    processingTime: 'Same visit (1–2 hours)',
    officeHours: 'Government clinics: Monday–Thursday & Saturday: 8:00am – 12:00pm, 1:30pm – 4:30pm',
    location: 'Nearest government health centre or polyclinic',
    tips: [
      'Bring your IC — many clinics cannot process without it.',
      'Go early in the morning — government clinics can get very busy.',
      'Medical certificates for driving licences must be from a JPD-approved doctor.',
      'Some employers have a specific form — confirm before visiting the clinic.',
    ],
  },
  {
    id: 'employment-permit',
    name: 'Employment Permit (Foreign Worker)',
    nameMalay: 'Permit Pekerjaan (Pekerja Asing)',
    department: 'Department of Labour (JPAS) & Immigration (JPIN)',
    departmentMalay: 'Jabatan Pekerja (JPAS) & Imigresen (JPIN)',
    category: 'immigration',
    description: 'Apply for an employment permit for a foreign national to work legally in Brunei.',
    descriptionMalay: 'Mohon permit pekerjaan untuk pekerja asing bekerja secara sah di Brunei.',
    documents: [
      'Employment permit application form (from JPAS)',
      'Passport (original + photocopy — minimum 18 months validity)',
      'Medical fitness certificate from a Brunei-approved doctor',
      'Employer\'s business registration certificate',
      'Employment contract (signed by both employer and employee)',
      'Education/professional qualifications (certified copies)',
      'Three (3) passport-sized photos',
    ],
    steps: [
      'The employer must first receive approval from JPAS to hire a foreign national.',
      'The foreign worker must obtain a work visa / employment pass before entering Brunei.',
      'Upon arrival, register with JPIN within the permitted period.',
      'Attend the medical examination at an approved clinic.',
      'Submit all documents to JPAS for permit issuance.',
      'Receive the Employment Permit — valid for the duration specified.',
      'Renew annually or as required.',
    ],
    fee: 'BND $50–$200 (varies by category and duration)',
    processingTime: '2–4 weeks',
    officeHours: 'Monday–Friday: 8:00am – 12:00pm, 1:30pm – 4:30pm',
    location: 'Department of Labour, BSB & JPIN',
    tips: [
      'The employer (not the worker) typically leads the application process.',
      'Overstaying is a serious offence — track permit expiry dates carefully.',
      'The Brunei government has quotas for foreign workers per industry — confirm eligibility first.',
      'Always use registered agents or the official government portal — avoid middlemen.',
    ],
  },
];

export function getFormsByCategory(category: FormCategory): BruneiForm[] {
  return FORMS.filter((f) => f.category === category);
}

export function getFormById(id: string): BruneiForm | undefined {
  return FORMS.find((f) => f.id === id);
}

export function getAllCategories(): FormCategory[] {
  return [...new Set(FORMS.map((f) => f.category))];
}
