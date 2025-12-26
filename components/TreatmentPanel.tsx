import React, { useMemo } from 'react';
import { Treatment, ToothState } from '../types';
import { X, DollarSign, Calendar, Info } from 'lucide-react';

interface TreatmentPanelProps {
  selectedToothId: number | null;
  toothData: ToothState | null;
  treatments: Treatment[];
  onClose: () => void;
}

const TreatmentPanel: React.FC<TreatmentPanelProps> = ({ selectedToothId, toothData, treatments, onClose }) => {
  
  const toothTreatments = useMemo(() => {
    if (!selectedToothId) return [];
    return treatments.filter(t => t.toothId === selectedToothId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedToothId, treatments]);

  if (!selectedToothId || !toothData) return (
    <div className="hidden lg:flex flex-col h-full items-center justify-center p-8 text-center text-slate-400 bg-white border-l border-slate-200 w-80">
      <Info size={48} className="mb-4 opacity-20" />
      <p>Select a tooth to view details and treatment history.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-full lg:w-96 shadow-xl lg:shadow-none fixed lg:static right-0 top-0 z-30 transition-all">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
           <h2 className="text-lg font-bold text-slate-800">Tooth #{selectedToothId}</h2>
           <p className="text-xs text-slate-500">History & Status</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 lg:hidden">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Current Status Summary */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            Current Status
          </h3>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(toothData.surfaces).map(([surface, condition]) => (
                    condition !== 'Healthy' && (
                        <div key={surface} className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="font-bold text-slate-500">{surface}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                condition === 'Caries' ? 'bg-red-100 text-red-700' : 
                                condition === 'Amalgam' ? 'bg-slate-100 text-slate-700' :
                                condition === 'Composite' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>{condition}</span>
                        </div>
                    )
                ))}
                {Object.values(toothData.surfaces).every(c => c === 'Healthy') && (
                    <div className="col-span-2 text-center text-slate-400 py-2 italic text-sm">
                        No visible conditions recorded.
                    </div>
                )}
            </div>
          </div>
        </section>

        {/* Treatment History */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            History
          </h3>
          <div className="space-y-3">
            {toothTreatments.length > 0 ? (
                toothTreatments.map((t) => (
                    <div key={t.id} className="group relative bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-slate-800 text-sm">{t.condition}</span>
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                {t.date}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 mb-2">
                            Surfaces: <span className="font-mono text-slate-700">{t.surfaces.join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div className="flex items-center text-xs text-slate-600 font-medium">
                                <DollarSign size={12} className="mr-0.5" />
                                {t.price.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm">
                    No procedures recorded.
                </div>
            )}
          </div>
        </section>

      </div>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
         <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            <Calendar size={16} />
            Schedule Procedure
         </button>
      </div>
    </div>
  );
};

export default TreatmentPanel;