
import { GoogleGenAI, Type } from "@google/genai";
import { ChemicalElement, ReactionResult, Catalyst, Accessory, VisualEffectType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateReaction = async (
  inputs: ChemicalElement[],
  catalyst: Catalyst | null = null,
  currentInsight: number = 0,
  accessory: Accessory | null = null
): Promise<ReactionResult> => {
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

  const inputNames = inputs.map(i => i.name).join(' + ');
  const catalystInfo = catalyst ? `Catalyst Used: ${catalyst.name}. Effect: ${catalyst.effectDescription}` : "No catalyst used.";
  const accessoryInfo = accessory ? `Furnace Accessory Equipped: ${accessory.name}. Effect: ${accessory.effectDescription}` : "No accessory equipped.";

  const systemInstruction = `
    You are the 'Neon Alchemy Engine', a high-tech chemistry simulator.
    Determine the result of combining elements/compounds.
    
    Inputs: ${inputNames}
    ${catalystInfo}
    ${accessoryInfo}
    Player Insight Level: ${currentInsight}

    IMPORTANT RULES:
    1. **STRICT SCIENTIFIC REALISM**: The result MUST be a REAL substance.
    2. **Accessory/Catalyst Logic**: Apply their effects to success rate and rarity.
    3. **Visual Effect Classification**:
       - 'fire': Explosives, fuels, high heat reactions, magma.
       - 'water': Liquids, coolants, oceans, ice, solutions.
       - 'electric': Batteries, conductors, magnets, energy sources.
       - 'bio': Organic matter, life forms, DNA, plants, toxins.
       - 'magic': (Rare/Epic only) Exotic particles, unstable isotopes, mysterious compounds.
       - 'metal': Pure metals, heavy alloys, crystals.
       - 'gas': Vapors, clouds, noble gases.
       - 'default': Dust, ash, stone, common materials.

    4. **Output**: Return all text fields in Traditional Chinese (繁體中文).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Simulate this reaction: ${inputNames}. Catalyst: ${catalyst ? catalyst.name : 'None'}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            productName: { type: Type.STRING },
            productSymbol: { type: Type.STRING },
            productDescription: { type: Type.STRING },
            productType: { type: Type.STRING, enum: ["basic", "compound", "rare"] },
            rarity: { type: Type.STRING, enum: ["common", "uncommon", "rare", "epic", "legendary"] },
            message: { type: Type.STRING },
            insightValue: { type: Type.INTEGER },
            visualColor: { type: Type.STRING },
            visualEffect: { type: Type.STRING, enum: ['fire', 'water', 'electric', 'bio', 'magic', 'metal', 'gas', 'default'] }
          },
          required: ["success", "message", "insightValue", "visualColor", "rarity", "visualEffect"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");

    if (result.success && result.productName) {
      const newProduct: ChemicalElement = {
        id: result.productName.toLowerCase().replace(/\s/g, '_'),
        name: result.productName,
        symbol: result.productSymbol || '?',
        atomicNumber: Math.floor(Math.random() * 100) + 1,
        type: result.productType || 'compound',
        rarity: result.rarity || 'common',
        description: result.productDescription || '未知物質',
        discovered: true
      };

      // Bonus calculations
      let bonusCreativity = 5;
      if (result.rarity === 'rare') bonusCreativity = 15;
      if (result.rarity === 'epic') bonusCreativity = 30;
      if (result.rarity === 'legendary') bonusCreativity = 60;

      return {
        success: true,
        product: newProduct,
        message: result.message,
        insightGained: result.insightValue || 10,
        creativityGained: bonusCreativity,
        energyCost: 10,
        visualColor: result.visualColor || '#ffffff',
        visualEffect: result.visualEffect || 'default',
        isNewDiscovery: true,
        rarity: result.rarity
      };
    } else {
      return {
        success: false,
        message: result.message || "反應失敗。無法形成穩定的化學結構。",
        insightGained: 2,
        creativityGained: 0,
        energyCost: 10,
        visualColor: '#333333',
        visualEffect: 'default',
        isNewDiscovery: false
      };
    }

  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return {
      success: false,
      message: "模擬錯誤：反應堆 AI 離線。",
      insightGained: 0,
      creativityGained: 0,
      energyCost: 0,
      isNewDiscovery: false
    };
  }
};
