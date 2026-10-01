const esc = (value) => String(value).replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const signalClass = (s) => s === 'BUY' ? 'signal-buy' : s === 'WATCH' ? 'signal-watch' : 'signal-sell';
async function loadDashboard() {
  const data = await (await fetch('/api/overview')).json();
  const s = data.summary;
  const cards = [['Total symbols', s.total_symbols], ['Low IV', s.low_iv_count], ['Gamma blast', s.gamma_blast_count], ['Avg. score', s.avg_score], ['Buy signals', s.buy_count], ['Top pick', s.top_pick.symbol]];
  document.querySelector('#summary').innerHTML = cards.map(([label, value]) => `<div class="summary-card"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div></div>`).join('');
  const list = (id, items, empty) => document.querySelector(id).innerHTML = items.length ? items.map(x => `<div class="chip"><b>${esc(x.symbol)}</b><span>${esc(x.score)}</span></div>`).join('') : `<div class="chip">${empty}</div>`;
  list('#low-iv-list', data.low_iv, 'No low-IV setups'); list('#gamma-list', data.gamma_blast, 'No gamma-blast setups');
  document.querySelector('#watchlist-body').innerHTML = data.signals.map(x => `<tr><td><b>${esc(x.symbol)}</b></td><td>${esc(x.asset_type)}</td><td>$${Number(x.price).toFixed(2)}</td><td>${esc(x.iv_percentile)}</td><td>${esc(x.mtf_alignment)}</td><td>${esc(x.event_label)}</td><td><span class="signal-badge ${signalClass(x.signal)}">${esc(x.signal)}</span></td><td>${esc(x.score)}</td></tr>`).join('');
}
loadDashboard().catch((error) => { document.body.insertAdjacentHTML('beforeend', `<p class="error">Unable to load dashboard: ${esc(error.message)}</p>`); });
