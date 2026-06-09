import {
  BUILTIN_SETS, optimize,
  loadInventory, saveInventory,
  toggleItem, setQuantity, selectAllInSet, clearAllInSet,
  getQuantity, isOwned,
  loadCustomSets, saveCustomSets,
  STAT_LABELS, STAT_ICONS
} from './logic.js';

// ─── State ─────────────────────────────────────────────────────
let inv = loadInventory();
let customSets = loadCustomSets();
let allSets = [...BUILTIN_SETS, ...customSets];
let results = [];

const ALL_STATS = [
  'frontCombatStrength', 'flankCombatStrength', 'flankUnitLimit', 'frontUnitLimit',
  'meleeAttack', 'rangedAttack', 'courtyardCombat', 'castleWallReduction',
  'gateReduction', 'additionalWaves', 'armyTravelSpeed', 'armyReturnSpeed', 'wallRegenCooldown'
];

let goals = ALL_STATS.map(stat => ({ stat, weight: 5, enabled: false }));

const PRESETS = [
  { name: 'Max Flank Limit',   emoji: '🛡️', goals: { flankUnitLimit: 10, flankCombatStrength: 7, meleeAttack: 4 } },
  { name: 'Max Front Combat',  emoji: '⚔️', goals: { frontCombatStrength: 10, frontUnitLimit: 7, rangedAttack: 5 } },
  { name: 'Gate Breaker',      emoji: '🚪', goals: { gateReduction: 10, castleWallReduction: 8, courtyardCombat: 5 } },
  { name: 'Wave Pusher',       emoji: '🌊', goals: { additionalWaves: 10, frontUnitLimit: 6, flankUnitLimit: 6 } },
  { name: 'Full Combat',       emoji: '💥', goals: { frontCombatStrength: 8, flankCombatStrength: 8, meleeAttack: 7, rangedAttack: 7, courtyardCombat: 5 } },
];

const SLOT_ICONS = { armor: '🛡', weapon: '⚔️', helmet: '⛑️', artifact: '📖', hero: '👑', gem: '💎' };
const SLOT_LABELS = { armor: 'Armor', weapon: 'Weapon', helmet: 'Helmet', artifact: 'Artifact', hero: 'Hero', gem: 'Gem' };

// ─── DOM refs ───────────────────────────────────────────────────
const tabs        = document.querySelectorAll('.opt-tab-btn');
const contents    = document.querySelectorAll('.opt-tab-content');
const invContainer   = document.getElementById('inventoryContainer');
const invStats       = document.getElementById('inventoryStats');
const goalsContainer = document.getElementById('goalsContainer');
const presetsContainer = document.getElementById('presetsContainer');
const activeGoalsCount = document.getElementById('activeGoalsCount');
const btnOptimizeInv   = document.getElementById('btnOptimizeInv');
const btnOptimizeAll   = document.getElementById('btnOptimizeAll');
const optHelpText      = document.getElementById('optimizeHelpText');
const resultsContainer = document.getElementById('resultsContainer');
const resultsSubtitle  = document.getElementById('resultsSubtitle');
const resultsCountBadge = document.getElementById('resultsCountBadge');
const setsContainer    = document.getElementById('setsContainer');

