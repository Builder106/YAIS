import { createBrowserRouter } from 'react-router';
import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HealthIdPage } from './pages/HealthIdPage';
import { RecordsPage } from './pages/RecordsPage';
import { PatientsListPage } from './pages/PatientsListPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { LabResultsPage } from './pages/LabResultsPage';
import { VaccinationsPage } from './pages/VaccinationsPage';
import { ConsentPage } from './pages/ConsentPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { InventoryPage } from './pages/InventoryPage';
import { StaffPage } from './pages/StaffPage';
import { ReportsPage } from './pages/ReportsPage';
import { SmsInboxPage } from './pages/SmsInboxPage';
import { VideoConsultPage } from './pages/VideoConsultPage';
import { RemindersPage } from './pages/RemindersPage';
import { VoiceConsultPage } from './pages/VoiceConsultPage';

export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  {
    path: '/',
    Component: RequireAuth,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: DashboardPage },
          { path: 'health-id', Component: HealthIdPage },
          { path: 'records', Component: RecordsPage },
          { path: 'patients', Component: PatientsListPage },
          { path: 'patients/:id', Component: PatientDetailPage },
          { path: 'appointments', Component: AppointmentsPage },
          { path: 'prescriptions', Component: PrescriptionsPage },
          { path: 'lab-results', Component: LabResultsPage },
          { path: 'vaccinations', Component: VaccinationsPage },
          { path: 'consent', Component: ConsentPage },
          { path: 'ai-assistant', Component: AiAssistantPage },
          { path: 'referrals', Component: ReferralsPage },
          { path: 'audit-log', Component: AuditLogPage },
          { path: 'inventory', Component: InventoryPage },
          { path: 'staff', Component: StaffPage },
          { path: 'reports', Component: ReportsPage },
          { path: 'sms-inbox', Component: SmsInboxPage },
          { path: 'video-consult', Component: VideoConsultPage },
          { path: 'reminders', Component: RemindersPage },
          { path: 'voice-consult', Component: VoiceConsultPage },
          {
            path: '*',
            Component: () => <div className="text-center py-12 text-gray-500">Page not found</div>,
          },
        ],
      },
    ],
  },
]);
