import { labResults, patients } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { FlaskConical, Upload } from 'lucide-react';

export function LabResultsPage() {
  const { role, currentPatientId } = useApp();
  const labs = role === 'patient' ? labResults.filter(l => l.patientId === currentPatientId) : labResults;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Lab Results</h1>
        {role !== 'patient' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[14px]">
            <Upload className="w-4 h-4" /> Import Results
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3">Date</th>
              {role !== 'patient' && <th className="px-4 py-3">Patient</th>}
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Reference Range</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Lab</th>
            </tr>
          </thead>
          <tbody>
            {labs.map(lab => {
              const patient = patients.find(p => p.id === lab.patientId);
              return (
                <tr key={lab.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-[13px]">{lab.date}</td>
                  {role !== 'patient' && <td className="px-4 py-3 text-[13px] text-purple-600">{patient ? `${patient.firstName} ${patient.lastName}` : lab.patientId}</td>}
                  <td className="px-4 py-3 text-[13px]">{lab.testName}</td>
                  <td className="px-4 py-3 text-[13px]">{lab.result}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{lab.referenceRange}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${lab.status === 'critical' ? 'bg-red-100 text-red-700' : lab.status === 'abnormal' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{lab.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{lab.labName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
