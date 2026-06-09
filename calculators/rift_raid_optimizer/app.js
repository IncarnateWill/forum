import { 
  BUILTIN_SETS, optimize, loadInventory, saveInventory, 
  toggleItem, setQuantity, selectAllInSet, clearAllInSet, 
  getQuantity, isOwned, loadCustomSets, saveCustomSets,
  STAT_LABELS, STAT_ICONS
} from './logic.js';

// --- State ---
let inv = loadInventory();
let customSets = loadCustomSets();
let allSets = [...BUILTIN_SETS, ...customSets];
let results = [];
let isInventoryMode = true;

const ALL_STATS = [
  'frontCombatStrength', 'flankCombatStrength', 'flankUnitLimit', 'frontUnitLimit',
  'meleeAttack', 'rangedAttack', 'courtyardCombat', 'castleWallReduction',
  'gateReduction', 'additionalWaves', 'armyTravelSpeed', 'armyReturnSpeed', 'wallRegenCooldown'
];

let goals = ALL_STATS.map(stat => ({ stat, weight: 5, enabled: false }));

const PRESETS = [
  { name: 'Max Flank Limit', emoji: '🛡️', goals: { flankUnitLimit: 10, flankCombatStrength: 7, meleeAttack: 4 } },
  { name: 'Max Front Combat', emoji: '⚔️', goals: { frontCombatStrength: 10, frontUnitLimit: 7, rangedAttack: 5 } },
  { name: 'Gate Breaker', emoji: '🚪', goals: { gateReduction: 10, castleWallReduction: 8, courtyardCombat: 5 } },
  { name: 'Wave Pusher', emoji: '🌊', goals: { additionalWaves: 10, frontUnitLimit: 6, flankUnitLimit: 6 } },
  { name: 'Full Combat', emoji: '💥', goals: { frontCombatStrength: 8, flankCombatStrength: 8, meleeAttack: 7, rangedAttack: 7, courtyardCombat: 5 } },
];

const SLOT_ICONS = { armor: '🛡', weapon: '⚔️', helmet: '⛑️', artifact: '📖', hero: '👑', gem: '💎' };

// --- DOM Elements ---
const tabs = document.querySelectorAll('.tab-item');
const contents = document.querySelectorAll('.tab-content');
const invContainer = document.getElementById('inventoryContainer');
const invStats = document.getElementById('inventoryStats');
const goalsContainer = document.getElementById('goalsContainer');
const presetsContainer = document.getElementById('presetsContainer');
const activeGoalsCount = document.getElementById('activeGoalsCount');
const btnOptimizeInv = document.getElementById('btnOptimizeInv');
const btnOptimizeAll = document.getElementById('btnOptimizeAll');
const optHelpText = document.getElementById('optimizeHelpText');
const resultsContainer = document.getElementById('resultsContainer');
const resultsSubtitle = document.getElementById('resultsSubtitle');
const resultsCountBadge = document.getElementById('resultsCountBadge');

// --- Tab Logic ---
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

