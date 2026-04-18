import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'patient' | 'doctor' | 'admin';
export type Language = 'en' | 'fr' | 'sw';

interface AppState {
  role: UserRole;
  setRole: (r: UserRole) => void;
  lang: Language;
  setLang: (l: Language) => void;
  currentPatientId: string;
  setCurrentPatientId: (id: string) => void;
  offlineMode: boolean;
  setOfflineMode: (v: boolean) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('doctor');
  const [lang, setLang] = useState<Language>('en');
  const [currentPatientId, setCurrentPatientId] = useState('PAT-001');
  const [offlineMode, setOfflineMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);

  return (
    <AppContext.Provider value={{ role, setRole, lang, setLang, currentPatientId, setCurrentPatientId, offlineMode, setOfflineMode, lowBandwidth, setLowBandwidth }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

// i18n
const translations: Record<string, Record<Language, string>> = {
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord', sw: 'Dashibodi' },
  'nav.patients': { en: 'Patients', fr: 'Patients', sw: 'Wagonjwa' },
  'nav.appointments': { en: 'Appointments', fr: 'Rendez-vous', sw: 'Miadi' },
  'nav.prescriptions': { en: 'Prescriptions', fr: 'Ordonnances', sw: 'Dawa' },
  'nav.labResults': { en: 'Lab Results', fr: 'Résultats de labo', sw: 'Matokeo ya Maabara' },
  'nav.vaccinations': { en: 'Vaccinations', fr: 'Vaccinations', sw: 'Chanjo' },
  'nav.referrals': { en: 'Referrals', fr: 'Références', sw: 'Rufaa' },
  'nav.inventory': { en: 'Inventory', fr: 'Inventaire', sw: 'Hesabu ya Vifaa' },
  'nav.staff': { en: 'Staff', fr: 'Personnel', sw: 'Wafanyakazi' },
  'nav.reports': { en: 'Reports', fr: 'Rapports', sw: 'Ripoti' },
  'nav.aiAssistant': { en: 'AI Assistant', fr: 'Assistant IA', sw: 'Msaidizi wa AI' },
  'nav.consent': { en: 'Consent & Privacy', fr: 'Consentement', sw: 'Idhini' },
  'nav.auditLog': { en: 'Audit Log', fr: 'Journal d\'audit', sw: 'Kumbukumbu' },
  'nav.myRecords': { en: 'My Records', fr: 'Mes dossiers', sw: 'Rekodi Zangu' },
  'nav.healthId': { en: 'Health ID', fr: 'ID Santé', sw: 'Kitambulisho cha Afya' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres', sw: 'Mipangilio' },
  'common.search': { en: 'Search', fr: 'Rechercher', sw: 'Tafuta' },
  'common.offline': { en: 'Offline Mode', fr: 'Mode hors ligne', sw: 'Nje ya mtandao' },
  'common.online': { en: 'Online', fr: 'En ligne', sw: 'Mtandaoni' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
