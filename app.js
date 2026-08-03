const brief = document.querySelector('#brief');
const cards = document.querySelector('#cards');
const results = document.querySelector('#results');
let goal = 'Create';

const examples = [
  'Design a two-week onboarding experience that helps new remote employees feel genuinely connected.',
  'Help a neighborhood café decide whether a loyalty program is worth the effort.',
  'Turn confusing sustainability data into a story a non-technical executive can use.',
  'Plan a small launch for an app that helps people remember the stories behind family recipes.'
];

document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
  document.querySelector('.chip.active').classList.remove('active');
  chip.classList.add('active'); goal = chip.dataset.goal;
}));

document.querySelector('#surprise').addEventListener('click', () => {
  brief.value = examples[Math.floor(Math.random() * examples.length)]; brief.focus();
});

document.querySelector('#run').addEventListener('click', generate);
brief.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate(); });

function generate() {
  const problem = brief.value.trim();
  if (!problem) { brief.focus(); brief.placeholder = 'Start with a real question—then press Generate strategy.'; return; }
  const modes = [
    { lens:'THE SYSTEMS LENS', title:'Map the terrain', why:'Useful when the real issue has more moving parts than it first appears.', prompt:`You are a systems strategist. Help me ${goal.toLowerCase()} around this brief:\n\n“${problem}”\n\nFirst identify the actors, incentives, constraints, and second-order effects. Then offer 3 approaches in a table, including tradeoffs and a low-risk first experiment. End with the one question that would most change your recommendation.` },
    { lens:'THE HUMAN LENS', title:'Start with a person', why:'Useful when adoption, trust, or emotion will decide whether an idea works.', prompt:`You are an empathetic researcher. I want to ${goal.toLowerCase()} around this brief:\n\n“${problem}”\n\nCreate 3 vivid user archetypes with distinct needs and anxieties. For each, show what success feels like in their words. Use those insights to propose a solution that is practical, inclusive, and emotionally resonant.` },
    { lens:'THE MAKER LENS', title:'Make it testable', why:'Useful when you need momentum and evidence instead of another polished theory.', prompt:`You are a pragmatic product builder. Help me ${goal.toLowerCase()} around this brief:\n\n“${problem}”\n\nTurn this into a 7-day test. Define the smallest valuable prototype, who to show it to, the exact feedback to collect, a success threshold, and what to do if the signal is weak. Be specific and frugal.` }
  ];
  cards.innerHTML = '';
  const template = document.querySelector('#card-template');
  modes.forEach((mode, index) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.number').textContent = `0${index + 1}`;
    node.querySelector('.lens').textContent = mode.lens;
    node.querySelector('h3').textContent = mode.title;
    node.querySelector('.why').textContent = mode.why;
    node.querySelector('.prompt').textContent = mode.prompt;
    node.querySelector('.copy').addEventListener('click', async e => {
      await navigator.clipboard.writeText(mode.prompt);
      e.currentTarget.firstChild.textContent = 'Copied! ';
      setTimeout(() => e.currentTarget.firstChild.textContent = 'Copy prompt ', 1600);
    });
    cards.appendChild(node);
  });
  results.classList.remove('hidden');
  results.scrollIntoView({ behavior:'smooth', block:'start' });
}
