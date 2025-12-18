
import React from 'react';
import { X, FlaskConical, Database, Zap, Target } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-lab-panel border border-neon-blue rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden animate-glow">
        
        {/* Header */}
        <div className="p-6 border-b border-lab-border flex items-center justify-between bg-lab-dark/50">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-neon-blue" />
            <h2 className="font-display text-2xl text-white tracking-widest">
              實驗室 <span className="text-neon-blue">操作協議</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 font-body text-slate-300 custom-scrollbar">
          
          {/* Section 1: Objective */}
          <section className="space-y-3">
            <h3 className="font-display text-lg text-neon-green flex items-center gap-2">
              <Target className="w-5 h-5" /> 任務目標 (MISSION OBJECTIVE)
            </h3>
            <p className="leading-relaxed border-l-2 border-slate-700 pl-4">
              您是<strong className="text-white">「霓虹煉金引擎」</strong>的操作員。
              您的目標是透過<strong className="text-neon-blue">「魔法熔爐」</strong>組合基本物質，熔煉出未知的元素。
              解開宇宙的奧秘，完成知識矩陣的登錄。
            </p>
          </section>

          {/* Section 2: How to Play */}
          <section className="space-y-4">
            <h3 className="font-display text-lg text-neon-purple flex items-center gap-2">
              <FlaskConical className="w-5 h-5" /> 操作流程 (PROCEDURE)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <div className="text-neon-purple font-display text-xl mb-2">01. 選擇</div>
                <p className="text-sm">從右側的<strong>「元素庫存」</strong>點選物質，將其投入熔爐的輸入槽中。</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <div className="text-neon-purple font-display text-xl mb-2">02. 熔煉</div>
                <p className="text-sm">當素材就緒時，按下中央的<strong>「啟動熔煉」</strong>按鈕開始合成。每次運作消耗 <strong className="text-neon-blue">10 能量</strong>。</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <div className="text-neon-purple font-display text-xl mb-2">03. 發現</div>
                <p className="text-sm">觀察熔爐變化。成功的轉化將創造新元素並完成委託，賺取更多能量。</p>
              </div>
            </div>
          </section>

          {/* Section 3: Resources */}
          <section className="space-y-3">
            <h3 className="font-display text-lg text-neon-blue flex items-center gap-2">
              <Zap className="w-5 h-5" /> 系統資源 (RESOURCES)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-purple-900/30 rounded border border-purple-500/30">
                   <div className="w-3 h-3 bg-neon-purple rounded-full" />
                </div>
                <div>
                  <strong className="text-white block font-display text-sm">洞察力 (INSIGHT)</strong>
                  <span className="text-sm text-slate-400">實驗累積的知識。當洞察力達到 <strong className="text-neon-blue">100</strong> 時，將解鎖合成高稀有度物質的能力。</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-blue-900/30 rounded border border-blue-500/30">
                   <Zap className="w-3 h-3 text-neon-blue" />
                </div>
                <div>
                  <strong className="text-white block font-display text-sm">能量 (ENERGY)</strong>
                  <span className="text-sm text-slate-400">驅動熔爐的魔力燃料。每次熔煉消耗 10 點。完成委託可回復 20 點。</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-900/30 rounded border border-green-500/30">
                   <Zap className="w-3 h-3 text-neon-green" />
                </div>
                <div>
                  <strong className="text-white block font-display text-sm">創造力 (CREATIVITY)</strong>
                  <span className="text-sm text-slate-400">額外的獎勵資源，可用於商店購買能量電池或催化劑。</span>
                </div>
              </li>
            </ul>
          </section>

           <div className="pt-4 border-t border-slate-800 text-center">
              <p className="text-xs font-mono text-slate-500">
                警告：未經授權的元素組合可能導致熔爐魔力不穩定。
              </p>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-lab-dark/80 border-t border-lab-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neon-blue/10 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black font-display text-sm font-bold rounded transition-all"
          >
            確認詳閱
          </button>
        </div>
      </div>
    </div>
  );
};
