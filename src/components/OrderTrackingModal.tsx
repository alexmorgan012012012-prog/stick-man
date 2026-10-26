import React, { useState } from 'react';
import { motion } from 'motion/react';
import { INITIAL_ORDERS } from '../data/mockData';
import { ManufacturingOrder } from '../types';
import { Search, PackageCheck, Clock, CheckCircle2, ChevronRight, X, ShieldAlert } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [searchId, setSearchId] = useState<string>('MK-PRO-8491');
  const [orders] = useState<ManufacturingOrder[]>(INITIAL_ORDERS);

  if (!isOpen) return null;

  const activeOrder =
    orders.find((o) => o.id.toLowerCase() === searchId.toLowerCase().trim()) || orders[0];

  const stages = [
    'Design Spec',
    'Pattern Grading',
    'Fabric Cutting',
    'Printing & Embroidery',
    'Precision Stitching',
    'Quality Control',
    'Dispatched',
  ];

  const currentStageIdx = stages.indexOf(activeOrder.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-[2px] bg-red-600" />
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            ATELIER PRODUCTION TRACKER
          </span>
        </div>

        <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-6">
          TRACK CUSTOM ORDER STATUS
        </h3>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. MK-PRO-8491)"
              className="w-full pl-9 pr-4 py-2 text-xs font-mono uppercase bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer"
          >
            Locate
          </button>
        </div>

        {/* Order Card */}
        {activeOrder ? (
          <div className="space-y-6">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-red-600 uppercase">
                  {activeOrder.id}
                </span>
                <h4 className="font-display text-base font-bold text-zinc-950 uppercase mt-0.5">
                  {activeOrder.garment}
                </h4>
                <p className="text-xs text-zinc-500">
                  Client: {activeOrder.clientName} · {activeOrder.organization}
                </p>
              </div>

              <div className="text-right">
                <span className="block font-mono text-[11px] text-zinc-400 uppercase">
                  ESTIMATED DELIVERY
                </span>
                <span className="font-display font-bold text-sm text-zinc-950">
                  {activeOrder.estimatedDelivery}
                </span>
                <span className="inline-block mt-1 font-mono text-xs font-bold text-zinc-700 bg-white px-2 py-0.5 border border-zinc-200 rounded">
                  {activeOrder.units} PIECES
                </span>
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-zinc-900 uppercase">
                  Current Stage: <span className="text-red-600 font-mono">{activeOrder.stage}</span>
                </span>
                <span className="font-mono font-bold text-zinc-700">
                  {activeOrder.progressPercent}% Complete
                </span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activeOrder.progressPercent}%` }}
                  transition={{ duration: 0.8 }}
                  className="bg-red-600 h-full"
                />
              </div>
            </div>

            {/* Stepped Timeline */}
            <div className="border border-zinc-200 rounded-sm divide-y divide-zinc-200">
              {stages.map((stg, sIdx) => {
                const isPassed = sIdx <= currentStageIdx;
                const isCurrent = sIdx === currentStageIdx;
                return (
                  <div
                    key={stg}
                    className={`p-3 flex items-center justify-between text-xs transition-colors ${
                      isCurrent
                        ? 'bg-zinc-950 text-white font-bold'
                        : isPassed
                        ? 'bg-zinc-50 text-zinc-900'
                        : 'bg-white text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <CheckCircle2
                          className={`w-4 h-4 ${isCurrent ? 'text-red-500' : 'text-emerald-600'}`}
                        />
                      ) : (
                        <Clock className="w-4 h-4 text-zinc-300" />
                      )}
                      <span className="uppercase font-mono text-[11px]">
                        0{sIdx + 1}. {stg}
                      </span>
                    </div>

                    {isCurrent && (
                      <span className="font-mono text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase animate-pulse">
                        ACTIVE BENCH
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-6">
            No active order found with that ID. Try "MK-PRO-8491".
          </p>
        )}
      </div>
    </div>
  );
};
