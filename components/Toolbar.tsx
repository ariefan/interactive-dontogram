import React from 'react';
import { ToolType } from '../types';
import { Stethoscope, Eraser, Octagon, Crown, Syringe, Ban, ShieldCheck } from 'lucide-react';

interface ToolbarProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onSelectTool }) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; color: string; desc: string; activeBorder: string }[] = [
    { id: 'select', label: 'Examine', icon: <Stethoscope size={20} />, color: 'bg-slate-900 text-white', desc: 'Select teeth to view details', activeBorder: 'border-slate-900' },
    { id: 'eraser', label: 'Eraser', icon: <Eraser size={20} />, color: 'bg-white text-slate-900', desc: 'Remove conditions from surfaces', activeBorder: 'border-slate-900 shadow-lg ring-2 ring-slate-100' },
    { id: 'caries', label: 'Caries', icon: <Octagon size={20} className="fill-red-600 text-red-900" />, color: 'bg-red-600 text-white', desc: 'Mark decay (Red)', activeBorder: 'border-red-900 shadow-red-100 shadow-md' },
    { id: 'restoration_amalgam', label: 'Amalgam', icon: <div className="w-5 h-5 bg-slate-700 border border-black rounded-sm" />, color: 'bg-slate-700 text-white', desc: 'Silver filling (Dark Gray)', activeBorder: 'border-black' },
    { id: 'restoration_composite', label: 'Composite', icon: <div className="w-5 h-5 bg-blue-600 border border-blue-900 rounded-sm" />, color: 'bg-blue-600 text-white', desc: 'Resin filling (Vibrant Blue)', activeBorder: 'border-blue-900' },
    { id: 'sealant', label: 'Sealant', icon: <ShieldCheck size={20} className="text-emerald-700" />, color: 'bg-emerald-500 text-white', desc: 'Preventive sealant (Emerald)', activeBorder: 'border-emerald-900' },
    { id: 'crown', label: 'Crown', icon: <Crown size={20} className="fill-amber-400 text-amber-900" />, color: 'bg-amber-400 text-amber-950', desc: 'Full coverage', activeBorder: 'border-amber-600' },
    { id: 'rct', label: 'Root Canal', icon: <Syringe size={20} className="text-purple-900" />, color: 'bg-purple-600 text-white', desc: 'Endodontic treatment', activeBorder: 'border-purple-900' },
    { id: 'missing', label: 'Missing', icon: <Ban size={20} className="text-red-700" />, color: 'bg-red-50 text-red-900 border-red-500', desc: 'Extracted or missing', activeBorder: 'border-red-600' },
  ];

  return (
    <div className="flex flex-col border-b-2 border-slate-300 bg-white sticky top-0 z-20 shadow-md">
      <div className="flex flex-wrap items-center gap-3 p-4 overflow-x-auto no-scrollbar">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            title={tool.desc}
            className={`
              flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap
              border-2
              ${selectedTool === tool.id 
                ? `ring-4 ring-blue-100 ${tool.color} ${tool.activeBorder} scale-105` 
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100'}
            `}
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>
      <div className="px-6 py-2 bg-slate-900 text-[11px] text-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase tracking-widest font-black">Tool Active:</span>
            <span className="font-bold text-white uppercase">{tools.find(t => t.id === selectedTool)?.label}</span>
         </div>
         <span className="italic text-slate-300">{tools.find(t => t.id === selectedTool)?.desc}</span>
      </div>
    </div>
  );
};

export default Toolbar;