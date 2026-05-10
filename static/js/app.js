const giFlowData = {
  profile: {
    name: "Geovana Calixto",
    positioning: "When I do not fully master something yet, I build intelligent systems to accelerate my evolution.",
    intro:
      "I graduated in 2024, but I have been working in marketing since 2022. I created GiFlow not to hide my limitations, but to demonstrate how I transform them into systems for growth.",
    strengths: [
      "Hard-working and delivery-focused",
      "Problem solver",
      "Creative",
      "Reliable",
      "Clear purpose",
      "Fast learner",
      "Strategic communicator"
    ],
    development: {
      english:
        "My English is a work in progress. I use structured preparation and AI-assisted workflows to ensure high performance while I improve.",
      overload:
        "I use a curation filter to distinguish noise from essential information, focusing only on what moves the needle.",
      instinct:
        "I manage my problem-solver instinct by delegating based on timeline: shorter deadlines go to experts, longer deadlines can become learning opportunities for others."
    }
  },

  interviewBank: {
    tell_me_about_yourself:
      "I graduated in 2024, but I have been working in marketing since 2022. My path combines marketing, UX, creative execution, Web3 studies, and a strong habit of building systems to learn faster. GiFlow is an example of that mindset: when I face a challenge, I create structure, practice deliberately, and improve through iteration.",
    why_google:
      "Google shapes markets instead of only reacting to them. I want to work in an environment where technology, product thinking, and user impact operate at global scale. I am especially interested in how Google combines innovation, accessibility, and business impact.",
    why_web3:
      "Traditional digital marketing is reaching a plateau. Web3 expands the conversation from channel management to ecosystem management, digital ownership, participation, incentives, and community design.",
    dao_lite:
      "One idea I find interesting is a DAO Lite model for creators: for example, top YouTube creators could receive governance-style participation to vote on selected product features, community tools, or visual identity experiments.",
    fipan:
      "Two weeks before FIPAN, the agency failed. I stepped up, learned booth design, organized the visual requirements, and delivered print-ready files in time. The lesson was that ownership often means learning fast under pressure and keeping the final outcome clear.",
    weakness:
      "A development point is English fluency under pressure. I am actively improving it through structured preparation, vocabulary systems, and repeated practice. I do not see that as a fixed limitation. I see it as a skill I am building with discipline.",
    learning:
      "My learning process is system-based. I collect examples, organize patterns, practice deliberately, ask for feedback, and transform each iteration into a clearer version of my communication and execution."
  },

  stories: [
    {
      id: "Leadership",
      keywords: ["leadership", "leader", "team", "alignment", "liderança", "lider"],
      answer:
        "Leadership for me is creating direction, trust, and momentum. In moments of misalignment, I listen first, clarify the shared goal, organize the next steps, and help the team regain focus."
    },
    {
      id: "Conflict",
      keywords: ["conflict", "disagreement", "tension", "conflito", "discordância"],
      answer:
        "I reframe conflict as a sign that some context is missing. My approach is to slow down the conversation, understand each perspective, identify the shared objective, and turn the tension into a structured decision."
    },
    {
      id: "Pressure",
      keywords: ["pressure", "deadline", "stress", "pressão", "prazo"],
      answer:
        "Pressure taught me to simplify. I identify what matters most, communicate early, reduce unnecessary complexity, and focus on controllable actions until the delivery is complete."
    },
    {
      id: "Volunteering",
      keywords: ["volunteer", "ngo", "impact", "social", "voluntariado", "ong"],
      answer:
        "My social impact experience taught me that meaningful work requires both empathy and execution. It is not enough to care about the mission; you also need organization, clarity, and consistency."
    },
    {
      id: "Startup",
      keywords: ["startup", "ambiguity", "adaptability", "ambiguidade", "adaptabilidade"],
      answer:
        "Startup environments taught me to move forward without perfect information. I learned to test, adapt, communicate quickly, and use uncertainty as a reason to create structure."
    }
  ],

  dictionary: {
    connectors: [
      "First, I would like to give some context.",
      "The main challenge was...",
      "What I learned was...",
      "As a result...",
      "Looking back...",
      "To make it more concrete..."
    ],
    verbs: [
      "structured",
      "prioritized",
      "aligned",
      "translated",
      "validated",
      "executed",
      "improved",
      "synthesized",
      "optimized",
      "spearheaded"
    ],
    recovery: [
      "Let me rephrase that.",
      "What I mean is...",
      "The key point is...",
      "Could I take a second to structure my answer?",
      "I would explain it this way..."
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#assistant-form");
  const input = document.querySelector("#assistant-input");
  const messages = document.querySelector("#chat-messages");
  const aiTrigger = document.querySelector("#ai-trigger");
  const openInline = document.querySelector("#open-ai-inline");
  const assistantWindow = document.querySelector("#assistant");
  const closeAi = document.querySelector("#close-ai");
  const modeButtons = document.querySelectorAll(".mode-btn");

  let currentMode = "bilingual";

  function openAssistant() {
    assistantWindow.classList.remove("hidden");
    input.focus();
  }

  function closeAssistant() {
    assistantWindow.classList.add("hidden");
  }

  function addMsg(type, text) {
    const msg = document.createElement("div");
    msg.className = type === "user" ? "user-message" : "bot-message";
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function clean(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatList(items) {
    return items.map((item) => `• ${item}`).join("<br>");
  }

  function applyMode(answer) {
    if (currentMode === "english") {
      return answer;
    }

    if (currentMode === "portuguese") {
      return `Resumo em português:<br>${translateToPortugueseHint(answer)}`;
    }

    if (currentMode === "translate") {
      return `English:<br>${answer}<br><br>Português:<br>${translateToPortugueseHint(answer)}`;
    }

    return `${answer}<br><br><span class="muted-line">PT note: posso te ajudar a transformar isso em uma resposta mais natural para entrevista.</span>`;
  }

  function translateToPortugueseHint(answer) {
    const simpleMap = [
      {
        key: "Google shapes markets",
        value:
          "O Google molda mercados em vez de apenas reagir a eles. A ideia principal é mostrar que você quer atuar com inovação, escala e impacto real no usuário."
      },
      {
        key: "I graduated in 2024",
        value:
          "Você se apresenta como alguém formada em 2024, mas com experiência desde 2022, conectando marketing, UX, Web3 e aprendizado rápido."
      },
      {
        key: "Traditional digital marketing",
        value:
          "Você explica que o marketing digital tradicional está ficando limitado e que Web3 amplia a visão para ecossistemas, comunidade, participação e propriedade digital."
      },
      {
        key: "Pressure taught me",
        value:
          "A ideia central é mostrar que, sob pressão, você simplifica prioridades, comunica cedo e foca no que consegue controlar."
      }
    ];

    const found = simpleMap.find((item) => answer.includes(item.key));
    if (found) return found.value;

    return "Esta resposta destaca sua capacidade de criar estrutura, aprender rápido, comunicar com clareza e transformar desafios em evolução prática.";
  }

  function buildResponse(rawQuery) {
    const query = clean(rawQuery);

    const storyMatch = giFlowData.stories.find((story) =>
      story.keywords.some((keyword) => query.includes(clean(keyword)))
    );

    if (storyMatch) {
      return `<strong>${storyMatch.id} story:</strong><br>${storyMatch.answer}<br><br><strong>STAR structure:</strong><br>Situation: explain the context.<br>Task: clarify your responsibility.<br>Action: show what you did.<br>Result: close with impact and learning.`;
    }

    if (query.includes("tell me about") || query.includes("about yourself") || query.includes("intro") || query.includes("apresentacao") || query.includes("sobre mim")) {
      return giFlowData.interviewBank.tell_me_about_yourself;
    }

    if (query.includes("google") || query.includes("why google") || query.includes("por que google")) {
      return giFlowData.interviewBank.why_google;
    }

    if (query.includes("web3") || query.includes("mba")) {
      return giFlowData.interviewBank.why_web3;
    }

    if (query.includes("dao") || query.includes("youtube") || query.includes("opportunity") || query.includes("oportunidade")) {
      return giFlowData.interviewBank.dao_lite;
    }

    if (query.includes("fipan") || query.includes("challenge") || query.includes("desafio")) {
      return giFlowData.interviewBank.fipan;
    }

    if (query.includes("weakness") || query.includes("development") || query.includes("ponto fraco") || query.includes("desenvolvimento")) {
      return giFlowData.interviewBank.weakness;
    }

    if (query.includes("strength") || query.includes("forte") || query.includes("qualidade")) {
      return `<strong>Core strengths:</strong><br>${formatList(giFlowData.profile.strengths)}`;
    }

    if (query.includes("learn") || query.includes("learning") || query.includes("aprender") || query.includes("aprendizado")) {
      return giFlowData.interviewBank.learning;
    }

    if (query.includes("connector") || query.includes("connect") || query.includes("vocab") || query.includes("vocabulary") || query.includes("conector")) {
      return `<strong>Useful connectors:</strong><br>${formatList(giFlowData.dictionary.connectors)}`;
    }

    if (query.includes("verb") || query.includes("impact")) {
      return `<strong>Impact verbs:</strong><br>${formatList(giFlowData.dictionary.verbs)}`;
    }

    if (query.includes("travou") || query.includes("blank") || query.includes("rephrase") || query.includes("recover")) {
      return `<strong>Recovery phrases:</strong><br>${formatList(giFlowData.dictionary.recovery)}`;
    }

    if (query.includes("star")) {
      return "Use this STAR structure: Situation: give context. Task: explain your responsibility. Action: describe what you did. Result: show impact, learning, or measurable improvement.";
    }

    return "I can help with Google, Web3, FIPAN, leadership, conflict, pressure, volunteering, strengths, weaknesses, English practice, connectors, impact verbs, or STAR answers. Try asking: “Help me answer why Google” or “Give me a leadership story.”";
  }

  if (aiTrigger) {
    aiTrigger.addEventListener("click", openAssistant);
  }

  if (openInline) {
    openInline.addEventListener("click", openAssistant);
  }

  if (closeAi) {
    closeAi.addEventListener("click", closeAssistant);
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentMode = button.dataset.mode;
      addMsg("bot", `Mode changed to <strong>${button.textContent}</strong>.`);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = input.value.trim();
    if (!question) return;

    addMsg("user", question);
    input.value = "";

    const response = buildResponse(question);

    window.setTimeout(() => {
      addMsg("bot", applyMode(response));
    }, 250);
  });
});
