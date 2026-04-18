import { consentRecords, auditLog } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { Shield, Eye, ShieldOff, ShieldCheck, Clock } from 'lucide-react';
import { useState } from 'react';

export function ConsentPage() {
  const { currentPatientId } = useApp();
  const [consents, setConsents] = useState(consentRecords.filter(c => c.patientId === currentPatientId));
  const audits = auditLog.filter(a => a.patientId === currentPatientId);

  const toggleConsent = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, granted: !c.granted } : c));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-[22px] text-slate-900">Consent & Privacy</h1>
        <p className="text-[13px] text-slate-400 mt-1">Control who can access your health records. Grant or revoke access per provider at any time.</p>
      </div>

      {/* Consent Cards */}
      <div className="space-y-3">
        <h2 className="text-[16px]">Provider Access</h2>
        {consents.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.granted ? 'bg-green-100' : 'bg-red-100'}`}>
              {c.granted ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <ShieldOff className="w-5 h-5 text-red-600" />}
            </div>
            <div className="flex-1">
              <p className="text-[14px]">{c.providerName}</p>
              <p className="text-[12px] text-gray-500">{c.facilityName}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {c.sections.map(s => <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
            </div>
            <button onClick={() => toggleConsent(c.id)}
              className={`px-4 py-2 rounded-lg text-[13px] transition-colors ${c.granted ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
              {c.granted ? 'Revoke' : 'Grant'}
            </button>
          </div>
        ))}
      </div>

      {/* Audit Log */}
      <div>
        <h2 className="text-[16px] mb-3">Who accessed your records</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Who</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Facility</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(a => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-[12px] text-gray-500">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[13px]">{a.accessedBy}<br /><span className="text-[11px] text-gray-400">{a.role}</span></td>
                  <td className="px-4 py-3 text-[13px]">{a.action}</td>
                  <td className="px-4 py-3 text-[12px]"><span className="bg-gray-100 px-2 py-0.5 rounded-full">{a.section}</span></td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{a.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}