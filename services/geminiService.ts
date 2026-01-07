
import { ChemicalElement, ReactionResult, Catalyst, Accessory, VisualEffectType, Rarity } from '../types';

/**
 * 本地配方表 - 確保核心化學反應的準確性
 */
const RECIPE_BOOK: Record<string, { 
  name: string, 
  symbol: string, 
  type: 'basic' | 'compound' | 'rare', 
  rarity: Rarity, 
  effect: VisualEffectType, 
  desc: string 
}> = {
  'h+o': { name: '水', symbol: 'H2O', type: 'compound', rarity: 'common', effect: 'water', desc: '生命之源，最完美的溶劑。' },
  'c+o': { name: '二氧化碳', symbol: 'CO2', type: 'compound', rarity: 'common', effect: 'gas', desc: '植物呼吸的必需品。' },
  'h+c': { name: '甲烷', symbol: 'CH4', type: 'compound', rarity: 'uncommon', effect: 'fire', desc: '簡單的碳氫化合物，極度易燃。' },
  'c+fe': { name: '鋼鐵', symbol: 'Steel', type: 'compound', rarity: 'uncommon', effect: 'metal', desc: '經過碳強化的鐵，工業的骨架。' },
  'fe+o': { name: '氧化鐵', symbol: 'Fe2O3', type: 'compound', rarity: 'common', effect: 'default', desc: '俗稱鐵鏽，氧化的金屬產物。' },
  'h+h': { name: '純氫氣', symbol: 'H2', type: 'basic', rarity: 'common', effect: 'gas', desc: '高度不穩定的雙原子分子。' },
  'o+o': { name: '臭氧', symbol: 'O3', type: 'rare', rarity: 'rare', effect: 'magic', desc: '罕見的氧同素異形體，具有強氧化性。' },
  'c+c': { name: '石墨', symbol: 'Graphite', type: 'basic', rarity: 'uncommon', effect: 'default', desc: '純碳結構，導電且質軟。' }
};

export const simulateReaction = async (
  inputs: ChemicalElement[],
  catalyst: Catalyst | null = null,
  currentInsight: number = 0,
  accessory: Accessory | null = null
): Promise<ReactionResult> => {
  // 基礎驗證
  if (inputs.length < 2) {
    return {
      success: false,
      message: "至少需要兩種元素才能進行反應。",
      insightGained: 0,
      creativityGained: 0,
      energyCost: 0,
      isNewDiscovery: false,
    };
  }

  // 排序輸入元素 ID 以便查詢配方
  const recipeKey = inputs.map(i => i.id).sort().join('+');
  const recipe = RECIPE_BOOK[recipeKey];

  // 計算成功率基礎 (如果有組件或催化劑會提升)
  let successChance = 0.85; // 基礎 85%
  if (catalyst?.id === 'stabilizer') successChance += 0.15;
  if (accessory?.id === 'core_stabilizer') successChance += 0.1;

  const isSuccess = Math.random() < successChance;

  if (isSuccess && recipe) {
    // 發現配方中的物質
    const product: ChemicalElement = {
      id: recipe.symbol.toLowerCase().replace(/\s/g, '_'),
      name: recipe.name,
      symbol: recipe.symbol,
      atomicNumber: inputs.reduce((acc, curr) => acc + curr.atomicNumber, 0),
      type: recipe.type,
      rarity: recipe.rarity,
      description: recipe.desc,
      discovered: true
    };

    // 根據稀有度計算獎勵
    let bonusCreativity = 5;
    if (recipe.rarity === 'rare') bonusCreativity = 20;
    if (recipe.rarity === 'epic') bonusCreativity = 40;

    return {
      success: true,
      product,
      message: `反應成功！獲得了「${recipe.name}」。`,
      insightGained: 15,
      creativityGained: bonusCreativity,
      energyCost: 10,
      visualColor: recipe.rarity === 'rare' ? '#00f3ff' : recipe.rarity === 'uncommon' ? '#0aff00' : '#94a3b8',
      visualEffect: recipe.effect,
      isNewDiscovery: true,
      rarity: recipe.rarity
    };
  } else if (isSuccess) {
    // 生成隨機「不穩定物質」 (當沒有對應配方時)
    const fallbackId = `iso_${inputs.map(i => i.symbol).join('')}`;
    const product: ChemicalElement = {
      id: fallbackId,
      name: '不穩定同位素',
      symbol: 'Un?',
      atomicNumber: inputs.reduce((acc, curr) => acc + curr.atomicNumber, 0),
      type: 'compound',
      rarity: 'common',
      description: '一種由多種元素強行聚合而成的臨時物質，結構極其不穩。',
      discovered: true
    };

    return {
      success: true,
      product,
      message: "反應產生了意料之外的不穩定聚合物。",
      insightGained: 5,
      creativityGained: 2,
      energyCost: 10,
      visualColor: '#64748b',
      visualEffect: 'default',
      isNewDiscovery: true,
      rarity: 'common'
    };
  } else {
    // 反應失敗
    return {
      success: false,
      message: "分子結構崩解，未能形成穩定的產物。",
      insightGained: 2,
      creativityGained: 0,
      energyCost: 10,
      visualColor: '#334155',
      visualEffect: 'default',
      isNewDiscovery: false
    };
  }
};
