
import React from 'react';
import { Brain, Zap, Palette, Activity } from 'lucide-react';

interface StatusPanelProps {
  resources: {
    insight: number;
    energy: number;
    creativity: number;
  };
  level: number;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ resources, level }) => {
  return (
    <div className="h-16 bg-lab-panel border-t border-neon-blue/30 flex items-center px-6 justify-between relative z-50">
       <div className="flex gap-8">
           {/* Insight */}
           <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
                   <Brain className="w-5 h-5 text-neon-purple" />
               </div>
               <div>
                   <p className="text-[10px] text-slate-400 font-mono uppercase">洞察力</p>
                   <p className="text-xl font-display font-bold text-white">{resources.insight}</p>
               </div>
           </div>

           {/* Energy */}
           <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
                   <Zap className="w-5 h-5 text-neon-blue" />
               </div>
               <div>
                   <p className="text-[10px] text-slate-400 font-mono uppercase">核心能量</p>
                   <p className="text-xl font-display font-bold text-white">{resources.energy}</p>
               </div>
           </div>

           {/* Creativity */}
           <div className="flex items-center gap-3">
               <div className="p-2 bg-green-900/30 rounded-lg border border-green-500/30">
                   <Palette className="w-5 h-5 text-neon-green" />
               </div>
               <div>
                   <p className="text-[10px] text-slate-400 font-mono uppercase">創造力</p>
                   <p className="text-xl font-display font-bold text-white">{resources.creativity}</p>
               </div>
           </div>
       </div>

       {/* System Status */}
       <div className="flex items-center gap-4 border-l border-slate-700 pl-8">
           <div className="text-right">
               <p className="text-[10px] text-slate-400 font-mono uppercase">系統狀態</p>
               <p className="text-sm font-display text-neon-green flex items-center justify-end gap-2">
                   連線中 <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
               </p>
           </div>
           <div className="text-right hidden md:block">
             <p className="text-[10px] text-slate-400 font-mono uppercase">安全層級</p>
             <p className="text-sm font-display text-white">LVL {level}</p>
           </div>
           <Activity className="w-6 h-6 text-slate-600" />
       </div>
    </div>
  );
};