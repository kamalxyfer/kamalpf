const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter – max 5 contact submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again later.' }
});

// ─── Visitor Counter ──────────────────────────────────────────────────────────
const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'visitors.json');

function readVisitors() {
  try {
    if (!fs.existsSync(DATA_DIR))  fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ count: 0, visits: [] }));
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch { return { count: 0, visits: [] }; }
}

function writeVisitors(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch {}
}

// GET  /api/visitors  → increment + return count
app.get('/api/visitors', (req, res) => {
  const data = readVisitors();
  data.count += 1;
  data.visits.push({ time: new Date().toISOString(), ip: req.ip });
  if (data.visits.length > 500) data.visits = data.visits.slice(-500); // keep last 500
  writeVisitors(data);
  res.json({ count: data.count });
});

// ─── Contact Form ─────────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   // Use Gmail App Password (not your main password)
      }
    });

    // Mail to YOU (Kamal)
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || 'sy8600711@gmail.com',
      subject: `[Portfolio] ${subject || 'New Message'} — from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#0a0a14;color:#e8d5ff;padding:30px;border-radius:8px;border:1px solid #b44fff33">
          <h2 style="color:#b44fff;font-family:monospace;letter-spacing:3px">NEW CONTACT</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8c6aaa;width:90px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#8c6aaa">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#b44fff">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8c6aaa">Subject</td><td style="padding:8px 0">${subject || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#8c6aaa;vertical-align:top">Message</td><td style="padding:8px 0;line-height:1.7">${message.replace(/\n/g,'<br>')}</td></tr>
          </table>
          <p style="color:#444;font-size:12px;margin-top:20px;font-family:monospace">Sent via kamal-goswami.onrender.com</p>
        </div>`
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Kamal Goswami" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;background:#0a0a14;color:#e8d5ff;padding:30px;border-radius:8px;border:1px solid #b44fff33">
          <h2 style="color:#b44fff;font-family:monospace">Hi ${name},</h2>
          <p style="line-height:1.8">Thank you for contacting me! I have received your message and will get back to you within 24–48 hours.</p>
          <p style="line-height:1.8;color:#8c6aaa">— Kamal Goswami<br>Domain Operations Executive | EXL Services</p>
        </div>`
    });

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ─── Catch-all → index.html ───────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running → http://localhost:${PORT}`);
  console.log(`📧 Email sender  → ${process.env.EMAIL_USER || '(not configured)'}\n`);
});
