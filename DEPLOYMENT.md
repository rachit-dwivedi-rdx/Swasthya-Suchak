# Deployment Guide - Smiriti Health Assistant

This branch contains all the necessary changes to deploy your application online for FREE.

## 🚀 Quick Deploy on Render.com (Recommended)

### Prerequisites
- GitHub account with this repository pushed
- Groq API Key (from console.groq.com)

---

## Step-by-Step Deployment

### 1️⃣ Deploy Backend (Flask API)

1. **Go to [render.com](https://render.com) and sign up with GitHub**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (smiriti)

4. **Configure the service:**
   - **Name:** `smiriti-backend`
   - **Branch:** `deployment`
   - **Root Directory:** Leave empty
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn web_app:app`

5. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add: `GROQ_API_KEY` = `your_groq_api_key_here`

6. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., `https://smiriti-backend.onrender.com`)

---

### 2️⃣ Update Frontend Configuration

1. **Edit `frontend/.env.production` file:**
   ```env
   VITE_API_URL=https://your-actual-backend-url.onrender.com
   ```
   Replace with your actual Render backend URL from Step 1

2. **Commit and push this change:**
   ```bash
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push origin deployment
   ```

---

### 3️⃣ Deploy Frontend (React App)

1. **Go back to Render Dashboard**

2. **Click "New +" → "Static Site"**

3. **Connect the same GitHub repository**

4. **Configure the static site:**
   - **Name:** `smiriti-frontend`
   - **Branch:** `deployment`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

5. **Click "Create Static Site"**
   - Wait 5-10 minutes for deployment
   - Your app will be live at `https://smiriti-frontend.onrender.com`

---

## 🎉 Your App is Live!

Visit your frontend URL and start using your health assistant online!

---

## 📝 Important Notes

### Free Tier Limitations:
- Backend sleeps after 15 minutes of inactivity (takes ~30 seconds to wake up)
- 750 hours/month free
- SQLite won't persist on Render free tier

### CORS Configuration:
If you face CORS errors, update `web_app.py`:
```python
CORS(app, origins=["https://your-frontend-url.onrender.com"])
```

---

## 🐛 Troubleshooting

### Build Fails on Render:
- Check logs in Render dashboard
- Verify `requirements.txt` has all dependencies

### Frontend Can't Connect to Backend:
- Verify `VITE_API_URL` in `.env.production`
- Check backend is running

---

## ✅ Checklist

Before deploying:
- [ ] Code is pushed to GitHub on `deployment` branch
- [ ] `GROQ_API_KEY` is ready
- [ ] Frontend `.env.production` has correct backend URL
- [ ] All changes are committed and pushed

---

**Good luck with your deployment! 🚀**
