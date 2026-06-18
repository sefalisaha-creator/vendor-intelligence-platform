import React from 'react';
import { useVendors } from '../../context/VendorContext';
import { CalendarClock, ShieldAlert } from 'lucide-react';

const ContractMonitor = () => {
  const { vendors } = useVendors();

  // Establish a system runtime evaluation baseline target window matching our 2026 anchor point
  const currentSystemDate = new Date('2026-06-18');
  const criticalHorizonDate = new Date('2026-07-18'); // 30-day monitoring buffer

  // Gather and transform expiration instances across the vendor landscape
  const alertList = vendors.reduce((acc, vendor) => {
    if (!vendor.activeContracts) return acc;
    
    vendor.activeContracts.forEach(contract => {
      const expirationDate = new Date(contract.endDate);
      
      // Filter out contracts expiring outside our 30-day evaluation horizon
      if (expirationDate >= currentSystemDate && expirationDate <= criticalHorizonDate) {
        acc.push({
          vendorName: vendor.name,
          contractId: contract.contractId,
          description: contract.description,
          endDate: expirationDate
        });
      }
    });
    return acc;
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
        <CalendarClock className="w-4 h-4 text-slate-400" />
        <span>30-Day Critical Contract Horizon ({alertList.length})</span>
      </h3>

      {alertList.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-4 text-center">
          All legal framework contracts are stable outside the 30-day compliance horizon.
        </p>
      ) : (
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
          {alertList.map((item) => (
            <div key={item.contractId} className="p-3 bg-red-50/40 border border-red-100 rounded-lg flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{item.vendorName}</span>
                  <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                    {item.contractId}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">
                  Scope: {item.description}
                </p>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wide">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Expiring Soon</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {item.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractMonitor;