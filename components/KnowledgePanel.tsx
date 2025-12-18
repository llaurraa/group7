
import React from 'react';
import { ChemicalElement, Mission } from '../types';
import { Beaker, FlaskConical, Microscope, Target, CheckCircle, ChevronRight, ChevronsRight } from 'lucide-react';

interface KnowledgePanelProps {
  inventory: ChemicalElement[];
  selectedInputs: ChemicalElement[];
  onRemoveInput: (index: number) => void;
  maxSlots: number;
  missions: Mission[];
}

export const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ 
  inventory, 
  selectedInputs, 
  onRemoveInput,
  maxSlots,
  missions
}) => {
  const totalSlots = 50; 
  const discoveredCount = inventory.length;

  return (
    // Updated Root: Added overflow-y-auto for full panel vertical scrolling
    <div className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 pb-2">
      
      {/* Input / Stoichiometry Section */}
      <div className="bg-lab-panel border border-neon-blue/30 p-4 rounded-lg relative overflow-hidden group shrink-0">
        <div className="absolute inset-0 bg-neon-blue/5 pointer-events-none" />
        <h2 className="font-display text-neon-blue mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5" /> 反應輸入端
        </h2>
        
        {/* Horizontal Scrollable Inputs */}
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar items-center bg-lab-dark/50 rounded-md inner-shadow px-4 py-6 min-h-[140px]">
          {Array.from({ length: maxSlots }).map((_, idx) => (
            <div 
              key={idx}
              onClick={() => idx < selectedInputs.length && onRemoveInput(idx)}
              className={`
                w-24 h-24 shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center
                cursor-pointer transition-all duration-300 relative group/slot
                ${idx < selectedInputs.length 
                  ? 'border-neon-green bg-neon-green/10 shadow-[0_0_15px_rgba(10,255,0,0.2)]' 
                  : 'border-slate-600 hover:border-neon-blue/50 text-slate-500 hover:bg-slate-800'}
              `}
            >
              {idx < selectedInputs.length ? (
                <>
                  <span className="text-3xl font-display font-bold text-white mb-1">
                    {selectedInputs[idx].symbol}
                  </span>
                  <span className="text-xs text-neon-green font-body uppercase tracking-wider text-center px-1 truncate w-full">
                    {selectedInputs[idx].name}
                  </span>
                  <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                  </div>
                  {/* Remove Overlay */}
                  <div className="absolute inset-0 bg-black/60 items-center justify-center rounded-lg hidden group-hover/slot:flex text-xs text-red-400 font-bold backdrop-blur-sm">
                    移除
                  </div>
                </>
              ) : (
                <span className="text-xs uppercase">空插槽 {idx + 1}</span>
              )}
            </div>
          ))}
          {/* Add phantom slot to suggest expansion if needed */}
          <div className="w-2 h-24 shrink-0 border-r border-slate-700/50" />
        </div>
      </div>

      {/* Mission Log */}
      <div className="bg-lab-panel border border-yellow-500/30 p-4 rounded-lg flex flex-col shrink-0 min-h-[200px]">
        <h2 className="font-display text-yellow-400 mb-2 flex items-center gap-2 text-sm sticky top-0">
          <Target className="w-4 h-4" /> 委託清單 (MISSIONS)
        </h2>
        <div className="overflow-y-auto pr-2 space-y-2 custom-scrollbar flex-1 max-h-60">
           {missions.map(mission => (
             <div key={mission.id} className={`p-2 rounded border flex items-center gap-3 ${mission.completed ? 'bg-green-900/20 border-green-500/30 opacity-60' : 'bg-slate-800/50 border-slate-700'}`}>
                {mission.completed ? <CheckCircle className="w-4 h-4 text-neon-green" /> : <div className="w-4 h-4 rounded-full border border-slate-500" />}
                <div className="flex-1">
                  <p className={`text-xs font-bold ${mission.completed ? 'text-neon-green line-through' : 'text-slate-200'}`}>{mission.title}</p>
                  <p className="text-[10px] text-slate-400">{mission.description}</p>
                </div>
                {!mission.completed && (
                  <div className="text-[10px] font-mono text-yellow-400 whitespace-nowrap">
                    {mission.condition.current}/{typeof mission.condition.target === 'number' ? mission.condition.target : 1}
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>

      {/* Knowledge Graph - Horizontal Sliding inside Vertical Panel */}
      <div className="bg-lab-panel border border-neon-purple/30 p-4 rounded-lg flex flex-col relative group shrink-0 min-h-[340px]">
        <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-neon-purple flex items-center gap-2">
            <Microscope className="w-5 h-5" /> 知識矩陣
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-neon-purple/70 animate-pulse">
                <ChevronsRight className="w-3 h-3" />
                <span>SLIDE</span>
            </div>
        </div>
        
        {/* Horizontal Scrolling Grid Container */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-lab-dark/30 rounded border border-slate-800/50 flex items-center">
          <div className="grid grid-rows-3 grid-flow-col gap-3 p-3 w-max content-start">
            {inventory.map((element) => (
              <div 
                key={element.id}
                className={`
                  w-16 h-16 bg-slate-800 border rounded flex flex-col items-center justify-center 
                  hover:scale-110 transition-all cursor-help relative group/item shrink-0
                  ${element.rarity === 'common' ? 'border-slate-600' : ''}
                  ${element.rarity === 'uncommon' ? 'border-neon-green shadow-[0_0_5px_rgba(10,255,0,0.3)]' : ''}
                  ${element.rarity === 'rare' ? 'border-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.4)]' : ''}
                  ${element.rarity === 'epic' ? 'border-neon-purple shadow-[0_0_10px_rgba(189,0,255,0.5)]' : ''}
                  ${element.rarity === 'legendary' ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : ''}
                `}
              >
                 <span className="text-sm font-bold text-white">{element.symbol}</span>
                 <span className="text-[9px] text-slate-400">{element.atomicNumber}</span>
                 
                 {/* Tooltip */}
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-slate-900 border border-slate-600 p-2 rounded text-xs z-50 hidden group-hover/item:block shadow-lg pointer-events-none whitespace-normal">
                   <p className="font-bold text-white mb-1 text-center">{element.name}</p>
                   <span className={`block text-center text-[9px] px-1 rounded bg-white/10 mb-1 ${
                      element.rarity === 'legendary' ? 'text-yellow-400' :
                      element.rarity === 'epic' ? 'text-neon-purple' :
                      element.rarity === 'rare' ? 'text-neon-blue' :
                      element.rarity === 'uncommon' ? 'text-neon-green' : 'text-slate-400'
                   }`}>
                     {element.rarity.toUpperCase()}
                   </span>
                 </div>
              </div>
            ))}
            
            {/* Locked Slots Placeholders */}
            {Array.from({ length: Math.max(0, totalSlots - discoveredCount) }).map((_, i) => (
              <div key={`locked-${i}`} className="w-16 h-16 bg-slate-900/50 border border-slate-800 rounded flex items-center justify-center opacity-30 shrink-0">
                <div className="w-1 h-1 bg-slate-600 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-2 flex justify-between text-xs font-mono text-neon-purple">
          <span>矩陣數據庫</span>
          <span>{discoveredCount} / {totalSlots}+</span>
        </div>
      </div>
    </div>
  );
};
