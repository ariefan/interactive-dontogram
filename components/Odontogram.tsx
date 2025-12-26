import React, { useState } from 'react';
import Tooth from './Tooth';
import { ToothState, ToothSurface, ToolType } from '../types';
import { User, Baby } from 'lucide-react';

interface OdontogramProps {
  teeth: Record<number, ToothState>;
  onSurfaceClick: (toothId: number, surface: ToothSurface) => void;
  selectedTool: ToolType;
  selectedToothId: number | null;
}

const Odontogram: React.FC<OdontogramProps> = ({ teeth, onSurfaceClick, selectedTool, selectedToothId }) => {
  const [viewMode, setViewMode] = useState<'adult' | 'child'>('adult');
  
  // FDI ISO 3950 Notation
  // Quadrant 1: Permanent Upper Right (18-11)
  const q1_UpperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  // Quadrant 2: Permanent Upper Left (21-28)
  const q2_UpperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  // Quadrant 3: Permanent Lower Left (31-38)
  const q3_LowerLeft = [31, 32, 33, 34, 35, 36, 37, 38]; 
  // Quadrant 4: Permanent Lower Right (41-48)
  const q4_LowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  
  // Deciduous (Primary)
  // Quadrant 5: Primary Upper Right (55-51)
  const q5_UpperRight = [55, 54, 53, 52, 51];
  // Quadrant 6: Primary Upper Left (61-65)
  const q6_UpperLeft = [61, 62, 63, 64, 65];
  // Quadrant 7: Primary Lower Left (71-75)
  const q7_LowerLeft = [71, 72, 73, 74, 75];
  // Quadrant 8: Primary Lower Right (85-81)
  const q8_LowerRight = [85, 84, 83, 82, 81];
  
  const renderTooth = (id: number) => {
    if (!teeth[id]) return null;
    return (
      <Tooth 
        key={id} 
        id={id} 
        data={teeth[id]} 
        onSurfaceClick={onSurfaceClick} 
        selectedTool={selectedTool}
        isSelected={selectedToothId === id}
      />
    );
  };

  // Select quadrants based on view mode
  // Screen Left = Patient Right
  // Screen Right = Patient Left
  
  const upperRightIndices = viewMode === 'adult' ? q1_UpperRight : q5_UpperRight;
  const upperLeftIndices = viewMode === 'adult' ? q2_UpperLeft : q6_UpperLeft;
  // Lower Arch: Screen Left is Patient Right (Q4/Q8), Screen Right is Patient Left (Q3/Q7)
  const lowerRightIndices = viewMode === 'adult' ? q4_LowerRight : q8_LowerRight;
  const lowerLeftIndices = viewMode === 'adult' ? q3_LowerLeft : q7_LowerLeft;

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* View Toggle */}
      <div className="flex border-b border-slate-100">
         <button 
           onClick={() => setViewMode('adult')}
           className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'adult' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
         >
           <User size={16} /> Permanent (11-48)
         </button>
         <button 
           onClick={() => setViewMode('child')}
           className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'child' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
         >
           <Baby size={16} /> Deciduous (51-85)
         </button>
      </div>

      <div className="p-4 md:p-8 overflow-x-auto">
        <div className="min-w-[700px] flex flex-col items-center gap-8">
          
          {/* Upper Arch Container */}
          <div className="relative w-full">
             {/* Quadrant Labels */}
             <div className="absolute top-0 left-4 text-xs font-bold text-slate-500">Q{viewMode === 'adult' ? '1' : '5'}</div>
             <div className="absolute top-0 right-4 text-xs font-bold text-slate-500">Q{viewMode === 'adult' ? '2' : '6'}</div>

             <div className="flex justify-center gap-8 md:gap-16 pt-4">
                 {/* Upper Right (Screen Left) */}
                 <div className="flex gap-1 justify-end min-w-[300px]">
                    {upperRightIndices.map(renderTooth)}
                 </div>
                 {/* Upper Left (Screen Right) */}
                 <div className="flex gap-1 justify-start min-w-[300px]">
                    {upperLeftIndices.map(renderTooth)}
                 </div>
             </div>
             
             {/* Labels and Lines */}
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-10"></div>
             <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-200 -translate-x-1/2"></div>
             <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase -rotate-90">Right</div>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase rotate-90">Left</div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-xs font-semibold text-slate-500 bg-white px-2">Maxilla (Upper)</div>
          </div>

          {/* Lower Arch Container */}
          <div className="relative w-full">
             {/* Quadrant Labels */}
             <div className="absolute bottom-0 left-4 text-xs font-bold text-slate-500">Q{viewMode === 'adult' ? '4' : '8'}</div>
             <div className="absolute bottom-0 right-4 text-xs font-bold text-slate-500">Q{viewMode === 'adult' ? '3' : '7'}</div>

             <div className="flex justify-center gap-8 md:gap-16 pb-4">
                 {/* Lower Right (Screen Left) */}
                 <div className="flex gap-1 justify-end min-w-[300px]">
                    {lowerRightIndices.map(renderTooth)}
                 </div>
                 {/* Lower Left (Screen Right) */}
                 <div className="flex gap-1 justify-start min-w-[300px]">
                    {lowerLeftIndices.map(renderTooth)}
                 </div>
             </div>
             
             {/* Labels and Lines */}
             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-100 -z-10"></div>
             <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-200 -translate-x-1/2"></div>
             <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase -rotate-90">Right</div>
             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase rotate-90">Left</div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-semibold text-slate-500 bg-white px-2">Mandible (Lower)</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Odontogram;