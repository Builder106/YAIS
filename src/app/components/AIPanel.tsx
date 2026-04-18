import React from 'react';
import { Bot, Sparkles, MessageSquare, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export function AIPanel() {
  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-5 lg:sticky lg:top-0 lg:h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide pb-4">
      
      {/* Primary Claude Panel */}
      <div className="bg-gradient-to-b from-[#FDF8EE] to-[#FFFBEB] rounded-[2rem] p-6 shadow-[0_8px_30px_-15px_rgba(217,119,6,0.3)] border-2 border-amber-200/60 relative overflow-hidden flex flex-col min-h-0 flex-shrink-0">
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-6 opacity-5 mix-blend-multiply pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Bot size={140} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 text-white relative">
              <Bot size={22} className="drop-shadow-md" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200"></span>
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-900 tracking-tight">Claude Assist</h2>
              <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <Sparkles size={10} /> Active Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Priority Insight */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-amber-200 shadow-sm relative z-10 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm leading-tight">Interaction Warning detected</h3>
              <p className="text-xs font-semibold text-amber-700/70 uppercase tracking-widest mt-1">Amina Osei</p>
            </div>
          </div>
          <p className="text-sm font-medium text-amber-800/90 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            Recent BP spike (140/90) contradicts stable trend. Consider adjusting Lisinopril dosage before next refill.
          </p>
          <button className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-bold text-amber-100 bg-amber-700 hover:bg-amber-800 transition-colors py-2.5 rounded-xl shadow-md shadow-amber-900/10">
            Review Protocol <ArrowRight size={14} />
          </button>
        </div>

        {/* Automated Summaries List */}
        <div className="space-y-3 relative z-10 flex-1 overflow-y-auto scrollbar-hide pr-1">
          <h4 className="text-[11px] font-bold text-amber-700/70 uppercase tracking-widest px-1">Recent Summaries</h4>
          
          <button className="w-full text-left bg-white/60 hover:bg-white p-3 rounded-xl border border-amber-200/50 transition-colors group flex items-start gap-3 shadow-sm">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 group-hover:text-amber-700 transition-colors">Discharge Note: S. Mutisya</p>
              <p className="text-[11px] font-medium text-amber-800/70 mt-0.5 line-clamp-1">Auto-generated from voice dictation</p>
            </div>
          </button>

          <button className="w-full text-left bg-white/60 hover:bg-white p-3 rounded-xl border border-amber-200/50 transition-colors group flex items-start gap-3 shadow-sm">
            <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg group-hover:scale-110 transition-transform">
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 group-hover:text-amber-700 transition-colors">Translate to Swahili</p>
              <p className="text-[11px] font-medium text-amber-800/70 mt-0.5 line-clamp-1">G. Njoroge post-op instructions</p>
            </div>
          </button>
        </div>

      </div>

      {/* Mini Widget / Connectivity */}
      <div className="bg-[#0F2221] rounded-[1.5rem] p-5 text-teal-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-[#1B3634] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-white">Network Status</h3>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase">Online</span>
          </div>
        </div>
        <p className="text-xs font-medium text-teal-100/60 leading-relaxed">
          HL7 FHIR R4 sync active. USSD endpoints are operational.
        </p>
      </div>

    </aside>
  );
}