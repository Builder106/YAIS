import { inventory } from '../data/mock-data';
import { Package, AlertTriangle, Download } from 'lucide-react';

export function InventoryPage() {
  const sorted = [...inventory].sort((a, b) => (a.quantity <= a.reorderLevel ? -1 : 1) - (b.quantity <= b.reorderLevel ? -1 : 1));

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px]">Drug Inventory</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-[14px]">
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3">Drug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Reorder Level</th>
              <th className="px-4 py-3">Active Rx</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => {
              const low = item.quantity <= item.reorderLevel;
              return (
                <tr key={item.id} className={`border-b border-gray-50 last:border-0 ${low ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 text-[14px]">{item.name}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-[14px]">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">{item.reorderLevel} {item.unit}</td>
                  <td className="px-4 py-3 text-[13px]">{item.linkedPrescriptions}</td>
                  <td className="px-4 py-3">
                    {low ? (
                      <span className="flex items-center gap-1 text-[11px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full w-fit"><AlertTriangle className="w-3 h-3" /> LOW STOCK</span>
                    ) : (
                      <span className="text-[11px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full">In Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
