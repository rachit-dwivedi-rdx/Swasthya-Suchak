import cv2
import numpy as np
from groq import Groq
import base64
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────
# OpenCV se basic detection
# ─────────────────────────────────────────
def opencv_preprocess(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return None, "normal"

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_red = np.array([0, 50, 50])
    upper_red = np.array([10, 255, 255])
    red_mask = cv2.inRange(hsv, lower_red, upper_red)
    red_percent = (np.sum(red_mask > 0) / red_mask.size) * 100

    lower_yellow = np.array([20, 50, 50])
    upper_yellow = np.array([30, 255, 255])
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
    yellow_percent = (np.sum(yellow_mask > 0) / yellow_mask.size) * 100

    findings = []
    if red_percent > 15:
        findings.append(f"Significant redness detected ({red_percent:.1f}%)")
    if yellow_percent > 20:
        findings.append(f"Yellowish tint detected ({yellow_percent:.1f}%) - possible jaundice")

    opencv_result = ", ".join(findings) if findings else "No significant color anomalies"
    return img, opencv_result


# ─────────────────────────────────────────
# Full Image Analysis
# ─────────────────────────────────────────
def analyze_image_full(image_bytes, system_prompt=None):
    try:
        # Step 1: OpenCV preprocessing
        img, opencv_findings = opencv_preprocess(image_bytes)
        print(f"OpenCV findings: {opencv_findings}")

        # Step 2: Groq Vision se deep analysis
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Enhanced system prompt for better medical analysis
        base_system = system_prompt or """
You are Swasthya Suchak, an expert Indian health assistant analyzing medical images.

**CRITICAL INSTRUCTIONS:**

1. **BE REALISTIC & SPECIFIC**: Analyze the ACTUAL image carefully. Don't give generic responses.
   - If it's a cut/wound: Mention depth, size, bleeding status
   - If it's a rash: Mention color, pattern, affected area size
   - If it's a burn: Mention degree, area affected
   - If it's swelling: Mention location, size, color

2. **CONTEXTUAL FOLLOW-UP QUESTIONS**: Ask questions SPECIFIC to what you see:
   - For cuts: "Kis cheez se kata? (knife, glass, metal)" "Kitna gehra hai? (skin surface ya andar tak)"
   - For rashes: "Kab se hai yeh rash?" "Khujli kitni hai?" "Koi naya soap/cream use kiya?"
   - For burns: "Kaise jala? (garam pani, oil, fire)" "Turant thanda pani lagaya tha?"
   - For swelling: "Kaise lagi? (chot, insect bite)" "Dard kitna hai?"

3. **GHARELU UPAY MUST BE SPECIFIC** to the injury type and severity you observe

Provide response in this EXACT format (NO EMOJIS):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Detailed observation in 3-4 lines - BE SPECIFIC about what you see:
- Type of injury/condition (cut, burn, rash, swelling, etc.)
- Severity (halka, medium, serious)
- Size/area affected (1 inch, 2 cm, palm size, etc.)
- Visible symptoms (bleeding, pus, redness, swelling)
- Any immediate concerns]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GHARELU UPAY (Pehle Ye Try Karein)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Give 4 remedies SPECIFIC to the injury type you observed]

1. [First Aid - Immediate action]
   • Kaise karein: [exact method with measurements]
   • Kitni baar: [frequency]
   • Kyun zaroori: [brief reason]

2. [Home Remedy 1 - Specific to injury]
   • Kaise banayein: [preparation with measurements]
   • Kaise lagayein: [application method]
   • Kab tak: [duration - 2-3 din tak]

3. [Home Remedy 2 - Specific to injury]
   • Instructions: [detailed steps]
   • Frequency: [kitni baar din mein]
   • Expected result: [kya hoga]

4. [General Care - Specific to injury]
   • [Care tip 1 specific to this injury]
   • [Care tip 2 specific to this injury]
   • [What to avoid]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KUCH AUR BATAYEIN (Zaroori Hai)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Ask 4-5 SPECIFIC questions based on what you see in the image]

For CUTS/WOUNDS:
• Kis cheez se kata/laga? (knife, glass, metal, kuch aur)
• Kitna gehra hai? (sirf upar ki skin ya andar tak)
• Khoon kitna nikla? (thoda/bahut/ab bhi nikal raha)
• Kab hua tha? (kitne ghante/din pehle)
• Tetanus injection liya hai kabhi? (last 5 years mein)

For RASH/SKIN ISSUES:
• Yeh rash kab se hai? (kitne din/weeks)
• Khujli kitni hai? (halki/medium/bahut zyada)
• Koi naya product use kiya? (soap, cream, detergent)
• Kuch naya khaya? (seafood, nuts, koi medicine)
• Pehle kabhi aisa hua hai?

For BURNS:
• Kaise jala? (garam pani, oil, fire, chemical)
• Kab hua? (kitne ghante pehle)
• Turant thanda pani lagaya tha? (kitni der tak)
• Chhale pade hain? (blisters)
• Dard kitna hai? (1-10 scale pe)

For SWELLING/INJURY:
• Kaise lagi chot? (gir gaye, takkar lagi, insect bite)
• Kab lagi? (kitne ghante/din pehle)
• Dard kitna hai? (halka/medium/bahut zyada)
• Hilane-dulane mein problem? (movement issue)
• Pehle bhi yahan chot lagi thi?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOCTOR KE PAAS ZAROOR JAAYEIN AGAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Give 3-4 SPECIFIC warning signs based on injury type]

• [Warning sign 1 - specific to this injury]
• [Warning sign 2 - specific to this injury]
• [Warning sign 3 - when immediate help needed]
• [Warning sign 4 - complications to watch for]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**IMPORTANT GUIDELINES:**
- Analyze the ACTUAL image, don't give generic responses
- Be SPECIFIC about size, depth, severity
- Ask CONTEXTUAL questions based on injury type
- Give remedies SPECIFIC to what you observe
- Use measurements (1 inch, 2 cm, palm size)
- Mention realistic timeframes (2-3 din, 1 week)
- Keep response 250-300 words
- Use Hindi/Hinglish naturally
- If serious (deep wound, severe burn, infection signs), add ESCALATE:YES at end
- NO EMOJIS - Use clean text formatting only
"""

        user_prompt = f"""Computer vision analysis: {opencv_findings}

ANALYZE THE IMAGE CAREFULLY and provide REALISTIC, SPECIFIC response:

1. Look at the ACTUAL injury/condition in the image
2. Be SPECIFIC about:
   - Type (cut, burn, rash, swelling, etc.)
   - Severity (halka, medium, serious)
   - Size (1 inch, 2 cm, palm size)
   - Visible details (bleeding, pus, color, depth)

3. Give GHARELU UPAY specific to THIS injury type

4. Ask CONTEXTUAL follow-up questions:
   - For cuts: "Kis cheez se kata?" "Kitna gehra hai?"
   - For burns: "Kaise jala?" "Thanda pani lagaya?"
   - For rash: "Koi naya soap use kiya?" "Khujli kitni hai?"
   - For swelling: "Kaise lagi chot?" "Hilane mein problem?"

5. Format EXACTLY follow karo with line separators
6. NO EMOJIS - only clean text
7. Be like a real doctor examining the patient"""

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": base_system
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": user_prompt
                        }
                    ]
                }
            ],
            max_tokens=600
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Image Analysis Error: {e}")
        return "Image analyze nahi ho paya......."