
import React from 'react';
import { ChemicalElement, ShopItem } from '../types';
import { ELEMENT_ICONS, SHOP_ITEMS, RARITY_COLORS } from '../constants';
import { Archive, ShoppingBag, Zap, Brain, ArrowRight, Hexagon, Component } from 'lucide-react';

interface InventoryPanelProps {
  inventory: ChemicalElement[];
  onSelectElement: (element: ChemicalElement) => void;
  onPurchase: (item: ShopItem) => void;
  resources: { 
    insight: number;
    creativity: number;
  };
  ownedAccessories?: string[];
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ 
  inventory, 
  onSelectElement,
  onPurchase,
  resources,
  ownedAccessories = []
}) => {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Element Supply */}
      <div className="flex-[3] bg-lab-panel border border-neon-green/30 p-4 rounded-lg flex flex-col relative overflow-hidden min-h-0">
        <div className="absolute top-0 right-0 w-20 h-20 bg-neon-green/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <h2 className="font-display text-neon-green mb-4 flex items-center gap-2 sticky top-0 bg-lab-panel/95 backdrop-blur z-10 py-1">
          <Archive className="w-5 h-5" /> 元素庫存
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {inventory.map((element) => (
            <button
              key={element.id}
              onClick={() => onSelectElement(element)}
              className="w-full bg-slate-800/80 border hover:bg-slate-700/50 p-3 rounded flex items-center gap-3 group transition-all text-left relative overflow-hidden"
              style={{ borderColor: RARITY_COLORS[element.rarity] || '#334155' }}
            >
              {/* Rarity Glow on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                style={{ backgroundColor: RARITY_COLORS[element.rarity] }}
              />

              <div className={`
                w-10 h-10 rounded flex items-center justify-center font-bold text-lg shrink-0 border border-white/10
                ${element.rarity === 'legendary' ? 'text-yellow-400 bg-yellow-900/20' : 
                  element.rarity === 'epic' ? 'text-neon-purple bg-purple-900/20' : 
                  element.rarity === 'rare' ? 'text-neon-blue bg-blue-900/20' : 
                  element.rarity === 'uncommon' ? 'text-neon-green bg-green-900/20' : 'text-slate-400 bg-slate-800'}
              `}>
                {element.symbol}
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between">
                   <h3 className="font-display text-sm text-slate-200 truncate group-hover:text-white">{element.name}</h3>
                   <span className="text-slate-600 scale-75">{ELEMENT_ICONS[element.type]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-500 truncate font-mono">{element.type.toUpperCase()}</p>
                  <span 
                    className="text-[9px] px-1 rounded border border-white/10 uppercase"
                    style={{ color: RARITY_COLORS[element.rarity] }}
                  >
                    {element.rarity}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Creativity Shop */}
      <div className="flex-[2] bg-lab-panel border border-neon-blue/30 p-4 rounded-lg flex flex-col relative overflow-hidden min-h-0">
        <h2 className="font-display text-white mb-3 flex items-center gap-2 text-sm sticky top-0 z-10">
          <ShoppingBag className="w-4 h-4 text-neon-blue" /> 創造力交換矩陣
          <span className="ml-auto text-neon-green font-mono text-xs">
            CR: {resources.creativity}
          </span>
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {SHOP_ITEMS.map((item) => {
             const isOwned = item.accessoryId && ownedAccessories.includes(item.accessoryId);
             const canAfford = resources[item.currency] >= item.cost;
             const isDisabled = isOwned || !canAfford;

             return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onPurchase(item)}
                disabled={!!isDisabled}
                className={`
                  w-full p-3 rounded border text-left transition-all relative group
                  ${isDisabled 
                    ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/50 border-slate-600 hover:border-neon-blue hover:bg-slate-700'}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-display text-sm font-bold flex items-center gap-2 ${isDisabled ? 'text-slate-500' : 'text-white'}`}>
                    {item.effectType === 'buy_catalyst' && <Hexagon className="w-3 h-3 text-yellow-400" />}
                    {item.effectType === 'buy_accessory' && <Component className="w-3 h-3 text-neon-purple" />}
                    {item.name}
                  </h3>
                  
                  {isOwned ? (
                    <div className="text-xs font-mono px-1.5 py-0.5 rounded border bg-slate-700 border-slate-500 text-slate-300">
                      已擁有
                    </div>
                  ) : (
                    <div className={`
                      text-xs font-mono px-1.5 py-0.5 rounded border
                      ${canAfford 
                        ? 'bg-green-900/30 border-green-500/50 text-neon-green' 
                        : 'bg-red-900/20 border-red-500/30 text-red-700'}
                    `}>
                      -{item.cost} CR
                    </div>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-400 mb-2">{item.description}</p>
                
                {/* Visual indicator of reward */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-neon-blue">
                   <ArrowRight className="w-3 h-3" />
                   {item.effectType === 'add_energy' && <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> +{item.value} 能量</span>}
                   {item.effectType === 'add_insight' && <span className="flex items-center gap-1"><Brain className="w-3 h-3"/> +{item.value} 洞察力</span>}
                   {item.effectType === 'buy_catalyst' && <span className="flex items-center gap-1"><Hexagon className="w-3 h-3"/> +{item.value} 庫存</span>}
                   {item.effectType === 'buy_accessory' && <span className="flex items-center gap-1"><Component className="w-3 h-3"/> 永久解鎖</span>}
                </div>

                {/* Hover Glow Effect */}
                {!isDisabled && (
                  <div className="absolute inset-0 rounded bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};
