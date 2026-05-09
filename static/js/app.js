// CONTEÚDOS ORIGINAIS DA REFERÊNCIA
const giFlowData = {
  narratives: [
    { id: "short", title: "Short version", text: "I am a marketing-driven builder with startup energy, social impact experience, and a growth mindset focused on learning fast." },
    { id: "medium", title: "Medium version", text: "My background connects marketing, leadership, volunteering, and an MBA in Web3. I like turning ambiguity into structure." },
    { id: "long", title: "Long version", text: "I see career development as an OS. Experience with Único Roteiro and relief efforts in RS. Specialist in product design." }
  ],
  stories: [
    { title: "Leadership", situation: "Different communication styles.", action: "Listened first, clarified goals.", result: "Alignment regained." },
    { title: "Conflict", situation: "Stakeholders had different priorities.", action: "Reframed around shared goals.", result: "Trust restored." },
    { title: "Pressure", situation: "Multiple responsibilities.", action: "Prioritized high-impact tasks.", result: "Protected quality." }
  ],
  bank: [
    { q: "Tell me about yourself", a: "Focus on the builder mindset and the OS analogy." },
    { q: "Why Google?", a: "Alignment with innovation, scale, and mission-driven culture." }
  ],
  toolkit: [
    { cat: "Connectors", items: ["First, I would like to give context", "The main challenge was", "As a result"] },
    { cat: "Leadership", items: ["Ownership", "Alignment", "Hands-on approach", "Adaptability"] }
  ]
};

// RENDERIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  const narrativesGrid = document.getElementById('narrativesContainer');
  giFlowData.narratives.forEach(n => {
    narrativesGrid.innerHTML += `
            <details class="glass-card">
                <summary>${n.title}</summary>
                <div class="details-content"><p>${n.text}</p></div>
            </details>
        `;
  });

  const storiesGrid = document.getElementById('storiesContainer');
  giFlowData.stories.forEach(s => {
    storiesGrid.innerHTML += `
            <div class="story-card">
                <h3>${s.title}</h3>
                <p><strong>Situation:</strong> ${s.situation}</p>
                <p><strong>Action:</strong> ${s.action}</p>
                <p><strong>Result:</strong> ${s.result}</p>
            </div>
        `;
  });

  const bankGrid = document.getElementById('interviewBankGrid');
  giFlowData.bank.forEach(b => {
    bankGrid.innerHTML += `<div class="glass-card"><h3>${b.q}</h3><p>${b.a}</p></div>`;
  });

  const toolkitGrid = document.getElementById('languageToolkitGrid');
  giFlowData.toolkit.forEach(t => {
    toolkitGrid.innerHTML += `
            <div class="glass-card">
                <h3>${t.cat}</h3>
                <ul style="list-style:none; padding:0; color:var(--muted);">${t.items.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
        `;
  });
});

document.addEventListener('DOMContentLoaded', () => {

const aiTrigger = document.getElementById('ai-trigger');
const aiAssistant = document.getElementById('assistant');
const closeAi = document.getElementById('close-ai');

aiTrigger.addEventListener('click', () => {
  aiAssistant.classList.toggle('hidden');
});

closeAi.addEventListener('click', () => {
  aiAssistant.classList.add('hidden');
});

});

// MODOS DE IDIOMA
const modeBtns = document.querySelectorAll('.mode-btn');
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    console.log("Mode switched to:", btn.dataset.mode);
  });
});