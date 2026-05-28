import { getNumberColor } from './data.js';

export class RouletteTable {
  constructor(container, onSelectionChange) {
    this.container = container;
    this.onSelectionChange = onSelectionChange;
    this.selected = new Set();
    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    const table = document.createElement('div');
    table.className = 'roulette-table';

    // Zero cell
    const zero = this.createCell(0);
    zero.classList.add('zero-cell');
    zero.style.gridColumn = '1';
    zero.style.gridRow = '1 / 4';
    table.appendChild(zero);

    // Number cells (3 rows × 12 cols)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const num = (3 - row) + col * 3;
        const cell = this.createCell(num);
        cell.style.gridColumn = `${col + 2}`;
        cell.style.gridRow = `${row + 1}`;
        table.appendChild(cell);
      }
    }

    // 2:1 column
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('div');
      c.className = 'col-bet';
      c.textContent = '2:1';
      c.style.gridColumn = '14';
      c.style.gridRow = `${i + 1}`;
      table.appendChild(c);
    }

    // Dozens (decorative)
    ['1st 12', '2nd 12', '3rd 12'].forEach((text, i) => {
      const d = document.createElement('div');
      d.className = 'dozen-cell';
      d.textContent = text;
      d.style.gridColumn = `${i * 4 + 2} / ${i * 4 + 6}`;
      d.style.gridRow = '4';
      table.appendChild(d);
    });

    // Even money (decorative)
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

    wrapper.appendChild(table);
    this.container.appendChild(wrapper);
  }

  createCell(num) {
    const cell = document.createElement('div');
    cell.className = `table-cell ${getNumberColor(num)}`;
    cell.dataset.number = num;

    const span = document.createElement('span');
    span.textContent = num;
    cell.appendChild(span);

    cell.addEventListener('click', () => this.toggleNumber(num, cell));
    return cell;
  }

  toggleNumber(num, cell) {
    if (this.selected.has(num)) {
      this.selected.delete(num);
      cell.classList.remove('selected');
    } else {
      this.selected.add(num);
      cell.classList.add('selected');
    }
    this.onSelectionChange([...this.selected]);
  }

  clearSelection() {
    this.selected.clear();
    this.container.querySelectorAll('.table-cell.selected')
      .forEach(c => c.classList.remove('selected'));
    this.onSelectionChange([]);
  }
}
