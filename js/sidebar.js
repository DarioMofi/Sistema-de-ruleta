import { getNumberColor, getNeighbors, findAlgorithmsForNumber } from './data.js';

const TYPE_CONFIG = {
  base:      { icon: '🔵', label: 'Base',      cls: 'type-base' },
  hueco:     { icon: '🟡', label: 'Hueco',     cls: 'type-hueco' },
  extension: { icon: '🟢', label: 'Extensión', cls: 'type-extension' }
};

const COLOR_LABELS = { red: 'Rojo', black: 'Negro', green: 'Verde' };

export class Sidebar {
  constructor(container, onClear, onAlgoClick) {
    this.container = container;
    this.onClear = onClear;
    this.onAlgoClick = onAlgoClick;
    this.renderShell();
    this.bindEvents();
  }

  renderShell() {
    this.container.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-header-left">
          <h2>📊 Análisis</h2>
          <p class="selected-count">0 números seleccionados</p>
        </div>
        <div class="legend">
          <span class="legend-item"><span class="legend-dot base"></span>Base</span>
          <span class="legend-item"><span class="legend-dot hueco"></span>Hueco</span>
          <span class="legend-item"><span class="legend-dot extension"></span>Extensión</span>
        </div>
      </div>
      <div class="sidebar-content" id="sidebar-content">
        <div class="empty-state">
          <div class="empty-icon">🎰</div>
          <p>Selecciona números en la mesa<br>para analizar algoritmos</p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const algoRow = e.target.closest('.algo-row');
      if (algoRow) {
        const algoId = parseInt(algoRow.dataset.id);
        if (!isNaN(algoId) && this.onAlgoClick) {
          this.onAlgoClick(algoId);
        }
      }
    });
  }

  update(numbers) {
    const countEl = this.container.querySelector('.selected-count');
    const content = document.getElementById('sidebar-content');
    const n = numbers.length;

    countEl.textContent = `${n} número${n !== 1 ? 's' : ''} seleccionado${n !== 1 ? 's' : ''}`;

    // Clear button management
    let clearBtn = this.container.querySelector('.clear-btn');
    if (n > 0 && !clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.className = 'clear-btn';
      clearBtn.textContent = '✕ Limpiar';
      clearBtn.addEventListener('click', () => this.onClear());
      this.container.querySelector('.sidebar-header-left').appendChild(clearBtn);
    } else if (n === 0 && clearBtn) {
      clearBtn.remove();
    }

    if (n === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎰</div>
          <p>Selecciona números en la mesa<br>para analizar algoritmos</p>
        </div>`;
      return;
    }

    content.innerHTML = numbers.map((num, i) => this.buildCard(num, i)).join('');
  }

  buildCard(num, idx) {
    const color = getNumberColor(num);
    const neighbors = getNeighbors(num, 1);
    const algos = findAlgorithmsForNumber(num);
    const leftDisp = [...neighbors.left].reverse();

    return `
      <div class="number-card" style="animation-delay:${idx * 0.06}s">
        <div class="card-header">
          <div class="card-title">
            <span class="num-badge ${color}">${num}</span>
            <span class="color-tag ${color}">${COLOR_LABELS[color]}</span>
          </div>
          <div class="neighbors-row">
            ${leftDisp.map(n => `<span class="nb ${getNumberColor(n)}">${n}</span>`).join('')}
            <span class="nb current ${color}">${num}</span>
            ${neighbors.right.map(n => `<span class="nb ${getNumberColor(n)}">${n}</span>`).join('')}
          </div>
          <span class="algo-count">${algos.length}<small>/10</small></span>
        </div>

        <div class="card-section">
          <h4>📋 Algoritmos</h4>
          ${algos.length > 0 ? `
            <div class="algo-list">
              ${algos.map(a => {
                const t = TYPE_CONFIG[a.type];
                return `
                  <div class="algo-row ${t.cls}" data-id="${a.id}">
                    <span class="algo-icon">${t.icon}</span>
                    <span class="algo-name">${a.name}</span>
                    <span class="algo-type-label">${t.label}</span>
                  </div>`;
              }).join('')}
            </div>
          ` : '<p class="no-match">No aparece en ningún algoritmo</p>'}
        </div>
      </div>`;
  }
}
