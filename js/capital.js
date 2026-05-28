export class CapitalTable {
  constructor(container) {
    this.container = container;
    this.startingCapital = 0;
    this.bets = [
      { id: 1, betAmount: 0, winAmount: 0 }
    ];
    this.nextId = 2;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="capital-card">
        <div class="capital-header">
          <h2>📊 Capital & Status</h2>
        </div>

        <div class="capital-input-group">
          <label for="starting-capital-input">INICIO DE CAPITAL</label>
          <div class="input-wrapper">
            <span class="currency-prefix">$</span>
            <input type="number" id="starting-capital-input" value="${this.startingCapital}" min="1" step="any">
          </div>
        </div>

        <div class="bets-table-container">
          <div class="bets-table-header">
            <div class="col-fila">FILA</div>
            <div class="col-apuesta">APUESTA</div>
            <div class="col-ganando">GANANDO</div>
            <div class="col-margen">MARGEN</div>
            <div class="col-action"></div>
          </div>
          <div id="bets-rows-container" class="bets-rows-container">
            <!-- Dynamic rows will be inserted here -->
          </div>
        </div>

        <button id="add-bet-btn" class="add-bet-btn">+ AGREGAR APUESTA</button>

        <div class="summary-divider"></div>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">TOTAL DÍA</span>
            <div class="summary-value" id="total-dia-val">$0</div>
          </div>
          <div class="summary-item">
            <span class="summary-label">TOTAL MARGEN</span>
            <div class="summary-value" id="total-margen-val">$0</div>
          </div>
          <div class="summary-item percent-item">
            <span class="summary-label">% DÍA</span>
            <div class="summary-value" id="percent-dia-val">0%</div>
          </div>
        </div>

        <div id="recommendation-box" class="recommendation-box">
          <!-- Dynamic recommendation text here -->
        </div>
      </div>
    `;

    // Cache elements
    this.rowsContainer = document.getElementById('bets-rows-container');
    this.startingCapitalInput = document.getElementById('starting-capital-input');
    this.addBetBtn = document.getElementById('add-bet-btn');
    
    // Bind global events
    this.startingCapitalInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.startingCapital = isNaN(val) ? 0 : val;
      this.calculate();
    });

    this.addBetBtn.addEventListener('click', () => this.addRow());

    // Initial render of rows
    this.renderRows();
  }

  renderRows() {
    this.rowsContainer.innerHTML = '';
    this.bets.forEach(bet => {
      const row = this.createRowElement(bet);
      this.rowsContainer.appendChild(row);
    });
    this.calculate();
  }

  createRowElement(bet) {
    const row = document.createElement('div');
    row.className = 'bet-row';
    row.dataset.id = bet.id;

    // Fila badge
    const colFila = document.createElement('div');
    colFila.className = 'col-fila row-badge';
    colFila.textContent = `#${this.bets.indexOf(bet) + 1}`;

    // Apuesta input
    const colApuesta = document.createElement('div');
    colApuesta.className = 'col-apuesta';
    const inputApuesta = document.createElement('input');
    inputApuesta.type = 'number';
    inputApuesta.value = bet.betAmount;
    inputApuesta.min = '0';
    inputApuesta.step = 'any';
    inputApuesta.className = 'row-input';
    inputApuesta.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      bet.betAmount = isNaN(val) ? 0 : val;
      this.updateRowCalculations(bet.id, row);
    });
    colApuesta.appendChild(inputApuesta);

    // Ganando input
    const colGanando = document.createElement('div');
    colGanando.className = 'col-ganando';
    const inputGanando = document.createElement('input');
    inputGanando.type = 'number';
    inputGanando.value = bet.winAmount;
    inputGanando.min = '0';
    inputGanando.step = 'any';
    inputGanando.className = 'row-input';
    inputGanando.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      bet.winAmount = isNaN(val) ? 0 : val;
      this.updateRowCalculations(bet.id, row);
    });
    colGanando.appendChild(inputGanando);

    // Margen label
    const colMargen = document.createElement('div');
    colMargen.className = 'col-margen row-margen-val';
    
    // Delete action button
    const colAction = document.createElement('div');
    colAction.className = 'col-action';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-row-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.addEventListener('click', () => this.deleteRow(bet.id));
    colAction.appendChild(deleteBtn);

    row.appendChild(colFila);
    row.appendChild(colApuesta);
    row.appendChild(colGanando);
    row.appendChild(colMargen);
    row.appendChild(colAction);

    // Set initial margin calculation style
    this.updateRowCalculations(bet.id, row, false);

    return row;
  }

  addRow() {
    this.bets.push({
      id: this.nextId++,
      betAmount: 0,
      winAmount: 0
    });
    this.renderRows();
    
    // Auto-scroll to bottom of the rows container
    this.rowsContainer.scrollTop = this.rowsContainer.scrollHeight;
  }

  deleteRow(id) {
    // Keep at least one row
    if (this.bets.length <= 1) {
      this.bets = [{ id: this.nextId++, betAmount: 0, winAmount: 0 }];
    } else {
      this.bets = this.bets.filter(b => b.id !== id);
    }
    this.renderRows();
  }

  updateRowCalculations(id, rowElement, triggerGlobalCalc = true) {
    const bet = this.bets.find(b => b.id === id);
    if (!bet) return;

    const margen = bet.winAmount - bet.betAmount;
    const margenEl = rowElement.querySelector('.row-margen-val');

    margenEl.textContent = `$${margen.toFixed(1).replace(/\.0$/, '')}`;
    
    if (margen > 0) {
      margenEl.className = 'col-margen row-margen-val positive';
    } else if (margen < 0) {
      margenEl.className = 'col-margen row-margen-val negative';
    } else {
      margenEl.className = 'col-margen row-margen-val neutral';
    }

    if (triggerGlobalCalc) {
      this.calculate();
    }
  }

  calculate() {
    let totalDia = 0;
    let totalMargen = 0;

    this.bets.forEach(b => {
      totalDia += b.winAmount;
      totalMargen += (b.winAmount - b.betAmount);
    });

    const percentDia = this.startingCapital > 0 ? (totalMargen / this.startingCapital) * 100 : 0;

    // Update global DOM labels
    document.getElementById('total-dia-val').textContent = `$${totalDia.toFixed(1).replace(/\.0$/, '')}`;
    
    const margenValEl = document.getElementById('total-margen-val');
    margenValEl.textContent = `$${totalMargen.toFixed(1).replace(/\.0$/, '')}`;
    if (totalMargen > 0) {
      margenValEl.className = 'summary-value positive';
    } else if (totalMargen < 0) {
      margenValEl.className = 'summary-value negative';
    } else {
      margenValEl.className = 'summary-value';
    }

    const percentEl = document.getElementById('percent-dia-val');
    percentEl.textContent = `${percentDia.toFixed(1).replace(/\.0$/, '')}%`;
    if (percentDia > 0) {
      percentEl.className = 'summary-value positive';
    } else if (percentDia < 0) {
      percentEl.className = 'summary-value negative';
    } else {
      percentEl.className = 'summary-value';
    }

    // Update recommendation box
    const recBox = document.getElementById('recommendation-box');
    if (percentDia >= 30) {
      recBox.className = 'recommendation-box positive';
      recBox.innerHTML = `🌟 <strong>¡Estás Imparable!</strong> Te recomiendo salir del sistema y disfrutar de tu día. ¡Nos vemos mañana!`;
    } else if (percentDia > 0) {
      recBox.className = 'recommendation-box path';
      recBox.innerHTML = `📈 <strong>Vas por buen camino.</strong> Sigue tu estrategia con disciplina y cabeza fría.`;
    } else if (percentDia === 0) {
      recBox.className = 'recommendation-box';
      recBox.innerHTML = `🎰 Define tu capital y comienza a registrar tus jugadas para medir tu rentabilidad.`;
    } else if (percentDia >= -20) {
      recBox.className = 'recommendation-box warning';
      recBox.innerHTML = `⚠️ <strong>Pérdidas menores detectadas.</strong> Mantén la calma y no juegues por recuperar impulsivamente.`;
    } else {
      recBox.className = 'recommendation-box negative';
      recBox.innerHTML = `🚨 <strong>Stop Loss Activo.</strong> Te sugerimos retirarte por hoy y evaluar fríamente tu estrategia mañana.`;
    }
  }
}
