# 🔄 User Query Processing Flow - Step by Step

## Complete Journey: From User Input to AI Response

---

## 📝 **STEP 1: User Types Query in Frontend**

**Location:** `ChatInterface.tsx` → `handleSendMessage()` function

**What Happens:**
1. User types message in textarea: `"मुझे सिर दर्द है"`
2. User presses Enter or clicks "Send" button
3. Frontend validates: Is message not empty?
4. Creates a `userMsg` object:
   ```typescript
   {
     id: "1234567890",
     role: "user",
     content: "मुझे सिर दर्द है",
     timestamp: "2024-01-15T10:30:00.000Z",
     image: undefined
   }
   ```

---

## 💾 **STEP 2: Save to Local State & Database**

**Location:** `ChatInterface.tsx` → `handleSendMessage()`

**What Happens:**
1. **Check if conversation exists:**
   - If NO conversation: Create new conversation with ID
   - If conversation exists: Use existing conversation ID

2. **Update UI immediately:**
   ```typescript
   setMessages((prev) => [...prev, userMsg])
   ```
   - User sees their message appear instantly

3. **Save to SQLite database:**
   - Call `api.saveMessage(conversationId, userMsg)`
   - Stores in `chat_history.db` for persistence

4. **Clear input & prepare for response:**
   ```typescript
   setInputValue("")
   setIsLoading(true)  // Show "Thinking..." animation
   ```

---

## 🌐 **STEP 3: Send HTTP Request to Backend**

**Location:** `frontend/src/app/utils/api.ts` → `sendMessage()`

**What Happens:**
1. **Prepare HTTP POST request:**
   ```typescript
   fetch("http://localhost:5001/chat", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       message: "मुझे सिर दर्द है",
       user: "john_doe"
     })
   })
   ```

2. **Request travels over network:**
   - From React frontend (port 5173)
   - To Flask backend (port 5001)
   - CORS enabled for cross-origin communication

---

## 🖥️ **STEP 4: Backend Receives Request**

**Location:** `web_app.py` → `/chat` route

**What Happens:**
1. **Flask receives POST request:**
   ```python
   @app.route("/chat", methods=["POST"])
   def chat():
       data = request.get_json()
       message = data.get("message")  # "मुझे सिर दर्द है"
       user = data.get("user")        # "john_doe"
   ```

2. **Validate input:**
   - Check if message is not empty
   - Check for special commands (reset, clear)

3. **Call AI processing function:**
   ```python
   reply = get_ai_response(user, message)
   ```

---

## 🧠 **STEP 5: Language Detection**

**Location:** `web_app.py` → `get_ai_response()`

**What Happens:**
1. **Detect script/language:**
   ```python
   # Check for Devanagari (Hindi)
   is_devanagari = any('\u0900' <= char <= '\u097F' for char in message)
   # Result: True (मुझे has Devanagari characters)
   
   # Check for Garhwali words
   is_garhwali = any(word in message.lower() for word in ['chu', 'chun', 'dukh chu'])
   # Result: False
   ```

2. **Set language instruction:**
   ```python
   language_instruction = """
   IMPORTANT: User has written in HINDI (Devanagari script). 
   You MUST reply ONLY in Hindi using Devanagari script.
   """
   ```

---

## 📚 **STEP 6: Search Knowledge Base**

**Location:** `knowledge_base.py` → `search_knowledge()`

**What Happens:**
1. **Load medical knowledge chunks:**
   - Reads from `data/symptoms.txt`, `data/diseases.txt`, `data/remedies.txt`
   - Total chunks loaded: ~3000+ medical information pieces

2. **Search for relevant information:**
   ```python
   query_words = "मुझे सिर दर्द है".lower().split()
   # query_words = ["मुझे", "सिर", "दर्द", "है"]
   
   # Score each chunk
   for chunk in chunks:
       score = sum(1 for word in query_words if word in chunk.lower())
       # Chunks about "सिर दर्द" get high scores
   ```

3. **Return top 3 relevant chunks:**
   ```
   Chunk 1: "सिर दर्द के कारण: तनाव, नींद की कमी..."
   Chunk 2: "सिर दर्द के घरेलू उपाय: अदरक की चाय..."
   Chunk 3: "सिर दर्द के लक्षण: माथे में दर्द..."
   ```

---

## 🤖 **STEP 7: Prepare AI Prompt**

**Location:** `web_app.py` → `get_ai_response()`

**What Happens:**
1. **Build conversation history:**
   ```python
   messages = [
       {
           "role": "system",
           "content": SYSTEM_PROMPT + language_instruction
       },
       {
           "role": "system",
           "content": "Relevant health info:\n[Knowledge base chunks]"
       },
       # Previous conversation (last 10 messages)
       {"role": "user", "content": "पहले का सवाल"},
       {"role": "assistant", "content": "पहले का जवाब"},
       # Current message
       {"role": "user", "content": "मुझे सिर दर्द है"}
   ]
   ```

2. **System prompt includes:**
   - Role: "You are Swasthya Suchak"
   - Language rules: Reply in same language
   - Response structure: Gharelu Upay + Follow-up questions
   - Garhwali vocabulary reference
   - Medical guidelines

