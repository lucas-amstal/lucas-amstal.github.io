// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});
document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Scroll reveal animation
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  observer.observe(el);
});

// ================= ROI / IMPACT CHART =================
(function () {
  const container = document.getElementById('roiChartContainer');
  if (!container) return;

  const months = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  const investment = [8,15.25,22.5,29.75,37,44.25,51.5,58.75,66,73.25,80.5,87.75,95];
  const value = [2,5,10,18,29,44,62,83,105,126,145,160,172];
  const milestones = {
    1: "Ramp-up: mapping the data landscape & quick wins",
    5: "Break-even: automation savings offset onboarding cost",
    7: "Real-time BI + ERP/CRM integrations live",
    9: "Self-serve dashboards adopted org-wide",
    12: "Consolidated on a modern data platform — compounding gains"
  };
  const breakevenMonth = 5;

  const W = 900, H = 420;
  const padL = 46, padR = 20, padT = 24, padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = 180;

  function xFor(m) { return padL + (m / 12) * plotW; }
  function yFor(v) { return padT + plotH - (v / yMax) * plotH; }

  function catmullRomPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  const investmentPts = months.map((m, i) => [xFor(m), yFor(investment[i])]);
  const valuePts = months.map((m, i) => [xFor(m), yFor(value[i])]);

  const investmentPath = catmullRomPath(investmentPts);
  const valuePath = catmullRomPath(valuePts);
  const areaPath = `${valuePath} L ${xFor(12)},${yFor(0)} L ${xFor(0)},${yFor(0)} Z`;

  const gridMonths = [0, 3, 6, 9, 12];
  let gridLines = '';
  let axisLabels = '';
  gridMonths.forEach((m) => {
    const x = xFor(m);
    const anchor = m === 0 ? 'start' : (m === 12 ? 'end' : 'middle');
    gridLines += `<line class="roi-grid-line" x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" />`;
    axisLabels += `<text class="roi-axis-label" x="${x}" y="${H - 14}" text-anchor="${anchor}">Month ${m}</text>`;
  });

  const breakevenX = xFor(breakevenMonth);

  let pointsMarkup = '';
  months.forEach((m, i) => {
    if (milestones[m]) {
      pointsMarkup += `<circle class="roi-point" data-month="${m}" data-label="${milestones[m]}" cx="${valuePts[i][0]}" cy="${valuePts[i][1]}" r="6"></circle>`;
    }
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="roiAreaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff3b30" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#ff3b30" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <line class="roi-breakeven-line" x1="${breakevenX}" y1="${padT}" x2="${breakevenX}" y2="${padT + plotH}" />
      <text class="roi-breakeven-label" x="${breakevenX + 8}" y="${padT + 16}">Break-even</text>
      <path class="roi-area-value" d="${areaPath}"></path>
      <path class="roi-line-investment" d="${investmentPath}"></path>
      <path class="roi-line-value" id="roiValuePath" d="${valuePath}"></path>
      ${pointsMarkup}
      ${axisLabels}
    </svg>
  `;

  const roiCard = container.closest('.roi-card');
  const valueLineEl = container.querySelector('#roiValuePath');
  const counterEl = document.getElementById('roiCounterNum');
  const finalRatio = value[value.length - 1] / investment[investment.length - 1];

  let animated = false;
  function animateChart() {
    if (animated) return;
    animated = true;
    roiCard.classList.add('in-view');

    const len = valueLineEl.getTotalLength();
    valueLineEl.style.strokeDasharray = `${len}`;
    valueLineEl.style.strokeDashoffset = `${len}`;
    valueLineEl.getBoundingClientRect();
    valueLineEl.style.transition = 'stroke-dashoffset 1.8s ease';
    requestAnimationFrame(() => {
      valueLineEl.style.strokeDashoffset = '0';
    });

    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counterEl.textContent = (eased * finalRatio).toFixed(1) + '×';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateChart();
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  chartObserver.observe(roiCard);

  const tooltip = document.createElement('div');
  tooltip.className = 'roi-tooltip';
  roiCard.style.position = 'relative';
  roiCard.appendChild(tooltip);

  container.querySelectorAll('.roi-point').forEach((point) => {
    point.addEventListener('mouseenter', () => showTooltip(point));
    point.addEventListener('mousemove', () => showTooltip(point));
    point.addEventListener('mouseleave', hideTooltip);
    point.addEventListener('touchstart', (e) => {
      e.preventDefault();
      showTooltip(point);
    }, { passive: false });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.classList || !e.target.classList.contains('roi-point')) hideTooltip();
  });

  function showTooltip(point) {
    container.querySelectorAll('.roi-point').forEach((p) => p.classList.remove('active'));
    point.classList.add('active');

    const month = point.getAttribute('data-month');
    const label = point.getAttribute('data-label');
    tooltip.innerHTML = `<span class="roi-tooltip-month">Month ${month}</span>${label}`;

    const svg = container.querySelector('svg');
    const pt = svg.createSVGPoint();
    pt.x = parseFloat(point.getAttribute('cx'));
    pt.y = parseFloat(point.getAttribute('cy'));
    const screenPt = pt.matrixTransform(svg.getScreenCTM());
    const cardRect = roiCard.getBoundingClientRect();

    tooltip.style.left = `${screenPt.x - cardRect.left}px`;
    tooltip.style.top = `${screenPt.y - cardRect.top}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    container.querySelectorAll('.roi-point').forEach((p) => p.classList.remove('active'));
  }
})();
