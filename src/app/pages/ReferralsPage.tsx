import { referrals, patients } from '../data/mock-data';
import { ArrowRightLeft, Plus, AlertTriangle } from 'lucide-react';

export function ReferralsPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Referrals</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[14px]">
          <Plus className="w-4 h-4" /> New Referral
        </button>
      </div>
      <div className="space-y-4">
        {referrals.map(ref => {
          const patient = patients.find(p => p.id === ref.patientId);
          return (
            <div key={ref.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${ref.urgency === 'emergency' ? 'bg-red-100 text-red-700' : ref.urgency === 'urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{ref.urgency}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${ref.status === 'accepted' ? 'bg-green-100 text-green-700' : ref.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>{ref.status}</span>
                <span className="text-[12px] text-gray-500">{ref.date}</span>
              </div>
              <p className="text-[14px] mb-2">{patient?.firstName} {patient?.lastName} ({ref.patientId})</p>
              <p className="text-[13px] text-gray-600 mb-3">{ref.reason}</p>
              <div className="flex items-center gap-4 text-[12px] text-gray-500">
                <div className="flex-1 p-2 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 uppercase">From</p>
                  <p>{ref.fromDoctor}</p>
                  <p className="text-[11px] text-gray-400">{ref.fromFacility}</p>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="flex-1 p-2 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 uppercase">To</p>
                  <p>{ref.toDoctor}</p>
                  <p className="text-[11px] text-gray-400">{ref.toFacility}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
