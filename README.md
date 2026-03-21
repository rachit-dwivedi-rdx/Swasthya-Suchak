# Swasthya-Suchak - AI Health Assistant
(This is a group project of 4 members in Hackathon )
A bilingual AI health assistant that works on both Web and WhatsApp. You can get instant health advice, analyze medical images, and upload reports for analysis.

## Features

- Web Chat and WhatsApp Bot
- Bilingual: Works in English, Hindi, and Garhwali
- Image Analysis: Analyzes medical images using AI
- PDF Reports: Upload and analyze medical reports
- Voice Input: Talk instead of typing
- Memory: Remembers your conversation history

## Tech Stack

- Backend: Flask, Groq AI, OpenCV, Twilio
- Frontend: React, TypeScript, Tailwind CSS
- AI Models: LLaMA 3.3 70B, LLaMA Vision, Whisper

---

## Step-by-Step Setup for Windows

### Step 1: Install Prerequisites

1. **Install Python 3.10 or higher**
   - Download from [python.org](https://www.python.org/downloads/)
   - Important: Check "Add Python to PATH" during installation

2. **Install Node.js 16 or higher**
   - Download from [nodejs.org](https://nodejs.org/)
   - Install with default settings

3. **Verify Installation**
   ```cmd
   python --version
   node --version
   npm --version
   ```

---

### Step 2: Get API Keys

#### Groq API Key (Required for AI)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Click "API Keys" in the left sidebar
4. Click "Create API Key"
5. Copy the key (it starts with `gsk_...`)
6. Save it somewhere safe

#### Twilio Setup (Optional - Only if you want WhatsApp feature)

1. Go to [twilio.com/console](https://www.twilio.com/console)
2. Sign up or log in
3. Go to "Messaging" → "Try it out" → "Send a WhatsApp message"
4. Follow the setup to activate WhatsApp Sandbox
5. Copy these 3 things:
   - Account SID (starts with `AC...`)
   - Auth Token (click to reveal it)
   - WhatsApp Sandbox Number (example: `+1 415 523 8886`)

---

### Step 3: Download Project

```cmd
git clone <your-repo-url>
cd smiriti
```

Or download the ZIP file and extract it.

---

### Step 4: Setup Backend

1. **Create Virtual Environment**
   ```cmd
   python -m venv venv
   ```

2. **Activate Virtual Environment**
   ```cmd
   venv\Scripts\activate
   ```
   You should see `(venv)` appear at the start of your command line

3. **Install Dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Create .env File**
   - Create a file named `.env` in the project root folder
   - Add your API keys:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   TWILIO_ACCOUNT_SID=AC_your_twilio_sid_here
   TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
   ```
   
   Note: If you're only using the web app, you only need `GROQ_API_KEY`

---

### Step 5: Setup Frontend

1. **Open a new Command Prompt** (keep the backend terminal open)

2. **Navigate to Frontend folder**
   ```cmd
   cd frontend
   ```

3. **Install Dependencies**
   ```cmd
   npm install
   ```

---

### Step 6: WhatsApp Setup 

If you want to use the WhatsApp feature, you need to expose your local server to the internet. There are two ways to do this:
( In this project Method 2(pyngrok) is used )
#### Method 1: Using ngrok (Recommended for beginners)

1. **Download ngrok**
   - Go to [ngrok.com](https://ngrok.com/download)
   - Download the Windows version
   - Extract the zip file

2. **Sign up for ngrok**
   - Create a free account on ngrok.com
   - Copy your authtoken from the dashboard

3. **Setup ngrok**
   - Open Command Prompt in the folder where you extracted ngrok
   - Run this command with your authtoken:
   ```cmd
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. You'll use ngrok later when running the application (see Step 7)

#### Method 2: Using pyngrok (Easier - runs automatically with your code)

1. **Install pyngrok**
   - Make sure your virtual environment is activated
   ```cmd
   pip install pyngrok
   ```

2. **Get your ngrok authtoken**
   - Go to [ngrok.com](https://ngrok.com/download)
   - Sign up for free
   - Copy your authtoken from the dashboard

3. **Add to your .env file**
   - Open your `.env` file
   - Add this line:
   ```env
   NGROK_AUTH_TOKEN=your_ngrok_authtoken_here
   ```

4. **Modify app.py** (only if using pyngrok)
   - Add these lines at the top of `app.py`:
   ```python
   from pyngrok import ngrok
   import os
   ```
   - Add these lines before `app.run()`:
   ```python
   # Setup ngrok
   ngrok.set_auth_token(os.getenv('NGROK_AUTH_TOKEN'))
   public_url = ngrok.connect(5000)
   print(f'Public URL: {public_url}')
   ```

---

### Step 7: Run the Application

You need to open multiple Command Prompt windows:

#### Terminal 1 - Web Backend (Port 5001)
```cmd
cd smiriti
venv\Scripts\activate
python web_app.py
```
You should see: `Running on http://127.0.0.1:5001`

#### Terminal 2 - WhatsApp Backend (Port 5000) - Only if using WhatsApp
```cmd
cd smiriti
venv\Scripts\activate
python app.py
```
You should see: `Running on http://127.0.0.1:5000`

**If using Method 1 (ngrok downloaded separately):**
- Open another Command Prompt
- Navigate to where you extracted ngrok
- Run:
```cmd
ngrok http 5000
```
- Copy the `https://` URL shown (like `https://abc123.ngrok.io`)
- Go to Twilio Console → WhatsApp Sandbox Settings
- Set "When a message comes in" to: `https://abc123.ngrok.io/whatsapp`
- Save it

**If using Method 2 (pyngrok):**
- The public URL will automatically appear in your terminal
- Copy that URL and add `/whatsapp` to it
- Go to Twilio Console → WhatsApp Sandbox Settings
- Set "When a message comes in" to your URL with `/whatsapp`
- Save it

#### Terminal 3 - Frontend (Port 5173)
```cmd
cd smiriti\frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

---

### Step 8: Access the App

1. Open your browser and go to: **http://localhost:5173**
2. Choose "Chat on Web"
3. Sign up or login
4. Start chatting!

For WhatsApp: Send a message to your Twilio WhatsApp number to start chatting.

---

## What Each File Does

- **web_app.py** - Backend for web chat (runs on port 5001)
- **app.py** - Backend for WhatsApp (runs on port 5000)
- **frontend/** - React web interface
- **.env** - Your API keys (keep this secret!)
- **requirements.txt** - Python dependencies

---

## Features Explained

### Text Chat
- Powered by LLaMA 3.3 70B through Groq
- Works in English, Hindi, and Garhwali
- Remembers your last 10 messages

### Image Analysis
- Uses OpenCV to preprocess images (detects redness, jaundice, etc.)
- Uses LLaMA Vision for AI analysis
- Supports JPG, PNG, and JPEG formats

### PDF Analysis
- Upload your medical reports
- AI extracts and interprets the data
- Gives you health recommendations

### Voice Input
- Uses Whisper Large v3 through Groq
- Converts your speech to text
- Works with multiple languages

---

## Important Notes

- **Not for Medical Diagnosis**: This is just an AI assistant. It's NOT a replacement for real doctors. Always consult a healthcare professional for medical advice.
- **Keep your .env file secret**: Never share your API keys with anyone or upload them to GitHub
- **API Limits**: Groq has free tier limits. If you use it too much, you might need to upgrade
- **WhatsApp Sandbox**: Twilio's sandbox is only for testing. For production use, you need to apply for WhatsApp Business API approval

---

## Troubleshooting

### "Module not found" error
This means Python packages aren't installed properly.
```cmd
venv\Scripts\activate
pip install -r requirements.txt
```

### "Port already in use"
Some other program is using the port.
- Close any programs using ports 5000, 5001, or 5173
- Or you can change the port number in the code

### "GROQ_API_KEY not found"
Your .env file isn't set up correctly.
- Make sure the `.env` file exists in the root folder (same folder as app.py)
- Check the spelling: `GROQ_API_KEY=gsk_...`
- Make sure there are no spaces around the `=` sign

### Frontend won't start
Node packages might not be installed.
```cmd
cd frontend
npm install
npm run dev
```

### CORS errors in browser
The backend isn't running or isn't connecting properly.
- Make sure `web_app.py` is running
- Check the browser console (F12) for specific error messages

### ngrok connection issues
- Make sure you've added your authtoken correctly
- Check if port 5000 is already in use
- Try restarting ngrok

---

## Support

If you run into any issues, feel free to open a GitHub issue or contact the maintainers.

---

Made with love for better healthcare accessibility
