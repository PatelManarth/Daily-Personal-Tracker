const NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}, text = '') {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  return node;
}

function finite(values) {
  return values.filter((value) => Number.isFinite(value));
}

function extent(values, padding = 0.08) {
  const nums = finite(values);
  if (!nums.length) return [0, 1];
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * padding;
  return [min - pad, max + pad];
}

function baseSvg(container, height = 320) {
  container.innerHTML = '';
  const width = Math.max(320, container.clientWidth || 720);
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', class: 'chart-svg' });
  container.appendChild(svg);
  return { svg, width, height };
}

function addEmpty(svg, width, height, message = 'Not enough data yet.') {
  svg.appendChild(el('text', { x: width / 2, y: height / 2, 'text-anchor': 'middle', class: 'chart-empty' }, message));
}

function axes(svg, width, height, yMin, yMax, labels, margins) {
  const { left, right, top, bottom } = margins;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH * i) / 4;
    const value = yMax - ((yMax - yMin) * i) / 4;
    svg.appendChild(el('line', { x1: left, x2: width - right, y1: y, y2: y, class: 'chart-grid' }));
    svg.appendChild(el('text', { x: left - 8, y: y + 4, 'text-anchor': 'end', class: 'chart-label' }, value.toFixed(value < 20 ? 1 : 0)));
  }
  const count = labels.length;
  const stride = Math.max(1, Math.ceil(count / 6));
  labels.forEach((label, index) => {
    if (index % stride !== 0 && index !== count - 1) return;
    const x = count === 1 ? left + plotW / 2 : left + (plotW * index) / (count - 1);
    svg.appendChild(el('text', { x, y: height - bottom + 22, 'text-anchor': 'middle', class: 'chart-label' }, label));
  });
  return { plotW, plotH };
}

export function renderLineChart(container, { labels, series, yMin, yMax, height = 330, annotations = [], xAnnotations = [] }) {
  const { svg, width } = baseSvg(container, height);
  const valid = series.some((item) => item.values.some(Number.isFinite));
  if (!valid) {
    addEmpty(svg, width, height);
    return;
  }
  const margins = { left: 52, right: 18, top: 22, bottom: 48 };
  const allValues = series.flatMap((item) => item.values);
  const [autoMin, autoMax] = extent(allValues);
  const min = Number.isFinite(yMin) ? yMin : autoMin;
  const max = Number.isFinite(yMax) ? yMax : autoMax;
  const { plotW, plotH } = axes(svg, width, height, min, max, labels, margins);
  const xAt = (i) => labels.length === 1 ? margins.left + plotW / 2 : margins.left + (plotW * i) / (labels.length - 1);
  const yAt = (v) => margins.top + plotH - ((v - min) / (max - min)) * plotH;

  xAnnotations.forEach((item) => {
    if (!Number.isInteger(item.index) || item.index < 0 || item.index >= labels.length) return;
    const x = xAt(item.index);
    svg.appendChild(el('line', { x1: x, x2: x, y1: margins.top, y2: margins.top + plotH, class: `chart-annotation vertical ${item.className || ''}` }));
    svg.appendChild(el('text', { x: x - 4, y: margins.top + 12, 'text-anchor': 'end', class: 'chart-label' }, item.label || labels[item.index]));
  });

  annotations.forEach((item) => {
    if (!Number.isFinite(item.value) || item.value < min || item.value > max) return;
    const y = yAt(item.value);
    svg.appendChild(el('line', { x1: margins.left, x2: width - margins.right, y1: y, y2: y, class: `chart-annotation ${item.className || ''}` }));
    svg.appendChild(el('text', { x: width - margins.right, y: y - 5, 'text-anchor': 'end', class: 'chart-label' }, item.label || String(item.value)));
  });

  series.forEach((item, sIndex) => {
    const points = [];
    item.values.forEach((value, i) => {
      if (Number.isFinite(value)) points.push(`${xAt(i)},${yAt(value)}`);
    });
    if (item.line !== false && points.length > 1) {
      svg.appendChild(el('polyline', { points: points.join(' '), fill: 'none', class: `chart-series series-${sIndex} ${item.className || ''}` }));
    }
    if (item.points !== false) {
      item.values.forEach((value, i) => {
        if (!Number.isFinite(value)) return;
        const circle = el('circle', { cx: xAt(i), cy: yAt(value), r: item.radius || 3, class: `chart-point series-${sIndex}` });
        circle.appendChild(el('title', {}, `${labels[i]}: ${value.toFixed(1)}`));
        svg.appendChild(circle);
      });
    }
  });

  const legend = el('g', { class: 'chart-legend' });
  let offset = margins.left;
  series.forEach((item, index) => {
    legend.appendChild(el('line', { x1: offset, x2: offset + 18, y1: 12, y2: 12, class: `chart-series series-${index}` }));
    legend.appendChild(el('text', { x: offset + 24, y: 16, class: 'chart-label' }, item.name));
    offset += Math.max(115, item.name.length * 7 + 45);
  });
  svg.appendChild(legend);
}

