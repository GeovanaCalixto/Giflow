import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request


app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "static" / "data"


def load_json(filename):
    with (DATA_DIR / filename).open("r", encoding="utf-8") as file:
        return json.load(file)


def normalize(text):
    replacements = {
        "á": "a",
        "à": "a",
        "ã": "a",
        "â": "a",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "õ": "o",
        "ô": "o",
        "ú": "u",
        "ç": "c",
        "ñ": "n"
    }

    normalized = (text or "").strip().lower()

    for original, replacement in replacements.items():
        normalized = normalized.replace(original, replacement)

    return normalized


def score_match(message, keywords):
    total = 0

    for keyword in keywords:
        if normalize(keyword) in message:
            total += 1

    return total


def format_items(items, fields):
    lines = []

    for item in items:
        parts = []

        for field in fields:
            if field in item:
                parts.append(str(item[field]))

        lines.append(" - " + " | ".join(parts))

    return "\n".join(lines)


def build_interview_bank_response(item, mode="bilingual"):
    if mode == "english":
        answer = item["english"]
        title = "Interview answer"
        tips = item.get("tips", [])

    elif mode == "portuguese":
        answer = item["portuguese"]
        title = "Resposta de entrevista"
        tips = item.get("tips", [])

    elif mode == "translate":
        answer = (
            f"Interview English version:\n{item['english']}\n\n"
            f"Tradução em português:\n{item['portuguese']}"
        )
        title = "Modo tradução"
        tips = item.get("tips", [])

    else:
        answer = (
            f"English answer:\n{item['english']}\n\n"
            f"Portuguese translation:\n{item['portuguese']}"
        )
        title = "Interview answer"
        tips = item.get("tips", [])

    return {
        "title": title,
        "answer": answer,
        "tips": tips
    }


def build_language_response(language, category, mode="bilingual"):
    if category == "connectives":
        title = "Connectives"
        items = language["connectives"]
        answer = format_items(items, ["term", "translation", "example", "mindset"])

    elif category == "verbs":
        title = "Powerful verbs"
        items = language["powerful_verbs"]
        answer = format_items(items, ["term", "translation", "example", "signal"])

    elif category == "save_phrases":
        title = "Phrases that save"
        items = language["phrases_that_save"]
        answer = format_items(items, ["term", "translation", "use"])

    elif category == "marketing":
        title = "Marketing terms"
        items = language["marketing_terms"]
        answer = format_items(items, ["term", "translation", "definition"])

    elif category == "web3":
        title = "Web3 terms"
        items = language["web3_terms"]
        answer = format_items(items, ["term", "translation", "definition"])

    elif category == "star":
        title = "STAR + Reflection"
        star = language["star_reflection"]
        answer = (
            f"S - {star['situation']['label']} ({star['situation']['translation']}): {star['situation']['example']}\n"
            f"T - {star['task']['label']} ({star['task']['translation']}): {star['task']['example']}\n"
            f"A - {star['action']['label']} ({star['action']['translation']}): {star['action']['example']}\n"
            f"R - {star['result']['label']} ({star['result']['translation']}): {star['result']['example']}\n"
            f"Reflection ({star['reflection']['translation']}): {star['reflection']['example']}"
        )

    else:
        title = "Language support"
        answer = (
            "I can help with connectives, powerful verbs, phrases that save, "
            "STAR structure, marketing terms, and Web3 terms."
        )

    if mode == "portuguese":
        title_map = {
            "connectives": "Conectivos",
            "verbs": "Verbos fortes",
            "save_phrases": "Frases que salvam",
            "marketing": "Termos de marketing",
            "web3": "Termos de Web3",
            "star": "STAR + Reflexão"
        }

        title = title_map.get(category, "Apoio de linguagem")

    return {
        "title": title,
        "answer": answer,
        "tips": [
            "Use these as building blocks during your interview answers.",
            "Practice them out loud so they become natural.",
            "Combine vocabulary with a specific personal example."
        ]
    }