---

## 🚀 **STEP 8: Call Groq AI API**

**Location:** `web_app.py` → `get_ai_response()`

**What Happens:**
1. **Send request to Groq:**
   ```python
   response = client.chat.completions.create(
       model="llama-3.3-70b-versatile",
       messages=messages,
       max_tokens=300,
       temperature=0.3  # Low temperature for consistent medical advice
   )
   ```

2. **Groq processes with LLaMA 3.3 70B:**
   - Model: Meta's LLaMA 3.3 (70 billion parameters)
   - Hosted on Groq's LPU (Language Processing Unit)
   - Ultra-fast inference: ~300 tokens/second
   - Context window: 8,192 tokens

3. **AI generates response:**
   ```
   सिर दर्द के लिए ये घरेलू उपाय आजमाएं:
   
   1. अदरक की चाय: 1 इंच अदरक को 1 कप पानी में उबालें...
   2. तुलसी के पत्ते: 5-6 पत्ते चबाएं...
   3. ठंडी पट्टी: माथे पर 10 मिनट के लिए...
   
   कुछ और बताएं:
   • कब से है यह दर्द?
   • कितना तेज है? (हल्का/मध्यम/बहुत)
   • कोई और लक्षण है?
   ```

---

## 🔍 **STEP 9: Extract Follow-up Questions**

**Location:** `web_app.py` → `extract_follow_up_questions()`

**What Happens:**
1. **Parse AI response line by line:**
   ```python
   lines = reply.split('\n')
   ```

2. **Find bullet points:**
   ```python
   for line in lines:
       if line.startswith('•') or line.startswith('-'):
           question = line.lstrip('•-* ').strip()
   ```

3. **Validate if it's a question:**
   ```python
   is_question = (
       '?' in question or
       question.startswith(('kab', 'kitna', 'kya', 'kaise'))
   )
   ```

4. **Filter out instructions:**
   ```python
   is_not_instruction = ':' not in question
   ```

5. **Return clean questions:**
   ```python
   questions = [
       "कब से है यह दर्द?",
       "कितना तेज है?",
       "कोई और लक्षण है?"
   ]
   ```

---

## 🧹 **STEP 10: Clean & Format Response**

**Location:** `web_app.py` → `check_and_clean()`

**What Happens:**
1. **Check for escalation flag:**
   ```python
   escalated = "ESCALATE:YES" in reply
   ```

2. **Remove internal flags:**
   ```python
   reply = reply.replace("ESCALATE:YES", "")
   reply = reply.replace("ESCALATE:NO", "")
   ```

3. **Add warning if escalated:**
   ```python
   if escalated:
       reply += "\n\n⚠️ यह गंभीर हो सकता है। डॉक्टर से मिलें।"
   ```

---

## 💬 **STEP 11: Update Conversation History**

**Location:** `web_app.py` → `add_to_history()`

**What Happens:**
1. **Store in memory (session):**
   ```python
   user_sessions["john_doe"] = [
       {"role": "user", "content": "मुझे सिर दर्द है"},
       {"role": "assistant", "content": "सिर दर्द के लिए..."}
   ]
   ```

2. **Maintain last 10 exchanges:**
   ```python
   if len(history) > MAX_HISTORY * 2:  # 10 * 2 = 20 messages
       user_sessions[user] = history[-20:]  # Keep only last 20
   ```

3. **Purpose:** Context for next question

---

## 📤 **STEP 12: Send Response to Frontend**

**Location:** `web_app.py` → `/chat` route

**What Happens:**
1. **Create JSON response:**
   ```python
   return jsonify({
       "reply": "सिर दर्द के लिए ये घरेलू उपाय...",
       "followUpQuestions": [
           "कब से है यह दर्द?",
           "कितना तेज है?",
           "कोई और लक्षण है?"
       ]
   })
   ```

2. **HTTP response sent:**
   - Status: 200 OK
   - Content-Type: application/json
   - Body: JSON with reply and questions

---

## 📥 **STEP 13: Frontend Receives Response**

**Location:** `ChatInterface.tsx` → `handleSendMessage()`

**What Happens:**
1. **Parse JSON response:**
   ```typescript
   const response = await api.sendMessage(user, message)
   // response = {
   //   reply: "सिर दर्द के लिए...",
   //   followUpQuestions: ["कब से है...", "कितना तेज..."]
   // }
   ```

2. **Create bot message object:**
   ```typescript
   const botMsg: BotMessage = {
     id: "1234567891",
     role: "assistant",
     content: response.reply,
     timestamp: new Date().toISOString(),
     followUpQuestions: response.followUpQuestions
   }
   ```

---

## 🎨 **STEP 14: Update UI**

**Location:** `ChatInterface.tsx`

**What Happens:**
1. **Add bot message to state:**
   ```typescript
   setMessages((prev) => [...prev, botMsg])
   ```

2. **Save to database:**
   ```typescript
   await api.saveMessage(conversationId, botMsg)
   ```

