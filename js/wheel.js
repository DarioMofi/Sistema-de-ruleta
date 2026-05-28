import { WHEEL_ORDER, getNumberColor } from './data.js';

const NS = 'http://www.w3.org/2000/svg';
const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 175;
const INNER_R = 125;
const TEXT_R = 153;
const SECTOR_ANGLE = 360 / 37;

const COLOR_MAP = {
  red: '#c62828',
  black: '#1a1a2e',
  green: '#1b7a3d'
};

export class RouletteWheel {
  constructor(container) {
    this.container = container;
    this.rotation = 0;
    this.spinning = false;
    this.render();
  }

  render() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
    svg.id = 'roulette-svg';

    // Outer frame ring
    svg.appendChild(this.circle(CX, CY, 188, '#1a1008', '#d4a843', 4));
    svg.appendChild(this.circle(CX, CY, 182, 'none', 'rgba(212,168,67,0.35)', 1));

    // Wheel group (rotates)
    const wheelG = document.createElementNS(NS, 'g');
    wheelG.id = 'wheel-group';

    WHEEL_ORDER.forEach((num, i) => {
      const startA = i * SECTOR_ANGLE - 90;
      const endA = startA + SECTOR_ANGLE;

      // Sector
      const path = this.sectorPath(OUTER_R, INNER_R, startA, endA);
      path.setAttribute('fill', COLOR_MAP[getNumberColor(num)]);
      path.setAttribute('stroke', 'rgba(212,168,67,0.25)');
      path.setAttribute('stroke-width', '0.5');
      path.classList.add('wheel-sector');
      path.dataset.number = num;
      wheelG.appendChild(path);

      // Number label
      const midA = (startA + endA) / 2;
      const rad = midA * Math.PI / 180;
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', CX + TEXT_R * Math.cos(rad));
      text.setAttribute('y', CY + TEXT_R * Math.sin(rad));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', '700');
      text.setAttribute('font-family', 'Outfit, sans-serif');
      text.setAttribute('transform',
        `rotate(${midA + 90}, ${CX + TEXT_R * Math.cos(rad)}, ${CY + TEXT_R * Math.sin(rad)})`
      );
      text.textContent = num;
      wheelG.appendChild(text);
    });

    svg.appendChild(wheelG);

    // Center hub (static)
    svg.appendChild(this.circle(CX, CY, INNER_R - 3, '#0c0c18', '#d4a843', 2.5));
    svg.appendChild(this.circle(CX, CY, INNER_R - 16, 'none', 'rgba(212,168,67,0.15)', 1));
    svg.appendChild(this.circle(CX, CY, INNER_R - 40, 'none', 'rgba(212,168,67,0.08)', 1));
    // Pointer arrow (static)
    const ptr = document.createElementNS(NS, 'polygon');
    ptr.setAttribute('points', `${CX},3 ${CX - 9},24 ${CX + 9},24`);
    ptr.setAttribute('fill', '#d4a843');
    ptr.setAttribute('stroke', '#a08030');
    ptr.setAttribute('stroke-width', '1');
    ptr.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))';
    svg.appendChild(ptr);

    this.container.appendChild(svg);
    this.wheelGroup = wheelG;
  }

  sectorPath(outerR, innerR, startA, endA) {
    const p1 = this.polar(outerR, startA);
    const p2 = this.polar(outerR, endA);
    const p3 = this.polar(innerR, endA);
    const p4 = this.polar(innerR, startA);
    const lg = endA - startA > 180 ? 1 : 0;

    const d = `M${p1.x},${p1.y} A${outerR},${outerR},0,${lg},1,${p2.x},${p2.y} ` +
              `L${p3.x},${p3.y} A${innerR},${innerR},0,${lg},0,${p4.x},${p4.y} Z`;

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    return path;
  }

  polar(r, deg) {
    const rad = deg * Math.PI / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  circle(cx, cy, r, fill, stroke, sw) {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    c.setAttribute('fill', fill);
    c.setAttribute('stroke', stroke);
    c.setAttribute('stroke-width', sw);
    return c;
  }

  spinToNumber(num) {
    if (this.spinning) return;
    this.spinning = true;

    const idx = WHEEL_ORDER.indexOf(num);
    if (idx === -1) { this.spinning = false; return; }

    // Target angle: sector center must align with top pointer
    // Sector center angle = idx * SECTOR_ANGLE + SECTOR_ANGLE/2
    // Pointer is at top (0° CSS rotation = 12 o'clock)
    // We need to rotate so that sector lands at top → negative of its position
    const sectorCenter = idx * SECTOR_ANGLE + SECTOR_ANGLE / 2;
    const targetAngle = 360 - sectorCenter;

    // Normalize current rotation to 0-360
    const currentMod = ((this.rotation % 360) + 360) % 360;
    // Calculate delta, add 1 full spin for visual effect
    let delta = targetAngle - currentMod;
    if (delta <= 0) delta += 360;
    delta += 360; // 1 extra spin

    this.rotation += delta;

    this.wheelGroup.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.wheelGroup.style.transform = `rotate(${this.rotation}deg)`;

    setTimeout(() => { this.spinning = false; }, 1600);
  }

  highlightNumbers(nums) {
    this.container.querySelectorAll('.wheel-sector').forEach(s => {
      const num = parseInt(s.dataset.number);
      if (nums.includes(num)) {
        s.setAttribute('stroke', '#f4d95e');
        s.setAttribute('stroke-width', '2.5');
      } else {
        s.setAttribute('stroke', 'rgba(212,168,67,0.25)');
        s.setAttribute('stroke-width', '0.5');
      }
    });
  }
}
