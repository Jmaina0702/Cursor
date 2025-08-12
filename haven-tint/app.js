// Haven Tint Kenya Interactive JS

const q = (sel, parent = document) => parent.querySelector(sel);
const qa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const state = {
  vehicle: {
    type: 'sedan',
    angle: 'side',
    tintType: 'normal',
    shade: 0.35
  },
  building: {
    type: 'residential',
    tintType: 'normal',
    shade: 0.35
  },
  pricing: {
    vehicleType: 'sedan',
    numWindows: 7,
    tintType: 'normal',
    shade: 0.35
  }
};

const BASE_PRICES = {
  normal: 4000,    // smallest car full
  '3m': 17000,     // smallest car full
  llumar: 14000,   // smallest car full
  chameleon: 13000 // windscreen only
};

const VEHICLE_MULTIPLIER = {
  small: 1.0,
  sedan: 1.15,
  suv: 1.3,
  van: 1.45,
  truck: 1.6,
  bus: 1.9
};

const WARRANTY = {
  normal: '1 year',
  '3m': '10 years',
  llumar: '10 years',
  chameleon: '1 year'
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function getTintRGBA(tintType, shade) {
  const opacity = 1 - clamp(Number(shade), 0.05, 0.95); // lower VLT -> darker
  switch (tintType) {
    case '3m': return `rgba(20, 24, 30, ${0.55 + opacity * 0.35})`;
    case 'llumar': return `rgba(24, 28, 35, ${0.5 + opacity * 0.35})`;
    case 'chameleon': return 'url(#gradChameleon)';
    default: return `rgba(0,0,0, ${0.45 + opacity * 0.35})`;
  }
}

function renderVehicleAngle(angle) {
  // For simplicity, we reuse a parametric SVG per angle
  const shade = state.vehicle.shade;
  const tintType = state.vehicle.tintType;
  const fill = getTintRGBA(tintType, shade);

  if (angle === 'side') {
    // Use the hero SVG clone with overlay fills
    const svg = q('#heroSedan').cloneNode(true);
    svg.removeAttribute('id');
    qa('[data-window]', svg).forEach(el => {
      const win = el.getAttribute('data-window');
      if (tintType === 'chameleon') {
        // Apply only to windscreen
        if (win === 'windscreen') {
          el.setAttribute('fill', fill);
        } else {
          el.setAttribute('fill', 'rgba(0,0,0,0)');
        }
      } else {
        el.setAttribute('fill', fill);
      }
    });
    return svg;
  }

  // Simple alternate angles made with abstracted shapes
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 800 300');

  const body = document.createElementNS(ns, 'rect');
  body.setAttribute('x', '120');
  body.setAttribute('y', '150');
  body.setAttribute('width', '560');
  body.setAttribute('height', '70');
  body.setAttribute('rx', '14');
  body.setAttribute('fill', '#0f1113');
  body.setAttribute('stroke', '#222');
  body.setAttribute('stroke-width', '3');
  svg.appendChild(body);

  const wheel1 = document.createElementNS(ns, 'circle');
  wheel1.setAttribute('cx', '240');
  wheel1.setAttribute('cy', '235');
  wheel1.setAttribute('r', '42');
  wheel1.setAttribute('fill', '#0a0c0e');
  wheel1.setAttribute('stroke', '#555');
  svg.appendChild(wheel1);

  const wheel2 = document.createElementNS(ns, 'circle');
  wheel2.setAttribute('cx', '560');
  wheel2.setAttribute('cy', '235');
  wheel2.setAttribute('r', '42');
  wheel2.setAttribute('fill', '#0a0c0e');
  wheel2.setAttribute('stroke', '#555');
  svg.appendChild(wheel2);

  const glass = document.createElementNS(ns, 'rect');
  glass.setAttribute('x', '240');
  glass.setAttribute('y', '160');
  glass.setAttribute('width', '320');
  glass.setAttribute('height', '40');
  glass.setAttribute('fill', '#b7d0ff');
  svg.appendChild(glass);

  const overlay = document.createElementNS(ns, 'rect');
  overlay.setAttribute('x', '240');
  overlay.setAttribute('y', '160');
  overlay.setAttribute('width', '320');
  overlay.setAttribute('height', '40');

  if (tintType === 'chameleon') {
    // chameleon on windscreen only; for other angles, simulate as gradient strip at front third
    const gradId = 'gradChameleon';
    overlay.setAttribute('fill', `url(#${gradId})`);
  } else {
    overlay.setAttribute('fill', fill);
  }
  overlay.style.mixBlendMode = 'multiply';
  svg.appendChild(overlay);

  return svg;
}

function renderVehicle() {
  const container = q('#vehicleCanvas');
  container.innerHTML = '';
  const angle = state.vehicle.angle;
  const svg = renderVehicleAngle(angle);
  svg.classList.add('fade-in');
  container.appendChild(svg);
}

function renderBuilding() {
  const ns = 'http://www.w3.org/2000/svg';
  const container = q('#buildingCanvas');
  container.innerHTML = '';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 800 300');

  const base = document.createElementNS(ns, 'rect');
  base.setAttribute('x', '100');
  base.setAttribute('y', '60');
  base.setAttribute('width', '600');
  base.setAttribute('height', '180');
  base.setAttribute('rx', '16');
  base.setAttribute('fill', '#0f1113');
  base.setAttribute('stroke', '#222');
  svg.appendChild(base);

  const cols = 6;
  const rows = 3;
  const gap = 12;
  const cellW = (600 - gap * (cols + 1)) / cols;
  const cellH = (180 - gap * (rows + 1)) / rows;
  const fillTint = getTintRGBA(state.building.tintType, state.building.shade);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 100 + gap + c * (cellW + gap);
      const y = 60 + gap + r * (cellH + gap);
      const win = document.createElementNS(ns, 'rect');
      win.setAttribute('x', String(x));
      win.setAttribute('y', String(y));
      win.setAttribute('width', String(cellW));
      win.setAttribute('height', String(cellH));
      win.setAttribute('rx', '6');
      win.setAttribute('fill', '#b7d0ff');
      svg.appendChild(win);

      const overlay = document.createElementNS(ns, 'rect');
      overlay.setAttribute('x', String(x));
      overlay.setAttribute('y', String(y));
      overlay.setAttribute('width', String(cellW));
      overlay.setAttribute('height', String(cellH));
      overlay.setAttribute('rx', '6');
      overlay.setAttribute('fill', fillTint);
      overlay.style.mixBlendMode = 'multiply';
      svg.appendChild(overlay);
    }
  }

  svg.classList.add('fade-in');
  container.appendChild(svg);
}

