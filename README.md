# Wedding Invitation — Bhrampreet & Simarpreet

A complete heirloom wedding invitation website.

---

## 📁 Project Structure

```text
Bhrampreet-Weds-Simarpreet/
├── index.html              # Main HTML markup
├── style.css               # Core styling, responsive typography, textures & animations
├── events.css              # Custom styling for the 4 wedding celebration cards
├── app.js                  # Interactive logic (scratch card, countdown, gallery, RSVP, wishes)
├── vercel.json             # Vercel static deployment configuration
├── assets/                 # High-resolution celebration cards, photos & audio (~65 MB)
└── local/                  # Optional local testing servers
    ├── local-server.js         # Local Node.js server
    ├── server.py               # Local Python server
    └── wishes.json             # Local wishes store
```

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or start a local server:

### Option 1: Using Node.js
```bash
node local/local-server.js
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Using Python
```bash
python local/server.py
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deploy to Vercel / Netlify / GitHub Pages

This is a **pure static frontend website** ready for 1-click deployment on Vercel, Netlify, or GitHub Pages. No build step or environment variables required.
