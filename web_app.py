from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
from knowledge_base import search_knowledge, INDEX, CHUNKS
from image_analyzer import analyze_image_full
from database import (
    save_conversation, save_message, get_conversations,
    get_messages, delete_conversation, update_conversation_title
)
import pdfplumber
import base64
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Same session memory as WhatsApp bot ──
user_sessions = {}
MAX_HISTORY = 10

SYSTEM_PROMPT = """You are Swasthya Suchak, a trusted Indian health assistant.

Language rule: Reply in the EXACT same language as the user.
- Devanagari input → Hindi reply
- English input → English reply
- Hinglish (Roman) input → Hinglish reply
- Garhwali input (words like chu, dukh chu, kan che, kakh, myaar, tyaar, bataundu) → reply mixing Garhwali + Hindi

Garhwali vocabulary reference:
- Kan che / Tu kan che = How are you
- Me theek chaun = I am fine
- Myaar = My
- Tyaar = Your
- Kakh = Where
- Dukh chu = It hurts / pain is there
- Bukhar chu = Fever is there
- Sir me dukh chu = Head is hurting
- Pet me dukh chu = Stomach is hurting
- Khasi chu = Cough is there
- M bataundu = I will tell you
- Theek ho jaula = Will get better

Response Structure (MUST FOLLOW):

1. **Gharelu Upay (Home Remedies)** - Start here ALWAYS:
   - Give 3-4 practical home remedies
   - Be specific with measurements (1 chammach, 2 glass, etc.)
   - Mention how to use (kaise lagana/khana hai)
   - Mention frequency (kitni baar karna hai)

2. **Follow-up Questions** - End with 2-3 questions:
   - Kab se hai yeh problem?
   - Kitna severe hai? (halka/medium/zyada)
   - Koi aur symptoms hai?
   - Pehle kabhi hua hai?

Response rules:
- Keep reply between 100-150 words
- Use simple, caring, conversational tone
- Never suggest medicine names or doses
- If serious/emergency, add ESCALATE:YES at end
- Format: [Gharelu upay with details] + [Follow-up questions]
"""


def get_history(user):
    return user_sessions.setdefault(user, [])


def add_to_history(user, role, content):
    history = user_sessions.setdefault(user, [])
    history.append({"role": role, "content": content})
    if len(history) > MAX_HISTORY * 2:
        user_sessions[user] = history[-MAX_HISTORY * 2:]


def extract_follow_up_questions(reply):
    """Extract follow-up questions from AI reply"""
    questions = []
    lines = reply.split('\n')
    
    print(f"\n=== Extracting Questions ===")
    print(f"Total lines: {len(lines)}")
    
    # Look for lines starting with bullet points
    for line in lines:
        line = line.strip()
        if line.startswith('•') or line.startswith('-') or line.startswith('*'):
            # Remove bullet point
            question = line.lstrip('•-* ').strip()
            print(f"Found bullet line: {question}")
            
            # Check if it's a question (contains ? or ends with common question patterns)
            is_question = (
                '?' in question or
                question.lower().startswith(('kab', 'kitna', 'kitni', 'kya', 'kaise', 'kis', 'koi', 'pehle')) or
                question.lower().startswith(('when', 'how', 'what', 'which', 'any', 'did'))
            )
            
            # Also check if it's NOT an instruction (doesn't contain colon or instruction words)
            is_not_instruction = (
                ':' not in question and
                not any(word in question.lower() for word in ['kaise karein', 'instructions', 'frequency', 'kab tak', 'kitni baar', 'kyun zaroori', 'kaise banayein', 'kaise lagayein'])
            )
            
            if is_question and is_not_instruction:
                # Clean up the question
                question = ' '.join(question.split())
                if len(question) > 10 and len(question) < 150:
                    questions.append(question)
                    print(f"✓ Added question: {question}")
                else:
                    print(f"✗ Rejected (length): {len(question)} chars")
            else:
                print(f"✗ Not a question or is instruction")
    
    print(f"\nTotal questions extracted: {len(questions)}")
    print(f"Questions: {questions}\n")
    return questions[:5]  # Return max 5 questions


