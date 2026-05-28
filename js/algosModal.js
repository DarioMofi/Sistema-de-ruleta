import { ALGORITHMS, getNumberColor } from './data.js';

export class AlgosModal {
  constructor() {
    this.activeAlgoId = 0;
    this.createDom();
    this.bindEvents();
  }

  createDom() {
    if (document.getElementById('algos-modal')) return;

    this.overlay = document.createElement('div');
    this.overlay.id = 'algos-modal';
    this.overlay.className = 'modal-overlay';

    this.overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>📋 Visor de Algoritmos</h3>
          <button class="close-modal-btn" id="close-modal-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="algo-tabs" id="algo-tabs">
            ${Object.entries(ALGORITHMS).map(([id, algo]) => `
              <button class="tab-btn" data-id="${id}">#${id}</button>
            `).join('')}
          </div>

          <div class="algo-info-panel">
            <div class="algo-info-left">
              <h4 id="modal-algo-name">Algoritmo 0</h4>
              <p id="modal-algo-desc">Cargando detalles...</p>
            </div>
            <div class="algo-legend">
              <span class="algo-legend-item"><span class="legend-dot base"></span> Base</span>
              <span class="algo-legend-item"><span class="legend-dot hueco"></span> Hueco</span>
              <span class="algo-legend-item"><span class="legend-dot extension"></span> Extensión</span>
            </div>
          </div>

          <div class="table-wrapper non-interactive-table" id="modal-table-container">
            <!-- Mesa estática inyectada dinámicamente -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.tabsContainer = document.getElementById('algo-tabs');
    this.modalTableName = document.getElementById('modal-algo-name');
    this.modalTableDesc = document.getElementById('modal-algo-desc');
    this.modalTableContainer = document.getElementById('modal-table-container');
  }

  bindEvents() {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    document.getElementById('close-modal-btn').addEventListener('click', () => this.close());

    this.tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-btn');
      if (tab) {
        const id = parseInt(tab.dataset.id);
        this.selectAlgo(id);
      }
    });
  }

  open(algoId = 0) {
    this.overlay.classList.add('active');
    this.selectAlgo(algoId);
  }

  close() {
    this.overlay.classList.remove('active');
  }

  selectAlgo(id) {
    this.activeAlgoId = id;
    
    this.tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      const btnId = parseInt(btn.dataset.id);
      btn.classList.toggle('active', btnId === id);
    });

    const algo = ALGORITHMS[id];
    this.modalTableName.textContent = algo.name;

    const totalCovered = algo.base.length + algo.hueco.length + algo.extension.length;
    this.modalTableDesc.textContent = 
      `Cubre un total de ${totalCovered} números (${algo.base.length} Base, ${algo.hueco.length} Hueco, ${algo.extension.length} Extensión) de los 37 en total.`;

    this.renderTable(algo);
  }

  renderTable(algo) {
    this.modalTableContainer.innerHTML = '';

    const table = document.createElement('div');
    table.className = 'roulette-table';

    // Celda del cero
    const zeroCell = this.createCell(0, algo);
    zeroCell.classList.add('zero-cell');
    zeroCell.style.gridColumn = '1';
    zeroCell.style.gridRow = '1 / 4';
    table.appendChild(zeroCell);

    // Celdas numéricas (3 filas × 12 columnas)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const num = (3 - row) + col * 3;
        const cell = this.createCell(num, algo);
        cell.style.gridColumn = `${col + 2}`;
        cell.style.gridRow = `${row + 1}`;
        table.appendChild(cell);
      }
    }

    // Columnas 2:1 (decorativo)
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('div');
      c.className = 'col-bet';
      c.textContent = '2:1';
      c.style.gridColumn = '14';
      c.style.gridRow = `${i + 1}`;
      table.appendChild(c);
    }

    // Decenas (decorativo)
    ['1st 12', '2nd 12', '3rd 12'].forEach((text, i) => {
      const d = document.createElement('div');
      d.className = 'dozen-cell';
      d.textContent = text;
      d.style.gridColumn = `${i * 4 + 2} / ${i * 4 + 6}`;
      d.style.gridRow = '4';
      table.appendChild(d);
    });

    // Apuestas simples (decorativo)
    const bets = [
      { text: '1-18', cls: '' },
      { text: 'PAR', cls: '' },
      { text: '◆', cls: 'red-diamond' },
      { text: '◆', cls: 'black-diamond' },
      { text: 'IMPAR', cls: '' },
      { text: '19-36', cls: '' }
    ];
    bets.forEach((b, i) => {
      const c = document.createElement('div');
      c.className = `even-cell ${b.cls}`.trim();
      c.textContent = b.text;
      c.style.gridColumn = `${i * 2 + 2} / ${i * 2 + 4}`;
      c.style.gridRow = '5';
      table.appendChild(c);
    });

    this.modalTableContainer.appendChild(table);
  }

  createCell(num, algo) {
    const cell = document.createElement('div');
    cell.className = `table-cell ${getNumberColor(num)}`;
    
    if (algo.base.includes(num)) {
      cell.classList.add('algo-base');
    } else if (algo.hueco.includes(num)) {
      cell.classList.add('algo-hueco');
    } else if (algo.extension.includes(num)) {
      cell.classList.add('algo-extension');
    }

    const span = document.createElement('span');
    span.textContent = num;
    cell.appendChild(span);

    return cell;
  }
}