function formatKES(n) {
  return n.toLocaleString('en-KE');
}

function computePrice({ vehicleType, numWindows, tintType }) {
  const multiplier = VEHICLE_MULTIPLIER[vehicleType] || 1;
  const base = BASE_PRICES[tintType] || BASE_PRICES.normal;

  if (tintType === 'chameleon') {
    // windscreen only, scale with larger vehicles slightly
    return Math.round(base * (0.9 + (multiplier - 1) * 0.6));
  }

  // scale with vehicle size and window count (baseline 7 windows for small car)
  const windowFactor = clamp(numWindows / 7, 0.7, 2.2);
  const price = base * multiplier * windowFactor;

  // Add small complexity premium for SUVs, trucks, buses
  let premium = 0;
  if (vehicleType === 'suv') premium = 1500;
  if (vehicleType === 'van') premium = 2000;
  if (vehicleType === 'truck') premium = 3000;
  if (vehicleType === 'bus') premium = 6000;

  return Math.round(price + premium);
}

function updatePriceUI() {
  const priceValue = q('#priceValue');
  const warrantyNote = q('#warrantyNote');
  const price = computePrice(state.pricing);
  priceValue.textContent = formatKES(price);
  warrantyNote.textContent = `Warranty: ${WARRANTY[state.pricing.tintType]}`;
}

function bindControls() {
  // Mobile menu
  const menuToggle = q('#menuToggle');
  const nav = q('.nav');
  menuToggle?.addEventListener('click', () => {
    const visible = getComputedStyle(nav).display !== 'none';
    nav.style.display = visible ? 'none' : 'flex';
  });

  // Vehicle controls
  q('#vehicleType').addEventListener('change', (e) => {
    state.vehicle.type = e.target.value;
    state.pricing.vehicleType = e.target.value;
    updatePriceUI();
  });
  q('#vehicleAngle').addEventListener('change', (e) => {
    state.vehicle.angle = e.target.value;
    renderVehicle();
  });
  q('#tintType').addEventListener('change', (e) => {
    state.vehicle.tintType = e.target.value;
    state.pricing.tintType = e.target.value;
    renderVehicle();
    updatePriceUI();
  });
  q('#tintShade').addEventListener('change', (e) => {
    state.vehicle.shade = Number(e.target.value);
    state.pricing.shade = Number(e.target.value);
    renderVehicle();
  });

  // Building controls
  q('#buildingType').addEventListener('change', (e) => {
    state.building.type = e.target.value;
    renderBuilding();
  });
  q('#buildingTintType').addEventListener('change', (e) => {
    state.building.tintType = e.target.value;
    renderBuilding();
  });
  q('#buildingShade').addEventListener('change', (e) => {
    state.building.shade = Number(e.target.value);
    renderBuilding();
  });

  // Pricing controls
  q('#priceVehicleType').addEventListener('change', (e) => {
    state.pricing.vehicleType = e.target.value;
    updatePriceUI();
  });
  q('#numWindows').addEventListener('input', (e) => {
    const v = clamp(parseInt(e.target.value || '0', 10) || 0, 2, 30);
    state.pricing.numWindows = v;
    e.target.value = String(v);
    updatePriceUI();
  });
  q('#priceTintType').addEventListener('change', (e) => {
    state.pricing.tintType = e.target.value;
    updatePriceUI();
  });
  q('#priceShade').addEventListener('change', (e) => {
    state.pricing.shade = Number(e.target.value);
  });

  // Booking
  q('#bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = q('#custName').value.trim();
    const vehicle = q('#custVehicle').value.trim();
    const tint = q('#custTint').value;
    const date = q('#custDate').value;

    const summaryPrice = computePrice({
      vehicleType: state.pricing.vehicleType,
      numWindows: state.pricing.numWindows,
      tintType: tint.toLowerCase() === '3m' ? '3m' : tint.toLowerCase() === 'llumar' ? 'llumar' : tint.toLowerCase() === 'chameleon' ? 'chameleon' : 'normal'
    });

    const text = `Booking Request - Haven Tint%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Vehicle: ${encodeURIComponent(vehicle)}%0A` +
      `Tint: ${encodeURIComponent(tint)}%0A` +
      `Preferred Date: ${encodeURIComponent(date)}%0A` +
      `Estimated Price: KES ${encodeURIComponent(formatKES(summaryPrice))}%0A` +
      `Source: Website`;

    // Provided number: +254 0115796645 -> International format: +254 115796645
    const phone = '254115796645';
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
  });
}

function init() {
  // Current year
  const y = new Date().getFullYear();
  const yearEl = q('#year');
  if (yearEl) yearEl.textContent = String(y);

  // Seed vehicle canvas with current tint
  renderVehicle();
  renderBuilding();
  updatePriceUI();
  bindControls();
}

window.addEventListener('DOMContentLoaded', init);