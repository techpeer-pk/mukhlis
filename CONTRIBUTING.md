# Contributing to Mukhlis

شکریہ کہ آپ مخلص میں حصہ ڈالنا چاہتے ہیں۔  
Thank you for your interest in contributing to Mukhlis!

---

## Getting Started

```bash
git clone https://github.com/techpeer-pk/mukhlis.git
cd mukhlis
cp .env.example .env
# Fill in your Firebase config + VITE_ENCRYPTION_KEY
npm install
npm run dev
```

---

## How to Contribute

### Reporting a Bug

1. Check [existing issues](https://github.com/techpeer-pk/mukhlis/issues) first
2. Open a new issue with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Device / browser info

### Suggesting a Feature

1. Open an issue with the `enhancement` label
2. Describe the use case — who benefits and why
3. Keep privacy implications in mind (this is a privacy-first app)

### Submitting a Pull Request

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test on mobile (primary audience)
5. Open a PR with a clear description of what changed and why

---

## Code Guidelines

- **No unnecessary comments** — well-named variables explain themselves
- **No new dependencies** without discussion — keep the bundle lean
- **Mobile-first** — test on small screens; most users are on phones
- **Privacy by default** — never log or expose PII; all sensitive fields must be encrypted
- **i18n required** — any new UI string must be added to both `ur` and `en` in `src/i18n/strings.js`
- **Dark mode required** — all new UI must support dark mode via Tailwind dark: classes

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React contexts (Auth, Theme, Language, Install)
├── i18n/             # Bilingual string definitions (Urdu + English)
├── pages/            # Route-level page components
└── utils/            # Crypto, formatting helpers
```

---

## Encryption Rules

All user-identifiable fields **must** be encrypted before writing to Firebase:

```js
import { encrypt, hash } from '../utils/crypto'

// Sensitive fields — encrypt
encrypt(value)

// Search keys — hash (irreversible, used for lookup only)
hash(uniqueNumber)
```

Never store plain-text phone numbers, names, or locations.

---

## Commit Message Format

```
Short imperative summary (max 72 chars)

Optional longer description if needed.

Developed by TechPeer
```

---

## Community Standards

- Be respectful and constructive
- This project serves everyday Pakistanis — keep UX simple and accessible
- Urdu speakers are the primary audience; Urdu translations take priority

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
