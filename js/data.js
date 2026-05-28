// Roulette constants and algorithm definitions

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
  8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26
];

export const ALGORITHMS = {
  0: {
    name: "Algoritmo 0",
    base: [0, 1, 2, 3, 5, 7, 8, 10, 11, 12, 13, 14, 17, 19, 20, 21, 23, 26, 27, 28, 29, 30, 32, 33],
    hueco: [15, 35, 36],
    extension: []
  },
  1: {
    name: "Algoritmo 1",
    base: [0, 1, 2, 4, 5, 7, 9, 10, 11, 12, 14, 15, 19, 20, 21, 23, 26, 28, 31, 32, 33, 36],
    hueco: [3, 8, 16, 24, 30, 35],
    extension: []
  },
  2: {
    name: "Algoritmo 2",
    base: [0, 1, 2, 7, 9, 11, 12, 14, 15, 18, 20, 21, 22, 25, 26, 28, 29, 30, 32, 35, 36],
    hueco: [3, 4, 19, 31],
    extension: []
  },
  3: {
    name: "Algoritmo 3",
    base: [0, 1, 2, 3, 4, 8, 10, 11, 12, 13, 16, 21, 23, 26, 27, 28, 30, 32, 33, 35, 36],
    hueco: [5, 15, 19, 24],
    extension: []
  },
  4: {
    name: "Algoritmo 4",
    base: [0, 4, 5, 6, 8, 9, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 30, 31, 32, 34, 36],
    hueco: [1, 2, 10, 11, 15, 25, 33],
    extension: []
  },
  5: {
    name: "Algoritmo 5",
    base: [0, 2, 3, 5, 8, 10, 12, 14, 15, 17, 19, 20, 23, 24, 25, 26, 31, 32, 35],
    hueco: [4, 21],
    extension: [9, 11, 28, 30, 34]
  },
  6: {
    name: "Algoritmo 6",
    base: [0, 1, 3, 4, 5, 6, 7, 9, 11, 13, 15, 16, 18, 19, 22, 24, 26, 27, 29, 31, 32, 33, 34, 36],
    hueco: [],
    extension: [30]
  },
  7: {
    name: "Algoritmo 7",
    base: [0, 2, 6, 7, 13, 16, 17, 24, 25, 26, 27, 28, 29, 32, 33, 34],
    hueco: [],
    extension: []
  },
  8: {
    name: "Algoritmo 8",
    base: [0, 3, 7, 8, 12, 17, 18, 22, 23, 25, 26, 28, 29, 30, 32, 34, 35],
    hueco: [],
    extension: [2, 6, 9, 10, 11, 15, 27, 31]
  },
  9: {
    name: "Algoritmo 9",
    base: [0, 3, 4, 6, 7, 9, 11, 13, 15, 16, 18, 19, 22, 24, 26, 27, 29, 31, 32, 33, 34, 36],
    hueco: [],
    extension: [1, 30]
  }
};

export function getNumberColor(num) {
  if (num === 0) return 'green';
  return RED_NUMBERS.includes(num) ? 'red' : 'black';
}

export function getNeighbors(num, count = 3) {
  const idx = WHEEL_ORDER.indexOf(num);
  const left = [], right = [];
  for (let i = 1; i <= count; i++) {
    left.push(WHEEL_ORDER[(idx - i + 37) % 37]);
    right.push(WHEEL_ORDER[(idx + i) % 37]);
  }
  return { left, right };
}

// Precomputed lookup: number → [{id, name, type}]
const _map = new Map();
for (const [id, algo] of Object.entries(ALGORITHMS)) {
  ['base', 'hueco', 'extension'].forEach(type => {
    algo[type].forEach(num => {
      if (!_map.has(num)) _map.set(num, []);
      _map.get(num).push({ id: parseInt(id), name: algo.name, type });
    });
  });
}

export function findAlgorithmsForNumber(num) {
  return _map.get(num) || [];
}
