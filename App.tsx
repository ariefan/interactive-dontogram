import React, { useState } from 'react';
import { ToothState, ToothCondition, ToothSurface, ToolType, Treatment } from './types';
import Odontogram from './components/Odontogram';
import Toolbar from './components/Toolbar';
import TreatmentPanel from './components/TreatmentPanel';
import { User, FileText, Settings, Search, AlertCircle } from 'lucide-react';

// Initialize teeth data structure
const initialTeethState: Record<number, ToothState> = {};

// FDI ISO 3950 Numbering
// Permanent Dentition
const q1 = [18,17,16,15,14,13,12,11]; // Upper Right
const q2 = [21,22,23,24,25,26,27,28]; // Upper Left
const q3 = [31,32,33,34,35,36,37,38]; // Lower Left
const q4 = [48,47,46,45,44,43,42,41]; // Lower Right

// Deciduous Dentition
const q5 = [55,54,53,52,51]; // Upper Right
const q6 = [61,62,63,64,65]; // Upper Left
const q7 = [71,72,73,74,75]; // Lower Left
const q8 = [85,84,83,82,81]; // Lower Right

const allTeethIds = [
  ...q1, ...q2, ...q3, ...q4,
  ...q5, ...q6, ...q7, ...q8
];

allTeethIds.forEach(id => {
    initialTeethState[id] = {
        id,
        surfaces: {
            O: ToothCondition.HEALTHY,
            M: ToothCondition.HEALTHY,
            D: ToothCondition.HEALTHY,
            V: ToothCondition.HEALTHY,
            L: ToothCondition.HEALTHY,
            ROOT: ToothCondition.HEALTHY,
        },
        hasCondition: false
    };
});

function App() {
  const [teeth, setTeeth] = useState<Record<number, ToothState>>(initialTeethState);
  const [selectedTool, setSelectedTool] = useState<ToolType>('select');
  const [selectedToothId, setSelectedToothId] = useState<number | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  
  // Handlers
  const handleSurfaceClick = (toothId: number, surface: ToothSurface) => {
    if (selectedTool === 'select') {
        setSelectedToothId(toothId);
        return;
    }

    let newCondition = ToothCondition.HEALTHY;
    
    if (selectedTool === 'eraser') {
        newCondition = ToothCondition.HEALTHY;
    } else {
        switch(selectedTool) {
            case 'caries': newCondition = ToothCondition.CARIES; break;
            case 'restoration_amalgam': newCondition = ToothCondition.AMALGAM; break;
            case 'restoration_composite': newCondition = ToothCondition.COMPOSITE; break;
            case 'crown': newCondition = ToothCondition.CROWN; break;
            case 'missing': newCondition = ToothCondition.MISSING; break;
            case 'rct': newCondition = ToothCondition.ROOT_CANAL; break;
            case 'sealant': newCondition = ToothCondition.SEALANT; break;
            default: return;
        }
    }

    setTeeth(prev => {
        const tooth = prev[toothId];
        const newSurfaces = { ...tooth.surfaces };
        
        // 1. Missing Tooth Logic
        if (newCondition === ToothCondition.MISSING) {
             Object.keys(newSurfaces).forEach(k => {
                 newSurfaces[k as ToothSurface] = ToothCondition.MISSING;
             });
        } 
        // 2. Restore Missing
        else if (selectedTool === 'eraser' && Object.values(newSurfaces).some(c => c === ToothCondition.MISSING)) {
             Object.keys(newSurfaces).forEach(k => {
                 newSurfaces[k as ToothSurface] = ToothCondition.HEALTHY;
             });
        }
        // 3. Crown Logic
        else if (newCondition === ToothCondition.CROWN) {
             Object.keys(newSurfaces).forEach(k => {
                if (k !== 'ROOT') newSurfaces[k as ToothSurface] = ToothCondition.CROWN;
             });
        }
        // 4. Root Canal Logic
        else if (newCondition === ToothCondition.ROOT_CANAL) {
             newSurfaces.ROOT = ToothCondition.ROOT_CANAL;
        }
        // 5. Standard Surface
        else {
             if (Object.values(newSurfaces).some(c => c === ToothCondition.MISSING)) return prev;

             if (surface === 'ROOT') {
                 // Root surface logic
             }

             newSurfaces[surface] = newCondition;
        }
        
        const hasAnyCondition = Object.values(newSurfaces).some(c => c !== ToothCondition.HEALTHY);

        return {
            ...prev,
            [toothId]: {
                ...tooth,
                surfaces: newSurfaces,
                hasCondition: hasAnyCondition
            }
        };
    });

    if (selectedTool !== 'select') {
        const newTreatment: Treatment = {
            id: Date.now().toString(),
            toothId,
            surfaces: [surface],
            condition: newCondition,
            date: new Date().toLocaleDateString(),
            price: selectedTool === 'eraser' ? 0 : 100 // Placeholder price
        };
        setTreatments(prev => [newTreatment, ...prev]);
        setSelectedToothId(toothId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0 z-40 relative shadow-sm">
         <div className="flex items-center gap-3">
             <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                 D
             </div>
             <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">DentalDash</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">ISO 3950 Compliant Record</p>
             </div>
         </div>
         
         <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-4 py-2 w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={16} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search procedure, notes..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
         </div>

         <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                 <div className="text-right hidden md:block">
                     <p className="text-sm font-semibold text-slate-700">Dr. Sarah Smith</p>
                     <p className="text-xs text-slate-400">General Dentist</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                 </div>
             </div>
             <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
                 <Settings size={20} />
             </button>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
         
         {/* Main Workspace */}
         <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
            
            <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
               <div className="max-w-6xl mx-auto space-y-6">
                  
                  {/* Patient Quick Info Card */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                             JD
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">John Doe</h2>
                            <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><User size={14} /> Male, 34y</span>
                                <span className="flex items-center gap-1"><FileText size={14} /> Last Visit: Oct 12, 2024</span>
                            </div>
                            <div className="mt-2 flex gap-2">
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium flex items-center gap-1">
                                    <AlertCircle size={10} /> Penicillin Allergy
                                </span>
                            </div>
                          </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                          <div className="flex-1 md:flex-none text-right px-5 py-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Plaque Score</p>
                              <p className="text-xl font-bold text-slate-700">12%</p>
                          </div>
                          <div className="flex-1 md:flex-none text-right px-5 py-3 bg-blue-600 rounded-lg border border-blue-700 shadow-sm shadow-blue-200">
                              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wider">Treatment Plan</p>
                              <p className="text-xl font-bold text-white">$450.00</p>
                          </div>
                      </div>
                  </div>

                  {/* Odontogram Component */}
                  <Odontogram 
                    teeth={teeth} 
                    onSurfaceClick={handleSurfaceClick} 
                    selectedTool={selectedTool}
                    selectedToothId={selectedToothId}
                  />

                  {/* Legend (Simplified) */}
                  <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                      <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">Condition Legend</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Caries</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-sm"></div> Amalgam</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Composite</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-200 border border-green-300 rounded-sm"></div> Sealant</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded-sm"></div> Crown</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Root Canal</div>
                      </div>
                  </div>
               </div>
            </div>
         </main>

         {/* Right Sidebar - Details */}
         <TreatmentPanel 
            selectedToothId={selectedToothId}
            toothData={selectedToothId ? teeth[selectedToothId] : null}
            treatments={treatments}
            onClose={() => setSelectedToothId(null)}
         />

      </div>
    </div>
  );
}

export default App;