// --- Render Inventory ---
function renderInventory() {
  const ownedCount = Object.values(inv).filter(q => q > 0).length;
  const totalItems = allSets.reduce((a, s) => a + s.items.length, 0);
  invStats.textContent = `${ownedCount} / ${totalItems} owned`;

  invContainer.innerHTML = '';
  allSets.forEach(set => {
    const setOwnedCount = set.items.filter(i => isOwned(inv, i.id)).length;
    const tierClass = `tier-${set.tier}`;
    
    let html = `
      <div class="glass-card ${tierClass}">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-3">
            <span style="width:10px;height:10px;border-radius:50%;background:var(--tier-color);box-shadow:0 0 8px var(--tier-glow);"></span>
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <h3 class="h6 fw-bold text-white mb-0">${set.name}</h3>
                <span class="badge" style="background:var(--tier-glow);color:var(--tier-light);border:1px solid var(--tier-color)">${set.tier}</span>
              </div>
              <p class="text-secondary small mb-0 mt-1">${setOwnedCount}/${set.items.length} items owned</p>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn-secondary text-xs px-3 py-1" onclick="window.app.selectAll('${set.id}')">✓ All</button>
            <button class="btn-secondary text-xs px-3 py-1" onclick="window.app.clearAll('${set.id}')">✕ None</button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
    `;

    set.items.forEach(item => {
      const qty = getQuantity(inv, item.id);
      const owned = qty > 0;
      
      const statsHtml = Object.entries(item.stats).map(([k, v]) => `
        <span class="stat-pill">${STAT_ICONS[k]} +${v}${k==='additionalWaves'?' wave':k==='wallRegenCooldown'?'s':'%'}</span>
      `).join('');

      html += `
        <div class="item-card ${tierClass} ${owned ? 'owned' : ''}" onclick="window.app.toggle('${item.id}')">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="fs-5">${SLOT_ICONS[item.slot] || '•'}</span>
            <span class="text-white small fw-bold flex-1 truncate">${item.name}</span>
            <div class="qty-stepper" onclick="event.stopPropagation()">
              <button onclick="window.app.setQty('${item.id}', ${qty - 1})" ${qty <= 0 ? 'disabled' : ''}>-</button>
              <input type="number" min="0" max="99" value="${qty}" onchange="window.app.setQty('${item.id}', parseInt(this.value)||0)">
              <button onclick="window.app.setQty('${item.id}', ${qty + 1})">+</button>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-1">${statsHtml}</div>
          ${owned ? `<div style="position:absolute;top:8px;right:8px;font-size:10px;font-weight:bold;background:var(--tier-glow);color:var(--tier-light);padding:2px 4px;border-radius:4px;border:1px solid var(--tier-color)">x${qty}</div>` : ''}
        </div>
      `;
    });

    html += `</div>`;
    
    // Set Bonuses
    if (set.setBonuses.length > 0) {
      html += `<div class="mt-4 pt-3 border-top border-secondary">
        <p class="small fw-bold text-secondary mb-2">SET BONUSES</p>
        <div class="d-flex flex-wrap gap-2">`;
      set.setBonuses.forEach(bonus => {
        const active = setOwnedCount >= bonus.pieces;
        const statsStr = Object.entries(bonus.stats).map(([k,v]) => `+${v}${k==='additionalWaves'?' waves':'%'} ${STAT_LABELS[k]}`).join(', ');
        html += `<div class="px-3 py-1 rounded small" style="background:${active?'var(--tier-glow)':'rgba(14,22,42,0.5)'};border:1px solid ${active?'var(--tier-color)':'#333'};color:${active?'var(--tier-light)':'#6c757d'}">
          <span class="fw-bold">${bonus.pieces}pc:</span> ${statsStr}
        </div>`;
      });
      html += `</div></div>`;
    }

    html += `</div>`;
    invContainer.insertAdjacentHTML('beforeend', html);
  });
}

// --- Render Goals ---
function renderGoals() {
  // Presets
  presetsContainer.innerHTML = PRESETS.map((p, i) => `
    <button class="btn-secondary small" onclick="window.app.applyPreset(${i})">${p.emoji} ${p.name}</button>
  `).join('');

  // Goals List
  const enabledCount = goals.filter(g => g.enabled).length;
  activeGoalsCount.textContent = `${enabledCount} active`;
  
  goalsContainer.innerHTML = goals.map(g => `
    <div class="goal-item ${g.enabled ? 'enabled' : ''}">
      <button class="btn text-white p-0 d-flex align-items-center justify-content-center flex-shrink-0" 
              style="width:32px;height:32px;border-radius:8px;background:${g.enabled?'rgba(124,58,237,0.3)':'rgba(14,22,42,0.6)'};border:1px solid ${g.enabled?'rgba(124,58,237,0.5)':'#333'}"
              onclick="window.app.toggleGoal('${g.stat}')">
        ${STAT_ICONS[g.stat]}
      </button>
      <div class="flex-1 min-w-0">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="small fw-bold truncate" style="color:${g.enabled?'#e8eaf6':'#6c757d'}">${STAT_LABELS[g.stat]}</span>
          ${g.enabled ? `<span class="badge" style="background:rgba(124,58,237,0.2);color:var(--color-accent-light)">${g.weight}/10</span>` : ''}
        </div>
        ${g.enabled ? `<input type="range" class="form-range" min="1" max="10" value="${g.weight}" onchange="window.app.setGoalWeight('${g.stat}', this.value)">` : ''}
      </div>
    </div>
  `).join('');

  const btnDisabled = enabledCount === 0;
  btnOptimizeInv.disabled = btnDisabled;
  btnOptimizeAll.disabled = btnDisabled;
  optHelpText.style.display = btnDisabled ? 'block' : 'none';
}

