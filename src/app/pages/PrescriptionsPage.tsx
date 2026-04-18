import { prescriptions, patients } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { Pill, AlertTriangle, Plus } from 'lucide-react';

export function PrescriptionsPage() {
  const { role, currentPatientId } = useApp();
  const rxList = role === 'patient'
    ? prescriptions.filter(r => r.patientId === currentPatientId)
    : prescriptions;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Prescriptions</h1>
        {role === 'doctor' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[14px]">
            <Plus className="w-4 h-4" /> New Prescription
          </button>
        )}
      </div>

      <div className="space-y-4">
        {rxList.map(rx => {
          const patient = patients.find(p => p.id === rx.patientId);
          return (
            <div key={rx.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${rx.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{rx.status}</span>
                  {role !== 'patient' && patient && <span className="text-[13px]">{patient.firstName} {patient.lastName}</span>}
                  <span className="text-[12px] text-gray-500">{rx.date} • {rx.doctorName}</span>
                </div>
                <span className="text-[11px] text-gray-400">{rx.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rx.medications.map((med, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Pill className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px]">{med.name} {med.dosage}</p>
                      <p className="text-[12px] text-gray-500">{med.frequency} • {med.duration}</p>
                      {med.interactions?.map(int => (
                        <p key={int} className="text-[11px] text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {int}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
