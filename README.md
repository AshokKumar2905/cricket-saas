# 🏏 Cricket SaaS Platform (Multi-User Web App Deployment)

A scalable, multi-user Software-as-a-Service (SaaS) platform engineered for managing cricket tournaments, tracking player performance metrics, orchestrating team workflows, and rendering structured statistics. This platform is built using a decoupled architecture, leveraging a high-performance Python backend RESTful API framework and a modern, type-safe Next.js frontend dashboard.

---

## 🏗️ System Architecture & Directory Layout

The repository is organized into a decoupled monorepo containing distinct `backend` and `frontend` environments:

```text
cricket-saas/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App initialization and factory pattern
│   │   ├── auth.py              # User authentication & token management logic
│   │   ├── config.py            # Environment configuration parsing
│   │   ├── database.py          # PostgreSQL relational connection engine
│   │   ├── main.py              # Application entrypoint & routing definitions
│   │   ├── models.py            # Relational database schema models
│   │   └── schemas.py           # Data validation and serialization layers
│   ├── .env                     # Local environment configuration variables
│   └── requirements.txt         # Python dependency manifest
└── frontend/
    ├── app/                     # Next.js App Router topology
    │   ├── blogs/
    │   │   ├── [slug]/page.tsx  # Dynamic route for technical/analytical articles
    │   │   └── page.tsx         # Analytical blogs overview page
    │   ├── players/
    │   │   └── [id]/page.tsx    # Dynamic detailed view for player performance metrics
    │   ├── favicon.ico
    │   ├── globals.css          # Tailwinds baseline configurations
    │   ├── layout.tsx           # High-level shell framework mapping wrappers
    │   └── page.tsx             # Main dashboard interface entryway
    ├── components/              # Reusable React UI component pool
    │   ├── BlogsOverviewGrid.tsx
    │   └── PlayerProfileView.tsx
    ├── public/                  # Core static assets and vector icons
    ├── types/
    │   └── cricket.ts           # Global TypeScript interface typing arrays
    ├── next.config.ts           # Next.js native execution profiles
    ├── tsconfig.json            # Strict TypeScript compilation definitions
    ├── package.json             # Node package ecosystem scripts
    └── eslint.config.mjs        # Production code linting profiles
