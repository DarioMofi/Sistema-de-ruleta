import { getNumberColor, getNeighbors, findAlgorithmsForNumber } from './data.js';

const COLOR_LABELS = { red: 'Rojo', black: 'Negro', green: 'Verde' };

export class Sidebar {
  constructor(container, onClear, onAlgoClick, onDelete) {
    this.container = container;
    this.onClear = onClear;
    this.onAlgoClick = onAlgoClick;
    this.onDelete = onDelete;
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
          <span class="legend-title">#0-#9: Algoritmos</span>
          <div class="legend-dots">
            <span class="legend-item"><span class="legend-dot base"></span>B (Base)</span>
            <span class="legend-item"><span class="legend-dot hueco"></span>H (Hueco)</span>
            <span class="legend-item"><span class="legend-dot extension"></span>E (Extensión)</span>
          </div>
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
      // Clic en cabecera de algoritmo
      const thAlgo = e.target.closest('.th-algo');
      if (thAlgo) {
        const algoId = parseInt(thAlgo.dataset.algoId);
        if (!isNaN(algoId) && this.onAlgoClick) {
          this.onAlgoClick(algoId);
        }
      }

      // Clic en celda marcada
      const matchedCell = e.target.closest('.trend-cell.matched');
      if (matchedCell) {
        const cellIndex = Array.from(matchedCell.parentNode.children).indexOf(matchedCell);
        const algoId = cellIndex - 4; // Primeros 4 son: N°, N, Color, Vecinos
        if (algoId >= 0 && algoId <= 9 && this.onAlgoClick) {
          this.onAlgoClick(algoId);
        }
      }

      // Clic en botón de borrar tirada individual
      const deleteBtn = e.target.closest('.delete-spin-btn');
      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        if (!isNaN(index) && this.onDelete) {
          this.onDelete(index);
        }
      }
    });
  }

  update(numbers) {
    const countEl = this.container.querySelector('.selected-count');
    const content = document.getElementById('sidebar-content');
    const n = numbers.length;

    countEl.textContent = `${n} número${n !== 1 ? 's' : ''} seleccionado${n !== 1 ? 's' : ''}`;

    // Botón Limpiar
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

    const rowsHtml = numbers.map((num, i) => {
      const color = getNumberColor(num);
      const neighbors = getNeighbors(num, 1);
      const algos = findAlgorithmsForNumber(num);

      // Diamantes estocásticos desalineados
      const isRed = color === 'red';
      const isBlack = color === 'black';
      const rCell = isRed ? `<span class="trend-diamond red">◆</span>` : '';
      const nCell = isBlack ? `<span class="trend-diamond black">◆</span>` : '';

      // Vecinos sin color (texto plano)
      const leftNeighbor = neighbors.left[0];
      const rightNeighbor = neighbors.right[0];
      const neighborsText = `${leftNeighbor} | ${rightNeighbor}`;

      const algoCells = Array.from({ length: 10 }, (_, algoId) => {
        const match = algos.find(a => a.id === algoId);
        if (!match) return `<td class="trend-cell empty">-</td>`;
        
        let letter = '';
        let cellCls = '';
        if (match.type === 'base') {
          letter = 'B';
          cellCls = 'base';
        } else if (match.type === 'hueco') {
          letter = 'H';
          cellCls = 'hueco';
        } else if (match.type === 'extension') {
          letter = 'E';
          cellCls = 'extension';
        }
        return `<td class="trend-cell matched ${cellCls}" title="${match.name}: ${match.type.toUpperCase()}">${letter}</td>`;
      }).join('');

      return `
        <tr class="trend-row" data-number="${num}">
          <td class="trend-cell num-col">
            <span class="trend-num-badge ${color}">${num}</span>
          </td>
          <td class="trend-cell r-col">${rCell}</td>
          <td class="trend-cell n-col">${nCell}</td>
          <td class="trend-cell neighbors-col">
            <span class="trend-neighbors-text">${neighborsText}</span>
          </td>
          ${algoCells}
          <td class="trend-cell action-col">
            <button class="delete-spin-btn" data-index="${i}" title="Borrar tirada">✕</button>
          </td>
        </tr>
      `;
    }).join('');

    content.innerHTML = `
      <div class="trend-table-wrapper">
        <table class="trend-table">
          <thead>
            <tr>
              <th class="th-num">N.o</th>
              <th class="th-color-r">R</th>
              <th class="th-color-n">N</th>
              <th class="th-neighbors">Vecinos</th>
              <th class="th-algo" data-algo-id="0">#0</th>
              <th class="th-algo" data-algo-id="1">#1</th>
              <th class="th-algo" data-algo-id="2">#2</th>
              <th class="th-algo" data-algo-id="3">#3</th>
              <th class="th-algo" data-algo-id="4">#4</th>
              <th class="th-algo" data-algo-id="5">#5</th>
              <th class="th-algo" data-algo-id="6">#6</th>
              <th class="th-algo" data-algo-id="7">#7</th>
              <th class="th-algo" data-algo-id="8">#8</th>
              <th class="th-algo" data-algo-id="9">#9</th>
              <th class="th-action"></th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Desplazar automáticamente la tabla de tendencias al final para ver la última tirada
    const wrapper = content.querySelector('.trend-table-wrapper');
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }
}