// --- Render Results ---
function renderResults() {
  resultsCountBadge.textContent = results.length;
  if (results.length > 0) {
    resultsCountBadge.classList.remove('d-none');
    resultsSubtitle.textContent = `Found ${results.length} build${results.length===1?'':'s'} for your priorities.`;
  } else {
    resultsCountBadge.classList.add('d-none');
    resultsSubtitle.textContent = 'Run the optimizer to see the best loadouts.';
  }

  if (results.length === 0) {
    resultsContainer.innerHTML = `<div class="text-center text-secondary py-5">No results found. Adjust priorities or inventory.</div>`;
    return;
  }

  resultsContainer.innerHTML = results.map((res, idx) => {
    const slots = ['armor', 'weapon', 'helmet', 'artifact', 'hero'];
    
    let html = `<div class="result-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h5 fw-bold text-white mb-0">Build #${idx + 1} <span class="badge bg-secondary ms-2 text-xs">Score: ${Math.round(res.score)}</span></h3>
      </div>
      <div class="row g-3 mb-4">`;
      
    // Render equipment slots
    slots.forEach(s => {
      const item = res.loadout[s];
      if (item) {
        html += `<div class="col-12 col-sm-6 col-md-4">
          <div class="p-2 rounded" style="background:rgba(14,22,42,0.6);border:1px solid #333">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span>${SLOT_ICONS[s]}</span>
              <span class="small fw-bold text-white truncate">${item.name}</span>
            </div>
            <div class="text-xs text-secondary">${item.setName}</div>
          </div>
        </div>`;
      }
    });

    // Render Gems
    res.loadout.gems.forEach((gem, i) => {
      if (gem) {
        html += `<div class="col-12 col-sm-6 col-md-4">
          <div class="p-2 rounded" style="background:rgba(14,22,42,0.6);border:1px solid #333">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span>💎</span>
              <span class="small fw-bold text-white truncate">${gem.name}</span>
            </div>
            <div class="text-xs text-secondary">${gem.setName}</div>
          </div>
        </div>`;
      }
    });

    html += `</div>`;

    // Render Set Bonuses Applied
    if (res.setBonusesApplied.length > 0) {
      html += `<p class="small fw-bold text-secondary mb-2">ACTIVE SET BONUSES</p>
      <div class="d-flex flex-wrap gap-2 mb-4">`;
      res.setBonusesApplied.forEach(b => {
        html += `<div class="badge text-white px-2 py-1" style="background:rgba(124,58,237,0.3);border:1px solid rgba(124,58,237,0.5)">
          ${b.pieces}pc ${b.setName}
        </div>`;
      });
      html += `</div>`;
    }

    // Render Total Stats
    html += `<p class="small fw-bold text-secondary mb-2">TOTAL STATS</p>
    <div class="d-flex flex-wrap gap-2">`;
    Object.entries(res.totalStats).sort((a,b) => b[1]-a[1]).forEach(([k, v]) => {
      const isPriority = goals.find(g => g.stat === k && g.enabled);
      html += `<div class="px-2 py-1 rounded small d-flex align-items-center gap-1" style="${isPriority?'background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:var(--color-accent-light)':'background:rgba(255,255,255,0.05);color:#ccc'}">
        <span>${STAT_ICONS[k]}</span>
        <span class="fw-bold">${v}${k==='additionalWaves'?'w':k==='wallRegenCooldown'?'s':'%'}</span>
        <span class="text-xs ${isPriority?'':'opacity-75'}">${STAT_LABELS[k]}</span>
      </div>`;
    });
    html += `</div></div>`;
    
    return html;
  }).join('');
}


// --- Actions ---
window.app = {
  // Inventory
  toggle: (id) => { inv = toggleItem(inv, id); saveInventory(inv); renderInventory(); },
  setQty: (id, qty) => { inv = setQuantity(inv, id, qty); saveInventory(inv); renderInventory(); },
  selectAll: (setId) => { const set = allSets.find(s=>s.id===setId); if(set){ inv = selectAllInSet(inv, set.items); saveInventory(inv); renderInventory(); }},
  clearAll: (setId) => { const set = allSets.find(s=>s.id===setId); if(set){ inv = clearAllInSet(inv, set.items); saveInventory(inv); renderInventory(); }},
  
  // Goals
  applyPreset: (idx) => {
    const preset = PRESETS[idx];
    goals = ALL_STATS.map(stat => ({ stat, weight: preset.goals[stat] || 0, enabled: !!preset.goals[stat] }));
    renderGoals();
  },
  toggleGoal: (stat) => {
    const goal = goals.find(g => g.stat === stat);
    if(goal) { goal.enabled = !goal.enabled; renderGoals(); }
  },
  setGoalWeight: (stat, val) => {
    const goal = goals.find(g => g.stat === stat);
    const weight = parseInt(val, 10);
    if(goal) { goal.weight = weight; goal.enabled = weight > 0; renderGoals(); }
  }
};

// --- Optimizing ---
function runOptimizer(inventoryOnly) {
  btnOptimizeInv.disabled = true;
  btnOptimizeAll.disabled = true;
  
  // Slight delay for UI to update to loading state
  setTimeout(() => {
    isInventoryMode = inventoryOnly;
    results = optimize(goals, allSets, inventoryOnly ? inv : undefined);
    renderResults();
    switchTab('results');
    btnOptimizeInv.disabled = false;
    btnOptimizeAll.disabled = false;
  }, 50);
}

btnOptimizeInv.addEventListener('click', () => runOptimizer(true));
btnOptimizeAll.addEventListener('click', () => runOptimizer(false));

// --- Init ---
renderInventory();
renderGoals();
renderResults();
