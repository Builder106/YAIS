import { labResults, patients } from '../data/mock-data';
import { useApp } from '../context/AppContext';
import { Upload } from 'lucide-react';
import { ResponsiveTable, type TableColumn } from '../components/ui/responsive-table';

type LabRow = (typeof labResults)[number];

export function LabResultsPage() {
  const { role, currentPatientId } = useApp();
  const labs = role === 'patient' ? labResults.filter(l => l.patientId === currentPatientId) : labResults;

  const statusPill = (status: LabRow['status']) => (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full ${
        status === 'critical'
          ? 'bg-red-100 text-red-700'
          : status === 'abnormal'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-green-100 text-green-700'
      }`}
    >
      {status}
    </span>
  );

  const patientCell = (lab: LabRow) => {
    const patient = patients.find(p => p.id === lab.patientId);
    return <span className="text-purple-600">{patient ? `${patient.firstName} ${patient.lastName}` : lab.patientId}</span>;
  };

  const columns: TableColumn<LabRow>[] = [
    { key: 'date', header: 'Date', cell: l => l.date },
    ...(role !== 'patient'
      ? [{ key: 'patient', header: 'Patient', cell: patientCell } as TableColumn<LabRow>]
      : []),
    { key: 'test', header: 'Test', cell: l => l.testName },
    { key: 'result', header: 'Result', cell: l => l.result },
    { key: 'range', header: 'Reference Range', cell: l => l.referenceRange, hideOnMobile: true },
    { key: 'status', header: 'Status', cell: l => statusPill(l.status) },
    { key: 'lab', header: 'Lab', cell: l => l.labName, hideOnMobile: true },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-[22px]">Lab Results</h1>
        {role !== 'patient' && (
          <button className="af-tap af-press af-focus inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[14px]">
            <Upload className="w-4 h-4" /> Import Results
          </button>
        )}
      </div>
      <ResponsiveTable
        columns={columns}
        rows={labs}
        rowKey={l => l.id}
        emptyLabel="No lab results"
        mobileTitle={l => l.testName}
        mobileSubtitle={l => `${l.date} · ${l.result}`}
      />
    </div>
  );
}
