
import React, { useState, useEffect } from 'react';
import { GameState, ChemicalElement, ShopItem, Catalyst, Rarity, Mission, Accessory, VisualEffectType } from './types';
import { INITIAL_ELEMENTS, MAX_INPUT_SLOTS, INITIAL_ENERGY, INITIAL_INSIGHT, INITIAL_CREATIVITY, INITIAL_MISSIONS, CATALYSTS, ACCESSORIES, RARITY_COLORS, generateRandomMission } from './constants';
import { simulateReaction } from './services/geminiService';
import { KnowledgePanel } from './components/KnowledgePanel';
import { ReactorPanel } from './components/ReactorPanel';
import { InventoryPanel } from './components/InventoryPanel';
import { StatusPanel } from './components/StatusPanel';
import { RulesModal } from './components/RulesModal';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    resources: {
      insight: INITIAL_INSIGHT,
      energy: INITIAL_ENERGY,
      creativity: INITIAL_CREATIVITY
    },
    inventory: INITIAL_ELEMENTS,
    selectedInputs: [],
    history: [],
    isProcessing: false,
    level: 1,
    missions: INITIAL_MISSIONS,
    catalysts: { 'stabilizer': 0, 'accelerator': 0, 'mutagen': 0 },
    activeCatalyst: null,
    ownedAccessories: [],
    activeAccessory: null
  });

  const [message, setMessage] = useState<string>("");
  const [reactionColor, setReactionColor] = useState<string>("");
  const [visualEffect, setVisualEffect] = useState<VisualEffectType | null>(null);
  const [showRules, setShowRules] = useState<boolean>(false);

  // Handler to add element to input slots
  const handleSelectElement = (element: ChemicalElement) => {
    if (gameState.selectedInputs.length < MAX_INPUT_SLOTS && !gameState.isProcessing) {
      setGameState(prev => ({
        ...prev,
        selectedInputs: [...prev.selectedInputs, element]
      }));
      setMessage(`已投入：${element.name.toUpperCase()}`);
    } else if (gameState.selectedInputs.length >= MAX_INPUT_SLOTS) {
      setMessage("熔爐容量已滿。請清空插槽以添加新素材。");
    }
  };

  // Handler to remove element from input slots
  const handleRemoveInput = (index: number) => {
    if (!gameState.isProcessing) {
      setGameState(prev => ({
        ...prev,
        selectedInputs: prev.selectedInputs.filter((_, i) => i !== index)
      }));
      setMessage("素材已取出。");
    }
  };

  // Clear inputs
  const handleClear = () => {
    setGameState(prev => ({ ...prev, selectedInputs: [] }));
    setMessage("熔爐已清空。");
  };

  // Toggle Catalyst Selection
  const handleToggleCatalyst = () => {
    setGameState(prev => {
      const ownedIds = Object.keys(prev.catalysts).filter(id => prev.catalysts[id] > 0);
      if (ownedIds.length === 0) return prev;

      // Cycle logic
      const currentIndex = prev.activeCatalyst ? ownedIds.indexOf(prev.activeCatalyst) : -1;
      let nextId: string | null = null;
      
      if (currentIndex === -1 || currentIndex === ownedIds.length - 1) {
        if (prev.activeCatalyst) {
           if (currentIndex < ownedIds.length - 1) {
             nextId = ownedIds[currentIndex + 1];
           } else {
             nextId = null; // Deselect
           }
        } else {
           nextId = ownedIds[0];
        }
      } else {
        nextId = ownedIds[currentIndex + 1];
      }

      const msg = nextId 
        ? `催化符文裝載: ${CATALYSTS[nextId].name}`
        : '催化符文已卸除';
        
      setMessage(msg);
      return { ...prev, activeCatalyst: nextId };
    });
  };

  // Toggle Accessory Selection
  const handleToggleAccessory = () => {
    setGameState(prev => {
      if (prev.ownedAccessories.length === 0) return prev;

      const currentIndex = prev.activeAccessory ? prev.ownedAccessories.indexOf(prev.activeAccessory) : -1;
      let nextId: string | null = null;

      if (currentIndex === -1 || currentIndex === prev.ownedAccessories.length - 1) {
        if (prev.activeAccessory) {
          if (currentIndex < prev.ownedAccessories.length - 1) {
            nextId = prev.ownedAccessories[currentIndex + 1];
          } else {
            nextId = null; // Deselect
          }
        } else {
          nextId = prev.ownedAccessories[0];
        }
      } else {
        nextId = prev.ownedAccessories[currentIndex + 1];
      }

      const msg = nextId
        ? `熔爐組件裝備: ${ACCESSORIES[nextId].name}`
        : '熔爐組件已移除';

      setMessage(msg);
      return { ...prev, activeAccessory: nextId };
    });
  };

  // Handle Shop Purchase
  const handlePurchase = (item: ShopItem) => {
    setGameState(prev => {
      // Check affordability
      if (prev.resources[item.currency] < item.cost) {
        setMessage(`資源不足：需要 ${item.cost} ${item.currency === 'creativity' ? '創造力' : '洞察力'}`);
        return prev;
      }

      const newResources = { ...prev.resources };
      const newCatalysts = { ...prev.catalysts };
      let newOwnedAccessories = [...prev.ownedAccessories];
      
      // Deduct cost
      newResources[item.currency] -= item.cost;

      // Apply effect
      if (item.effectType === 'add_energy') {
        newResources.energy += item.value;
        setMessage(`購買成功：獲得 ${item.value} 單位能量。`);
      } else if (item.effectType === 'add_insight') {
        newResources.insight += item.value;
        setMessage(`購買成功：轉化獲得 ${item.value} 洞察力。`);
      } else if (item.effectType === 'buy_catalyst' && item.catalystId) {
        newCatalysts[item.catalystId] = (newCatalysts[item.catalystId] || 0) + item.value;
        setMessage(`購買成功：獲得 ${item.value} 個 ${CATALYSTS[item.catalystId].name}。`);
      } else if (item.effectType === 'buy_accessory' && item.accessoryId) {
         if (!newOwnedAccessories.includes(item.accessoryId)) {
           newOwnedAccessories.push(item.accessoryId);
           setMessage(`購買成功：獲得新組件 ${ACCESSORIES[item.accessoryId].name}。`);
         }
      }

      return {
        ...prev,
        resources: newResources,
        catalysts: newCatalysts,
        ownedAccessories: newOwnedAccessories
      };
    });
  };

  // The Core Game Loop: Reaction
  const handleReact = async () => {
    if (gameState.selectedInputs.length < 2) return;
    
    // Check Energy Cost
    if (gameState.resources.energy < 10) {
      setMessage("能量不足 (需要 10)。請完成委託或購買電池組。");
      return;
    }

    // Catalyst & Accessory preparation
    const activeCatalystData = gameState.activeCatalyst ? CATALYSTS[gameState.activeCatalyst] : null;
    const activeAccessoryData = gameState.activeAccessory ? ACCESSORIES[gameState.activeAccessory] : null;

    setGameState(prev => ({ ...prev, isProcessing: true }));
    setMessage("正在引導元素魔力...");
    setVisualEffect(null); // Clear previous effect

    const processingTime = 2500; 

    // Simulate with catalyst & accessory
    // We pass Insight to unlock rarities
    const result = await simulateReaction(
        gameState.selectedInputs, 
        activeCatalystData, 
        gameState.resources.insight,
        activeAccessoryData
    );

    // Dynamic color based on rarity or result
    if (result.rarity) {
      setReactionColor(RARITY_COLORS[result.rarity]);
    } else if (result.visualColor) {
      setReactionColor(result.visualColor);
    }
    
    // Set visual effect if successful
    if (result.success && result.visualEffect) {
       setVisualEffect(result.visualEffect);
    }

    setTimeout(() => {
      setGameState(prev => {
        const newHistory = [...prev.history, result.message];
        let newInventory = [...prev.inventory];
        const newCatalysts = { ...prev.catalysts };
        
        // Consume catalyst
        if (prev.activeCatalyst) {
          newCatalysts[prev.activeCatalyst] = Math.max(0, newCatalysts[prev.activeCatalyst] - 1);
        }

        // Determine if actually new (Prevent farming same recipe)
        let isActuallyNew = false;
        if (result.success && result.product) {
          const exists = prev.inventory.some(e => e.id === result.product!.id);
          if (!exists) {
            newInventory.push(result.product);
            isActuallyNew = true;
          }
        }

        // Mission Logic and Rewards
        const nextMissions: Mission[] = [];
        let missionEnergy = 0;

        prev.missions.forEach(mission => {
          let newCurrent = mission.condition.current;
          
          // Only progress missions if the reaction was successful
          if (result.success) {
            // Require 'isActuallyNew' for mission progress to prevent infinite energy loops
            if (mission.condition.type === 'discover_count' && isActuallyNew) {
               newCurrent += 1;
            }
            if (mission.condition.type === 'find_rarity' && result.product && isActuallyNew) {
               // Rarity check
               const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
               const targetIdx = rarities.indexOf(mission.condition.target as string);
               const productIdx = rarities.indexOf(result.product.rarity);
               if (productIdx >= targetIdx) {
                 newCurrent += 1;
               }
            }
          }

          // Check target met
          const target = typeof mission.condition.target === 'number' ? mission.condition.target : 1;
          
          if (newCurrent >= target) {
             // Mission Completed: Grant Reward and Replace
             missionEnergy += 20;
             
             // Log completion
             newHistory.push(`委託完成: ${mission.title} (+20 能量)`);
             
             // Generate New Mission immediately
             const replacement = generateRandomMission(`m_${Date.now()}_${Math.random()}`);
             nextMissions.push(replacement);
          } else {
             // Keep existing
             nextMissions.push({
               ...mission,
               condition: { ...mission.condition, current: newCurrent }
             });
          }
        });

        // Determine next active catalyst state (auto deselect if run out)
        let nextActiveCatalyst = prev.activeCatalyst;
        if (nextActiveCatalyst && newCatalysts[nextActiveCatalyst] <= 0) {
          nextActiveCatalyst = null;
        }

        return {
          ...prev,
          isProcessing: false,
          resources: {
            insight: prev.resources.insight + result.insightGained,
            energy: Math.max(0, prev.resources.energy - 10 + missionEnergy), // Deduct cost, add reward
            creativity: prev.resources.creativity + result.creativityGained
          },
          inventory: newInventory,
          selectedInputs: [], // Auto clear
          history: newHistory,
          catalysts: newCatalysts,
          activeCatalyst: nextActiveCatalyst,
          missions: nextMissions
        };
      });

      setMessage(result.message);
    }, processingTime);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-lab-dark text-slate-200 font-body selection:bg-neon-blue selection:text-black">
      
      {/* Top Bar / Header */}
      <header className="h-16 border-b border-lab-border flex items-center px-6 justify-between bg-lab-panel z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            <span className="font-display font-bold text-black text-xl">N</span>
          </div>
          <h1 className="font-display text-2xl tracking-widest text-white">
            NEON<span className="text-neon-blue">ALCHEMY</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowRules(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-600 bg-slate-800/50 hover:bg-neon-blue/20 hover:border-neon-blue hover:text-white transition-all text-xs font-display tracking-wider text-slate-400"
          >
            <BookOpen className="w-3 h-3" />
            操作說明
          </button>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            V.2.6.0 // 強化組件系統
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20" 
          style={{ backgroundColor: reactionColor || '#00f3ff' }}
        />

        {/* Left: Knowledge & Inputs */}
        <div className="col-span-12 md:col-span-3 h-full min-h-[400px]">
          <KnowledgePanel 
            inventory={gameState.inventory} 
            selectedInputs={gameState.selectedInputs}
            onRemoveInput={handleRemoveInput}
            maxSlots={MAX_INPUT_SLOTS}
            missions={gameState.missions}
          />
        </div>

        {/* Center: Reactor/Furnace */}
        <div className="col-span-12 md:col-span-6 h-full min-h-[400px]">
          <ReactorPanel 
            isProcessing={gameState.isProcessing}
            onReact={handleReact}
            onClear={handleClear}
            canReact={gameState.selectedInputs.length >= 2}
            message={message}
            reactionColor={reactionColor}
            activeCatalyst={gameState.activeCatalyst ? CATALYSTS[gameState.activeCatalyst] : null}
            onToggleCatalyst={handleToggleCatalyst}
            ownedCatalysts={gameState.catalysts}
            activeAccessory={gameState.activeAccessory ? ACCESSORIES[gameState.activeAccessory] : null}
            onToggleAccessory={handleToggleAccessory}
            ownedAccessories={gameState.ownedAccessories}
            visualEffect={visualEffect}
          />
        </div>

        {/* Right: Strategy & Inventory */}
        <div className="col-span-12 md:col-span-3 h-full min-h-[400px]">
           <InventoryPanel 
             inventory={gameState.inventory}
             onSelectElement={handleSelectElement}
             onPurchase={handlePurchase}
             resources={gameState.resources}
             ownedAccessories={gameState.ownedAccessories}
           />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <StatusPanel resources={gameState.resources} level={gameState.level} />

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
};

export default App;
