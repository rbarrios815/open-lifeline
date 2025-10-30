const state = {
  all: [],
  filtered: [],
  selected: null
};

async function loadData() {
  const res = await fetch('data/content.json');
  const data = await res.json();
  state.all = data.topics || [];
  state.filtered = [...state.all];
  renderTopics();
  if (state.all.length) select(state.all[0].id);
}

function renderTopics() {
  const wrap = document.getElementById('topics');
  wrap.innerHTML = '';
  state.filtered.forEach(item => {
    const a = document.createElement('button');
    a.className = 'topic';
    a.setAttribute('data-id', item.id);
    a.innerHTML = `<strong>${item.title}</strong><small>${item.category} · ${item.summary}</small>`;
    a.addEventListener('click', () => select(item.id));
    wrap.appendChild(a);
  });
}

function select(id) {
  const item = state.all.find(t => t.id === id);
  if (!item) return;
  state.selected = item;
  const el = document.getElementById('content');
  const steps = item.steps.map(s => `<li>${s}</li>`).join('');
  el.innerHTML = `
    <h2>${item.title} <span class="badge">${item.category}</span></h2>
    <p class="summary">${item.summary}</p>
    <ol class="steps">${steps}</ol>
  `;
  // Smooth scroll for mobile ergonomics
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupSearch() {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      state.filtered = [...state.all];
    } else {
      state.filtered = state.all.filter(t =>
        [t.title, t.category, t.summary, ...(t.keywords || [])]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }
    renderTopics();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  setupSearch();
  await loadData();
});
