# QueueCure — High-Fidelity Indian-Localized OPD Queue Management System

QueueCure is a modern, premium, and feature-rich outpatient department (OPD) queue management system customized for Indian clinical workflows. Designed to minimize patient waiting anxiety and optimize hospital triage efficiency, QueueCure bridges the gap between waiting halls and consulting rooms with real-time tracking, multi-language support, automated speech calling, and interactive SMS alerts simulation.

---

##  Key Features

### 1. Dual-Role Architecture (Role-Guard Security)
- **OPD Desk Operator Console**: A secure workspace for clinic receptionists and triage coordinators to dispatch patients, summon next in line, cancel bookings, view real-time statistics, and download logs.
- **Patient Self-Care & Status Portal**: A responsive patient-facing dashboard to register details, check queue rank, calculate estimated waiting time, and track clinical room status.

### 2.Voice Announcements & Audio Chimes
- Synthesized Text-to-Speech (TTS) engine that announces token transitions automatically in real-time (e.g., *"Token number 44, please proceed to OPD Cabin 1"*).
- Distinct sound chimes to signal new registrations and patient summons.

### 3.Interactive SMS Mobile Simulator
- Real-time mobile phone frame displaying dispatched SMS notifications as patient updates happen.
- Alerts include priority tier details, estimated wait times, room assignments, completed consults, and cancellation notifications.

### 4. 🇮🇳 13-Language Indian Localization
Full interface translation and localization for major regional languages:
- **English, Hindi (हिन्दी), Bengali (বাংলা), Telugu (తెలుగు), Marathi (मराठी), Tamil (தமிழ்), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Urdu (اردو), Odia (ଓଡ଼ିଆ), and Assamese (অসমীয়া)**.

### 5. Advanced Smart Triage
- **Priority-Based Auto-Sorting**: Dedicated queues for regular clients, infants/children, seniors/disabled (Divyangjan), and immediate high-priority emergency triage (Atyant Care).
- **Multi-Tab Sync**: Uses reactive storage events to keep the operator console, patient portal, and SMS logs synchronized instantly across multiple browser windows.

### 6. Clinical Audit Logbook
- Searchable and filterable history of all processed patient actions (served, missed, canceled).
- Seamless CSV exporter generating audit-ready report sheets.

---

##  Technology Stack

- **Core Framework**: React 19 + TypeScript
- **Bundler & Server**: Vite 6
- **Styling & Theme**: Tailwind CSS v4 (with premium dark/light mode system)
- **Icons**: Lucide React
- **Audio Engines**: Web Speech Synthesis API & Web Audio API
- **State Management**: Reactive LocalStorage Synced State

---

## Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your system.

### Installation

1. **Clone the repository and enter the directory:**
   ```bash
   cd "wobble project"
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy the example environment template and add your Gemini API Key if using assistant extensions:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The app will run locally and be accessible at: `http://localhost:3000`

---

##  Project Structure

```
wobble project/
├── src/
│   ├── components/
│   │   ├── ActiveQueue.tsx         # Live queue list & check-in monitor
│   │   ├── FormSection.tsx         # Operator patient intake panel
│   │   ├── GitHubImport.tsx        # Simulated portfolio meta importer
│   │   ├── HistoryLog.tsx          # Audit trail table & CSV exporter
│   │   ├── PhoneMockup.tsx         # Visual SMS simulation viewport
│   │   ├── RoleGuardLanding.tsx    # Secure role entry gate (passcode: swasthya)
│   │   ├── ServingRoom.tsx         # Operator cabin dispatcher module
│   │   └── StatsGrid.tsx           # Multi-metric KPI board
│   ├── utils/
│   │   ├── audio.ts                # TTS Speech engine & synth chimes
│   │   └── receptionistTranslations.ts # 13-language translation dictionary
│   ├── App.tsx                     # Main layout & state coordinator
│   ├── index.css                   # Custom global scrollbars & active glow keyframes
│   ├── main.tsx                    # React rendering entrypoint
│   └── types.ts                    # TypeScript typings (Patient, VisitType, etc.)
├── index.html                      # Web app entry markup template
├── package.json                    # Configuration, scripts & dependency list
└── tsconfig.json                   # TS compiler rules config
```

---

##  Access Credentials

To enter the **OPD Desk Operator Console** from the gate selector:
- **Passcode**: `swasthya`

---

##  License
This project is proprietary and customized for clinical portfolio presentation.
