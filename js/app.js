import { RouletteTable } from './table.js';
import { RouletteWheel } from './wheel.js';
import { Sidebar } from './sidebar.js';
import { CapitalTable } from './capital.js';
import { AlgosModal } from './algosModal.js';

class App {
  init() {
    const tableEl = document.getElementById('table-container');
    const wheelEl = document.getElementById('wheel-container');
    const sidebarEl = document.getElementById('sidebar-container');
    const capitalEl = document.getElementById('capital-container');

    // Inicializar el modal visor de algoritmos
    this.algosModal = new AlgosModal();

    this.wheel = new RouletteWheel(wheelEl);

    // Sidebar recibe el callback para abrir el algoritmo seleccionado en el modal
    this.sidebar = new Sidebar(
      sidebarEl,
      () => this.table.clearSelection(),
      (algoId) => this.algosModal.open(algoId)
    );

    this.capital = new CapitalTable(capitalEl);

    this.table = new RouletteTable(tableEl, (selected) => {
      this.sidebar.update(selected);
      this.wheel.highlightNumbers(selected);
      if (selected.length > 0) {
        this.wheel.spinToNumber(selected[selected.length - 1]);
      }
    });

    // Vincular botón global "Ver Algoritmos" en el header
    const viewAlgosBtn = document.getElementById('view-algos-btn');
    if (viewAlgosBtn) {
      viewAlgosBtn.addEventListener('click', () => {
        this.algosModal.open(0);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new App().init());
