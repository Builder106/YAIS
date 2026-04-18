import { doctors, facilities } from '../data/mock-data';
import { UserCog, Plus } from 'lucide-react';

export function StaffPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Staff Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-[14px]">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(doc => {
          const fac = facilities.find(f => f.id === doc.facilityId);
          return (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 text-[14px]">{doc.name.split(' ').slice(1).map(n => n[0]).join('')}</div>
                <div>
                  <p className="text-[14px]">{doc.name}</p>
                  <p className="text-[12px] text-gray-500">{doc.specialty}</p>
                </div>
              </div>
              <p className="text-[12px] text-gray-500">{fac?.name}</p>
              <p className="text-[11px] text-gray-400">{doc.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
