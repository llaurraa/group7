
import React, { useEffect, useState } from 'react';
import { Hexagon, Flame, Sparkles, Triangle, Shield, Zap, Droplet, Leaf, Wind, Orbit, Power, Star } from 'lucide-react';
import { Catalyst, Accessory, VisualEffectType } from '../types';

interface ReactorPanelProps {
  isProcessing: boolean;
  onReact: () => void;
  onClear: () => void;
  canReact: boolean;
  message: string;
  reactionColor?: string;
  activeCatalyst: Catalyst | null;
  onToggleCatalyst: () => void;
  ownedCatalysts: Record<string, number>;
  activeAccessory: Accessory | null;
  onToggleAccessory: () => void;
  ownedAccessories: string[];
  visualEffect?: VisualEffectType | null;
}

export const ReactorPanel: React.FC<ReactorPanelProps> = ({
  isProcessing,
  onReact,
  onClear,
  canReact,
  message,
  reactionColor = '#00f3ff',
  activeCatalyst,
  onToggleCatalyst,
  ownedCatalysts,
  activeAccessory,
  onToggleAccessory,
  ownedAccessories,
  visualEffect
}) => {
  const hasAnyCatalyst = Object.values(ownedCatalysts).some((v: number) => v > 0);
  const hasAnyAccessory = ownedAccessories.length > 0;
  
  // Animation States
  const [showResult, setShowResult] = useState(false);
  const [triggerBurst, setTriggerBurst] = useState(false);
  const [isHoveringReact, setIsHoveringReact] = useState(false);

  // Handle Success Trigger
  useEffect(() => {
    if (!isProcessing && visualEffect) {
      // 1. Trigger the burst immediately
      setTriggerBurst(true);
      setShowResult(true);

      // 2. Reset burst trigger shortly after
      const burstTimer = setTimeout(() => setTriggerBurst(false), 800);
      
      // 3. Keep result visible for a bit longer, then fade
      const resultTimer = setTimeout(() => setShowResult(false), 3000);

      return () => {
        clearTimeout(burstTimer);
        clearTimeout(resultTimer);
      };
    }
  }, [isProcessing, visualEffect]);

  // Render the materialized element icon (Holographic look)
  const renderResultVisual = () => {
    if (!showResult || !visualEffect) return null;

    let IconComponent = Sparkles;
    let baseColor = "#ffffff";

    switch (visualEffect) {
      case 'fire': IconComponent = Flame; baseColor = "#f97316"; break; // Orange-500
      case 'water': IconComponent = Droplet; baseColor = "#06b6d4"; break; // Cyan-500
      case 'electric': IconComponent = Zap; baseColor = "#eab308"; break; // Yellow-500
      case 'bio': IconComponent = Leaf; baseColor = "#22c55e"; break; // Green-500
      case 'magic': IconComponent = Orbit; baseColor = "#d946ef"; break; // Fuchsia-500
      case 'metal': IconComponent = Hexagon; baseColor = "#94a3b8"; break; // Slate-400
      case 'gas': IconComponent = Wind; baseColor = "#a5b4fc"; break; // Indigo-300
      default: IconComponent = Star; baseColor = "#e2e8f0"; break; // Slate-200
    }

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Floating Animation Container */}
        <div className="relative animate-[bounce_2s_infinite]">
            
            {/* Core Icon Glow - Colored */}
            <div 
                className="absolute inset-0 blur-xl animate-pulse"
                style={{ backgroundColor: baseColor, opacity: 0.6 }}
            />
            
            {/* The Icon Itself - Appearing with scale. REMOVED text-white and white drop-shadow */}
            <div 
                className="relative z-10 animate-[ping_0.3s_ease-out_reverse_fill-mode-forwards]"
                style={{ filter: `drop-shadow(0 0 10px ${baseColor})` }}
            >
                <IconComponent 
                    className="w-16 h-16" 
                    style={{ color: baseColor, fill: `${baseColor}44` }} // Semi-transparent fill matching color
                    strokeWidth={1.5}
                />
            </div>

            {/* Orbiting Particles - Colored */}
            <div className="absolute inset-[-20px] animate-[spin_4s_linear_infinite]">
                <div 
                    className="absolute top-0 left-1/2 w-1 h-1 rounded-full" 
                    style={{ backgroundColor: baseColor, boxShadow: `0 0 5px ${baseColor}` }}
                />
            </div>
            <div className="absolute inset-[-20px] animate-[spin_4s_linear_infinite_reverse] delay-75">
                <div 
                    className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: baseColor, boxShadow: `0 0 5px ${baseColor}` }}
                />
            </div>

        </div>
      </div>
    );
  };

  // Render the Shockwave/Burst effect
  const renderBurst = () => {
    if (!triggerBurst) return null;

    return (
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
         {/* 1. Flash Screen - Tinted instead of pure white */}
         <div 
            className="absolute inset-0 animate-[fadeOut_0.5s_ease-out_forwards] mix-blend-screen opacity-30" 
            style={{ backgroundColor: reactionColor }}
         />
         
         {/* 2. Expanding Shockwave Ring 1 */}
         <div 
            className="absolute border-2 rounded-full animate-[ping_0.8s_ease-out_forwards]"
            style={{ 
                borderColor: reactionColor,
                width: '100%', 
                height: '100%',
                opacity: 0.8
            }}
         />

         {/* 3. Expanding Shockwave Ring 2 (Delayed) - Changed to reactionColor instead of white */}
         <div 
            className="absolute border rounded-full animate-[ping_1s_ease-out_forwards]"
            style={{ 
                borderColor: reactionColor,
                width: '80%', 
                height: '80%',
                animationDelay: '0.1s',
                opacity: 0.4
            }}
         />

         {/* 4. Radial Burst Lines */}
         <div 
            className="absolute w-[150%] h-[150%] animate-[spin_0.5s_ease-out]"
            style={{
                background: `radial-gradient(circle, transparent 30%, ${reactionColor}33 40%, transparent 70%)`
            }}
         />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col justify-center items-center relative bg-lab-dark rounded-xl border border-lab-border overflow-hidden p-6 shadow-inner group selection:bg-none">
      
      {/* Static Background Grid */}
      <div 
        className={`absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] transition-opacity duration-1000 pointer-events-none
        ${isProcessing ? 'opacity-20' : 'opacity-5'}`}
      >
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-neon-blue/10" />
        ))}
      </div>
      
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{ 
          background: isProcessing 
            ? `radial-gradient(circle at center, ${reactionColor}30 0%, transparent 70%)` 
            : triggerBurst
                ? `radial-gradient(circle at center, ${reactionColor}40 0%, transparent 80%)` // Bright burst BG
                : canReact 
                    ? `radial-gradient(circle at center, ${reactionColor}05 0%, transparent 60%)`
                    : undefined
        }} 
      />

      {/* Main Furnace Container */}
      <div className="relative z-10 w-full max-w-[220px] aspect-square flex items-center justify-center">
        
        {/* === SUCCESS EFFECTS === */}
        {renderBurst()}
        {renderResultVisual()}

        {/* === RINGS & LAYERS === */}

        {/* 1. Outer Ring */}
        <div 
            className={`absolute inset-[-10%] rounded-full border border-dashed transition-all duration-[2000ms] pointer-events-none
            ${isProcessing 
                ? 'animate-[spin_10s_linear_infinite] opacity-40 scale-100 border-opacity-100' 
                : canReact 
                    ? 'animate-[spin_20s_linear_infinite] opacity-20 scale-95 border-neon-blue/30' 
                    : 'opacity-5 scale-90 border-slate-700'
            }`}
            style={{ 
                borderColor: (isProcessing || triggerBurst) ? reactionColor : canReact ? reactionColor : undefined,
                filter: triggerBurst ? `drop-shadow(0 0 10px ${reactionColor})` : 'none'
            }}
        />

        {/* 2. Middle Ring */}
        <div 
            className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current border-b-current transition-all duration-500 pointer-events-none
            ${isProcessing ? 'animate-[spin_3s_linear_infinite_reverse] opacity-60 scale-100' : isHoveringReact ? 'animate-[spin_4s_linear_infinite_reverse] opacity-40 scale-100' : 'opacity-0 scale-75'}`}
            style={{ color: reactionColor }}
        />

        {/* === SLOTS === */}

        {/* Left: Accessory Slot */}
        <div className="absolute top-0 left-0 z-30 -translate-x-2 -translate-y-2">
          <button
            onClick={onToggleAccessory}
            disabled={isProcessing || !hasAnyAccessory}
            className={`
               w-10 h-10 relative flex items-center justify-center rounded-lg border-2 transition-all transform
               ${activeAccessory 
                 ? 'border-neon-purple bg-purple-900/20 shadow-[0_0_15px_rgba(189,0,255,0.5)]' // Equipped
                 : hasAnyAccessory
                    ? 'border-slate-600 bg-slate-800 hover:border-neon-purple/50 hover:bg-slate-700' // Available
                    : 'border-slate-800 bg-slate-900/50 opacity-20 cursor-not-allowed' // Locked
               }
               ${!isProcessing && hasAnyAccessory ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}
            `}
            title={
                activeAccessory ? activeAccessory.name : 
                !hasAnyAccessory ? "無可用強化組件 (請至商店購買)" : 
                "點擊裝備組件"
            }
          >
            {activeAccessory ? (
                <>
                    {activeAccessory.icon === 'triangle' ? <Triangle className="w-5 h-5 text-neon-purple fill-purple-500/20" /> :
                     activeAccessory.icon === 'shield' ? <Shield className="w-5 h-5 text-neon-purple fill-purple-500/20" /> :
                     <div className="w-4 h-4 bg-neon-purple rounded-sm" />}
                </>
            ) : (
                <div className={`w-4 h-4 border-2 border-dashed rounded-sm ${hasAnyAccessory ? 'border-slate-500 group-hover:border-neon-purple/50' : 'border-slate-700'}`} />
            )}
            
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 whitespace-nowrap bg-black/60 px-1 rounded backdrop-blur-sm">
              {activeAccessory ? 'MOD' : 'SLOT'}
            </span>
          </button>
        </div>

        {/* Right: Catalyst Slot */}
        <div className="absolute top-0 right-0 z-30 translate-x-2 -translate-y-2">
          <button
            onClick={onToggleCatalyst}
            disabled={isProcessing || !hasAnyCatalyst}
            className={`
               w-10 h-10 relative flex items-center justify-center rounded-lg border-2 transition-all transform
               ${activeCatalyst 
                 ? 'border-yellow-400 bg-yellow-900/20 shadow-[0_0_15px_rgba(250,204,21,0.5)]' 
                 : hasAnyCatalyst
                    ? 'border-slate-600 bg-slate-800 hover:border-yellow-400/50 hover:bg-slate-700'
                    : 'border-slate-800 bg-slate-900/50 opacity-20 cursor-not-allowed'
               }
               ${!isProcessing && hasAnyCatalyst ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}
            `}
            title={activeCatalyst ? activeCatalyst.name : hasAnyCatalyst ? "點擊切換催化劑" : "無可用催化劑"}
          >
            {activeCatalyst ? (
                <>
                    <Hexagon className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 text-[8px] font-bold text-black border border-black">
                        1
                    </span>
                </>
            ) : (
                <div className={`w-4 h-4 border-2 border-dashed rounded-sm rotate-45 ${hasAnyCatalyst ? 'border-slate-500 group-hover:border-yellow-400/50' : 'border-slate-700'}`} />
            )}
            
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 whitespace-nowrap bg-black/60 px-1 rounded backdrop-blur-sm">
              {activeCatalyst ? 'RUNE' : 'SLOT'}
            </span>
          </button>
        </div>

        {/* === CORE FURNACE VISUAL === */}
        <div 
          className={`
            relative w-28 h-28 flex items-center justify-center
            transition-all duration-300
            ${isProcessing ? 'scale-105 filter drop-shadow-[0_0_25px_rgba(255,100,0,0.6)]' : 
              triggerBurst ? 'scale-110' : // Removed white burst shadow
              isHoveringReact ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 
              'drop-shadow-[0_0_10px_rgba(0,243,255,0.1)]'}
          `}
          style={triggerBurst ? { filter: `drop-shadow(0 0 30px ${reactionColor})` } : {}}
        >
           {/* Inner Core Circle */}
           <div 
             className={`absolute inset-0 rounded-full border border-slate-600 bg-lab-dark transition-all duration-500 overflow-hidden
             ${canReact && !isProcessing ? 'border-neon-blue shadow-[inset_0_0_20px_rgba(0,243,255,0.2)]' : ''}
             ${!canReact && !isProcessing ? 'opacity-80' : ''}
             ${isProcessing ? 'border-orange-400 shadow-[inset_0_0_40px_rgba(255,60,0,0.5)]' : ''}
             ${triggerBurst ? 'bg-white/10' : ''} 
             `}
             style={triggerBurst ? { borderColor: reactionColor } : {}}
           >
              {/* Fluid/Energy Animation inside core */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50`} />
              
              {/* === PROCESSING STATE (Fire) === */}
              {isProcessing && (
                <>
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-orange-600/80 via-red-500/30 to-transparent animate-pulse mix-blend-screen" />
                  <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,100,0,0.4)_180deg,transparent_360deg)] animate-[spin_1s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-orange-500/40 rounded-full blur-xl animate-pulse mix-blend-screen" />
                  </div>
                   <div className="absolute inset-0 overflow-hidden pointer-events-none">
                     <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-[ping_0.8s_linear_infinite]" />
                     <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-[ping_1.2s_linear_infinite] delay-100" />
                   </div>
                </>
              )}
           </div>

           {/* Central Initiate Button */}
           <button
             onClick={onReact}
             onMouseEnter={() => setIsHoveringReact(true)}
             onMouseLeave={() => setIsHoveringReact(false)}
             disabled={!canReact || isProcessing}
             className={`
               relative z-20 rounded-full w-20 h-20 flex flex-col items-center justify-center
               transition-all duration-200 group/btn
               ${!canReact 
                  ? 'cursor-not-allowed opacity-50 grayscale' 
                  : 'cursor-pointer hover:bg-neon-blue/10'}
               ${showResult ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} 
             `}
             // Hide button when showing result to let icon shine
           >
              <div className={`
                transition-all duration-500
                ${isProcessing ? 'text-yellow-100 drop-shadow-[0_0_5px_rgba(255,200,0,0.8)]' : canReact ? 'text-neon-blue' : 'text-slate-600'}
              `}>
                {isProcessing ? <Flame className="w-8 h-8 animate-pulse" strokeWidth={2} /> : <Power className="w-8 h-8" strokeWidth={1.5} />}
              </div>
              
              {!isProcessing && (
                <span className={`
                  mt-1 text-[9px] font-display font-bold tracking-widest transition-colors
                  ${canReact ? 'text-white group-hover/btn:text-neon-blue' : 'text-slate-600'}
                `}>
                  {canReact ? 'INITIATE' : 'OFFLINE'}
                </span>
              )}
           </button>
        </div>

      </div>

      {/* Message Output */}
      <div className="absolute bottom-6 w-full px-6 text-center z-50">
        <div className={`
          inline-block px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border transition-all duration-300 max-w-full
          ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${triggerBurst ? 'text-white' : 
            isProcessing ? 'border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(255,100,0,0.3)]' : 'border-slate-700/50 text-slate-300'}
        `}
        style={triggerBurst ? { borderColor: reactionColor, boxShadow: `0 0 20px ${reactionColor}` } : {}}
        >
          <p className="text-xs font-mono typing-effect truncate">
            {message || "等待指令..."}
          </p>
        </div>
      </div>
    </div>
  );
};
