# مخلص — Mukhlis

Pakistan's privacy-first lost document recovery platform.

**Live:** https://immukhlis.web.app

---

## What it does

Finders report found documents (CNIC, degree, ATM card) using the document's unique number. Owners search by that number to get the finder's contact — no account needed to search.

## Stack

- React 18 + Vite + Tailwind CSS v4
- Firebase Realtime Database + Google Auth + Hosting
- AES-256-CBC encryption on all sensitive fields
- SHA-256 hash for searchable unique number (irreversible)
- PWA — installable, offline-capable, app shortcuts

## Setup

```bash
cp .env.example .env
# fill in your Firebase config + VITE_ENCRYPTION_KEY
npm install
npm run dev
```

## Firebase Rules

Add `.indexOn` to Realtime Database rules:

```json
{
  "rules": {
    "documents": {
      ".indexOn": ["uniqueNumberHash", "reportedBy"]
    }
  }
}
```

## Deploy

```bash
npm run build
firebase deploy --only hosting
```

## License

MIT © 2025 [TechPeer](https://techpeer.web.app)
