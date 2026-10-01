const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

const signalClass = (s) => {
  if (s === 'BUY') return 'signal-buy';
  if (s === 'WATCH') return 'signal-watch';
  return 'signal-sell';
};

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;
const scoreTone = (score) => (score >= 80 ? 'Strong' : score >= 65 ? 'Positive' : score >= 55 ? 'Watch' : 'Soft');

async function loadDashboard() {
  const res = await fetch('/api/overview');
  if (!res.ok) throw new Error(`Dashboard request failed (${res.status})`);

  const data = await res.json();
  const s = data.summary || {};
  const signals = Array.isArray(data.signals) ? data.signals : [];
  const lowIv = Array.isArray(data.low_iv) ? data.low_iv : [];
  const gamma = Array.isArray(data.gamma_blast) ? data.gamma_blast : [];

  const cards = [
    ['Total symbols', s.total_symbols ?? 0],
    ['Low IV', s.low_iv_count ?? 0],
    ['Gamma blast', s.gamma_blast_count ?? 0],
    ['Avg. score', s.avg_score ?? 0],
    ['Buy signals', s.buy_count ?? 0],
    ['Top pick', (s.top_pick && s.top_pick.symbol) ? s.top_pick.symbol : 'N/A']
  ];

  document.querySelector('#summary').innerHTML = cards
    .map(([label, value]) => `
      <div class="summary-card">
        <div class="label">${esc(label)}</div>
        <div class="value">${esc(value)}</div>
      </div>
    `)
    .join('');

  const lowIvList = document.querySelector('#low-iv-list');
  lowIvList.innerHTML = lowIv.length
    ? lowIv
        .slice(0, 8)
        .map((x) => `
          <div class="chip">
            <strong>${esc(x.symbol)}</strong>
            <span>${esc(x.score)}</span>
          </div>
        `)
        .join('')
    : '<div class="empty-state">No low-IV setups</div>';

  const gammaList = document.querySelector('#gamma-list');
  gammaList.innerHTML = gamma.length
    ? gamma
        .slice(0, 8)
        .map((x) => `
          <div class="chip">
            <strong>${esc(x.symbol)}</strong>
            <span>${esc(x.score)}</span>
          </div>
        `)
        .join('')
    : '<div class="empty-state">No gamma-blast setups</div>';

  const topPick = s.top_pick && s.top_pick.symbol ? s.top_pick : { symbol: 'N/A', score: 0 };
  const pulseValue = topPick.symbol !== 'N/A' ? `${topPick.symbol} · ${topPick.score}` : 'No setup';
  document.querySelector('#marketPulse').textContent = pulseValue;
  document.querySelector('#biasValue').textContent = (s.buy_count ?? 0) >= (s.watch_count ?? 0) ? 'Bullish' : 'Balanced';
  document.querySelector('#topPickValue').textContent = topPick.symbol;

  const rows = signals
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((x) => `
      <tr>
        <td><b>${esc(x.symbol)}</b></td>
        <td>${esc(x.asset_type || 'stock')}</td>
        <td>${formatCurrency(x.price ?? 0)}</td>
        <td class="delta ${Number(x.daily_change_pct) >= 0 ? 'up' : 'down'}">
          ${Number(x.daily_change_pct ?? 0).toFixed(2)}%
        </td>
        <td>${esc(x.mtf_alignment || 'Neutral')}</td>
        <td><span class="signal-badge ${signalClass(x.signal)}">${esc(x.signal)}</span></td>
        <td>
          <div class="score-cell">
            <span>${esc(x.score)}</span>
            <small>${esc(scoreTone(x.score))}</small>
          </div>
        </td>
      </tr>
    `)
    .join('');

  document.querySelector('#watchlist-body').innerHTML = rows || '<tr><td colspan="7">No market signals available.</td></tr>';
}

const refreshButton = document.querySelector('#refreshButton');
if (refreshButton) {
  refreshButton.addEventListener('click', async () => {
    refreshButton.disabled = true;
    refreshButton.textContent = 'Refreshing…';
    try {
      await loadDashboard();
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = 'Refresh data';
    }
  });
}

loadDashboard().catch((error) => {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<p class="error">Unable to load dashboard: ${esc(error.message)}</p>`
  );
});