// ─── Tab Navigation ─────────────────────────────────────────────
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.target}`).classList.add('active');
  });
});

function switchTab(target) {
  const tab = Array.from(tabs).find(t => t.dataset.target === target);
  if (tab) tab.click();
}

// ─── Render Inventory ───────────────────────────────────────────
function renderInventory() {
  const ownedCount = Object.values(inv).filter(q => q > 0).length;
  const totalItems = allSets.reduce((a, s) => a + s.items.length, 0);
  invStats.textContent = `${ownedCount} / ${totalItems} owned`;

  invContainer.innerHTML = '';
  allSets.forEach(set => {
    const setOwnedCount = set.items.filter(i => isOwned(inv, i.id)).length;
    const tierCls = set.tier;

    const wrapper = document.createElement('div');
    wrapper.className = 'collapse-area mb-2';

    // Header
    const header = document.createElement('h2');
    header.className = 'collapse-header';
    header.style.fontSize = '15px';
    header.innerHTML = `
      <span class="d-flex align-items-center gap-2 header-title">
        <span class="opt-tier-dot ${tierCls}"></span>
        ${set.name}
        <span class="opt-tier-badge ${tierCls}">${set.tier}</span>
        <span style="color:rgba(242,217,187,0.65);font-size:12px;font-weight:normal">${setOwnedCount}/${set.items.length}</span>
      </span>
      <span class="opt-set-actions">
        <button class="opt-set-btn" data-action="selectAll" data-setid="${set.id}">✓ All</button>
        <button class="opt-set-btn" data-action="clearAll"  data-setid="${set.id}">✕ None</button>
      </span>`;

    // Body
    const body = document.createElement('div');
    body.className = 'collapse show opt-section-body';
    body.style.cssText = 'background-color:rgb(180,127,92);border-radius:0 0 10px 10px;padding:10px;margin-bottom:0';

    // Item grid
    const grid = document.createElement('div');
    grid.className = 'opt-item-grid';

    set.items.forEach(item => {
      const qty = getQuantity(inv, item.id);
      const owned = qty > 0;

      const card = document.createElement('div');
      card.className = `opt-item-card${owned ? ' owned' : ''}`;
      card.dataset.itemId = item.id;

      const statHtml = Object.entries(item.stats).map(([k, v]) =>
        `<span class="opt-stat-pill">${STAT_ICONS[k] || ''} +${v}${k === 'additionalWaves' ? ' wave' : k === 'wallRegenCooldown' ? 's' : '%'}</span>`
      ).join('');

      card.innerHTML = `
        <div class="opt-item-card-top">
          <span class="opt-item-icon">${SLOT_ICONS[item.slot] || '•'}</span>
          <span class="opt-item-name">${item.name}</span>
          <div class="opt-qty-stepper" data-item-id="${item.id}" onclick="event.stopPropagation()">
            <button data-delta="-1" data-id="${item.id}" ${qty <= 0 ? 'disabled' : ''}>−</button>
            <input type="number" min="0" max="99" value="${qty}" data-id="${item.id}">
            <button data-delta="1" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="opt-stat-pills">${statHtml}</div>
        ${owned ? `<div class="opt-qty-badge">×${qty}</div>` : ''}
      `;

      // Toggle on card click (not on stepper)
      card.addEventListener('click', () => appActions.toggle(item.id));

      grid.appendChild(card);
    });

    body.appendChild(grid);

    // Set bonuses
    if (set.setBonuses.length > 0) {
      const bonusDiv = document.createElement('div');
      bonusDiv.className = 'opt-bonus-pills';
      set.setBonuses.forEach(bonus => {
        const active = setOwnedCount >= bonus.pieces;
        const statsStr = Object.entries(bonus.stats).map(([k, v]) =>
          `+${v}${k === 'additionalWaves' ? ' waves' : '%'} ${STAT_LABELS[k]}`
        ).join(', ');
        const pill = document.createElement('span');
        pill.className = `opt-bonus-pill${active ? ' active' : ''}`;
        pill.textContent = `${bonus.pieces}pc: ${statsStr}`;
        bonusDiv.appendChild(pill);
      });
      body.appendChild(bonusDiv);
    }

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    invContainer.appendChild(wrapper);
  });

  // Qty stepper events (delegated)
  invContainer.querySelectorAll('.opt-qty-stepper button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const delta = parseInt(btn.dataset.delta, 10);
      const current = getQuantity(inv, id);
      appActions.setQty(id, current + delta);
    });
  });

  invContainer.querySelectorAll('.opt-qty-stepper input').forEach(input => {
    input.addEventListener('change', e => {
      e.stopPropagation();
      const id = input.dataset.id;
      appActions.setQty(id, parseInt(input.value, 10) || 0);
    });
    input.addEventListener('click', e => e.stopPropagation());
  });

  // Select/Clear all buttons
  invContainer.querySelectorAll('.opt-set-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const { action, setid } = btn.dataset;
      if (action === 'selectAll') appActions.selectAll(setid);
      else appActions.clearAll(setid);
    });
  });
}

// ─── Render Goals ───────────────────────────────────────────────
function renderGoals() {
  // Presets
  presetsContainer.innerHTML = '';
  PRESETS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-preset-btn';
    btn.textContent = `${p.emoji} ${p.name}`;
    btn.addEventListener('click', () => appActions.applyPreset(i));
    presetsContainer.appendChild(btn);
  });

  // Goals
  const enabledCount = goals.filter(g => g.enabled).length;
  activeGoalsCount.textContent = `${enabledCount} active`;

  goalsContainer.innerHTML = '';
  goals.forEach(g => {
    const row = document.createElement('div');
    row.className = `opt-goal-row${g.enabled ? ' enabled' : ''}`;
    row.innerHTML = `
      <div class="opt-goal-toggle">${STAT_ICONS[g.stat] || '•'}</div>
      <div class="flex-fill">
        <div class="opt-goal-label">${STAT_LABELS[g.stat]}</div>
        ${g.enabled ? `<input type="range" class="opt-goal-range" min="1" max="10" value="${g.weight}" data-stat="${g.stat}">` : ''}
      </div>
      ${g.enabled ? `<span class="opt-goal-weight">${g.weight}/10</span>` : ''}
    `;

    // Toggle the whole row
    row.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return;
      appActions.toggleGoal(g.stat);
    });

    goalsContainer.appendChild(row);
  });

  // Slider events
  goalsContainer.querySelectorAll('.opt-goal-range').forEach(slider => {
    slider.addEventListener('input', e => {
      appActions.setGoalWeight(slider.dataset.stat, parseInt(slider.value, 10));
    });
  });

  const disabled = enabledCount === 0;
  btnOptimizeInv.disabled = disabled;
  btnOptimizeAll.disabled = disabled;
  optHelpText.style.display = disabled ? 'block' : 'none';
}

// ─── Render Results ─────────────────────────────────────────────
function renderResults() {
  resultsCountBadge.textContent = results.length;
  resultsCountBadge.style.display = results.length > 0 ? 'inline' : 'none';
  resultsSubtitle.textContent = results.length > 0
    ? `Found ${results.length} build${results.length === 1 ? '' : 's'} — sorted by optimization score.`
    : 'Run the optimizer to see the best loadouts.';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="opt-empty">No results found. Check your stat priorities or inventory.</div>';
    return;
  }

  const slots = ['armor', 'weapon', 'helmet', 'artifact', 'hero'];
  resultsContainer.innerHTML = results.map((res, idx) => {
    // Equipment slots
    const slotsHtml = slots.map(s => {
      const item = res.loadout[s];
      if (!item) return '';
      return `<div class="opt-result-slot">
        <div class="opt-result-slot-label">${SLOT_ICONS[s]} ${SLOT_LABELS[s]}</div>
        <div class="opt-result-slot-name">${item.name}</div>
        <div class="opt-result-slot-set">${item.setName}</div>
      </div>`;
    }).join('');

    // Gems
    const gemsHtml = res.loadout.gems.filter(Boolean).map(gem =>
      `<div class="opt-result-slot">
        <div class="opt-result-slot-label">💎 Gem</div>
        <div class="opt-result-slot-name">${gem.name}</div>
        <div class="opt-result-slot-set">${gem.setName}</div>
      </div>`
    ).join('');

    // Active set bonuses
    const bonusHtml = res.setBonusesApplied.length > 0 ? `
      <p class="opt-sub-header">ACTIVE SET BONUSES</p>
      <div class="opt-active-bonuses">
        ${res.setBonusesApplied.map(b => `<span class="opt-active-bonus">${b.pieces}pc ${b.setName}</span>`).join('')}
      </div>` : '';

    // Total stats
    const priorityStats = new Set(goals.filter(g => g.enabled).map(g => g.stat));
    const statsHtml = Object.entries(res.totalStats)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => {
        const isPriority = priorityStats.has(k);
        const unit = k === 'additionalWaves' ? 'w' : k === 'wallRegenCooldown' ? 's' : '%';
        return `<span class="opt-total-stat-pill${isPriority ? ' priority' : ''}">${STAT_ICONS[k] || ''} ${v}${unit} ${STAT_LABELS[k]}</span>`;
      }).join('');

    return `
      <div class="opt-result-card">
        <p class="opt-result-rank">Build #${idx + 1} <span style="font-size:13px;font-weight:bold;color:rgba(242,217,187,0.6)">— Score: ${Math.round(res.score)}</span></p>
        <div class="opt-result-slot-grid">${slotsHtml}${gemsHtml}</div>
        ${bonusHtml}
        <p class="opt-sub-header">TOTAL STATS</p>
        <div class="opt-total-stats-grid">${statsHtml}</div>
      </div>`;
  }).join('');
}

// ─── Render Sets Tab ────────────────────────────────────────────
function renderSets() {
  setsContainer.innerHTML = '';
  allSets.forEach(set => {
    const wrapper = document.createElement('div');
    wrapper.className = 'collapse-area mb-2';
    wrapper.innerHTML = `
      <h2 class="collapse-header" style="font-size:15px;">
        <span class="d-flex align-items-center gap-2 header-title">
          <span class="opt-tier-dot ${set.tier}"></span>
          ${set.name}
          <span class="opt-tier-badge ${set.tier}">${set.tier}</span>
          <span style="color:rgba(242,217,187,0.65);font-size:11px;font-weight:normal">${set.items.length} items</span>
        </span>
      </h2>
      <div class="collapse show" style="background-color:rgb(180,127,92);border-radius:0 0 10px 10px;padding:10px;">
        <p class="opt-sub-header" style="margin-top:0">SET BONUSES</p>
        <div class="opt-bonus-pills">
          ${set.setBonuses.map(b => {
            const statsStr = Object.entries(b.stats).map(([k,v]) =>
              `+${v}${k === 'additionalWaves' ? ' waves' : '%'} ${STAT_LABELS[k]}`).join(', ');
            return `<span class="opt-bonus-pill">${b.pieces}pc: ${statsStr}</span>`;
          }).join('')}
        </div>
        <p class="opt-sub-header">ITEMS</p>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${set.items.map(item =>
            `<span class="opt-stat-pill">${SLOT_ICONS[item.slot] || ''} ${item.name}</span>`
          ).join('')}
        </div>
      </div>`;
    setsContainer.appendChild(wrapper);
  });
}

// ─── Actions ────────────────────────────────────────────────────
const appActions = {
  toggle(id) {
    inv = toggleItem(inv, id);
    saveInventory(inv);
    renderInventory();
  },
  setQty(id, qty) {
    inv = setQuantity(inv, id, qty);
    saveInventory(inv);
    renderInventory();
  },
  selectAll(setId) {
    const set = allSets.find(s => s.id === setId);
    if (!set) return;
    inv = selectAllInSet(inv, set.items);
    saveInventory(inv);
    renderInventory();
  },
  clearAll(setId) {
    const set = allSets.find(s => s.id === setId);
    if (!set) return;
    inv = clearAllInSet(inv, set.items);
    saveInventory(inv);
    renderInventory();
  },
  applyPreset(idx) {
    const preset = PRESETS[idx];
    goals = ALL_STATS.map(stat => ({
      stat,
      weight: preset.goals[stat] || 0,
      enabled: !!preset.goals[stat]
    }));
    renderGoals();
  },
  toggleGoal(stat) {
    const goal = goals.find(g => g.stat === stat);
    if (goal) { goal.enabled = !goal.enabled; renderGoals(); }
  },
  setGoalWeight(stat, val) {
    const goal = goals.find(g => g.stat === stat);
    if (goal) { goal.weight = val; goal.enabled = val > 0; renderGoals(); }
  }
};

// ─── Optimizer Execution ────────────────────────────────────────
function runOptimizer(inventoryOnly) {
  btnOptimizeInv.disabled = true;
  btnOptimizeAll.disabled = true;
  setTimeout(() => {
    results = optimize(goals, allSets, inventoryOnly ? inv : undefined);
    renderResults();
    switchTab('results');
    const disabled = goals.filter(g => g.enabled).length === 0;
    btnOptimizeInv.disabled = disabled;
    btnOptimizeAll.disabled = disabled;
  }, 50);
}

btnOptimizeInv.addEventListener('click', () => runOptimizer(true));
btnOptimizeAll.addEventListener('click', () => runOptimizer(false));

// ─── Init ───────────────────────────────────────────────────────
renderInventory();
renderGoals();
renderResults();
renderSets();
