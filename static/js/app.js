// --- DATABASE COMPLETA INTEGRADA ---
const giFlowData = {
    profile: {
        positioning: "When I do not fully master something yet, I build intelligent systems to accelerate my evolution.",
        intro_long: "I graduated in 2024, but I have been working in marketing since 2022. I created GiFlow not to hide my limitations, but to demonstrate how I transform them into systems for growth.",
        strengths: ["Hard-working (focus on delivery)", "Problem solver", "Creative", "Reliable", "Clear purpose"],
        development: {
            english: "My English is a work in progress. I use structured preparation and AI-assisted workflows to ensure high performance while I improve.",
            overload: "I use a curation filter to distinguish noise from essential information, focusing only on what 'moves the needle'.",
            instinct: "I manage my problem-solver instinct by delegating based on timeline: shorter for experts, longer for those who need to grow."
        }
    },
    dictionary: {
        connectors: ["First, I would like to give some context", "The main challenge was", "What I learned was", "As a result", "Looking back"],
        strategic_verbs: ["prioritized", "aligned", "structured", "translated", "validated", "executed", "improved"],
        communication: ["Let me rephrase that", "What I mean is", "The key point is", "To make it more concrete"]
    },
    interview_bank: {
        why_web3: "Traditional digital marketing is reaching a plateau. I want to shift from channel management to ecosystem management using decentralization and digital ownership.",
        dao_lite: "I see an opportunity in 'DAO Lite' for YouTube: using Governance Tokens for top creators to vote on new features or visual identities.",
        why_google: "Google shapes markets instead of reacting to them. I want to operate at this level of innovation and scale.",
        fipan: "Two weeks before FIPAN, the agency failed. I stepped up, learned booth design myself, and delivered print-ready files just in time."
    },
    stories: [
        { id: "leadership", keywords: ["leader", "team", "alignment"], text: "Leadership for me is creating direction, trust, and momentum through listening and clarifying goals." },
        { id: "conflict", keywords: ["conflict", "disagreement", "tension"], text: "I reframe conflict as a signal of missing context. I bring structure to the conversation to find shared goals." },
        { id: "pressure", keywords: ["pressure", "deadline", "stress"], text: "Pressure taught me to simplify, communicate early, and focus on controllable actions." },
        { id: "volunteering", keywords: ["volunteer", "ngo", "impact"], text: "Led 19 volunteers in an NGO restructure. Taught me that meaningful work requires both empathy and execution." },
        { id: "startup", keywords: ["startup", "adaptability", "ambiguity"], text: "Learned to move forward without perfect information by using experimentation and fast learning." }
    ]
};

// --- SELETORES ---
const form = document.querySelector(".assistant-form");
const input = document.querySelector(".assistant-form input");
const messages = document.querySelector(".assistant-messages");
const aiTrigger = document.querySelector("#ai-trigger");
const assistantWindow = document.querySelector("#assistant");
const closeAi = document.querySelector("#close-ai");

// --- INTERFACE ---
if (aiTrigger) aiTrigger.onclick = (e) => { e.stopPropagation(); assistantWindow.classList.toggle("hidden"); };
if (closeAi) closeAi.onclick = () => assistantWindow.classList.add("hidden");

function addMsg(type, text) {
    const msg = document.createElement("div");
    msg.className = type === "user" ? "user-message" : "bot-message";
    msg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// --- LÓGICA DE RESPOSTA ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.toLowerCase();
    if (!query) return;

    addMsg("user", input.value);
    input.value = "";

    let r = "I can help with leadership, conflict, FIPAN, Web3, or STAR stories. What would you like to review?";

    // Busca nas Histórias (stories.json)
    const storyMatch = giFlowData.stories.find(s => s.keywords.some(k => query.includes(k)));
    
    if (storyMatch) {
        r = `<strong>${storyMatch.id.toUpperCase()}:</strong> ${storyMatch.text}`;
    } else if (query.includes("web3") || query.includes("mba")) {
        r = giFlowData.interview_bank.why_web3;
    } else if (query.includes("dao") || query.includes("opportunity")) {
        r = giFlowData.interview_bank.dao_lite;
    } else if (query.includes("google")) {
        r = giFlowData.interview_bank.why_google;
    } else if (query.includes("fipan") || query.includes("challenge")) {
        r = giFlowData.interview_bank.fipan;
    } else if (query.includes("weakness") || query.includes("development")) {
        r = `I have 3 main points: 1. ${giFlowData.profile.development.english} 2. ${giFlowData.profile.development.overload} 3. ${giFlowData.profile.development.instinct}`;
    } else if (query.includes("strength")) {
        r = "My core strengths are: " + giFlowData.profile.strengths.join(", ") + ".";
    } else if (query.includes("intro") || query.includes("about")) {
        r = giFlowData.profile.intro_long;
    } else if (query.includes("connect") || query.includes("vocab")) {
        r = "Try these connectors: " + giFlowData.dictionary.connectors.join(" | ");
    }

    setTimeout(() => addMsg("bot", r), 400);
});
