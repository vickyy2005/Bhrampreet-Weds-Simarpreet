# Wedding Invitation — Bhrampreet & Simarpreet

A complete clone of the wedding invitation website [`https://arshdeep-dilmeet.theinvitationandco.com/`](https://arshdeep-dilmeet.theinvitationandco.com/).

---

## 📁 Project Structure

```text
Punjab da invitatio/
├── index.html              # Main HTML markup (clean of third-party bot scripts)
├── style.css               # Core styling, layout, typography, animations, petals
├── events.css              # Custom styling for wedding celebration cards
├── app.js                  # Interactive logic (scratch card, countdown, music, gallery, RSVP, wishes)
├── wishes.json             # Local data storage for guest wishes
├── server.py               # Built-in lightweight Python server (serves site & /api/wishes)
├── local-server.js               # Built-in lightweight Node.js server (serves site & /api/wishes)
├── package.json            # Node configuration (npm start)
└── assets/                 # All high-resolution media & imagery (~65 MB total)
    ├── wedding-song.mp3        # Background music track
    ├── scratch-paper.png       # Scratch-to-reveal canvas texture
    ├── clock-flourish.png      # Countdown timer floral ornament
    ├── heritage.png            # Hero section vintage background
    ├── vintage-arrow.png       # Gallery navigation arrows
    ├── heading-*.png           # Ornamental section headings
    ├── event-*.png             # High-res banners for all wedding events
    └── moment-*.jpg/png        # Gallery photograph prints
```

---

## 🚀 How to Run

You can run this project using **Node.js**, **Python**, or open `index.html` directly in any web browser.

### Option 1: Using Node.js (Recommended)
No npm installations required (uses native Node.js HTTP module):
```bash
npm start
# or
node local-server.js
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Using Python
No external packages needed (uses Python built-in standard library):
```bash
python server.py
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🎨 Customization Guide

1. **Bride & Groom Names & Dates**:
   - Edit text in [`index.html`](file:///c:/Users/manis/OneDrive/Desktop/Punjab%20da%20invitatio/index.html).
   - In [`app.js`](file:///c:/Users/manis/OneDrive/Desktop/Punjab%20da%20invitatio/app.js), update the countdown target date on line 72:
     ```javascript
     const target = new Date('2027-01-02T11:00:00+05:30').getTime();
     ```
2. **RSVP WhatsApp Number**:
   - Currently set to `+91 9356334333` in [`app.js`](file:///c:/Users/manis/OneDrive/Desktop/Punjab%20da%20invitatio/app.js) on line 137:
     ```javascript
     const url = 'https://wa.me/919356334333?text=' + encodeURIComponent(message);
     ```
3. **Photos & Music**:
   - Replace or add images in the [`assets/`](file:///c:/Users/manis/OneDrive/Desktop/Punjab%20da%20invitatio/assets/) directory.
   - Replace [`assets/wedding-song.mp3`](file:///c:/Users/manis/OneDrive/Desktop/Punjab%20da%20invitatio/assets/wedding-song.mp3) with any song of your choice.
