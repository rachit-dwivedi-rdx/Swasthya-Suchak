from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv
from groq import Groq
from knowledge_base import search_knowledge, INDEX, CHUNKS
from image_analyzer import analyze_image_full
from pyngrok import ngrok
import pdfplumber
import requests
import os

load_dotenv()

app = Flask(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")


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


# ─────────────────────────────────────────
# Memory functions
# ─────────────────────────────────────────
def get_history(sender):
    if sender not in user_sessions:
        user_sessions[sender] = []
    return user_sessions[sender]


def add_to_history(sender, role, content):
    if sender not in user_sessions:
        user_sessions[sender] = []
    user_sessions[sender].append({
        "role": role,
        "content": content
    })
    # Sirf last MAX_HISTORY messages rakho
    if len(user_sessions[sender]) > MAX_HISTORY * 2:
        user_sessions[sender] = user_sessions[sender][-MAX_HISTORY * 2:]


def clear_history(sender):
    user_sessions[sender] = []


# ─────────────────────────────────────────
# AI Response — memory ke saath
# ─────────────────────────────────────────
def get_ai_response(sender, user_message):
    try:
        # Knowledge base se relevant data dhundo
        relevant_data = search_knowledge(user_message, INDEX, CHUNKS)

        # Context banao
        context = ""
        if relevant_data:
            context = f"""Relevant health info from our knowledge base:
{relevant_data}"""

        # Messages list banao — system + history + new message
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if context:
            messages.append({"role": "system", "content": context})

        # Purani history add karo
        history = get_history(sender)
        messages.extend(history)

        # Naya message add karo
        messages.append({"role": "user", "content": user_message})

        # Groq call
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300
        )

        reply = response.choices[0].message.content.strip()

        # History mein save karo — ESCALATE tags hataake
        clean_reply = reply.replace("ESCALATE:YES", "").replace("ESCALATE:NO", "").strip()
        add_to_history(sender, "user", user_message)
        add_to_history(sender, "assistant", clean_reply)

        return reply

    except Exception as e:
        print(f"Groq Error: {e}")
        return "Service unavailable hai, thodi der baad try karein....."


# ─────────────────────────────────────────
# Media download
# ─────────────────────────────────────────
def download_media(media_url):
    response = requests.get(
        media_url,
        auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    )
    return response.content


# ─────────────────────────────────────────
# PDF handle
# ─────────────────────────────────────────
def handle_pdf(media_url, sender):
    try:
        pdf_bytes = download_media(media_url)
        temp_path = "temp_report.pdf"
        with open(temp_path, "wb") as f:
            f.write(pdf_bytes)

        extracted_text = ""
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() or ""
        os.remove(temp_path)

        if not extracted_text.strip():
            return "PDF mein readable text nahi mila....."

        prompt = f"""Yeh medical report hai. Simple Hindi mein explain karo:
- Kya normal hai
- Kya abnormal hai
- Kya karna chahiye
- Doctor se kab milna chahiye

Report: {extracted_text[:3000]}"""

        return get_ai_response(sender, prompt)

    except Exception as e:
        print(f"PDF Error: {e}")
        return "PDF padh nahi paya....."


# ─────────────────────────────────────────
# Voice handle
# ─────────────────────────────────────────
def handle_voice(media_url, sender):
    try:
        audio_bytes = download_media(media_url)
        temp_path = "temp_audio.ogg"
        with open(temp_path, "wb") as f:
            f.write(audio_bytes)

        with open(temp_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                language="hi"
            )
        os.remove(temp_path)

        user_text = transcription.text
        print(f"Voice: {user_text}")

        reply = get_ai_response(sender, user_text)
        return reply, user_text

    except Exception as e:
        print(f"Voice Error: {e}")
        return "Voice samajh nahi aaya....", ""


# ─────────────────────────────────────────
# Escalation check + clean
# ─────────────────────────────────────────
def check_and_clean(reply, sender):
    escalated = "ESCALATE:YES" in reply
    if escalated:
        print(f"ESCALATION: {sender}")
    reply = reply.replace("ESCALATE:YES", "").strip()
    reply = reply.replace("ESCALATE:NO", "").strip()
    if escalated:
        reply += "\n\nYeh serious lag raha hai — turant doctor ya hospital jaao!"
    return reply


# ─────────────────────────────────────────
# Home
# ─────────────────────────────────────────
@app.route("/")
def home():
    return "Swasthya Suchak Running"


# ─────────────────────────────────────────
# WhatsApp route
# ─────────────────────────────────────────
@app.route("/whatsapp", methods=['POST'])
def whatsapp_reply():
    incoming_msg = request.form.get('Body', '').strip()
    sender = request.form.get('From', '')
    num_media = int(request.form.get('NumMedia', 0))

    print(f"From {sender}: {incoming_msg}")

    reply_text = ""

    # ── Reset command ──
    if incoming_msg.lower() in ["reset", "clear", "naya shuru"]:
        clear_history(sender)
        reply_text = "Conversation reset ho gayi! Naya sawaal poocho"

    # ── Media ──
    elif num_media > 0:
        media_url = request.form.get('MediaUrl0', '')
        media_type = request.form.get('MediaContentType0', '')
        print(f"📎 Media: {media_type}")

        if 'pdf' in media_type:
            reply_text = handle_pdf(media_url, sender)

        elif 'image' in media_type:
            image_bytes = download_media(media_url)
            reply_text = analyze_image_full(image_bytes)
            # Image context bhi history mein save karo
            add_to_history(sender, "user", "[User ne image bheji thi]")
            add_to_history(sender, "assistant", reply_text)

        elif 'audio' in media_type or 'ogg' in media_type:
            reply_text, transcribed = handle_voice(media_url, sender)
            if transcribed:
                reply_text = f"Aapne kaha: {transcribed}\n\n{reply_text}"

        else:
            reply_text = "Yeh format support nahi hota. PDF, image ya voice bhejein"

    # ── Normal text ──
    elif incoming_msg:
        reply_text = get_ai_response(sender, incoming_msg)

    else:
        reply_text = "Haan bolo, kya hua?"

    reply_text = check_and_clean(reply_text, sender)

    response = MessagingResponse()
    response.message(reply_text)
    print(f"Reply: {reply_text[:100]}...")
    return str(response)


if __name__ == "__main__":
    ngrok.set_auth_token(os.getenv("NGROK_AUTH_TOKEN"))
    public_url = ngrok.connect(5000)
    print(f"\nngrok tunnel active!")
    print(f"Set this in Twilio Sandbox Webhook:")
    print(f"{public_url}/whatsapp\n")
    app.run(debug=False, port=5000)