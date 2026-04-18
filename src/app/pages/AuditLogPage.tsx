import { auditLog } from '../data/mock-data';
import { ClipboardList, Download } from 'lucide-react';

export function AuditLogPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Audit Log</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-[14px]">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Patient ID</th>
              <th className="px-4 py-3">Accessed By</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Facility</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map(a => (
              <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-[12px] text-gray-500 whitespace-nowrap">{new Date(a.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 text-[13px]">{a.patientId}</td>
                <td className="px-4 py-3 text-[13px]">{a.accessedBy}</td>
                <td className="px-4 py-3 text-[12px]"><span className="bg-gray-100 px-2 py-0.5 rounded-full">{a.role}</span></td>
                <td className="px-4 py-3 text-[13px]">{a.action}</td>
                <td className="px-4 py-3 text-[12px]"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{a.section}</span></td>
                <td className="px-4 py-3 text-[12px] text-gray-500">{a.facility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