def build_story_response(story, dictionary, mode="bilingual"):
    anchors = ", ".join(dictionary.get("communication_anchors", [])[:3])

    english_answer = (
        f"I would frame this using STAR.\n\n"
        f"Situation: {story['situation']}\n"
        f"Challenge: {story['challenge']}\n"
        f"Action: {story['action']}\n"
        f"Result: {story['result']}\n"
        f"Reflection: {story['reflection']}"
    )

    portuguese_answer = (
        f"Eu estruturaria essa resposta usando STAR.\n\n"
        f"Situação: essa experiência mostra um contexto em que havia diferentes prioridades, pessoas ou desafios de comunicação.\n"
        f"Desafio: o ponto principal era criar clareza e alinhamento.\n"
        f"Ação: minha resposta mostra que eu ouvi primeiro, organizei o problema e transformei a situação em próximos passos concretos.\n"
        f"Resultado: a história demonstra mais clareza, colaboração e senso de responsabilidade.\n"
        f"Reflexão: o aprendizado principal é que preparação, estrutura e comunicação ajudam a transformar limitações em evolução."
    )

    portuguese_explanation = (
        "Essa resposta funciona bem porque mostra pensamento estruturado, maturidade e growth mindset. "
        "Ela não tenta esconder que o inglês ainda está em desenvolvimento; ela mostra que você criou um sistema "
        "para comunicar melhor, aprender mais rápido e performar com mais clareza."
    )

    if mode == "english":
        title = f"Story match: {story['title']}"
        answer = english_answer
        tips = [
            "Start with context in one clear sentence.",
            "Show the challenge before explaining your action.",
            "Finish with what you learned and how you improved."
        ]

    elif mode == "portuguese":
        title = f"História encontrada: {story['theme']}"
        answer = portuguese_answer
        tips = [
            "Comece com o contexto em uma frase clara.",
            "Explique o desafio antes de falar da ação.",
            "Finalize com o aprendizado para mostrar growth mindset."
        ]

    elif mode == "translate":
        title = "Modo tradução e estudo"
        answer = (
            f"Versão em inglês para entrevista:\n{english_answer}\n\n"
            f"Explicação em português:\n{portuguese_explanation}\n\n"
            f"Frases úteis:\n"
            f"- Let me rephrase that.\n"
            f"- What I mean is.\n"
            f"- To make it more concrete.\n"
            f"- The key point is."
        )
        tips = [
            "Use este modo para transformar ideias em português em respostas fortes em inglês.",
            "Compare a lógica da resposta com a versão em inglês.",
            "Repita as frases úteis em voz alta para ganhar fluência."
        ]

    else:
        title = f"Story match: {story['title']}"
        answer = (
            f"English answer:\n{english_answer}\n\n"
            f"Portuguese explanation:\n{portuguese_explanation}"
        )
        tips = [
            "Open with the context in one clear sentence.",
            "Use structure to make your English easier to follow.",
            f"Use anchors such as {anchors} when you need time to think."
        ]

    return {
        "title": title,
        "answer": answer,
        "tips": tips
    }


