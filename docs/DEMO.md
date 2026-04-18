# MedCore phone-demo guide

This is what actually needs a phone — and for each one, what to show, why it's better than on the laptop, and any setup.

## TL;DR — seven things only a phone proves

| # | Feature | What it proves |
|---|---------|----------------|
| 1 | **PWA install** | "Works like a native app, offline-capable" |
| 2 | **Voice consultation recording** | AI note-gen in a doctor's pocket |
| 3 | **Video consultation** | Telemedicine on a patient's phone |
| 4 | **Medication reminders with push** | Real lockscreen alerts, even when app is closed |
| 5 | **SMS reply flow (Africa's Talking)** | Feature-phone users can access the system |
| 6 | **Health ID QR** | Paper/ID card → instant patient chart |
| 7 | **Low-bandwidth / offline mode on cellular** | Realistic network conditions |

Everything else (i18n, prescriptions, interactions, inbox, dashboards, admin) is just as convincing on the laptop. Bring those up there, bring the seven items above up on your phone.

---

## Pre-flight (do once before your demo)

### Laptop

1. From the project root:

   ```bash
   npm run demo
   ```

   Wait for **all three**:

   ```
   [web]   ➜  Network: http://10.x.x.x:5173/
   [api]   [medcore-api] listening on http://localhost:3001
   [tunnel] MedCore demo URL: https://<words>.trycloudflare.com
   ```

2. Scan the QR the tunnel script prints, or AirDrop the URL to your phone.

### Phone

1. Open the tunnel URL in **Safari (iOS)** or **Chrome (Android)** — not in an in-app browser like Slack/Gmail, those block push + mic.
2. Allow the browser to: **use camera**, **use microphone**, **send notifications** when it asks (you can also pre-grant in Settings).
3. Bookmark it / add to home screen (see Feature 1 below).

### Optional — for the full "connected" demo

Copy `server/.env.example` to `server/.env` on the laptop and fill only what you want live:

| Feature | Env vars |
|---------|----------|
| Real Whisper transcripts | `OPENAI_API_KEY` |
| Real Daily.co rooms | `DAILY_API_KEY`, `DAILY_DOMAIN` |
| Real SMS round-trip | `AT_API_KEY`, `AT_USERNAME`, `DEMO_DOCTOR_PHONE=+1yourmobile` |
| Real push notifications | `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` (`npx web-push generate-vapid-keys`) |

Everything you leave blank runs against the built-in mock. Restart `npm run demo` after editing `.env`.

---

## 1. PWA install — "This is an app, not a webpage"

### Why phone

Installing to the home screen is the move that visually separates "web demo" from "product". Laptop PWAs exist but nobody notices.

### Show it

- **iOS Safari**: tap Share → **Add to Home Screen** → name stays "MedCore" → Add.
- **Android Chrome**: menu → **Install app** / **Add to Home screen**.

Launch from the home-screen icon. The browser chrome disappears; you get a splash screen (the green hex + gold caduceus from `public/icons/icon-192.svg`) and fullscreen shell.

### Talking point

"Low-end Android phones install the app in under 200 KB, cache the UI via the service worker in `public/sw.js`, and work through offline pockets."

---

## 2. Voice consultation — "Dictate a SOAP note in 20 seconds"

### Why phone

Doctors in African clinics often consult bedside with a phone, not a laptop. The native mic on a phone is closer to real usage than a laptop mic. Plus it shows mobile-first UX.

### Requires

- **HTTPS context** → use the Cloudflare tunnel URL (the `localhost` / LAN URL will silently refuse mic access on iOS). This is the #1 reason voice demos fail.
- Mic permission granted to the browser.

### Show it

1. Log in as **Doctor** (role toggle).
2. Navigate to **Voice Consult** (in the sidebar, mic icon).
3. Check the consent checkbox ("I agree to the recording") — mention audio retention is 30 days and auto-purged (`purgeExpiredAudio` in `server/src/routes/voice.ts`).
4. Tap **Record** — allow mic when iOS prompts.
5. Dictate into the phone for ~15–30 seconds, e.g.:

   > "Chief complaint: 42-year-old female with two weeks of intermittent headaches, worse in the evenings. History: hypertension, on amlodipine. Assessment: likely tension-type headache, rule out poorly controlled blood pressure. Plan: recheck BP, trial of paracetamol, follow up in one week."

6. Tap **Stop** → tap **Generate consultation note**.
7. The SOAP fields populate. Edit inline if you want, then **Save**.
8. Show the past-recordings list at the bottom with the embedded audio player.

### Talking point

"Audio goes over HTTPS to `/api/transcribe`, which hits OpenAI Whisper with a fallback to a mock if no key. The transcript is parsed into SOAP sections. Audio is encrypted at rest and purged after 30 days."

---

## 3. Video consultation — "Real telemedicine, one tap"

### Why phone

A video consult viewed on a laptop is meaningless — telemedicine is about a patient on their phone talking to a clinician. Being the patient on a phone makes the point instantly.

### Requires

- HTTPS tunnel URL (camera + mic are blocked on plain HTTP).
- Camera and mic permissions.
- Laptop to simultaneously play the "other end" of the call.

### Show it

Option A — **Two-device demo (best)**:

1. On the **laptop**, log in as Doctor → Video Consult → Start call. Browser iframe opens in a Daily.co or Jitsi room.
2. On the **phone**, log in as Patient (same role toggle) → Video Consult → Start call → same room automatically.
3. Put phone and laptop side by side — the patient sees the doctor, the doctor sees the patient.

Option B — **Phone-only walkthrough**:

1. On the phone, go to Video Consult.
2. Walk through the pre-call checklist (camera test, mic test, bandwidth selector).
3. Flip the bandwidth selector to **Poor** — point out the amber "switching to audio only" banner — this is the graceful degradation story.
4. Show the telemedicine disclaimer text.
5. Start the call → end the call → show the post-call notes form → Save.

### Talking point

"Pre-call device checks, bandwidth-aware degradation, post-call SOAP note persisted to the patient record. Daily.co for production, Jitsi as fallback. The disclaimer is non-skippable — legally required."

---

## 4. Medication reminders + push — "Lockscreen alert, even when app closed"

### Why phone

A desktop notification sitting in Notification Center is forgettable. A push showing on your **phone's lock screen** while the app is backgrounded is visceral. This is the feature that sells patient adherence.

### Requires

- HTTPS tunnel URL.
- For *real* push: `WEB_PUSH_PUBLIC_KEY` / `WEB_PUSH_PRIVATE_KEY` set in `server/.env`.
- On iOS 16.4+, push **only works after "Add to Home Screen"** — install the PWA (Feature 1) before enabling push.
- Notification permission granted.

### Show it

1. Phone: log in as Patient → **Reminders** page.
2. Tap **Enable push reminders** — iOS/Android prompts "Allow notifications?" → Allow.
3. Lock the phone (press power button).
4. On the **laptop** (doctor role): Reminders page → pick a prescription → tap **Send test reminder**.
5. Phone lockscreen lights up with a MedCore notification: "Time for your medication — Metformin 500mg". Tap it → app opens directly to the Reminders screen.
6. Back on the laptop, show the **adherence %** and **streak** widgets update when you tap TAKEN on the phone.

### Talking point

"Reminders are scheduled with node-cron server-side. The Web Push API + our service worker deliver the notification even when the PWA isn't running. TAKEN/SKIP replies land in the adherence events table, which feeds the streak calculation."

---

## 5. SMS reply flow — "Works on a $10 feature phone"

### Why phone

This isn't about your smartphone's browser — it's about using the **actual SMS app** to send a real text. A laptop can simulate this via the `/sms-inbox` form, but handing your phone to someone and letting *them* type `PATIENT PAT-001 PIN:4242` into Messages, then watching a reply come back ~2 seconds later, is the only way to feel the pitch: "This works when the internet doesn't."

### Requires

- Africa's Talking account + shortcode (free sandbox: <https://account.africastalking.com>).
- `server/.env`: `AT_API_KEY`, `AT_USERNAME`, and **`DEMO_DOCTOR_PHONE=+254…`** — your actual phone number in E.164.
- Set the AT dashboard's **SMS callback URL** to:

  ```
  https://<your-tunnel>.trycloudflare.com/api/sms/inbound
  ```

- Wait for the AT sandbox approval (~minutes).

### Show it

From your phone's native SMS app, send the AT shortcode (shown on the AT dashboard):

```
PATIENT PAT-001 PIN:4242
```

~2 seconds later you get an SMS back:

> `Amina O.: meds Metformin 500mg, Amlodipine 5mg, Warfarin 5mg. RISK med. See app for full record.`

Now from the laptop, show the same message in **SMS Inbox** — it's logged with command, PIN status, response snippet.

Other commands to demo:

- `MEDS PAT-001 PIN:4242` — medication list
- `NOTE PAT-001 PIN:4242 follow up in two weeks` — adds a clinician note
- `APPT PAT-001 PIN:4242` — upcoming appointments
- `EMRG PAT-001 PIN:4242` — emergency summary
- `PATIENT PAT-001 PIN:0000` — wrong PIN; do it 3 times → account locks for 15 minutes

### Talking point

"93% of rural African phones are SMS-capable but not smartphones. The inbound webhook parses the command, validates the doctor's PIN (3 attempts, 15-min lockout), queries the same data store, and replies in under 140 chars."

### Fallback if you can't get AT set up

Use the `/sms-inbox` simulator on the laptop. Type the same commands into the "Simulate inbound SMS" form. Not as dramatic, but functionally identical.

---

## 6. Health ID QR — "Scan an ID card, get the chart"

### Why phone

QR scanning is literally a phone camera operation. Showing it on two devices (card/laptop QR → phone scanner) is the whole point.

### Requires

- Tunnel URL open on phone (so the scanned link resolves back into the same app).
- Phone's native Camera app (it auto-detects QR codes on iOS and modern Android).

### Show it

1. **Laptop** (Patient role): navigate to **Health ID** page. A QR code fills the screen, encoding something like `https://<tunnel>/patients/PAT-001`.
2. Point your phone's camera at the laptop screen — no special app needed. A yellow banner appears: "Open in Safari: MedCore".
3. Tap the banner → phone opens the patient chart directly.
4. Bonus: hand your phone to someone else (acting as "the doctor receiving the ID") — they scan, they get the chart. The pitch: the patient's ID card *is* their medical record.

### Talking point

"Patients carry a printed or digital ID card. Any clinician with MedCore access scans it and has the full record — no fax, no phone tag, no lost files."

---

## 7. Low-bandwidth / offline / cellular data — "Rural realistic"

### Why phone

Your laptop is on your home Wi-Fi. Rural Kenya is on a 2G cell, which behaves differently. Doing even part of the demo on cellular is more credible than claiming offline-first from a gigabit connection.

### Show it — any of these

- **Turn Wi-Fi off on your phone**, use LTE. Load the tunnel URL — observe the app still loads via the cached service-worker shell even if API calls are slow.
- In the app header, toggle **Low-bandwidth** on → show that image-heavy views switch to compressed text/icon mode.
- Toggle **Offline mode** on → show the app continues to work against cached data; the header badge flips to amber "Offline sync"; submissions queue.
- iOS: turn on **Settings → Developer → Network Link Conditioner → 3G** to throttle live.

### Talking point

"Service worker caches the UI shell. Offline mode queues writes and reconciles when online. Low-bandwidth mode drops avatars/images and uses iconography — the UX stays usable on 2G."

---

## Bonus — USSD

If a demo audience includes carriers or ministry-of-health folks, mention the `USSD *123#` pill in the header. It's a visual placeholder right now, but pitch it as:

> "In production, this dial-string is provisioned with Safaricom / MTN. A patient with a brick phone dials `*123#`, gets a menu, and interacts with MedCore over USSD sessions. No internet, no SMS cost."

That reinforces the "works on any phone" narrative even if you don't wire it up live.

---

## One-screen cheat sheet

Tape this to your laptop:

```
LAPTOP
  1. Role = Doctor
     • /prescriptions → Aspirin + Warfarin → PIN 4242 override
     • /sms-inbox     → simulate inbound, reply appears
     • /reminders     → Send test reminder

PHONE (tunnel URL)
  2. Add to Home Screen                     (Feature 1)
  3. /voice-consult → record 20 s → SOAP    (Feature 2)
  4. /video-consult → join doctor call      (Feature 3)
  5. /reminders    → Enable push, lock phone (Feature 4)
     → (laptop sends test → lockscreen lights up)
  6. SMS "PATIENT PAT-001 PIN:4242"         (Feature 5)
  7. Camera at laptop's /health-id QR       (Feature 6)
  8. Wi-Fi OFF, load tunnel on LTE          (Feature 7)
```

Total demo length: 5–7 minutes to hit all seven. 10–12 if you want to slow down on voice + video + push (the three that usually wow people).
