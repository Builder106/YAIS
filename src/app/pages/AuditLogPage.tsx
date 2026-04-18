import { auditLog } from '../data/mock-data';
import { Download } from 'lucide-react';
import { ResponsiveTable, type TableColumn } from '../components/ui/responsive-table';

type AuditRow = (typeof auditLog)[number];

export function AuditLogPage() {
  const columns: TableColumn<AuditRow>[] = [
    {
      key: 'ts',
      header: 'Timestamp',
      cell: a => <span className="whitespace-nowrap text-[12px] text-gray-500">{new Date(a.timestamp).toLocaleString()}</span>,
    },
    { key: 'pid', header: 'Patient ID', cell: a => a.patientId },
    { key: 'by', header: 'Accessed By', cell: a => a.accessedBy },
    {
      key: 'role',
      header: 'Role',
      cell: a => <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[12px]">{a.role}</span>,
    },
    { key: 'action', header: 'Action', cell: a => a.action },
    {
      key: 'section',
      header: 'Section',
      cell: a => <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[12px]">{a.section}</span>,
    },
    { key: 'facility', header: 'Facility', cell: a => a.facility, hideOnMobile: true },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-[22px]">Audit Log</h1>
        <button className="af-tap af-press af-focus inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-[14px]">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <ResponsiveTable
        columns={columns}
        rows={auditLog}
        rowKey={a => a.id}
        emptyLabel="No audit entries"
        mobileTitle={a => `${a.action} · ${a.section}`}
        mobileSubtitle={a => `${a.accessedBy} — ${new Date(a.timestamp).toLocaleString()}`}
      />
    </div>
  );
}
