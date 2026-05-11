# 🚀 Kamal Goswami — Futuristic Portfolio

> Full-stack portfolio with Node.js backend, contact form (email), and live visitor counter.

---

## ✨ Features

- ⚡ Futuristic black + neon purple design
- 🎯 Animated particle network background
- 📧 **Working contact form** (sends email to you + auto-reply to sender)
- 👁️ **Live visitor counter** (persisted in JSON)
- 📱 Mobile responsive
- 🔒 Rate limiting on API routes

---

## 📁 Project Structure

```
kamal-portfolio/
├── server.js          ← Express backend (API routes)
├── package.json
├── .env               ← Your secrets (create this — see below)
├── .env.example       ← Template
├── .gitignore
├── public/
│   └── index.html     ← Full portfolio frontend
└── data/
    └── visitors.json  ← Auto-created, auto-managed
```

---

## 🛠️ Local Setup

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create your .env file
```bash
cp .env.example .env
```
Then open `.env` and fill in:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Gmail App Password (see below)
EMAIL_TO=sy8600711@gmail.com
```

### Step 3 — Generate Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → **2-Step Verification** (turn ON if not already)
3. Security → **App Passwords**
4. Select app: **Mail**, device: **Other** → name it "Portfolio"
5. Copy the 16-character password → paste in `.env` as `EMAIL_PASS`

### Step 4 — Run locally
```bash
npm run dev      # with auto-reload (nodemon)
# OR
npm start        # normal
```
Open → **http://localhost:3000**

---

## 🌐 Deploy to Render.com (FREE — Recommended)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "🚀 Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kamal-portfolio.git
git push -u origin main
```

### Step 2 — Create Render Web Service
1. Go to [render.com](https://render.com) → Sign up free
2. **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   | Field | Value |
   |-------|-------|
   | **Name** | `kamal-goswami-portfolio` |
   | **Branch** | `main` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

### Step 3 — Set Environment Variables on Render
In Render dashboard → **Environment** tab → Add:
```
EMAIL_USER  =  your_gmail@gmail.com
EMAIL_PASS  =  xxxx xxxx xxxx xxxx
EMAIL_TO    =  sy8600711@gmail.com
```

### Step 4 — Deploy!
Click **Deploy** → Wait ~2 min → Your site is live at:
```
https://kamal-goswami-portfolio.onrender.com
```

---

## 🔗 Alternative: Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
Set env vars in Railway dashboard → same keys as above.

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/visitors` | Increment + return visitor count |
| POST | `/api/contact` | Send contact form email |
| GET | `/api/health` | Server health check |

### Contact Form POST Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "Hello Kamal..."
}
```

---

## ⚠️ Important Notes

- `.env` is in `.gitignore` — **never commit it**
- `data/visitors.json` is in `.gitignore` — count resets on Render free tier deploys (use a DB for permanent persistence)
- Rate limit: 5 contact submissions per IP per 15 minutes
- Render free tier spins down after inactivity (first load may take 30s to wake up)

---

## 🧑‍💻 Author

**Kamal Goswami**  
Domain Ops Executive · EXL Services · Noida  
📧 sy8600711@gmail.com  
💼 [linkedin.com/in/kamal-goswami-2a84b2209](https://linkedin.com/in/kamal-goswami-2a84b2209)