def check_and_clean(reply, user):
    escalated = "ESCALATE:YES" in reply
    reply = reply.replace("ESCALATE:YES", "").replace("ESCALATE:NO", "").strip()
    if escalated:
        reply += "\n\n ......."
    return reply


def get_ai_response(user, message):
    try:
        # Detect language from user message
        is_devanagari = any('\u0900' <= char <= '\u097F' for char in message)
        is_garhwali = any(word in message.lower() for word in ['chu', 'chun', 'chha', 'kasa', 'dukh chu', 'thik chu'])
        
        # Add language instruction to system prompt
        language_instruction = ""
        if is_devanagari:
            language_instruction = "\n\nIMPORTANT: User has written in HINDI (Devanagari script). You MUST reply ONLY in Hindi using Devanagari script. Do NOT use English or Roman script."
        elif is_garhwali:
            language_instruction = "\n\nIMPORTANT: User has written in GARHWALI. You MUST reply mixing Garhwali words with Hindi. Use phrases like 'chu', 'm bataundu', 'tumko'."
        elif message.isascii() and not any(word in message.lower() for word in ['hai', 'mujhe', 'mere', 'kya', 'kaise']):
            language_instruction = "\n\nIMPORTANT: User has written in PURE ENGLISH. You MUST reply ONLY in English. Do NOT use Hindi words."
        else:
            language_instruction = "\n\nIMPORTANT: User has written in HINGLISH (Roman script mix). You MUST reply in Hinglish using Roman script only."
        
        relevant_data = search_knowledge(message, INDEX, CHUNKS)
        messages = [{"role": "system", "content": SYSTEM_PROMPT + language_instruction}]
        if relevant_data:
            messages.append({"role": "system", "content": f"Relevant health info:\n{relevant_data}"})
        messages.extend(get_history(user))
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300,
            temperature=0.3
        )
        reply = response.choices[0].message.content.strip()
        clean_reply = reply.replace("ESCALATE:YES", "").replace("ESCALATE:NO", "").strip()
        add_to_history(user, "user", message)
        add_to_history(user, "assistant", clean_reply)
        return reply
    except Exception as e:
        print(f"Groq Error: {e}")
        return "Service abhi available nahi hai, thodi der baad try karein...."


# ── Text chat ──
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip()
    user = data.get("user", "web_user")

    if not message:
        return jsonify({"reply": "Kuch toh likho....."})

    if message.lower() in ["reset", "clear", "naya shuru"]:
        user_sessions[user] = []
        return jsonify({"reply": "Conversation reset ho gayi! Naya sawaal poocho...."})

    reply = get_ai_response(user, message)
    reply = check_and_clean(reply, user)
    
    # Extract follow-up questions from reply
    follow_up_questions = extract_follow_up_questions(reply)
    
    return jsonify({"reply": reply, "followUpQuestions": follow_up_questions})


# ── Image analysis ──
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    data = request.get_json()
    image_data = data.get("image", "")
    user = data.get("user", "web_user")

    try:
        # Strip base64 header if present (data:image/jpeg;base64,...)
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        image_bytes = base64.b64decode(image_data)
        reply = analyze_image_full(image_bytes)
        reply = check_and_clean(reply, user)
        add_to_history(user, "user", "[User ne image bheji]")
        add_to_history(user, "assistant", reply)
        
        # Extract follow-up questions from reply
        follow_up_questions = extract_follow_up_questions(reply)
        
        # Extract follow-up questions from reply
        follow_up_questions = extract_follow_up_questions(reply)
        
        return jsonify({"reply": reply, "followUpQuestions": follow_up_questions})
    except Exception as e:
        print(f"Image route error: {e}")
        return jsonify({"reply": "Image analyze nahi ho paya....."})


