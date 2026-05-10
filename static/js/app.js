// SELETORES EXISTENTES
const form = document.querySelector(".assistant-form");
const input = document.querySelector(".assistant-form input");
const messages = document.querySelector(".assistant-messages");
const modeButtons = document.querySelectorAll(".mode-btn");
const interviewBankGrid = document.querySelector("#interviewBankGrid");
const languageToolkitGrid = document.querySelector("#languageToolkitGrid");

// NOVOS SELETORES PARA ABRIR/FECHAR IA
const aiTrigger = document.querySelector("#ai-trigger");
const assistantWindow = document.querySelector("#assistant");
const closeAi = document.querySelector("#close-ai");

let currentMode = "bilingual";

// --- LÓGICA DE ABRIR/FECHAR (CORREÇÃO) ---
if (aiTrigger) {
    aiTrigger.onclick = (e) => {
        e.stopPropagation();
        assistantWindow.classList.toggle("hidden");
    };
}

if (closeAi) {
    closeAi.onclick = () => {
        assistantWindow.classList.add("hidden");
    };
}

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
    if (assistantWindow && !assistantWindow.contains(e.target) && e.target !== aiTrigger) {
        assistantWindow.classList.add("hidden");
    }
});

// --- SUA LÓGICA ORIGINAL DE MENSAGENS E CARDS ---
function addMessage(type, title, text, tips = []) {
    const message = document.createElement("div");
    message.classList.add(type === "user" ? "user-message" : "bot-message");

    const tipsHtml = tips.length ? `<ul>${tips.map((tip) => `<li>${tip}</li>`).join("")}</ul>` : "";
    const formattedText = text.replace(/\n/g, "<br>");

    message.innerHTML = `<strong>${title}</strong><p>${formattedText}</p>${tipsHtml}`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function addLoadingMessage() {
    const message = document.createElement("div");
    message.classList.add("bot-message");
    message.innerHTML = `<strong>Thinking...</strong><p>Reading your system.</p>`;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
}

function createBankCard(key, item) {
    const card = document.createElement("article");
    card.classList.add("glass-card"); // Usando sua classe CSS chic
    const title = key.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

    card.innerHTML = `
        <span class="section-label">Strategic answer</span>
        <h3>${title}</h3>
        <p style="color:var(--muted); font-size:14px;">${item.english.substring(0, 80)}...</p>
        <details>
            <summary style="justify-content:center;">Open full answer</summary>
            <div class="details-content">
                <p><strong>English:</strong><br>${item.english}</p>
                <p><strong>Português:</strong><br>${item.portuguese}</p>
            </div>
        </details>
    `;
    return card;
}

function createToolkitCard(title, items, fields) {
    const card = document.createElement("article");
    card.classList.add("glass-card");
    const listItems = items.slice(0, 5).map((item) => {
        const content = fields.filter((f) => item[f]).map((f) => item[f]).join(" | ");
        return `<li style="font-size:13px; margin-bottom:5px;">${content}</li>`;
    }).join("");

    card.innerHTML = `
        <span class="section-label">Support</span>
        <h3>${title}</h3>
        <ul style="list-style:none; padding:0; text-align:left;">${listItems}</ul>
    `;
    return card;
}

// --- CARREGAMENTO DE CONTEÚDO ---
async function loadPageContent() {
    try {
        const response = await fetch("/api/content");
        const data = await response.json();

        if (interviewBankGrid && data.interview_bank) {
            interviewBankGrid.innerHTML = "";
            Object.entries(data.interview_bank).forEach(([key, item]) => {
                interviewBankGrid.appendChild(createBankCard(key, item));
            });
        }

        if (languageToolkitGrid && data.language) {
            languageToolkitGrid.innerHTML = "";
            // Renderiza as categorias do seu JSON de tradução
            const categories = ["connectives", "powerful_verbs", "phrases_that_save", "marketing_terms", "web3_terms"];
            categories.forEach(cat => {
                if(data.language[cat]) {
                    languageToolkitGrid.appendChild(createToolkitCard(cat.replace("_", " "), data.language[cat], ["term", "translation"]));
                }
            });
        }
    } catch (error) {
        console.error("API offline, usando modo estático", error);
    }
}

// MUDANÇA DE MODO
modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        modeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentMode = button.dataset.mode;
    });
});

// SUBMIT DO CHAT
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    addMessage("user", "You", userText);
    input.value = "";
    const loading = addLoadingMessage();

    try {
        const response = await fetch("/api/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText, mode: currentMode })
        });
        const data = await response.json();
        loading.remove();
        addMessage("bot", data.title, data.answer, data.tips || []);
    } catch (error) {
        loading.remove();
        addMessage("bot", "System Mode", "API disconnected. Ready to edit local code.");
    }
});

loadPageContent();
