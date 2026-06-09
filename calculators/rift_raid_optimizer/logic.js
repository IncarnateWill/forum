// src/types/index.ts
import { fetchDynamicSets } from './dataLoader.mjs';

var STAT_LABELS = {
  frontCombatStrength: "Front Combat Strength",
  flankCombatStrength: "Flank Combat Strength",
  flankUnitLimit: "Flank Unit Limit",
  frontUnitLimit: "Front Unit Limit",
  meleeAttack: "Melee Attack",
  rangedAttack: "Ranged Attack",
  armyTravelSpeed: "Army Travel Speed",
  armyReturnSpeed: "Army Return Speed",
  courtyardCombat: "Courtyard Combat",
  castleWallReduction: "Castle Wall Reduction",
  gateReduction: "Gate Reduction",
  additionalWaves: "Additional Waves",
  wallRegenCooldown: "Wall Regen Cooldown (s)"
};
var STAT_ICONS = {
  frontCombatStrength: "\u2694\uFE0F",
  flankCombatStrength: "\u{1F5E1}\uFE0F",
  flankUnitLimit: "\u{1F6E1}\uFE0F",
  frontUnitLimit: "\u{1F3F9}",
  meleeAttack: "\u26A1",
  rangedAttack: "\u{1F3AF}",
  armyTravelSpeed: "\u{1F4A8}",
  armyReturnSpeed: "\u{1F504}",
  courtyardCombat: "\u{1F3F0}",
  castleWallReduction: "\u{1F9F1}",
  gateReduction: "\u{1F6AA}",
  additionalWaves: "\u{1F30A}",
  wallRegenCooldown: "\u23F1\uFE0F"
};

// src/data/equipment.ts
var BUILTIN_SETS = [];

async function initLogic() {
  BUILTIN_SETS = await fetchDynamicSets();
}

// src/lib/storage.ts
var STORAGE_KEY_INVENTORY = "gge-inventory-v2";
var STORAGE_KEY_CUSTOM_SETS = "gge-custom-sets";
function loadInventory() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVENTORY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
function saveInventory(inv) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inv));
}
function getQuantity(inv, id) {
  return inv[id] ?? 0;
}
function isOwned(inv, id) {
  return getQuantity(inv, id) > 0;
}
function setQuantity(inv, id, qty) {
  const clamped = Math.max(0, Math.min(99, qty));
  if (clamped === 0) {
    const next = { ...inv };
    delete next[id];
    return next;
  }
  return { ...inv, [id]: clamped };
}
function toggleItem(inv, id) {
  return setQuantity(inv, id, isOwned(inv, id) ? 0 : 1);
}
function selectAllInSet(inv, items) {
  const next = { ...inv };
  for (const item of items) {
    if (!isOwned(next, item.id)) next[item.id] = 1;
  }
  return next;
}
function clearAllInSet(inv, items) {
  const next = { ...inv };
  for (const item of items) {
    delete next[item.id];
  }
  return next;
}
function loadCustomSets() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SETS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveCustomSets(sets) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_CUSTOM_SETS, JSON.stringify(sets));
}

// src/lib/optimizer.ts
function mergeStats(a, b) {
  const result = { ...a };
  for (const key of Object.keys(b)) {
    result[key] = (result[key] ?? 0) + (b[key] ?? 0);
  }
  return result;
}
function calculateSetBonuses(items, allSets) {
  const pieceCounts = {};
  for (const item of items) {
    if (!item) continue;
    pieceCounts[item.setId] = (pieceCounts[item.setId] ?? 0) + 1;
  }
  let bonusStats = {};
  const applied = [];
  for (const set of allSets) {
    const count = pieceCounts[set.id] ?? 0;
    if (count === 0) continue;
    for (const bonus of set.setBonuses) {
      if (count >= bonus.pieces) {
        bonusStats = mergeStats(bonusStats, bonus.stats);
        applied.push({
          setId: set.id,
          setName: set.name,
          pieces: bonus.pieces,
          bonusStats: bonus.stats
        });
      }
    }
  }
  return { bonusStats, applied };
}
function scoreStats(stats, goals) {
  let score = 0;
  for (const goal of goals) {
    if (!goal.enabled) continue;
    const val = stats[goal.stat] ?? 0;
    score += val * goal.weight;
  }
  return score;
}
function pickBestGems(gemsPool, goals, inv) {
  if (gemsPool.length === 0) return [];
  const scored = gemsPool.map((g) => ({ gem: g, rawScore: scoreStats(g.stats, goals) })).sort((a, b) => b.rawScore - a.rawScore);
  const remaining = {};
  for (const { gem } of scored) {
    remaining[gem.id] = inv ? getQuantity(inv, gem.id) : 4;
    if (remaining[gem.id] === 0) remaining[gem.id] = inv ? 0 : 4;
  }
  const result = [];
  for (let slot = 0; slot < 4; slot++) {
    const pick = scored.find(({ gem }) => (remaining[gem.id] ?? 0) > 0);
    if (!pick) break;
    result.push(pick.gem);
    remaining[pick.gem.id]--;
  }
  return result;
}
function optimize(goals, allSets, inv) {
  const filterItem = (item) => !inv || isOwned(inv, item.id);
  const getItems = (slot) => allSets.flatMap((s) => s.items).filter((i) => i.slot === slot && filterItem(i));
  const allGems = allSets.flatMap((s) => s.items).filter((i) => i.slot === "gem");
  const gemsPool = inv ? allGems.filter((g) => isOwned(inv, g.id)) : allGems;
  const armors = getItems("armor");
  const weapons = getItems("weapon");
  const helmets = getItems("helmet");
  const artifacts = getItems("artifact");
  const heroes = getItems("hero");
  if (armors.length === 0 || weapons.length === 0 || helmets.length === 0 || artifacts.length === 0) {
    return [];
  }
  const results = [];
  const heroList = heroes.length > 0 ? heroes : [null];
  for (const armor of armors) {
    for (const weapon of weapons) {
      for (const helmet of helmets) {
        for (const artifact of artifacts) {
          for (const hero of heroList) {
            const gems = pickBestGems(gemsPool, goals, inv);
            const allItems = [armor, weapon, helmet, artifact, hero, ...gems];
            let totalStats = {};
            for (const item of allItems) {
              if (item) totalStats = mergeStats(totalStats, item.stats);
            }
            const { bonusStats, applied } = calculateSetBonuses(allItems, allSets);
            totalStats = mergeStats(totalStats, bonusStats);
            results.push({
              loadout: { armor, weapon, helmet, artifact, hero, gems },
              totalStats,
              setBonusesApplied: applied,
              score: scoreStats(totalStats, goals)
            });
          }
        }
      }
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 10);
}
function theoreticalBest(goals, allSets) {
  return optimize(goals, allSets, void 0);
}
export {
  BUILTIN_SETS,
  STAT_ICONS,
  STAT_LABELS,
  calculateSetBonuses,
  clearAllInSet,
  getQuantity,
  isOwned,
  loadCustomSets,
  loadInventory,
  mergeStats,
  optimize,
  saveCustomSets,
  saveInventory,
  selectAllInSet,
  setQuantity,
  theoreticalBest,
  toggleItem,
  initLogic
};
