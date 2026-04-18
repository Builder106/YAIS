# MedCore — Centralised Digital Health Records

MedCore is a centralised digital health records platform designed for African healthcare providers. This repo contains a **Vite + React web app** (`src/`) and a **Node + Express + SQLite API** (`server/`) that implements PRD Features 1–6 end-to-end.

## Architecture

```
┌──────────────┐          ┌──────────────────┐       ┌──────────────┐
│ Vite React   │──/api──▶ │  Express API     │──▶    │  SQLite (or  │
│ (src/)       │          │  (server/)       │       │  Postgres via│
│  + SW + PWA  │          │  + node-cron     │       │  docker)     │
└──────────────┘          └──────────────────┘       └──────────────┘
                                  │
                                  ├── OpenFDA / RxNorm (Feature 6)
                                  ├── OpenAI Whisper (Feature 2)
                                  ├── Daily.co (Feature 3)
                                  ├── Africa's Talking SMS (Features 4 & 5)
                                  └── Web Push (Feature 5)
```

All external integrations fall back to working **mock implementations** when API keys are missing, so the demo runs offline.

## Quick start

```bash
npm install
npm --prefix server install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001/api/health

The Vite dev server proxies `/api/*` to the Express server on port 3001 and also binds to `0.0.0.0` so your phone on the same Wi‑Fi can open `http://<your-laptop-ip>:5173`.

### Sign-in (demo)

The UI opens a **login** screen first. After you sign in, the API issues an **HTTP-only session cookie** (`mc_session`, JWT). Seeded users (PINs configurable in `server/.env`; see `server/.env.example`):

| Role | User ID | Default PIN |
|------|---------|-------------|
| Doctor | `DOC-001` | `4242` |
| Patient | `PAT-001` | `1212` |
| Admin | `ADM-001` | `3434` |

For production, set `SESSION_SECRET` to a long random string (≥32 characters).

## Running tests (TDD)

```bash
npm test                    # web tests (Vitest)
npm --prefix server test    # API + SMS + interaction tests
npm run test:all            # both
```

## Demo on your phone

See [`docs/DEMO.md`](docs/DEMO.md) for the full 7-feature phone walkthrough (PWA install, voice, video, push reminders, SMS, Health ID QR, offline/low-bandwidth).

Media APIs (camera, microphone, push) require a **secure context**. There are two supported options:

### Option 1 — Tunnel to your laptop (recommended for dev)

```bash
# Cloudflare Tunnel (install: brew install cloudflared)
cloudflared tunnel --url http://localhost:5173
# or ngrok
ngrok http 5173
```

Open the printed `https://…` URL on your phone. All features including video, voice, and push notifications work on-device.

### Option 2 — Light cloud deploy

Push to Fly.io, Railway or Render — the `server/` and the Vite build can be dockerised using the provided `docker-compose.yml` (for the Postgres-backed variant).

### Africa's Talking inbound webhook

Point the **AT SMS callback URL** at your tunnel / deploy:

```
https://<your-public-url>/api/sms/inbound
```

Send a test SMS from your phone (the number must match `DEMO_DOCTOR_PHONE` in `server/.env`):

```
PATIENT PAT-001 PIN:4242
MEDS PAT-001 PIN:4242
NOTE PAT-001 PIN:4242 follow up in two weeks
```

The API replies within ~2 seconds with a structured safe summary.

### Health ID QR

The QR on `/health-id` encodes a patient URL — scan it from your phone's camera to open the patient chart on the same demo instance.

## Environment variables

Copy `server/.env.example` to `server/.env` and fill in only the integrations you need:

| Variable | Purpose | Fallback when empty |
| --- | --- | --- |
| `OPENAI_API_KEY` | Feature 2 Whisper transcription | Returns realistic mock transcripts |
| `DAILY_API_KEY` / `DAILY_DOMAIN` | Feature 3 video rooms | Falls back to a Jitsi public room |
| `AT_API_KEY` | Feature 4 & 5 SMS send | Logs to mock outbox |
| `WEB_PUSH_PUBLIC_KEY` / `WEB_PUSH_PRIVATE_KEY` | Feature 5 push | In-memory fake send |
| `DEMO_DOCTOR_PHONE` | Lets your real phone number act as `DOC-001` for SMS | — |
| `DEMO_PATIENT_PHONE` | Lets your real phone number receive reminders for `PAT-001` | — |

To generate VAPID keys: `npx web-push generate-vapid-keys`.

## PRD features implemented

1. **Multilingual (i18next, 5 languages + RTL Arabic)** — `src/locales/*`
2. **Voice recording + AI transcription** — `src/app/components/clinical/VoiceConsultPanel.tsx` and `server/src/routes/voice.ts`
3. **Video consulting (Daily.co + fallback)** — `src/app/pages/VideoConsultPage.tsx` and `server/src/routes/video.ts`
4. **SMS offline system** — `server/src/routes/sms.ts` + doctor inbox in `src/app/pages/SmsInboxPage.tsx`
5. **Medication reminders + adherence** — `server/src/routes/reminders.ts` + doctor/patient UIs
6. **Drug interaction checker** — `server/src/routes/interactions.ts` + prescription writer in `src/app/components/clinical/PrescriptionFormModal.tsx`

## Postgres (production option)

```bash
docker compose up -d postgres
# then set DATABASE_URL in server/.env to a Postgres URL
```

The SQLite schema in `server/src/db/migrations.sql` is portable; switching dialects only requires updating the Drizzle client.