# ── PDF analysis ──
@app.route("/analyze-pdf", methods=["POST"])
def analyze_pdf():
    user = request.form.get("user", "web_user")
    file = request.files.get("file")

    if not file:
        return jsonify({"reply": "PDF nahi mila....."})

    try:
        temp_path = "temp_web_report.pdf"
        file.save(temp_path)
        extracted_text = ""
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() or ""
        os.remove(temp_path)

        if not extracted_text.strip():
            return jsonify({"reply": "PDF mein readable text nahi mila...."})

        prompt = f"""Yeh medical report hai. Simple Hindi mein explain karo:
- Kya normal hai
- Kya abnormal hai
- Kya karna chahiye
- Doctor se kab milna chahiye

Report: {extracted_text[:3000]}"""

        reply = get_ai_response(user, prompt)
        reply = check_and_clean(reply, user)
        
        # Extract follow-up questions from reply
        follow_up_questions = extract_follow_up_questions(reply)
        
        return jsonify({"reply": reply, "followUpQuestions": follow_up_questions})
    except Exception as e:
        print(f"PDF Error: {e}")
        return jsonify({"reply": "PDF padh nahi paya....."})


# ── Voice transcription ──
@app.route("/transcribe", methods=["POST"])
def transcribe():
    user = request.form.get("user", "web_user")
    audio_file = request.files.get("audio")

    if not audio_file:
        return jsonify({"reply": "Audio nahi mila....", "transcript": ""})

    try:
        temp_path = "temp_web_audio.ogg"
        audio_file.save(temp_path)
        with open(temp_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=f,
                language="hi"
            )
        os.remove(temp_path)
        transcript = transcription.text
        reply = get_ai_response(user, transcript)
        reply = check_and_clean(reply, user)
        
        # Extract follow-up questions from reply
        follow_up_questions = extract_follow_up_questions(reply)
        
        return jsonify({"reply": reply, "transcript": transcript, "followUpQuestions": follow_up_questions})
    except Exception as e:
        print(f"Voice Error: {e}")
        return jsonify({"reply": "Voice samajh nahi aaya.....", "transcript": ""})


# ── Get all conversations for a user ──
@app.route("/conversations/<user>", methods=["GET"])
def get_user_conversations(user):
    try:
        convos = get_conversations(user)
        return jsonify({"conversations": convos})
    except Exception as e:
        print(f"Error fetching conversations: {e}")
        return jsonify({"error": str(e)}), 500


# ── Get messages for a conversation ──
@app.route("/conversations/<conversation_id>/messages", methods=["GET"])
def get_conversation_messages(conversation_id):
    try:
        messages = get_messages(conversation_id)
        return jsonify({"messages": messages})
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({"error": str(e)}), 500


# ── Save conversation ──
@app.route("/conversations", methods=["POST"])
def create_conversation():
    data = request.get_json()
    user = data.get("user")
    convo_id = data.get("id")
    title = data.get("title")
    created_at = data.get("createdAt")
    
    try:
        save_conversation(user, convo_id, title, created_at)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error saving conversation: {e}")
        return jsonify({"error": str(e)}), 500


# ── Save message ──
@app.route("/messages", methods=["POST"])
def create_message():
    data = request.get_json()
    msg_id = data.get("id")
    conversation_id = data.get("conversationId")
    role = data.get("role")
    content = data.get("content")
    timestamp = data.get("timestamp")
    image = data.get("image")
    
    try:
        save_message(msg_id, conversation_id, role, content, timestamp, image)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({"error": str(e)}), 500


# ── Delete conversation ──
@app.route("/conversations/<conversation_id>", methods=["DELETE"])
def remove_conversation(conversation_id):
    try:
        delete_conversation(conversation_id)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error deleting conversation: {e}")
        return jsonify({"error": str(e)}), 500


# ── Update conversation title ──
@app.route("/conversations/<conversation_id>/title", methods=["PUT"])
def update_title(conversation_id):
    data = request.get_json()
    title = data.get("title")
    
    try:
        update_conversation_title(conversation_id, title)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error updating title: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Swasthya Suchak Web API Running"


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", debug=False, port=port)
