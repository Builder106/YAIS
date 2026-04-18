import { PatientDetailPage } from './PatientDetailPage';
import { useApp } from '../context/AppContext';

// Patient-facing records view reuses the patient detail page for the current patient
export function RecordsPage() {
  const { currentPatientId } = useApp();
  // We render PatientDetailPage inline with the current patient's ID
  return <PatientDetailInline patientId={currentPatientId} />;
}

import { patients, encounters, prescriptions, labResults, vaccinations } from '../data/mock-data';
import { Pill, FlaskConical, Syringe, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';

type Tab = 'timeline' | 'prescriptions' | 'labs' | 'vaccinations';

function PatientDetailInline({ patientId }: { patientId: string }) {
  const patient = patients.find(p => p.id === patientId)!;
  const [tab, setTab] = useState<Tab>('timeline');
  const patEncounters = encounters.filter(e => e.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  const patRx = prescriptions.filter(p => p.patientId === patientId);
  const patLabs = labResults.filter(l => l.patientId === patientId);
  const patVax = vaccinations.filter(v => v.patientId === patientId);

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'timeline', label: 'Timeline', icon: Clock, count: patEncounters.length },
    { key: 'prescriptions', label: 'Prescriptions', icon: Pill, count: patRx.length },
    { key: 'labs', label: 'Lab Results', icon: FlaskConical, count: patLabs.length },
    { key: 'vaccinations', label: 'Vaccinations', icon: Syringe, count: patVax.length },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-[22px]">My Medical Records</h1>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] transition-colors whitespace-nowrap ${tab === tb.key ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <tb.icon className="w-4 h-4" /> {tb.label} <span className="text-[11px] bg-gray-200 px-1.5 py-0.5 rounded-full">{tb.count}</span>
          </button>
        ))}
      </div>

      {tab === 'timeline' && (
        <div className="relative pl-6">
          <div className="absolute left-2.5 top-0 bottom-0 w-px bg-teal-200" />
          <div className="space-y-4">
            {patEncounters.map(enc => (
              <div key={enc.id} className="relative">
                <div className={`absolute -left-[14px] top-4 w-3 h-3 rounded-full border-2 border-white ${enc.type === 'emergency' ? 'bg-red-500' : enc.type === 'lab' ? 'bg-blue-500' : enc.type === 'vaccination' ? 'bg-green-500' : 'bg-teal-500'}`} />
                <div className="bg-white rounded-xl border border-gray-200 p-4 ml-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${enc.type === 'emergency' ? 'bg-red-100 text-red-700' : enc.type === 'lab' ? 'bg-blue-100 text-blue-700' : enc.type === 'vaccination' ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'}`}>{enc.type}</span>
                      <span className="text-[13px] text-gray-500">{enc.date}</span>
                    </div>
                  </div>
                  <h3 className="text-[15px]">{enc.diagnosis}</h3>
                  <p className="text-[13px] text-gray-600 mt-1">{enc.notes}</p>
                  <p className="text-[12px] text-gray-400 mt-2">{enc.doctorName} • {enc.facilityName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'prescriptions' && (
        <div className="space-y-4">
          {patRx.map(rx => (
            <div key={rx.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${rx.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{rx.status}</span>
                <span className="text-[12px] text-gray-500">{rx.date} • {rx.doctorName}</span>
              </div>
              {rx.medications.map((med, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg mb-2 last:mb-0">
                  <Pill className="w-4 h-4 text-teal-500 mt-0.5" />
                  <div>
                    <p className="text-[14px]">{med.name} {med.dosage}</p>
                    <p className="text-[12px] text-gray-500">{med.frequency} • {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'labs' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">Test</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {patLabs.map(lab => (
                <tr key={lab.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-[13px]">{lab.date}</td>
                  <td className="px-4 py-3 text-[13px]">{lab.testName}</td>
                  <td className="px-4 py-3 text-[13px]">{lab.result}</td>
                  <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full ${lab.status === 'critical' ? 'bg-red-100 text-red-700' : lab.status === 'abnormal' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{lab.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'vaccinations' && (
        <div className="space-y-3">
          {patVax.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <Syringe className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-[14px]">{v.vaccine} — {v.dose}</p>
                <p className="text-[12px] text-gray-500">{v.date} • {v.site}</p>
              </div>
              {v.nextDue && <span className={`text-[11px] px-2 py-1 rounded-full ${new Date(v.nextDue) < new Date() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{new Date(v.nextDue) < new Date() ? 'OVERDUE' : `Next: ${v.nextDue}`}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
