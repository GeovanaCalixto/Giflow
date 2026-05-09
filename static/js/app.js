// GiFlow AI - Versão Estática para GitHub Pages
// Desenvolvido por Geovana Calixto | UI/UX Specialist

const form = document.querySelector(".assistant-form");
const input = document.querySelector(".assistant-form input");
const messages = document.querySelector(".assistant-messages");
const modeButtons = document.querySelectorAll(".mode-btn");
const interviewBankGrid = document.querySelector("#interviewBankGrid");
const languageToolkitGrid = document.querySelector("#languageToolkitGrid");

let currentMode = "bilingual";
let globalData = {}; // Armazena os JSONs carregados

// 1. UTILITÁRIOS (Traduzidos do seu app.py)
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreMatch(message, keywords) {
  let score = 0;
  const msg = normalizeText(message);
  keywords.forEach(key => {
    if (msg.includes(normalizeText(key))) score++;
  });
  return score;
}

// 2. INTERFACE (Mensagens e Cards)
function addMessage(type, title, text, tips = []) {
  const message = document.createElement("div");
  message.classList.add(type === "user" ? "user-message" : "bot-message");

  const tipsHtml = tips.length
    ? `<ul>${tips.map(tip => `<li>${tip}</li>`).join("")}</ul>`
    : "";

  message.innerHTML = `
        <strong>${title}</strong>
        <p>${text.replace(/\n/g, "<br>")}</p>
        ${tipsHtml}
    `;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function addLoadingMessage() {
  const message = document.createElement("div");
  message.classList.add("bot-message");
  message.innerHTML = `<strong>Thinking...</strong><p>Reading your interview system.</p>`;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

// 3. CRIAÇÃO DINÂMICA DE CARDS (Seu código original)
function createBankCard(key, item) {
  const card = document.createElement("article");
  card.classList.add("bank-card");
  const title = key.replaceAll("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  card.innerHTML = `
        <span class="card-tag">Strategic answer</span>
        <h3>${title}</h3>
        <p class="preview">${item.english.substring(0, 80)}...</p>
        <details>
            <summary>Open answer</summary>
            <p><strong>English:</strong><br>${item.english}</p>
            <p><strong>Português:</strong><br>${item.portuguese}</p>
        </details>`;
  return card;
}

function createToolkitCard(title, items, fields) {
  const card = document.createElement("article");
  card.classList.add("toolkit-card");
  const listItems = items.slice(0, 6).map(item => {
    const content = fields.filter(f => item[f]).map(f => item[f]).join(" | ");
    return `<li>${content}</li>`;
  }).join("");
  card.innerHTML = `<span class="card-tag">Language support</span><h3>${title}</h3><ul>${listItems}</ul>`;
  return card;
}

// 4. LÓGICA DO ASSISTENTE (O coração do app.py convertido)
function getAIResponse(userText, mode) {
  const msg = normalizeText(userText);

  // Perfil Pessoal
  const profileWords = ["about", "yourself", "introduce", "introduction", "trajetoria", "sobre mim", "quem sou eu"];
  if (profileWords.some(w => msg.includes(w))) {
    const p = globalData.personal_profile.introduction;
    return {
      title: mode === "portuguese" ? "Apresentação Pessoal" : "Personal Introduction",
      answer: mode === "portuguese" ? p.portuguese_long : p.long,
      tips: ["Connect your career timeline with your learning mindset."]
    };
  }

  // Interview Bank Match
  let bestBank = null; let bestScore = 0;
  Object.values(globalData.interview_bank).forEach(item => {
    let s = scoreMatch(msg, item.keywords || []);
    if (s > bestScore) { bestBank = item; bestScore = s; }
  });
  if (bestBank) {
    return {
      title: "Interview Answer",
      answer: mode === "portuguese" ? bestBank.portuguese : bestBank.english,
      tips: bestBank.tips || []
    };
  }

  // Stories Match
  let bestStory = null; let sScore = 0;
  globalData.stories.forEach(story => {
    let s = scoreMatch(msg, story.keywords || []);
    if (s > sScore) { bestStory = story; sScore = s; }
  });
  if (bestStory) {
    return {
      title: `Story match: ${bestStory.title}`,
      answer: `Situation: ${bestStory.situation}\nAction: ${bestStory.action}\nResult: ${bestStory.result}`,
      tips: ["Finish with what you learned to show growth mindset."]
    };
  }

  return {
    title: "Strategic Coach",
    answer: globalData.prompts.default_response,
    tips: globalData.prompts.suggested_questions
  };
}

// 5. INICIALIZAÇÃO E EVENTOS
async function loadPageContent() {
  try {
    const files = ['stories', 'dictionary', 'prompts', 'personal_profile', 'language_support', 'interview_bank'];
    for (const file of files) {
      const response = await fetch(`static/data/${file}.json`);
      globalData[file] = await response.json();
    }

    // Popular Grids
    if (interviewBankGrid) {
      interviewBankGrid.innerHTML = "";
      Object.entries(globalData.interview_bank).forEach(([key, item]) => {
        interviewBankGrid.appendChild(createBankCard(key, item));
      });
    }

    if (languageToolkitGrid) {
      const lang = globalData.language_support;
      languageToolkitGrid.innerHTML = "";
      languageToolkitGrid.appendChild(createToolkitCard("Connectives", lang.connectives, ["term", "translation"]));
      languageToolkitGrid.appendChild(createToolkitCard("Powerful Verbs", lang.powerful_verbs, ["term", "translation"]));
      languageToolkitGrid.appendChild(createToolkitCard("Marketing Terms", lang.marketing_terms, ["term", "definition"]));
    }
  } catch (e) { console.error("Error loading JSONs:", e); }
}

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    addMessage("bot", "System Update", `Mode switched to: ${currentMode}`, []);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", "You", text);
  input.value = "";

  const loading = addLoadingMessage();
  setTimeout(() => {
    loading.remove();
    const response = getAIResponse(text, currentMode);
    addMessage("bot", response.title, response.answer, response.tips);
  }, 600);
});


loadPageContent();

