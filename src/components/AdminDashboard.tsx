import React, { useState } from 'react';
import { ManufacturingOrder } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { X, CheckCircle2, Clock, Filter, Plus, FileSpreadsheet, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  customInquiries?: any[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  customInquiries = [],
}) => {
  const [orders, setOrders] = useState<ManufacturingOrder[]>(INITIAL_ORDERS);
  const [filterStage, setFilterStage] = useState<string>('All');

  if (!isOpen) return null;

  const handleUpdateStage = (id: string, newStage: any) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          const progressMap: Record<string, number> = {
            'Design Spec': 15,
            'Pattern Grading': 30,
            'Fabric Cutting': 50,
            'Printing & Embroidery': 70,
            'Precision Stitching': 85,
            'Quality Control': 95,
            'Dispatched': 100,
          };
          return {
            ...ord,
            stage: newStage,
            progressPercent: progressMap[newStage] || 50,
          };
        }
        return ord;
      })
    );
  };

  const stages = [
    'Design Spec',
    'Pattern Grading',
    'Fabric Cutting',
    'Printing & Embroidery',
    'Precision Stitching',
    'Quality Control',
    'Dispatched',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-[2px] bg-red-600" />
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            ATELIER PRODUCTION MANAGEMENT
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight">
            MANUFACTURING PIPELINE CONSOLE
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500 uppercase">Active Runs:</span>
            <span className="font-mono font-bold text-red-600">{orders.length}</span>
          </div>
        </div>

        {/* Custom Inquiries Submitted in Session */}
        {customInquiries.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-red-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Newly Submitted User Inquiries ({customInquiries.length})</span>
            </h4>
            <div className="space-y-2">
              {customInquiries.map((inq, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-red-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-zinc-900 mr-2">{inq.id}</span>
                    <span className="font-semibold text-zinc-800">
                      {inq.design.garmentType.toUpperCase()} ({inq.design.quantity} pcs)
                    </span>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Colors: {inq.design.baseColor} / {inq.design.secondaryColor} · Method: {inq.design.printMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-600 font-display">${inq.total.toLocaleString()}</span>
                    <span className="block text-[10px] font-mono text-zinc-400">{inq.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto border border-zinc-200 rounded-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 border-b border-zinc-200 font-mono text-[11px] text-zinc-600 uppercase">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Client & Squad</th>
                <th className="p-3">Garment & Units</th>
                <th className="p-3">Production Stage</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-medium">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-red-600">{ord.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-zinc-900">{ord.clientName}</p>
                    <p className="text-zinc-500 text-[11px]">{ord.organization}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-zinc-900">{ord.garment}</p>
                    <span className="font-mono text-zinc-500 text-[11px]">{ord.units} pcs</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={ord.stage}
                      onChange={(e) => handleUpdateStage(ord.id, e.target.value)}
                      className="bg-white border border-zinc-300 rounded px-2 py-1 text-xs font-mono font-bold text-zinc-800 cursor-pointer focus:border-zinc-950"
                    >
                      {stages.map((stg) => (
                        <option key={stg} value={stg}>
                          {stg}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="w-24 bg-zinc-200 h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        className="bg-red-600 h-full"
                        style={{ width: `${ord.progressPercent}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                      {ord.progressPercent}%
                    </span>
                  </td>
                  <td className="p-3 font-mono text-zinc-600">{ord.estimatedDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>ATELIER OS // VERSION 2.6.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 text-white font-bold uppercase rounded-sm cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
