import { inventory } from '../data/mock-data';
import { AlertTriangle, Download } from 'lucide-react';
import { ResponsiveTable, type TableColumn } from '../components/ui/responsive-table';

type InvRow = (typeof inventory)[number];

export function InventoryPage() {
  const sorted = [...inventory].sort((a, b) => (a.quantity <= a.reorderLevel ? -1 : 1) - (b.quantity <= b.reorderLevel ? -1 : 1));

  const columns: TableColumn<InvRow>[] = [
    { key: 'drug', header: 'Drug', cell: i => <span className="text-[14px]">{i.name}</span> },
    { key: 'cat', header: 'Category', cell: i => <span className="text-[12px] text-gray-500">{i.category}</span> },
    {
      key: 'qty',
      header: 'Quantity',
      cell: i => (
        <span className="text-[14px]">
          {i.quantity} {i.unit}
        </span>
      ),
    },
    {
      key: 'reorder',
      header: 'Reorder Level',
      cell: i => (
        <span className="text-[13px] text-gray-500">
          {i.reorderLevel} {i.unit}
        </span>
      ),
      hideOnMobile: true,
    },
    { key: 'rx', header: 'Active Rx', cell: i => i.linkedPrescriptions, hideOnMobile: true },
    {
      key: 'status',
      header: 'Status',
      cell: i =>
        i.quantity <= i.reorderLevel ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> LOW STOCK
          </span>
        ) : (
          <span className="text-[11px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full">In Stock</span>
        ),
    },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-[22px]">Drug Inventory</h1>
        <button className="af-tap af-press af-focus inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-[14px]">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500">Total Items</p>
          <p className="text-[28px]">{inventory.length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-[12px] text-red-600">Low Stock</p>
          <p className="text-[28px] text-red-700">{inventory.filter(i => i.quantity <= i.reorderLevel).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500">Linked Prescriptions</p>
          <p className="text-[28px]">{inventory.reduce((s, i) => s + i.linkedPrescriptions, 0)}</p>
        </div>
      </div>

      <ResponsiveTable
        columns={columns}
        rows={sorted}
        rowKey={i => i.id}
        emptyLabel="No inventory"
        mobileTitle={i => i.name}
        mobileSubtitle={i => `${i.category} · ${i.quantity} ${i.unit}`}
      />
    </div>
  );
}
