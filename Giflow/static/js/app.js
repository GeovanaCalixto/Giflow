const form = document.querySelector(".assistant-form");
const input = document.querySelector(".assistant-form input");
const messages = document.querySelector(".assistant-messages");
const modeButtons = document.querySelectorAll(".mode-btn");

const interviewBankGrid = document.querySelector("#interviewBankGrid");
const languageToolkitGrid = document.querySelector("#languageToolkitGrid");

let currentMode = "bilingual";

function addMessage(type, title, text, tips = []) {
  const message = document.createElement("div");

  if (type === "user") {
    message.classList.add("user-message");
  } else {
    message.classList.add("bot-message");
  }

  const tipsHtml = tips.length
    ? `<ul>${tips.map((tip) => `<li>${tip}</li>`).join("")}</ul>`
    : "";

  const formattedText = text.replace(/\n/g, "<br>");

  message.innerHTML = `
    <strong>${title}</strong>
    <p>${formattedText}</p>
    ${tipsHtml}
  `;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function addLoadingMessage() {
  const message = document.createElement("div");
  message.classList.add("bot-message");

  message.innerHTML = `
    <strong>Thinking...</strong>
    <p>Reading your interview preparation system.</p>
  `;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;

  return message;
}

function createBankCard(key, item) {
  const card = document.createElement("article");
  card.classList.add("bank-card");

  const title = key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  card.innerHTML = `
    <span class="card-tag">Strategic answer</span>
    <h3>${title}</h3>
    <p class="preview">${item.english}</p>
    <details>
      <summary>Open answer</summary>
      <p><strong>English:</strong><br>${item.english}</p>
      <p><strong>Português:</strong><br>${item.portuguese}</p>
    </details>
  `;

  return card;
}

function createToolkitCard(title, items, fields) {
  const card = document.createElement("article");
  card.classList.add("toolkit-card");

  const listItems = items
    .slice(0, 7)
    .map((item) => {
      const content = fields
        .filter((field) => item[field])
        .map((field) => item[field])
        .join(" | ");

      return `<li>${content}</li>`;
    })
    .join("");

  card.innerHTML = `
    <span class="card-tag">Language support</span>
    <h3>${title}</h3>
    <ul>${listItems}</ul>
  `;

  return card;
}

function createStarCard(star) {
  const card = document.createElement("article");
  card.classList.add("toolkit-card");

  card.innerHTML = `
    <span class="card-tag">Framework</span>
    <h3>STAR + Reflection</h3>
    <ul>
      <li><strong>S</strong> - ${star.situation.label}: ${star.situation.example}</li>
      <li><strong>T</strong> - ${star.task.label}: ${star.task.example}</li>
      <li><strong>A</strong> - ${star.action.label}: ${star.action.example}</li>
      <li><strong>R</strong> - ${star.result.label}: ${star.result.example}</li>
      <li><strong>Reflection</strong>: ${star.reflection.example}</li>
    </ul>
  `;

  return card;
}

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

      languageToolkitGrid.appendChild(
        createToolkitCard("Connectives", data.language.connectives, [
          "term",
          "translation",
          "example"
        ])
      );

      languageToolkitGrid.appendChild(
        createToolkitCard("Powerful verbs", data.language.powerful_verbs, [
          "term",
          "translation",
          "example"
        ])
      );

      languageToolkitGrid.appendChild(
        createToolkitCard("Phrases that save", data.language.phrases_that_save, [
          "term",
          "translation",
          "use"
        ])
      );

      languageToolkitGrid.appendChild(
        createToolkitCard("Marketing terms", data.language.marketing_terms, [
          "term",
          "translation",
          "definition"
        ])
      );

      languageToolkitGrid.appendChild(
        createToolkitCard("Web3 terms", data.language.web3_terms, [
          "term",
          "translation",
          "definition"
        ])
      );

      languageToolkitGrid.appendChild(createStarCard(data.language.star_reflection));
    }
  } catch (error) {
    console.error("Could not load page content", error);
  }
}

modeButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    modeButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    currentMode = button.dataset.mode;

    const modeMessages = {
      bilingual: "Current mode: Bilingual",
      english: "Current mode: English",
      portuguese: "Modo atual: Português",
      translate: "Current mode: Translate"
    };

    addMessage(
      "bot",
      currentMode === "portuguese" ? "Modo alterado" : "Mode changed",
      modeMessages[currentMode],
      []
    );
  });
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const userText = input.value.trim();

  if (!userText) {
    return;
  }

  addMessage("user", "You", userText);

  input.value = "";

  const loadingMessage = addLoadingMessage();

  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText,
        mode: currentMode
      })
    });

    const data = await response.json();

    loadingMessage.remove();

    addMessage("bot", data.title, data.answer, data.tips || []);
  } catch (error) {
    loadingMessage.remove();

    addMessage(
      "bot",
      "Connection error",
      "I could not connect to the Flask assistant. Check if the server is running.",
      []
    );
  }
});

loadPageContent();
