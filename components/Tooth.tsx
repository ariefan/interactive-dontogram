import React from 'react';
import { ToothCondition, ToothState, ToothSurface, ToolType } from '../types';

interface ToothProps {
  id: number;
  data: ToothState;
  onSurfaceClick: (toothId: number, surface: ToothSurface) => void;
  selectedTool: ToolType;
  isSelected: boolean;
}

const Tooth: React.FC<ToothProps> = ({ id, data, onSurfaceClick, selectedTool, isSelected }) => {
  
  // High contrast color mapping
  const getFillColor = (condition: ToothCondition) => {
    switch (condition) {
      case ToothCondition.HEALTHY: return 'fill-white hover:fill-slate-200';
      case ToothCondition.CARIES: return 'fill-red-600 hover:fill-red-700';
      case ToothCondition.AMALGAM: return 'fill-slate-700 hover:fill-slate-800';
      case ToothCondition.COMPOSITE: return 'fill-blue-600 hover:fill-blue-700';
      case ToothCondition.SEALANT: return 'fill-emerald-500 hover:fill-emerald-600';
      case ToothCondition.CROWN: return 'fill-amber-400/40 hover:fill-amber-400/60'; 
      case ToothCondition.MISSING: return 'fill-slate-100';
      case ToothCondition.ROOT_CANAL: return 'fill-purple-600 hover:fill-purple-700';
      default: return 'fill-white';
    }
  };

  const isMissing = Object.values(data.surfaces).some(c => c === ToothCondition.MISSING);
  const isSelectedStyle = isSelected ? 'ring-2 ring-blue-600 ring-offset-2 z-10 bg-blue-50/50' : '';
  const interactiveClass = selectedTool !== 'select' ? 'cursor-crosshair' : 'cursor-pointer';

  // FDI ISO 3950 Orientation
  const isPatientRight = (id >= 11 && id <= 18) || (id >= 41 && id <= 48) || (id >= 51 && id <= 55) || (id >= 81 && id <= 85);
  const isUpper = (id >= 11 && id <= 28) || (id >= 51 && id <= 65);

  let topSurf: ToothSurface, bottomSurf: ToothSurface;
  if (isUpper) {
      topSurf = 'V'; 
      bottomSurf = 'L';
  } else {
      topSurf = 'L'; 
      bottomSurf = 'V';
  }

  let leftSurf: ToothSurface, rightSurf: ToothSurface;
  if (isPatientRight) {
      leftSurf = 'D';
      rightSurf = 'M';
  } else {
      leftSurf = 'M';
      rightSurf = 'D';
  }

  const isRootTop = isUpper;

  const renderPolygon = (points: string, surface: ToothSurface) => (
    <polygon 
      points={points}
      className={`stroke-slate-900 stroke-[1.5] transition-colors duration-150 ${getFillColor(data.surfaces[surface])}`}
      onClick={(e) => { e.stopPropagation(); onSurfaceClick(id, surface); }}
    />
  );

  const renderRoot = () => {
    const rootCondition = data.surfaces.ROOT;
    const isRCT = rootCondition === ToothCondition.ROOT_CANAL;
    const isImplant = rootCondition === ToothCondition.IMPLANT;
    
    const rootClass = `w-8 h-4 rounded-full mx-auto cursor-pointer transition-all border-2 ${
        isRCT ? 'bg-purple-600 border-purple-900' : 
        isImplant ? 'bg-slate-700 border-black' :
        'bg-slate-100 border-slate-400 hover:bg-slate-200 hover:border-slate-500'
    }`;
    
    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onSurfaceClick(id, 'ROOT'); }}
            className={`flex justify-center ${isRootTop ? 'mb-1' : 'mt-1'}`}
            title="Root Surface"
        >
           <div className={rootClass + (isSelected && rootCondition !== 'Healthy' ? ' ring-2 ring-blue-400 ring-offset-1' : '')}>
              {isRCT && <div className="w-full h-1 bg-white/40 mt-1"></div>}
           </div>
        </div>
    );
  };

  if (isMissing) {
      return (
        <div 
          onClick={() => onSurfaceClick(id, 'O')}
          className={`flex flex-col items-center justify-center gap-1 relative p-2 rounded-lg transition-all border-2 border-transparent ${isSelectedStyle}`}
        >
             {isRootTop && <div className="h-4 w-8" />}
             
             <div className="w-10 h-10 md:w-12 md:h-12 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <line x1="10" y1="10" x2="90" y2="90" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                    <line x1="90" y1="10" x2="10" y2="90" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                </svg>
             </div>
             
             <span className="text-xs font-bold text-red-600/50 line-through">{id}</span>
             {!isRootTop && <div className="h-4 w-8" />}
             
             {selectedTool === 'eraser' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded cursor-pointer border-2 border-dashed border-green-500">
                    <span className="text-[10px] text-green-700 font-bold px-1 uppercase tracking-tighter">Restore</span>
                 </div>
             )}
        </div>
      );
  }

  const hasCrown = Object.values(data.surfaces).some(c => c === ToothCondition.CROWN);

  return (
    <div className={`flex flex-col relative group ${interactiveClass} rounded-xl p-1 transition-all ${isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-slate-50'}`}>
      
      {/* Upper Root */}
      {isRootTop && renderRoot()}

      {/* Tooth Body */}
      <div className={`w-10 h-10 md:w-12 md:h-12 relative transition-transform duration-150 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main Surfaces */}
          {renderPolygon("2,2 98,2 72,28 28,28", topSurf)}
          {renderPolygon("2,98 98,98 72,72 28,72", bottomSurf)}
          {renderPolygon("2,2 2,98 28,72 28,28", leftSurf)}
          {renderPolygon("98,2 98,98 72,72 72,28", rightSurf)}
          
          <rect 
            x="28" y="28" width="44" height="44" 
            className={`stroke-slate-900 stroke-[1.5] ${getFillColor(data.surfaces['O'])} transition-colors`}
            onClick={(e) => { e.stopPropagation(); onSurfaceClick(id, 'O'); }}
          />

          {/* Condition Overlays */}
          {hasCrown && (
             <rect 
                x="5" y="5" width="90" height="90" rx="10" 
                fill="none" stroke="#d97706" strokeWidth="5" 
                className="pointer-events-none" 
             />
          )}
          
          {/* Internal Numbering */}
          <g className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
             <text x="50" y="50" textAnchor="middle" dy="4" fontSize="16" fill="#1e293b" fontWeight="900" className="drop-shadow-sm">{id}</text>
          </g>
        </svg>
      </div>

      {/* Lower Root */}
      {!isRootTop && renderRoot()}

      {/* Tooth Number Label */}
      <div className="text-center h-5 flex items-center justify-center mt-1">
         <span className={`text-[11px] font-black select-none tracking-tight ${data.hasCondition ? 'text-blue-700' : 'text-slate-500'}`}>
            {id}
         </span>
      </div>
      
    </div>
  );
};

export default Tooth;