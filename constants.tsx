
import { ChemicalElement, ShopItem, Rarity, Mission, Catalyst, Accessory } from './types';
import { Atom, Zap, Droplet, Flame, Hexagon } from 'lucide-react';
import React from 'react';

export const INITIAL_ELEMENTS: ChemicalElement[] = [
  { id: 'h', name: '氫', symbol: 'H', atomicNumber: 1, type: 'basic', rarity: 'common', description: '宇宙中最輕盈的元素。', discovered: true },
  { id: 'o', name: '氧', symbol: 'O', atomicNumber: 8, type: 'basic', rarity: 'common', description: '燃燒與呼吸的必要條件。', discovered: true },
  { id: 'c', name: '碳', symbol: 'C', atomicNumber: 6, type: 'basic', rarity: 'common', description: '構成生命的基礎物質。', discovered: true },
  { id: 'fe', name: '鐵', symbol: 'Fe', atomicNumber: 26, type: 'basic', rarity: 'common', description: '堅硬且強韌的金屬。', discovered: true },
];

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#94a3b8', // Slate 400
  uncommon: '#0aff00', // Neon Green
  rare: '#00f3ff', // Neon Blue
  epic: '#bd00ff', // Neon Purple
  legendary: '#fbbf24', // Amber 400 (Goldish)
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  uncommon: '罕見',
  rare: '稀有',
  epic: '史詩',
  legendary: '傳說',
};

export const CATALYSTS: Record<string, Catalyst> = {
  'stabilizer': {
    id: 'stabilizer',
    name: '量子穩定劑',
    description: '降低反應失敗的風險，但會稍微抑制變異。',
    effectDescription: '大幅提升成功率'
  },
  'accelerator': {
    id: 'accelerator',
    name: '高能粒子束',
    description: '注入高能量，提升產生稀有元素的機率。',
    effectDescription: '提升稀有度機率'
  },
  'mutagen': {
    id: 'mutagen',
    name: '虛空突變原',
    description: '極不穩定的物質，可能導致意想不到的結果。',
    effectDescription: '極高隨機性與史詩潛力'
  }
};

export const ACCESSORIES: Record<string, Accessory> = {
  'prism_lens': {
    id: 'prism_lens',
    name: '虛空稜鏡',
    description: '重組魔力光譜，稍微提升合成結果的品質。',
    effectDescription: '提升稀有度潛力',
    icon: 'triangle'
  },
  'core_stabilizer': {
    id: 'core_stabilizer',
    name: '穩定力場發生器',
    description: '保護熔爐核心，減少合成失敗的可能性。',
    effectDescription: '提升合成成功率',
    icon: 'shield'
  }
};

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: '初級合成師',
    description: '合成 3 種新的化合物。',
    condition: { type: 'discover_count', target: 3, current: 0 },
    reward: { resource: 'energy', amount: 20 },
    completed: false
  },
  {
    id: 'm2',
    title: '尋找光芒',
    description: '發現 1 個「罕見」或更高等級的元素。',
    condition: { type: 'find_rarity', target: 'uncommon', current: 0 },
    reward: { resource: 'energy', amount: 20 },
    completed: false
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'acc_prism',
    name: '組件: 虛空稜鏡',
    description: '永久升級。熔爐配件，可提升稀有度潛力。',
    cost: 100,
    currency: 'creativity',
    effectType: 'buy_accessory',
    value: 1,
    accessoryId: 'prism_lens'
  },
  {
    id: 'acc_stabilizer',
    name: '組件: 穩定力場',
    description: '永久升級。熔爐配件，確保反應穩定。',
    cost: 80,
    currency: 'creativity',
    effectType: 'buy_accessory',
    value: 1,
    accessoryId: 'core_stabilizer'
  },
  {
    id: 'cat_stabilizer',
    name: '購買: 量子穩定劑',
    description: '一組穩定劑 (3個)，確保實驗安全。',
    cost: 15,
    currency: 'creativity',
    effectType: 'buy_catalyst',
    value: 3,
    catalystId: 'stabilizer'
  },
  {
    id: 'cat_accelerator',
    name: '購買: 高能粒子束',
    description: '一組粒子束 (2個)，追求更高品質。',
    cost: 25,
    currency: 'creativity',
    effectType: 'buy_catalyst',
    value: 2,
    catalystId: 'accelerator'
  },
  {
    id: 'energy_pack',
    name: '高能電池組',
    description: '補充 50 單位能量。',
    cost: 20,
    currency: 'creativity',
    effectType: 'add_energy',
    value: 50
  },
  {
    id: 'insight_converter',
    name: '思維昇華模組',
    description: '將創造力轉化為 50 點洞察力數據。',
    cost: 30,
    currency: 'creativity',
    effectType: 'add_insight',
    value: 50
  }
];

export const generateRandomMission = (id: string): Mission => {
  const isDiscovery = Math.random() > 0.4; // 60% chance for discovery mission
  
  if (isDiscovery) {
      const target = 1;
      return {
          id,
          title: '實驗數據擴充',
          description: '合成 1 種新的化合物。',
          condition: { type: 'discover_count', target, current: 0 },
          reward: { resource: 'energy', amount: 20 },
          completed: false
      };
  } else {
      const rarities: Rarity[] = ['uncommon', 'rare', 'epic'];
      // Randomly pick rarity, weighted towards uncommon/rare
      const rIndex = Math.floor(Math.random() * 3); // 0, 1, 2
      // Reduce chance of epic slightly for ease
      const targetRarity = rarities[rIndex > 1 && Math.random() > 0.5 ? 1 : rIndex];
      
      const label = RARITY_LABELS[targetRarity];
      return {
          id,
          title: '稀有物質探勘',
          description: `發現一個「${label}」或更高等級的物質。`,
          condition: { type: 'find_rarity', target: targetRarity, current: 0 },
          reward: { resource: 'energy', amount: 20 },
          completed: false
      };
  }
};

export const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  'basic': <Atom className="w-4 h-4" />,
  'compound': <Droplet className="w-4 h-4" />,
  'rare': <Zap className="w-4 h-4" />,
  'danger': <Flame className="w-4 h-4" />
};

export const MAX_INPUT_SLOTS = 2;
export const INITIAL_ENERGY = 100;
export const INITIAL_INSIGHT = 0;
export const INITIAL_CREATIVITY = 30;
export const RARITY_UNLOCK_THRESHOLD = 100;