3. **Update conversation title:**
   ```typescript
   const title = getTitle([userMsg, botMsg])
   // title = "मुझे सिर दर्द है"
   await api.updateTitle(conversationId, title)
   ```

4. **Stop loading animation:**
   ```typescript
   setIsLoading(false)
   ```

5. **Render in UI:**
   - Bot avatar appears
   - Message bubble with response
   - Follow-up question buttons below
   - Smooth scroll to bottom

---

## 🖱️ **STEP 15: User Sees Response**

**What User Sees:**

```
┌─────────────────────────────────────────┐
│  🤖 Swasthya Suchak                     │
│                                         │
│  सिर दर्द के लिए ये घरेलू उपाय:       │
│                                         │
│  1. अदरक की चाय: 1 इंच अदरक को...    │
│  2. तुलसी के पत्ते: 5-6 पत्ते...      │
│  3. ठंडी पट्टी: माथे पर...            │
│                                         │
│  Quick Replies:                         │
│  ┌──────────────┐ ┌──────────────┐    │
│  │ कब से है?   │ │ कितना तेज?  │    │
│  └──────────────┘ └──────────────┘    │
│  ┌──────────────────────────────┐     │
│  │ कोई और लक्षण है?           │     │
│  └──────────────────────────────┘     │
│                                         │
│  10:30 AM                               │
└─────────────────────────────────────────┘
```

---

## ⏱️ **Performance Metrics**

| Step | Time Taken | Details |
|------|-----------|---------|
| Frontend Processing | ~10ms | React state updates |
| Network Request | ~50ms | HTTP POST to backend |
| Backend Processing | ~20ms | Python processing |
| Knowledge Base Search | ~30ms | Search 3000+ chunks |
| Groq AI API Call | ~500ms | LLaMA 3.3 inference |
| Response Processing | ~10ms | Extract questions |
| Network Response | ~50ms | Send back to frontend |
| UI Update | ~20ms | React re-render |
| **TOTAL** | **~690ms** | **< 1 second!** |

---

## 🔄 **Special Cases**

### 📸 **Image Upload Flow:**
1. User uploads image → Base64 encoded
2. Sent to `/analyze-image` endpoint
3. **OpenCV preprocessing:**
   - Detect redness (HSV color analysis)
   - Detect yellowish tint (jaundice detection)
4. **Groq Vision API:**
   - Model: `llama-4-scout-17b-16e-instruct`
   - Analyzes image with medical context
5. Returns detailed analysis + remedies

### 🎤 **Voice Input Flow:**
1. User records voice → Browser captures audio
2. Sent to `/transcribe` endpoint
3. **Groq Whisper API:**
   - Model: `whisper-large-v3`
   - Transcribes to text (Hindi/English)
4. Transcribed text processed as normal query

### 📄 **PDF Upload Flow:**
1. User uploads PDF → Saved temporarily
2. **PDFPlumber extracts text:**
   - Reads all pages
   - Extracts medical report data
3. AI analyzes report text
4. Returns interpretation + recommendations

---

## 🔐 **Data Flow Security**

1. **API Keys:** Stored in `.env` (never exposed to frontend)
2. **CORS:** Enabled only for localhost:5173
3. **User Sessions:** Stored in memory (not persistent)
4. **Database:** SQLite local file (chat_history.db)
5. **No PII sent to Groq:** Only medical queries

---

## 📊 **Architecture Diagram**

```
┌─────────────┐
│   USER      │
│  (Browser)  │
└──────┬──────┘
       │ Types: "मुझे सिर दर्द है"
       ↓
┌──────────────────────────────────┐
│  FRONTEND (React + TypeScript)   │
│  Port: 5173                      │
│  ├─ ChatInterface.tsx            │
│  ├─ api.ts                       │
│  └─ State Management             │
└──────┬───────────────────────────┘
       │ HTTP POST /chat
       ↓
┌──────────────────────────────────┐
│  BACKEND (Flask + Python)        │
│  Port: 5001                      │
│  ├─ web_app.py                   │
│  ├─ Language Detection           │
│  └─ Session Management           │
└──────┬───────────────────────────┘
       │
       ├─→ knowledge_base.py
       │   └─ Search medical data
       │
       ├─→ Groq AI API
       │   └─ LLaMA 3.3 70B
       │       └─ Generate response
       │
       └─→ database.py
           └─ SQLite (chat_history.db)
```

---

## 🎯 **Key Technologies**

1. **Frontend:**
   - React 18 + TypeScript
   - Framer Motion (animations)
   - Tailwind CSS (styling)

2. **Backend:**
   - Flask (Python web framework)
   - Groq SDK (AI API client)
   - SQLite (database)

3. **AI Models:**
   - LLaMA 3.3 70B (text chat)
   - LLaMA Vision (image analysis)
   - Whisper Large v3 (voice transcription)

4. **Processing:**
   - OpenCV (image preprocessing)
   - PDFPlumber (PDF text extraction)
   - FAISS (vector search - optional)

---

**This entire process happens in less than 1 second, providing users with instant, contextual, and medically-informed responses!** 🚀

