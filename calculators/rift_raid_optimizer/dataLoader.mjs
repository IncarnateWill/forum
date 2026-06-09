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
    const gems = Array.isArray(items.gems) ? items.gems : items.gems?.gem || [];
    const setBonusesRaw = Array.isArray(items.equipment_sets) ? items.equipment_sets : items.equipment_sets?.equipmentSet || [];
    const effectsList = Array.isArray(items.effects) ? items.effects : items.effects?.effect || [];
    
    // Build effect ID to effect object map
    const effectById = {};
    effectsList.forEach(e => effectById[e.effectID] = e);
    
    // Grouping helper
    const normalizeSetId = (id) => String(id || "").trim();
    const byId = {};
    function ensure(id) {
        if (!byId[id]) {
            byId[id] = { id, equipments: [], gems: [], bonuses: [] };
        }
        return byId[id];
    }
    
    equipments.forEach(eq => {
        const setId = normalizeSetId(eq.setID);
        if (setId) ensure(setId).equipments.push(eq);
    });
    
    gems.forEach(gem => {
        const setId = normalizeSetId(gem.setID);
        if (setId) ensure(setId).gems.push(gem);
    });
    
    setBonusesRaw.forEach(bonus => {
        const setId = normalizeSetId(bonus.setID);
        if (setId) ensure(setId).bonuses.push(bonus);
    });
    
    const parseEffectsString = (effectStr, checkRiftRaid = false) => {
        const stats = {};
        let isRiftRaid = false;
        
        if (!effectStr) return { stats, isRiftRaid };
        const tokens = String(effectStr).split(',').map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const parts = token.split(':');
            if (parts.length < 2) continue;
            const effId = parts[0];
            const valStr = parts[1];
            
            const effectDef = effectById[effId];
            if (!effectDef) continue;
            
            const lowerName = effectDef.name.toLowerCase();
            if (lowerName.includes("rift raid event")) {
                isRiftRaid = true;
            }
            
            const mapped = mapEffectToStat(effectDef.name, valStr);
            if (mapped) {
                stats[mapped.key] = (stats[mapped.key] || 0) + mapped.value;
            }
        }
        return { stats, isRiftRaid };
    };
    
    const resultSets = [];
    
    for (const [setId, group] of Object.entries(byId)) {
        let hasRiftRaidStat = false;
        
        // Check if this set is a Rift Raid set
        group.bonuses.forEach(b => {
            if (b.effects) {
                const parsed = parseEffectsString(b.effects);
                if (parsed.isRiftRaid) hasRiftRaidStat = true;
            }
        });
        
        group.equipments.forEach(eq => {
            if (eq.effects) {
                const parsed = parseEffectsString(eq.effects);
                if (parsed.isRiftRaid) hasRiftRaidStat = true;
            }
        });
        
        if (!hasRiftRaidStat) continue;
        
        // Find name from lang
        const langKey = `equipment_set_${setId}`.toLowerCase();
        let setName = lang[langKey] || lang[`equipment_set_${setId}`];
        if (!setName) {
            // Fallback to equipment names or bonuses
            const fallbackEq = group.equipments.find(e => e.comment1);
            if (fallbackEq) setName = fallbackEq.comment1.replace(/\b(armor|weapon|helmet|artifact|hero)\b/ig, "").trim();
            else setName = `Set ${setId}`;
        }
        
        const lowerName = setName.toLowerCase();
        
        // Determine tier
        let tier = 'bronze';
        if (lowerName.includes('silver')) tier = 'silver';
        if (lowerName.includes('gold') || lowerName.includes('vanquisher') || lowerName.includes('radiant')) tier = 'gold';
        
        const cat = lowerName.includes('dragon') ? 'D' : lowerName.includes('zombie') || lowerName.includes('radiant') ? 'Z' : 'M';
        
        // Build items
        const setItems = group.equipments.map(eq => {
            const eqLangKey = `equipment_unique_${eq.equipmentID}`.toLowerCase();
            const eqName = lang[eqLangKey] || lang[`equipment_unique_${eq.equipmentID}`] || eq.comment2 || eq.comment1 || eq.name || `Item ${eq.equipmentID}`;
            
            let slot = "hero";
            if (eq.slotID == 1) slot = "helmet";
            if (eq.slotID == 2) slot = "armor";
            if (eq.slotID == 3) slot = "weapon";
            if (eq.slotID == 4) slot = "artifact";
            if (eq.slotID == 6) slot = "hero";
            
            const parsed = parseEffectsString(eq.effects);
            
            return {
                id: `eq_${eq.equipmentID}`,
                name: eqName,
                setId: `set_${setId}`,
                setName: setName,
                tier: tier,
                slot: slot,
                stats: parsed.stats
            };
        });
        
        // Build set bonuses
        const setBonuses = [];
        group.bonuses.forEach(b => {
            if (!b.effects) return;
            const req = parseInt(b.neededItems || b.pieces, 10);
            if (isNaN(req)) return;
            const parsed = parseEffectsString(b.effects);
            if (Object.keys(parsed.stats).length > 0) {
                setBonuses.push({ pieces: req, stats: parsed.stats });
            }
        });
        
        if (setItems.length === 0) continue;
        
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

