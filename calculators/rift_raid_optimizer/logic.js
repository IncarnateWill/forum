// src/types/index.ts
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
var BUILTIN_SETS = [
  // ─── BRONZE DRAGON HUNTER (bronzeD) ───────────────────────────────────────
  {
    id: "bronze-dragon",
    name: "Bronze Dragon Hunter",
    tier: "bronze",
    category: "D",
    items: [
      {
        id: "bronze-dragon-armor",
        name: "Bronze Dragon Hunter Armor",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "armor",
        stats: {
          armyReturnSpeed: 50,
          rangedAttack: 330,
          meleeAttack: 380
        }
      },
      {
        id: "bronze-dragon-weapon",
        name: "Bronze Dragon Hunter Weapon",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "weapon",
        stats: {
          rangedAttack: 330,
          frontCombatStrength: 245,
          armyReturnSpeed: 50
        }
      },
      {
        id: "bronze-dragon-helmet",
        name: "Bronze Dragon Hunter Helmet",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "helmet",
        stats: {
          frontCombatStrength: 245,
          armyTravelSpeed: 50,
          flankCombatStrength: 380
        }
      },
      {
        id: "bronze-dragon-artifact",
        name: "Bronze Dragon Hunter Artifact",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "artifact",
        stats: {
          armyTravelSpeed: 50,
          rangedAttack: 330,
          meleeAttack: 380
        }
      },
      {
        id: "bronze-dragon-hero",
        name: "Legendary Dragon Commander (Bronze)",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "hero",
        stats: {
          additionalWaves: 1,
          courtyardCombat: 115,
          frontUnitLimit: 220,
          armyTravelSpeed: 100
        }
      },
      {
        id: "bronze-dragon-gemplate",
        name: "Bronze Dragon Hunter Gemplate",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          meleeAttack: 55
        }
      },
      {
        id: "bronze-dragon-shardblade",
        name: "Bronze Dragon Hunter Shardblade",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          rangedAttack: 55
        }
      },
      {
        id: "bronze-dragon-crownstone",
        name: "Bronze Dragon Hunter Crownstone",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          meleeAttack: 55
        }
      },
      {
        id: "bronze-dragon-relicstone",
        name: "Bronze Dragon Hunter Relicstone",
        setId: "bronze-dragon",
        setName: "Bronze Dragon Hunter",
        tier: "bronze",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          rangedAttack: 55
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { flankUnitLimit: 380 } },
      { pieces: 5, stats: { rangedAttack: 500 } },
      { pieces: 7, stats: { meleeAttack: 380 } },
      { pieces: 9, stats: { frontUnitLimit: 350 } }
    ]
  },
  // ─── SILVER DRAGON SLAYER (silverD) ────────────────────────────────────────
  {
    id: "silver-dragon",
    name: "Silver Dragon Slayer",
    tier: "silver",
    category: "D",
    items: [
      {
        id: "silver-dragon-armor",
        name: "Silver Dragon Slayer Armor",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "armor",
        stats: {
          armyReturnSpeed: 75,
          rangedAttack: 520,
          meleeAttack: 600
        }
      },
      {
        id: "silver-dragon-weapon",
        name: "Silver Dragon Slayer Weapon",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "weapon",
        stats: {
          rangedAttack: 520,
          frontCombatStrength: 385,
          armyReturnSpeed: 75
        }
      },
      {
        id: "silver-dragon-helmet",
        name: "Silver Dragon Slayer Helmet",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "helmet",
        stats: {
          frontCombatStrength: 380,
          armyTravelSpeed: 75,
          flankCombatStrength: 600
        }
      },
      {
        id: "silver-dragon-artifact",
        name: "Silver Dragon Slayer Artifact",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "artifact",
        stats: {
          armyTravelSpeed: 75,
          rangedAttack: 520,
          meleeAttack: 600
        }
      },
      {
        id: "silver-dragon-hero",
        name: "Legendary Dragon Commander (Silver)",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "hero",
        stats: {
          additionalWaves: 2,
          courtyardCombat: 180,
          frontUnitLimit: 345,
          armyTravelSpeed: 125
        }
      },
      {
        id: "silver-dragon-gemplate",
        name: "Silver Dragon Slayer Gemplate",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          wallRegenCooldown: 6,
          meleeAttack: 90
        }
      },
      {
        id: "silver-dragon-shardblade",
        name: "Silver Dragon Slayer Shardblade",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          wallRegenCooldown: 6,
          rangedAttack: 90
        }
      },
      {
        id: "silver-dragon-crownstone",
        name: "Silver Dragon Slayer Crownstone",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          wallRegenCooldown: 6,
          meleeAttack: 90
        }
      },
      {
        id: "silver-dragon-relicstone",
        name: "Silver Dragon Slayer Relicstone",
        setId: "silver-dragon",
        setName: "Silver Dragon Slayer",
        tier: "silver",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          wallRegenCooldown: 2,
          rangedAttack: 90
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { flankUnitLimit: 600 } },
      { pieces: 5, stats: { rangedAttack: 790 } },
      { pieces: 7, stats: { meleeAttack: 600 } },
      { pieces: 9, stats: { frontUnitLimit: 555 } }
    ]
  },
  // ─── GOLD DRAGON VANQUISHER (goldD) ────────────────────────────────────────
  {
    id: "gold-dragon",
    name: "Gold Dragon Vanquisher",
    tier: "gold",
    category: "D",
    items: [
      {
        id: "gold-dragon-armor",
        name: "Gold Dragon Vanquisher Armor",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "armor",
        stats: {
          armyReturnSpeed: 100,
          rangedAttack: 715,
          meleeAttack: 825
        }
      },
      {
        id: "gold-dragon-weapon",
        name: "Gold Dragon Vanquisher Weapon",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "weapon",
        stats: {
          rangedAttack: 715,
          frontCombatStrength: 530,
          armyReturnSpeed: 100
        }
      },
      {
        id: "gold-dragon-helmet",
        name: "Gold Dragon Vanquisher Helmet",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "helmet",
        stats: {
          frontCombatStrength: 530,
          armyTravelSpeed: 100,
          flankCombatStrength: 825
        }
      },
      {
        id: "gold-dragon-artifact",
        name: "Gold Dragon Vanquisher Artifact",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "artifact",
        stats: {
          armyTravelSpeed: 100,
          rangedAttack: 715,
          meleeAttack: 825
        }
      },
      {
        id: "gold-dragon-hero",
        name: "Legendary Dragon Commander (Gold)",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "hero",
        stats: {
          additionalWaves: 3,
          courtyardCombat: 250,
          frontUnitLimit: 475,
          armyTravelSpeed: 150
        }
      },
      {
        id: "gold-dragon-gemplate",
        name: "Gold Dragon Vanquisher Gemplate",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          wallRegenCooldown: 9,
          meleeAttack: 125
        }
      },
      {
        id: "gold-dragon-shardblade",
        name: "Gold Dragon Vanquisher Shardblade",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          wallRegenCooldown: 9,
          rangedAttack: 125
        }
      },
      {
        id: "gold-dragon-crownstone",
        name: "Gold Dragon Vanquisher Crownstone",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          wallRegenCooldown: 9,
          meleeAttack: 125
        }
      },
      {
        id: "gold-dragon-relicstone",
        name: "Gold Dragon Vanquisher Relicstone",
        setId: "gold-dragon",
        setName: "Gold Dragon Vanquisher",
        tier: "gold",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          wallRegenCooldown: 3,
          rangedAttack: 125
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { flankUnitLimit: 825 } },
      { pieces: 5, stats: { rangedAttack: 1080 } },
      { pieces: 7, stats: { meleeAttack: 825 } },
      { pieces: 9, stats: { frontUnitLimit: 760 } }
    ]
  },
  // ─── BRONZE zombie (bronzeZ) ─────────────────────────────────────────────
  {
    id: "bronze-zombie",
    name: "Bronze zombie",
    tier: "bronze",
    category: "Z",
    items: [
      {
        id: "bronze-zombie-armor",
        name: "Bronze zombie Armor",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "armor",
        stats: {
          rangedAttack: 200,
          armyTravelSpeed: 50,
          flankUnitLimit: 200,
          meleeAttack: 200
        }
      },
      {
        id: "bronze-zombie-weapon",
        name: "Bronze zombie Halberd",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "weapon",
        stats: {
          rangedAttack: 200,
          meleeAttack: 200,
          flankCombatStrength: 200,
          armyReturnSpeed: 50
        }
      },
      {
        id: "bronze-zombie-helmet",
        name: "Bronze zombie Helmet",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "helmet",
        stats: {
          frontCombatStrength: 200,
          armyTravelSpeed: 50,
          meleeAttack: 200,
          flankCombatStrength: 60
        }
      },
      {
        id: "bronze-zombie-artifact",
        name: "Bronze zombie Book",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "artifact",
        stats: {
          meleeAttack: 200,
          armyTravelSpeed: 50,
          frontUnitLimit: 200,
          rangedAttack: 200
        }
      },
      {
        id: "bronze-zombie-hero",
        name: "Radiant Soldier",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "hero",
        stats: {
          additionalWaves: 2,
          castleWallReduction: 400,
          gateReduction: 400,
          armyTravelSpeed: 50,
          courtyardCombat: 60,
          flankUnitLimit: 100
        }
      },
      {
        id: "bronze-zombie-bastion",
        name: "Bronze Bastion zombie",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          frontCombatStrength: 25,
          flankCombatStrength: 25
        }
      },
      {
        id: "bronze-zombie-vanguard",
        name: "Bronze Vanguard zombie",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          meleeAttack: 25
        }
      },
      {
        id: "bronze-zombie-marksman",
        name: "Bronze Marksman zombie",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          rangedAttack: 25
        }
      },
      {
        id: "bronze-zombie-courtyard",
        name: "Bronze Courtyard zombie",
        setId: "bronze-zombie",
        setName: "Bronze zombie",
        tier: "bronze",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          courtyardCombat: 25
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { castleWallReduction: 100 } },
      { pieces: 5, stats: { gateReduction: 100 } },
      { pieces: 7, stats: { castleWallReduction: 100 } },
      { pieces: 9, stats: { gateReduction: 100 } }
    ]
  },
  // ─── SILVER zombie (silverZ) ─────────────────────────────────────────────
  {
    id: "silver-zombie",
    name: "Silver zombie",
    tier: "silver",
    category: "Z",
    items: [
      {
        id: "silver-zombie-armor",
        name: "Silver zombie Armor",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "armor",
        stats: {
          rangedAttack: 400,
          armyTravelSpeed: 75,
          flankUnitLimit: 400,
          meleeAttack: 400
        }
      },
      {
        id: "silver-zombie-weapon",
        name: "Silver zombie Halberd",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "weapon",
        stats: {
          rangedAttack: 400,
          meleeAttack: 400,
          flankCombatStrength: 400,
          armyReturnSpeed: 75
        }
      },
      {
        id: "silver-zombie-helmet",
        name: "Silver zombie Helmet",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "helmet",
        stats: {
          frontCombatStrength: 400,
          armyTravelSpeed: 75,
          meleeAttack: 400,
          flankCombatStrength: 120
        }
      },
      {
        id: "silver-zombie-artifact",
        name: "Silver zombie Book",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "artifact",
        stats: {
          meleeAttack: 400,
          armyTravelSpeed: 75,
          frontUnitLimit: 400,
          rangedAttack: 400
        }
      },
      {
        id: "silver-zombie-hero",
        name: "Radiant Knight",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "hero",
        stats: {
          additionalWaves: 3,
          castleWallReduction: 500,
          gateReduction: 500,
          armyTravelSpeed: 75,
          courtyardCombat: 120,
          flankUnitLimit: 200
        }
      },
      {
        id: "silver-zombie-bastion",
        name: "Silver Bastion zombie",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          frontCombatStrength: 50,
          flankCombatStrength: 50
        }
      },
      {
        id: "silver-zombie-vanguard",
        name: "Silver Vanguard zombie",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          meleeAttack: 50
        }
      },
      {
        id: "silver-zombie-marksman",
        name: "Silver Marksman zombie",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          rangedAttack: 50
        }
      },
      {
        id: "silver-zombie-courtyard",
        name: "Silver Courtyard zombie",
        setId: "silver-zombie",
        setName: "Silver zombie",
        tier: "silver",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          courtyardCombat: 50
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { castleWallReduction: 200 } },
      { pieces: 5, stats: { gateReduction: 200 } },
      { pieces: 7, stats: { castleWallReduction: 200 } },
      { pieces: 9, stats: { gateReduction: 200 } }
    ]
  },
  // ─── GOLD zombie / RADIANT (goldZ) ──────────────────────────────────────
  {
    id: "gold-zombie",
    name: "Gold Radiant / zombie",
    tier: "gold",
    category: "Z",
    items: [
      {
        id: "gold-zombie-armor",
        name: "Gold Radiant Armor",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "armor",
        stats: {
          rangedAttack: 510,
          armyTravelSpeed: 100,
          flankUnitLimit: 510,
          meleeAttack: 510
        }
      },
      {
        id: "gold-zombie-weapon",
        name: "Gold zombie Halberd",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "weapon",
        stats: {
          rangedAttack: 510,
          meleeAttack: 510,
          flankCombatStrength: 510,
          armyReturnSpeed: 100
        }
      },
      {
        id: "gold-zombie-helmet",
        name: "Gold zombie Helmet",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "helmet",
        stats: {
          frontCombatStrength: 510,
          armyTravelSpeed: 100,
          meleeAttack: 510,
          flankCombatStrength: 155
        }
      },
      {
        id: "gold-zombie-artifact",
        name: "Gold zombie Book",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "artifact",
        stats: {
          meleeAttack: 510,
          armyTravelSpeed: 100,
          frontUnitLimit: 510,
          rangedAttack: 510
        }
      },
      {
        id: "gold-zombie-hero",
        name: "Radiant Warrior",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "hero",
        stats: {
          additionalWaves: 4,
          castleWallReduction: 510,
          gateReduction: 510,
          armyTravelSpeed: 100,
          courtyardCombat: 155,
          flankUnitLimit: 255
        }
      },
      {
        id: "gold-zombie-bastion",
        name: "Gold Bastion zombie",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "gem",
        gemSubType: "gemplate",
        stats: {
          frontCombatStrength: 75,
          flankCombatStrength: 75
        }
      },
      {
        id: "gold-zombie-vanguard",
        name: "Gold Vanguard zombie",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "gem",
        gemSubType: "shardblade",
        stats: {
          meleeAttack: 75
        }
      },
      {
        id: "gold-zombie-marksman",
        name: "Gold Marksman zombie",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "gem",
        gemSubType: "crownstone",
        stats: {
          rangedAttack: 75
        }
      },
      {
        id: "gold-zombie-courtyard",
        name: "Gold Courtyard zombie",
        setId: "gold-zombie",
        setName: "Gold Radiant / zombie",
        tier: "gold",
        slot: "gem",
        gemSubType: "relicstone",
        stats: {
          courtyardCombat: 75
        }
      }
    ],
    setBonuses: [
      { pieces: 3, stats: { castleWallReduction: 300 } },
      { pieces: 5, stats: { gateReduction: 300 } },
      { pieces: 7, stats: { castleWallReduction: 300 } },
      { pieces: 9, stats: { gateReduction: 300 } }
    ]
  }
];

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
  toggleItem
};
