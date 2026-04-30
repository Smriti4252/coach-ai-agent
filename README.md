# Coach AI Agent 🎯

An AI-powered sales and onboarding automation system built for online coaches.
This system acts as a virtual sales assistant that qualifies leads, books discovery
calls, generates tailored coaching packages, and onboards paying clients automatically.

## Live Demo
> Run locally following the setup instructions below.

## Features

- **AI Lead Qualification** — Scores leads as HOT / WARM / COLD using LLaMA 3.3 via Groq
- **Auto Booking Engine** — Suggests real calendar slots and confirms discovery calls
- **AI Coaching Packages** — Generates 3 tailored packages based on lead's goal and budget
- **Automated Onboarding** — Welcome message, checklist, and session scheduling
- **Coach Dashboard** — Real-time pipeline with conversion and booking rates
- **Google Calendar Integration** — Real slot availability and event creation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | MongoDB Atlas |
| AI/LLM | Groq API — LLaMA 3.3 70B |
| Agent Framework | LangChain |
| Calendar | Google Calendar API |

## System Flow

1. Lead fills the coaching match form
2. AI qualification agent scores the lead HOT / WARM / COLD
3. HOT leads get real calendar slots to book a discovery call
4. After the call, AI generates 3 personalized coaching packages
5. Client picks a plan → onboarding sequence starts automatically
6. Coach monitors everything on the dashboard in real time

## Project Structure

coach-ai-agent/
├── backend/
│   ├── agents/
│   │   ├── qualification_agent.py
│   │   ├── booking_agent.py
│   │   ├── proposal_agent.py
│   │   └── onboarding_agent.py
│   ├── routes/
│   │   └── leads.py
│   ├── utils/
│   │   └── calendar.py
│   ├── main.py
│   ├── database.py
│   └── models.py
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LeadForm.jsx
│       │   ├── Booking.jsx
│       │   ├── Proposal.jsx
│       │   ├── Dashboard.jsx
│       │   └── ThankYou.jsx
│       └── components/
│           └── Navbar.jsx
└── README.md

## Setup Instructions

### Backend

```bash
cd backend
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string

Run the server:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Get free at console.groq.com |
| `MONGODB_URI` | MongoDB Atlas connection string |

## Author

Built by Smriti Sharma