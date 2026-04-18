import { useState } from 'react';
import { Link } from 'react-router';
import { patients, encounters } from '../data/mock-data';
import { Search, QrCode, Plus } from 'lucide-react';

export function PatientsListPage() {
  const [query, setQuery] = useState('');
  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.phone} ${p.nationalId} ${p.id}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] text-slate-900">Patients</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[13px]">
          <Plus className="w-4 h-4" /> Register Patient
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
        <Search className="w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Search by name, phone, national ID, or patient ID..." value={query} onChange={e => setQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-[14px]" />
        <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[12px] hover:bg-purple-100 border border-purple-100">
          <QrCode className="w-4 h-4" /> Scan QR
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[12px] text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Insurance</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-4 py-3">Allergies</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const lastEnc = encounters.filter(e => e.patientId === p.id).sort((a, b) => b.date.localeCompare(a.date))[0];
              return (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/patients/${p.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-[13px]">{p.firstName[0]}{p.lastName[0]}</div>
                      <div>
                        <p className="text-[14px] text-purple-600 hover:underline">{p.firstName} {p.lastName}</p>
                        <p className="text-[11px] text-gray-400">{p.gender === 'M' ? 'Male' : 'Female'} • {p.dob}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{p.nationalId}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-600">{p.phone}</td>
                  <td className="px-4 py-3 text-[12px]"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{p.insuranceScheme}</span></td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{lastEnc?.date || '—'}</td>
                  <td className="px-4 py-3 text-[12px]">{p.allergies.length ? p.allergies.map(a => <span key={a} className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full mr-1">{a}</span>) : <span className="text-gray-400">None</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}