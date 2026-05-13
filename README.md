# AI Lead Generation CRM

> A fully functional AI-powered CRM tool that imports leads, enriches them with AI intelligence, generates personalised cold emails, analyzes reply sentiment, and manages the full sales pipeline.

---

## Workflow Architecture

```
Lead Upload  (CSV · paste text · manual form)
      ↓
Data Validation  (dedup · normalisation · completeness)
      ↓
AI Enrichment Engine  (ICP score · meeting readiness · priority tag · summary)
      ↓
CRM Database Storage  (lead records · pipeline status · audit trail)
      ↓
Personalised Email Generation  (AI drafts cold emails per lead context)
      ↓
Dashboard + Lead Tracking  (score rings · pipeline · filters · metrics)
      ↓
Automated Follow-Up Engine  (smart timing · sentiment analysis · next-action)
      ↑_____________________________ re-enters pipeline ________________________|
```

---

## Features

| Feature | Description |
|---|---|
| Lead upload | CSV import, paste any raw text (AI parses it automatically), manual form entry |
| AI enrichment | ICP fit score (0–100), meeting readiness score, Hot/Warm/Cold priority tag, prospect intelligence summary |
| Cold email generator | AI writes personalised cold outreach per lead — tailored to their role, company, and context |
| Sentiment analysis | Paste a reply — AI labels sentiment (Positive/Neutral/Negative/Objection) and recommends next action |
| Pipeline tracking | Status: New → Contacted → Qualified → Won / Lost |
| Dashboard metrics | Total leads, new, hot, enriched, won counts + live pipeline distribution bar |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, inline CSS |
| AI model | LLaMA 3.3 70B via Groq API (free tier) |
| State management | React `useState` (in-memory, no backend required) |
| Data import | CSV file reader + AI-powered text parser |
| Build tool | Vite |
| Deployment | Vercel / Netlify (static hosting) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free Groq API key — get one at [console.groq.com](https://console.groq.com)

### Installation

```bash
git clone https://github.com/divyay-spec/quanhack-ai-crm.git
cd quanhack-ai-crm
npm install
```

### Configure API key

Create a `.env` file in the root folder:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

---

## Project Structure

```
quanhack-ai-crm/
├── src/
│   ├── App.jsx              # Main app — state, enrichment logic, imports
│   ├── main.jsx             # React entry point
│   ├── components/
│   │   ├── LeadCard.jsx     # Individual lead card with scores and enrich button
│   │   ├── LeadDetail.jsx   # Lead detail panel (tabs: AI Intel, Cold Email, Sentiment, Details)
│   │   ├── AddLeadModal.jsx # Manual lead entry form
│   │   ├── ArchModal.jsx    # 7-step workflow architecture diagram
│   │   └── ui.jsx           # Shared UI components (Avatar, Chip, ScoreRing, PipelineBar)
│   ├── utils/
│   │   └── claude.js        # Groq API wrapper (callClaude + callClaudeJSON)
│   └── data/
│       └── sampleLeads.js   # Sample leads + color maps for status/priority/sentiment
├── index.html               # HTML shell + global styles
├── package.json
├── vite.config.js
├── .env.example             # API key template
├── .gitignore
├── sample_leads.csv         # Sample CSV for demo
└── README.md
```

---

## Demo Walkthrough

1. **Architecture** — click "View architecture" (top right) to see the full 7-stage workflow
2. **CSV import** — click "Import CSV" and upload `sample_leads.csv` — leads load instantly
3. **Paste import** — paste any raw text or LinkedIn bio → AI extracts structured lead data
4. **Enrich with AI** — click "Enrich with AI" on any lead → ICP score, meeting readiness score, priority tag, and follow-up recommendation generate live
5. **Cold email** — open a lead → Cold Email tab → generate a personalised outreach email
6. **Sentiment analysis** — paste a reply in the Sentiment tab → AI labels sentiment and recommends next action
7. **Pipeline** — update lead statuses → pipeline bar and metrics update in real time

---

## Sample CSV Format

```csv
name,title,company,email,phone,industry,size,location
Priya Sharma,Head of Operations,NovaTech Solutions,priya@novatech.io,+91 98201 44310,SaaS,51-200,Bangalore IN
```

---