def build_profile_response(profile, mode="bilingual"):
    intro = profile["introduction"]
    positioning = profile["positioning"]
    google = profile["google_narrative"]

    english_answer = (
        f"{intro['long']}\n\n"
        f"My core message is: {google['core_message']}\n\n"
        f"This project reflects one idea: {positioning['main_idea']}"
    )

    portuguese_answer = intro["portuguese_long"]

    if mode == "english":
        title = "Personal introduction"
        answer = english_answer
        tips = [
            "Keep the first sentence warm and direct.",
            "Connect your career timeline with your learning mindset.",
            "End by showing how GiFlow reflects strategic preparation."
        ]

    elif mode == "portuguese":
        title = "Apresentação pessoal"
        answer = portuguese_answer
        tips = [
            "Comece agradecendo a oportunidade.",
            "Conecte trajetória, aprendizado e propósito.",
            "Finalize mostrando que o GiFlow é uma prova prática do seu mindset."
        ]

    elif mode == "translate":
        title = "Modo tradução: apresentação pessoal"
        answer = (
            f"Interview English version:\n{english_answer}\n\n"
            f"Tradução fiel em português:\n{intro['portuguese_long']}"
        )
        tips = [
            "Pratique em blocos, não tudo de uma vez.",
            "Grave sua fala e compare clareza, ritmo e confiança.",
            "Use frases de apoio quando precisar ganhar tempo."
        ]

    else:
        title = "Personal introduction"
        answer = (
            f"English answer:\n{english_answer}\n\n"
            f"Portuguese translation:\n{intro['portuguese_long']}"
        )
        tips = [
            "Use this when the interviewer asks: Tell me about yourself.",
            "Do not rush the timeline.",
            "Make your learning system part of the story."
        ]

    return {
        "title": title,
        "answer": answer,
        "tips": tips
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/content")
def content():
    return jsonify({
        "stories": load_json("stories.json"),
        "dictionary": load_json("dictionary.json"),
        "prompts": load_json("prompts.json"),
        "profile": load_json("personal_profile.json"),
        "language": load_json("language_support.json"),
        "interview_bank": load_json("interview_bank.json")
    })


@app.route("/api/assistant", methods=["POST"])
def assistant():
    payload = request.get_json(silent=True) or {}
    message = normalize(payload.get("message", ""))
    mode = payload.get("mode", "bilingual")

    stories = load_json("stories.json")
    dictionary = load_json("dictionary.json")
    prompts = load_json("prompts.json")
    profile = load_json("personal_profile.json")
    language = load_json("language_support.json")
    interview_bank = load_json("interview_bank.json")

    if not message:
        return jsonify({
            "title": "Ready when you are",
            "answer": "Send me a theme, interview question, or vocabulary need.",
            "tips": [
                "Try: Tell me about leadership",
                "Try: Me ajuda com liderança",
                "Try: Tell me about yourself"
            ]
        })

    profile_words = [
        "about",
        "yourself",
        "introduce",
        "introduction",
        "presentation",
        "trajetoria",
        "sobre mim",
        "apresentacao",
        "apresentação",
        "me apresenta",
        "fale sobre mim",
        "quem sou eu",
        "experiencia",
        "experiencias",
        "background"
    ]

    if any(word in message for word in profile_words):
        return jsonify(build_profile_response(profile, mode))

    best_bank_item = None
    best_bank_score = 0

    for item in interview_bank.values():
        current_score = score_match(message, item.get("keywords", []))

        if current_score > best_bank_score:
            best_bank_item = item
            best_bank_score = current_score

    if best_bank_item:
        return jsonify(build_interview_bank_response(best_bank_item, mode))

    if any(word in message for word in ["conectivo", "conectivos", "connective", "connectives"]):
        return jsonify(build_language_response(language, "connectives", mode))

    if any(word in message for word in ["verbo", "verbos", "powerful", "verbs", "strong verbs"]):
        return jsonify(build_language_response(language, "verbs", mode))

    if any(word in message for word in ["travei", "travar", "save", "salvar", "frases que salvam"]):
        return jsonify(build_language_response(language, "save_phrases", mode))

    if any(word in message for word in ["marketing", "rice", "aarrr", "north star", "roi", "churn"]):
        return jsonify(build_language_response(language, "marketing", mode))

    if any(word in message for word in ["web3", "dao", "token", "ownership", "creator economy"]):
        return jsonify(build_language_response(language, "web3", mode))

    if any(word in message for word in ["star", "reflection", "reflexao", "estrutura"]):
        return jsonify(build_language_response(language, "star", mode))

    best_story = None
    best_score = 0

    for story in stories:
        current_score = score_match(message, story.get("keywords", []))

        if current_score > best_score:
            best_story = story
            best_score = current_score

    if best_story:
        return jsonify(build_story_response(best_story, dictionary, mode))

    translation_words = [
        "translate",
        "traduzir",
        "traducao",
        "translation",
        "portuguese",
        "portugues",
        "english",
        "ingles"
    ]

    vocabulary_words = [
        "vocabulary",
        "dictionary",
        "phrase",
        "phrases",
        "fluency",
        "vocabulario",
        "dicionario",
        "frase",
        "frases",
        "fluencia",
        "espanhol",
        "spanish"
    ]

    if any(word in message for word in translation_words):
        return jsonify({
            "title": "Translation study mode",
            "answer": (
                "I can help you study in two layers: first, I shape your answer in English; "
                "then I explain the logic in Portuguese so you understand the structure, vocabulary, and intention."
            ),
            "tips": [
                "Send a sentence in Portuguese and ask: translate this to interview English.",
                "Send an English answer and ask: improve my fluency.",
                "Ask: explain this answer in Portuguese."
            ]
        })

    if any(word in message for word in vocabulary_words):
        return jsonify({
            "title": "Fluency support",
            "answer": "Here are practical phrases you can use to stay clear, calm, and structured during an interview.",
            "tips": dictionary.get("fluency_support_phrases", [])[:6]
        })

    return jsonify({
        "title": "Strategic interview coach",
        "answer": prompts["default_response"],
        "tips": prompts["suggested_questions"]
    })


if __name__ == "__main__":
    app.run(debug=True)
