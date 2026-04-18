import { useApp, t } from '../context/AppContext';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

export function DashboardPage() {
  const { role } = useApp();
  if (role === 'patient') return <PatientDashboard />;
  if (role === 'doctor') return <DoctorDashboard />;
  return <AdminDashboard />;
}
