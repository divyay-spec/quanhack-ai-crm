# AI Lead Generation CRM

> **QuAnHack Internship Final Round Submission**
> AI-powered lead generation, enrichment, cold email drafting, and pipeline management tool.

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
Personalised Email Generation  (Claude drafts cold emails per lead context)
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
| Lead upload | CSV import, paste any raw text (Claude parses it), manual form |
| AI enrichment | ICP fit score (0–100), meeting readiness score, Hot/Warm/Cold priority tag, prospect intelligence summary |
| Cold email generator | Claude writes personalised cold outreach per lead context |
| Sentiment analysis | Paste a reply — Claude labels sentiment and recommends next action |
| Pipeline tracking | Status: New → Contacted → Qualified → Won / Lost |
| Dashboard metrics | Total leads, new, hot, enriched, won counts + pipeline bar |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind-style inline CSS |
| AI brain | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| State management | React `useState` (in-memory, no backend required) |
| Data import | CSV file reader + Claude-powered text parser |
| Deployment | Vite + static hosting (Vercel / Netlify) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/quanhack-ai-crm.git
cd quanhack-ai-crm
npm install
```

### Configure API key

```bash
cp .env.example .env
# Edit .env and add your key:
# VITE_ANTHROPIC_API_KEY=sk-ant-...
```

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
│   ├── App.jsx              # Main app + routing
│   ├── components/
│   │   ├── LeadCard.jsx     # Individual lead card
│   │   ├── LeadDetail.jsx   # Lead detail panel (tabs: Intel, Email, Sentiment, Details)
│   │   ├── AddLeadModal.jsx # Add lead form
│   │   └── ArchModal.jsx    # Workflow architecture diagram
│   ├── utils/
│   │   └── claude.js        # Anthropic API wrapper
│   ├── data/
│   │   └── sampleLeads.js   # Sample leads for demo
│   └── main.jsx
├── public/
│   └── architecture.svg     # Workflow architecture diagram (standalone)
├── sample_leads.csv         # Sample CSV for import demo
├── .env.example
├── vite.config.js
└── README.md
```

---

## Demo Walkthrough (for the video)

1. **Architecture** — click "View architecture" to show the 7-stage workflow
2. **Import** — drag in `sample_leads.csv` or paste a LinkedIn bio
3. **Enrich** — click "Enrich with AI" → watch ICP score, meeting readiness, and priority tag populate
4. **Email** — open a lead → generate cold email
5. **Sentiment** — paste a fake reply in the Sentiment tab → see analysis + recommendation
6. **Pipeline** — update statuses, watch the pipeline bar update live

---

## Sample CSV Format

```csv
name,title,company,email,phone,industry,size,location
Priya Sharma,Head of Operations,NovaTech Solutions,priya@novatech.io,+91 98201 44310,SaaS,51-200,Bangalore IN
```

---

## License

MIT
