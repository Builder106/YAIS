import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { useApp, t } from '../context/AppContext';
import { Wifi, WifiOff, Bell, Shield, Activity, Smartphone, Globe2 } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/health-id': 'Health ID',
  '/records': 'My Records',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/prescriptions': 'Prescriptions',
  '/lab-results': 'Lab Results',
  '/vaccinations': 'Vaccinations',
  '/consent': 'Consent & Privacy',
  '/ai-assistant': 'AI Clinical Assistant',
  '/referrals': 'Referrals',
  '/audit-log': 'Audit Log',
  '/inventory': 'Drug Inventory',
  '/staff': 'Staff Management',
  '/reports': 'Reports',
};

export function Layout() {
  const { offlineMode, role, lang, setLang, lowBandwidth, setLowBandwidth, setOfflineMode } = useApp();
  const location = useLocation();
  const pageLabel = routeLabels[location.pathname] || '';
  const roleLabel = role === 'patient' ? 'Patient Portal' : role === 'doctor' ? 'Clinical Workspace' : 'Facility Admin Command';
  const roleDot = role === 'patient' ? 'bg-teal-500' : role === 'doctor' ? 'bg-violet-500' : 'bg-amber-500';
  const roleAvatar = role === 'patient' ? 'bg-teal-700' : role === 'doctor' ? 'bg-violet-700' : 'bg-amber-700';
  const langLabel = lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Swahili';

  return (
    <div className="flex min-h-screen items-stretch bg-[#F3ECE1]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#F9F5ED] border-b border-[#D9C8AE] px-4 lg:px-7 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${roleDot}`} />
              <span className="text-[11px] text-[#5B5149] uppercase tracking-[0.14em] hidden sm:inline">{roleLabel}</span>
              {pageLabel && (
                <>
                  <span className="text-[#B8A589] hidden sm:inline">/</span>
                  <span className="text-[13px] text-[#1F1B18]">{pageLabel}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLowBandwidth(!lowBandwidth)}
                className={`af-press af-focus hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${lowBandwidth ? 'bg-[#E8D6BC] text-[#5C3A2E] border-[#D0B994]' : 'bg-[#F7F1E6] text-[#5B5149] border-[#D9C8AE]'}`}
              >
                <Smartphone className="w-3 h-3" />
                Low-bandwidth
              </button>
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                className={`af-press af-focus flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${offlineMode ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
              >
                {offlineMode ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                {offlineMode ? 'Offline sync' : 'Online sync'}
              </button>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF2FF] text-[#3D4C8A] rounded-full text-[11px] border border-[#C4CEE9]">
                <Globe2 className="w-3 h-3" />
                {langLabel}
              </div>
              <select
                aria-label="Language selector"
                value={lang}
                onChange={e => setLang(e.target.value as 'en' | 'fr' | 'sw')}
                className="af-focus hidden md:block bg-white border border-[#D9C8AE] text-[12px] text-[#5B5149] rounded-lg px-2 py-1"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="sw">Swahili</option>
              </select>
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F1E6] text-[#5B5149] rounded-full text-[11px] border border-[#D9C8AE]">
                <Smartphone className="w-3 h-3" />
                USSD *123#
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#ECF7EE] text-[#2F6B4F] rounded-full text-[11px] border border-[#CDE4D4]">
                <Shield className="w-3 h-3" />
                AES-256
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF1FA] text-[#3D4C8A] rounded-full text-[11px] border border-[#D2D8EC]">
                <Activity className="w-3 h-3" />
                FHIR R4
              </div>
              <button className="af-press af-focus relative p-2 rounded-lg hover:bg-[#EFE4D1] transition-colors">
                <Bell className="w-[18px] h-[18px] text-[#5B5149]" />
                <span className="af-pulse-dot absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A63D32] rounded-full" />
              </button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] ${roleAvatar}`}>
                {role === 'patient' ? 'AO' : role === 'doctor' ? 'WN' : 'AD'}
              </div>
            </div>
          </div>
          <div className="lg:hidden mt-2 text-[11px] text-[#5B5149]">
            {t('common.offline', lang)} · USSD *123# · {langLabel}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(195,154,61,0.1),_transparent_40%)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}