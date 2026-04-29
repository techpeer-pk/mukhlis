<div align="center">

<img src="logo/logo.png" width="96" height="96" style="border-radius:20px" alt="Mukhlis Logo" />

<br />

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&pause=1000&color=1E293B&center=true&vCenter=true&width=680&lines=مخلص+%E2%80%94+Mukhlis;Pakistan's+Lost+Document+Platform;ایمانداری+سے+واپسی+%7C+Find+with+Trust)](https://git.io/typing-svg)

<br />

[![Live](https://img.shields.io/badge/🌐_Live-immukhlis.web.app-22c55e?style=for-the-badge)](https://immukhlis.web.app)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Installable-6d28d9?style=for-the-badge&logo=pwa&logoColor=white)](https://immukhlis.web.app)

<br />

[🚀 View Live App](https://immukhlis.web.app) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/techpeer-pk/mukhlis/issues/new?labels=bug) &nbsp;·&nbsp;
[💡 Request Feature](https://github.com/techpeer-pk/mukhlis/issues/new?labels=enhancement) &nbsp;·&nbsp;
[🤝 Contributing](CONTRIBUTING.md)

<br />

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![AES-256](https://img.shields.io/badge/AES--256--CBC-Encrypted-16a34a?style=flat-square&logo=letsencrypt&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-Urdu_%7C_English-0ea5e9?style=flat-square)

</div>

---

## What is Mukhlis?

**مخلص** (Mukhlis) is a free, privacy-first platform that connects people who **find** lost documents with their **owners** — no data sold, no accounts needed to search.

A finder reports a found document using its unique number (CNIC, degree, ATM card, etc.). The owner searches that same number to get the finder's contact. No photos, no addresses, no unnecessary data.

---

## How It Works

```
Finder                          Owner
  │                               │
  ├─ Report document number  ─────┤
  │  (1 minute, needs login)      │
  │                               ├─ Search number (anonymous)
  │                               ├─ Enter phone to claim
  │◄── Both get each other's ─────┤
       number. Meet in public.
```

---

## Features

- **Anonymous Search** — no account needed to search
- **AES-256-CBC Encryption** — all sensitive fields encrypted at rest
- **SHA-256 Hashing** — unique numbers are irreversibly hashed (not stored in plain text)
- **PWA** — installable, offline-capable, home screen shortcut
- **Urdu / English** — full bilingual UI with persistent language preference
- **Dark / Light Mode** — system-aware theme toggle
- **90-day Auto-expiry** — reports expire automatically
- **Tap-to-Call** — one tap to call finder after claim
- **Step-by-step Claim Flow** — clear UX for non-technical users

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Google Auth |
| Database | Firebase Realtime Database |
| Hosting | Firebase Hosting |
| Encryption | AES-256-CBC (all PII fields) |
| Hashing | SHA-256 (unique number — search key) |
| PWA | Vite PWA Plugin + Service Worker |
| i18n | Custom context + static strings (Urdu / English) |

---

## Setup

```bash
cp .env.example .env
# Fill in Firebase config + VITE_ENCRYPTION_KEY (32-char secret)

npm install
npm run dev
```

### Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ENCRYPTION_KEY=
```

### Firebase Realtime Database Rules

```json
{
  "rules": {
    "documents": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["uniqueNumberHash", "reportedBy"]
    }
  }
}
```

---

## Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## Roadmap

### ✅ Shipped

- [x] Search by unique document number (anonymous)
- [x] 5-step report form with Google Auth
- [x] AES-256-CBC encryption on all sensitive fields
- [x] SHA-256 hash for searchable unique number
- [x] PWA — installable, offline-capable
- [x] Dark / Light mode toggle
- [x] Urdu / English full bilingual UI (i18n system)
- [x] HelpModal with YouTube tutorial video
- [x] My Reports page with Active / Claimed / Expired status
- [x] 90-day auto-expiry on reports
- [x] Persistent Install App button (Android native + iOS instructions)
- [x] Step-by-step claim flow with amber prompt callout
- [x] Tap-to-call button after successful claim
- [x] Share button on all pages
- [x] SearchPage as landing page (`/`)
- [x] App purpose description + How it works link

### 🔄 In Progress / Planned

- [ ] **WhatsApp button** — alongside Call after claim (`wa.me/` deep link)
- [ ] **Self-service report deletion** — delete from My Reports without contacting support
- [ ] **Push Notifications (FCM)** — notify finder when their reported document is claimed
- [ ] **"Notify me" feature** — owner gets notified when someone reports their document later
- [ ] **Custom domain** — `mukhlis.pk`
- [ ] **Photo upload** *(optional)* — for visual verification, privacy-preserving
- [ ] **Admin dashboard** — moderate reports, view stats, handle abuse
- [ ] **Analytics** — anonymous usage stats (documents found rate, city breakdown)

---

## Privacy

- No document images stored
- Phone numbers encrypted with AES-256-CBC, only revealed after mutual claim
- Unique numbers stored as SHA-256 hashes — cannot be reversed
- Google Auth used only to prevent spam reports; no profile data stored

---

## License

MIT © 2025 [TechPeer](https://techpeer.web.app)
