
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type VisualEffectType = 'fire' | 'water' | 'electric' | 'bio' | 'magic' | 'metal' | 'gas' | 'default';

export interface ChemicalElement {
  id: string;
  name: string;
  symbol: string;
  description: string;
  atomicNumber: number;
  type: 'basic' | 'compound' | 'rare';
  rarity: Rarity;
  discovered: boolean;
}

export interface ReactionResult {
  success: boolean;
  product?: ChemicalElement;
  message: string;
  insightGained: number;
  creativityGained: number;
  energyCost: number;
  visualColor?: string;
  visualEffect?: VisualEffectType;
  isNewDiscovery: boolean;
  rarity?: Rarity;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  condition: {
    type: 'discover_count' | 'find_rarity' | 'craft_element';
    target: number | Rarity | string; // count | rarity string | element name
    current: number;
  };
  reward: {
    resource: 'energy' | 'insight' | 'creativity';
    amount: number;
  };
  completed: boolean;
}

export interface Catalyst {
  id: string;
  name: string;
  description: string;
  effectDescription: string;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  effectDescription: string;
  icon?: string; // Icon name reference
}

export interface GameState {
  resources: {
    insight: number; 
    energy: number; 
    creativity: number; 
  };
  inventory: ChemicalElement[];
  selectedInputs: ChemicalElement[];
  history: string[];
  isProcessing: boolean;
  level: number;
  missions: Mission[];
  catalysts: Record<string, number>; // catalystId -> quantity
  activeCatalyst: string | null;
  ownedAccessories: string[]; // List of owned accessory IDs
  activeAccessory: string | null; // Currently equipped accessory ID
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  currency: 'creativity' | 'insight';
  effectType: 'add_energy' | 'add_insight' | 'gamble' | 'buy_catalyst' | 'buy_accessory';
  value: number; // For catalysts, this might be batch size
  catalystId?: string;
  accessoryId?: string;
}

export enum LabAlertLevel {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}
