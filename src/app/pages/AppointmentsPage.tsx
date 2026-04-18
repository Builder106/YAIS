import { appointments, patients } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Plus, MapPin } from 'lucide-react';
import { useState } from 'react';

export function AppointmentsPage() {
  const { role, currentPatientId } = useApp();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const appts = role === 'patient'
    ? appointments.filter(a => a.patientId === currentPatientId)
    : appointments;

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] text-slate-900">Appointments</h1>
        <button className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-[14px] ${role === 'patient' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'scheduled', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[13px] capitalize transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(apt => {
          const patient = patients.find(p => p.id === apt.patientId);
          return (
            <div key={apt.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${apt.status === 'completed' ? 'bg-green-100' : apt.status === 'cancelled' ? 'bg-red-100' : 'bg-blue-100'}`}>
                <Calendar className={`w-5 h-5 ${apt.status === 'completed' ? 'text-green-600' : apt.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px]">{apt.type}</h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{apt.status}</span>
                </div>
                {role !== 'patient' && patient && <p className="text-[13px] text-gray-600">{patient.firstName} {patient.lastName} ({patient.id})</p>}
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[12px] text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{apt.facilityName}</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1">{apt.doctorName}</p>
              </div>
              {apt.estimatedWait && apt.status === 'scheduled' && (
                <div className="text-right">
                  <p className="text-[12px] text-gray-500">Est. wait</p>
                  <p className="text-[16px] text-amber-600">~{apt.estimatedWait} min</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}