export function renderBarChart(container, { labels, values, targetMin, targetMax, height = 330, suffix = '' }) {
  const { svg, width } = baseSvg(container, height);
  if (!values.some(Number.isFinite)) {
    addEmpty(svg, width, height);
    return;
  }
  const margins = { left: 52, right: 18, top: 22, bottom: 54 };
  const [autoMin, autoMax] = extent([...values, targetMin, targetMax].filter(Number.isFinite), 0.12);
  const min = Math.min(0, autoMin);
  const max = autoMax;
  const { plotW, plotH } = axes(svg, width, height, min, max, labels, margins);
  const slot = plotW / Math.max(1, labels.length);
  const barW = Math.max(8, slot * 0.58);
  const yAt = (v) => margins.top + plotH - ((v - min) / (max - min)) * plotH;

  if (Number.isFinite(targetMin) && Number.isFinite(targetMax)) {
    const y1 = yAt(targetMax);
    const y2 = yAt(targetMin);
    svg.appendChild(el('rect', { x: margins.left, y: y1, width: plotW, height: Math.max(0, y2 - y1), class: 'chart-target-band' }));
  }

  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    const x = margins.left + slot * index + (slot - barW) / 2;
    const y = yAt(value);
    const bottomY = yAt(0);
    const rect = el('rect', { x, y: Math.min(y, bottomY), width: barW, height: Math.abs(bottomY - y), rx: 4, class: 'chart-bar' });
    rect.appendChild(el('title', {}, `${labels[index]}: ${value.toFixed(1)}${suffix}`));
    svg.appendChild(rect);
  });
}

export function renderScatterChart(container, { points, xLabel = 'Sleep (h)', yLabel = 'Hunger', height = 330 }) {
  const { svg, width } = baseSvg(container, height);
  if (!points.length) {
    addEmpty(svg, width, height);
    return;
  }
  const margins = { left: 54, right: 18, top: 20, bottom: 52 };
  const [xMin, xMax] = extent(points.map((p) => p.x), 0.12);
  const [yMin, yMax] = extent(points.map((p) => p.y), 0.12);
  const plotW = width - margins.left - margins.right;
  const plotH = height - margins.top - margins.bottom;
  const xAt = (v) => margins.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const yAt = (v) => margins.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  for (let i = 0; i <= 4; i += 1) {
    const x = margins.left + (plotW * i) / 4;
    const y = margins.top + (plotH * i) / 4;
    svg.appendChild(el('line', { x1: x, x2: x, y1: margins.top, y2: margins.top + plotH, class: 'chart-grid' }));
    svg.appendChild(el('line', { x1: margins.left, x2: margins.left + plotW, y1: y, y2: y, class: 'chart-grid' }));
    svg.appendChild(el('text', { x, y: height - margins.bottom + 22, 'text-anchor': 'middle', class: 'chart-label' }, (xMin + ((xMax - xMin) * i) / 4).toFixed(1)));
    svg.appendChild(el('text', { x: margins.left - 8, y: y + 4, 'text-anchor': 'end', class: 'chart-label' }, (yMax - ((yMax - yMin) * i) / 4).toFixed(1)));
  }
  points.forEach((point) => {
    const circle = el('circle', { cx: xAt(point.x), cy: yAt(point.y), r: 5, class: 'chart-scatter' });
    circle.appendChild(el('title', {}, `${point.label || ''} Sleep ${point.x} h, hunger ${point.y}`));
    svg.appendChild(circle);
  });
  svg.appendChild(el('text', { x: margins.left + plotW / 2, y: height - 8, 'text-anchor': 'middle', class: 'chart-axis-title' }, xLabel));
  const yTitle = el('text', { x: 14, y: margins.top + plotH / 2, 'text-anchor': 'middle', class: 'chart-axis-title', transform: `rotate(-90 14 ${margins.top + plotH / 2})` }, yLabel);
  svg.appendChild(yTitle);
}
