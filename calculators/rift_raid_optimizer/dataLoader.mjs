import { loadCoreData } from '../../overviews/shared/DataService.mjs';

// Map known English terms to our internal STAT keys
const STAT_NAME_MAP = {
  "melee": "meleeAttack",
  "ranged": "rangedAttack",
  "front combat strength": "frontCombatStrength",
  "flank combat strength": "flankCombatStrength",
  "flank unit limit": "flankUnitLimit",
  "front unit limit": "frontUnitLimit",
  "travel speed": "armyTravelSpeed",
  "return speed": "armyReturnSpeed",
  "courtyard": "courtyardCombat",
  "wall reduction": "castleWallReduction",
  "gate reduction": "gateReduction",
  "wave": "additionalWaves",
  "regen": "wallRegenCooldown"
};

function mapEffectToStat(effectName, valStr) {
    if (!effectName) return null;
    const lower = effectName.toLowerCase();
    
    let statKey = null;
    for (const [kw, key] of Object.entries(STAT_NAME_MAP)) {
        if (lower.includes(kw)) {
            statKey = key;
            break;
        }
    }
    
    if (!statKey) return null;
    
    // Extract numbers
    const num = parseFloat(String(valStr).replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return null;
    
    return { key: statKey, value: num };
}

export async function fetchDynamicSets() {
    const { items, lang } = await loadCoreData('en');
    
    const equipments = Array.isArray(items.equipments) ? items.equipments : items.equipments?.equipment || [];
    const sets = Array.isArray(items.equipment_sets) ? items.equipment_sets : items.equipment_sets?.equipmentSet || [];
    const effectsList = Array.isArray(items.effects) ? items.effects : items.effects?.effect || [];
    
    // Build effect ID to effect object map
    const effectById = {};
    effectsList.forEach(e => effectById[e.effectID] = e);
    
    // Group equipment by set
    const equipBySet = {};
    equipments.forEach(eq => {
        if (!eq.setID) return;
        if (!equipBySet[eq.setID]) equipBySet[eq.setID] = [];
        equipBySet[eq.setID].push(eq);
    });
    
    const parseEffectsString = (effectStr) => {
        const stats = {};
        if (!effectStr) return stats;
        const tokens = String(effectStr).split(',').map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const parts = token.split(':');
            if (parts.length < 2) continue;
            const effId = parts[0];
            const valStr = parts[1];
            
            const effectDef = effectById[effId];
            if (!effectDef) continue;
            
            const mapped = mapEffectToStat(effectDef.name, valStr);
            if (mapped) {
                stats[mapped.key] = (stats[mapped.key] || 0) + mapped.value;
            }
        }
        return stats;
    };
    
    const resultSets = [];
    
    // Target sets by their EN lang keys
    const targetKeywords = ['dragon hunter', 'dragon slayer', 'dragon vanquisher', 'zombie', 'radiant', 'fungal swarm'];
    
    for (const setDef of sets) {
        const setId = String(setDef.setID);
        
        // Find name from lang
        const langKey = `equipment_set_${setId}`.toLowerCase();
        const setName = lang[langKey] || lang[`equipment_set_${setId}`];
        if (!setName) continue;
        
        const lowerName = setName.toLowerCase();
        const isTarget = targetKeywords.some(kw => lowerName.includes(kw));
        
        if (!isTarget) continue;
        
        // Determine tier
        let tier = 'bronze';
        if (lowerName.includes('silver')) tier = 'silver';
        if (lowerName.includes('gold') || lowerName.includes('vanquisher') || lowerName.includes('radiant')) tier = 'gold';
        
        const cat = lowerName.includes('dragon') ? 'D' : lowerName.includes('zombie') || lowerName.includes('radiant') ? 'Z' : 'M';
        
        // Build items
        const setItems = (equipBySet[setId] || []).map(eq => {
            const eqLangKey = `equipment_name_${eq.equipmentID}`.toLowerCase();
            const eqName = lang[eqLangKey] || lang[`equipment_name_${eq.equipmentID}`] || `Item ${eq.equipmentID}`;
            
            let slot = "hero";
            if (eq.slotID == 1) slot = "helmet";
            if (eq.slotID == 2) slot = "armor";
            if (eq.slotID == 3) slot = "weapon";
            if (eq.slotID == 4) slot = "artifact";
            if (eq.slotID == 6) slot = "hero";
            
            return {
                id: `eq_${eq.equipmentID}`,
                name: eqName,
                setId: `set_${setId}`,
                setName: setName,
                tier: tier,
                slot: slot,
                stats: parseEffectsString(eq.effects)
            };
        });
        
        // Build set bonuses
        const setBonuses = [];
        if (setDef.bonuses) {
            const bArray = Array.isArray(setDef.bonuses) ? setDef.bonuses : setDef.bonuses.bonus || [];
            bArray.forEach(b => {
                if (!b.effects) return;
                const req = parseInt(b.pieces, 10);
                if (isNaN(req)) return;
                const st = parseEffectsString(b.effects);
                if (Object.keys(st).length > 0) {
                    setBonuses.push({ pieces: req, stats: st });
                }
            });
        }
        
        resultSets.push({
            id: `set_${setId}`,
            name: setName,
            tier: tier,
            category: cat,
            items: setItems,
            setBonuses: setBonuses
        });
    }
    
    // Sort bronze -> silver -> gold
    const tierOrder = { 'bronze': 1, 'silver': 2, 'gold': 3 };
    resultSets.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return tierOrder[a.tier] - tierOrder[b.tier];
    });
    
    return resultSets;
}
