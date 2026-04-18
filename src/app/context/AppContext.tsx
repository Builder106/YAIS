import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18nInstance, { SUPPORTED_LANGUAGES, applyDirection } from '../i18n';

export type UserRole = 'patient' | 'doctor' | 'admin';
export type Language = 'en' | 'fr' | 'ar' | 'sw' | 'ha';

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
  currentUserId: string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('doctor');
  const [lang, setLangState] = useState<Language>((i18nInstance.language as Language) || 'en');
  const [currentPatientId, setCurrentPatientId] = useState('PAT-001');
  const [offlineMode, setOfflineMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);

  const setLang = (l: Language) => {
    setLangState(l);
    i18nInstance.changeLanguage(l);
    applyDirection(l);
  };

  useEffect(() => {
    applyDirection(lang);
  }, [lang]);

  const currentUserId = role === 'doctor' ? 'DOC-001' : 'PAT-001';

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        currentPatientId,
        setCurrentPatientId,
        offlineMode,
        setOfflineMode,
        lowBandwidth,
        setLowBandwidth,
        currentUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

const legacyMap: Record<string, string> = {
  'nav.dashboard': 'nav.dashboard',
  'nav.patients': 'nav.patients',
  'nav.appointments': 'nav.appointments',
  'nav.prescriptions': 'nav.prescriptions',
  'nav.labResults': 'nav.labResults',
  'nav.vaccinations': 'nav.vaccinations',
  'nav.referrals': 'nav.referrals',
  'nav.inventory': 'nav.inventory',
  'nav.staff': 'nav.staff',
  'nav.reports': 'nav.reports',
  'nav.aiAssistant': 'nav.aiAssistant',
  'nav.consent': 'nav.consent',
  'nav.auditLog': 'nav.auditLog',
  'nav.myRecords': 'nav.myRecords',
  'nav.healthId': 'nav.healthId',
  'nav.settings': 'nav.settings',
  'common.search': 'common.search',
  'common.offline': 'common.offline',
  'common.online': 'common.online',
};

export function t(key: string, lang: Language): string {
  const mapped = legacyMap[key] ?? key;
  const value = i18nInstance.getResource(lang, 'translation', mapped);
  if (typeof value === 'string') return value;
  return i18nInstance.t(mapped, { lng: lang }) ?? key;
}

export { SUPPORTED_LANGUAGES };
export function useT() {
  return useTranslation();
}
