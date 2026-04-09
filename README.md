# Aible

Gamified mobile web app that teaches AI skills through bite-sized daily lessons. Think Duolingo, but for prompting, AI literacy, and practical AI workflows.

## Overview

Aible makes AI skills approachable through short, structured lessons with immediate feedback. Users complete exercises, earn XP, maintain streaks, and progress through a curriculum that takes them from AI basics to real-world workflows — without needing to write code.

## Features

- **Structured curriculum** — 4 modules, 24 lessons covering prompting, AI tools, automation, and real-world applications
- **Exercise formats** — Fill-in-the-blank, prompt builder, output judge, and real-world scenario exercises
- **Gamification** — XP system, streaks, progress rings, celebration overlays
- **AI tutor** — Conversational AI tutor for guidance and concept explanations
- **Voice mode** — Optional voice interaction with the tutor
- **Topic-based learning** — Browse by subject area with adaptive difficulty
- **Paywall** — Free preview + per-topic unlock model

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Vercel Edge Functions (AI tutor API)
- localStorage (progress persistence)

## Setup

```bash
cd app
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
```
