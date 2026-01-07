#  ArchLab

From Idea to Architecture — Powered by AI.

ArchLab is a Software Engineering Workbench that helps developers, students, and startup founders turn rough requirements into professional system design specifications. It uses Google Gemini to generate architecture patterns, component breakdowns, API specs, and Mermaid.js diagrams, all in a structured, exportable format.

##  Features

- ** AI-Powered Design**: Input requirements (chat/text) and get a complete system architecture (Monolith, Microservices, etc.).
- ** Automated Diagrams**: Auto-generates C4 Context, Container, Sequence, and ERD diagrams using Mermaid.js.
- ** Documentation Generator**: Produces structured API specifications, data models, and non-functional requirements (NFRs).
- ** Iterative Refinement**: Refine designs via chat (e.g., "Switch database to MongoDB") with version control (v1, v2 snapshots).
- ** Exportable Artifacts**: Download the entire design package as Markdown, PDF , or PNG images.

##  Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui (planned)
- **Diagrams**: Mermaid.js (via react-mermaid or similar)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **AI Orchestration**: Google Gemini API (Pro/Flash)

### Data & Infra
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Environment**: Docker Compose (for DB)

##  Project Structure

```
ArchLab/
├── backend/                # Express API & AI Orchestration
│   ├── src/
│   │   ├── modules/        # Domain logic (Auth, Projects, AI)
│   │   ├── config/         # Environment config
│   │   └── main.ts         # Entry point
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
│
├── frontend/               # Next.js Web Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # UI components
│   │   └── lib/            # API clients & utils
│   └── public/
│
├── docker-compose.yml      # Local database setup (Postgres)
└── README.md               # You are here
```

##  Getting Started

Follow these steps to set up ArchLab locally.

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/ArchLab.git
cd ArchLab
```

### 3. Database Setup

Start PostgreSQL using Docker:

```bash
docker-compose up -d
```

This spins up a Postgres container on port 5432.

### 4. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure Environment: Create a `.env` file (copy from `.env.example` if it exists):

```env
PORT=4000
DATABASE_URL="postgresql://postgres:password@localhost:5432/archlab?schema=public"
GEMINI_API_KEY="_google_gemini_key"
```

Run Database Migrations (Prisma):

```bash
npx prisma migrate dev --name init
```

Start the Server:

```bash
npm run dev
```

Server should be running at [http://localhost:4000](http://localhost:4000).

### 5. Frontend Setup

Open a new terminal and navigate to `frontend`:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure Environment: Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the Application:

```bash
npm run dev
```

App should be running at [http://localhost:3000](http://localhost:3000).

##  Usage Guide

1. **Create a Project**: Go to the dashboard and click "New Project". Give it a name (e.g., "Delivery App").
2. **Input Requirements**: Describe what you want to build.
   - Example: "A food delivery app where users can order from restaurants, track drivers, and pay via card."
3. **Generate**: Click "Generate Architecture". Wait for Gemini to process.
4. **View Results**:
   - **Architecture Tab**: View the high-level summary and tech stack.
   - **Diagrams Tab**: See the generated C4 and Sequence diagrams.
5. **Refine (Optional)**: Chat with the AI to tweak the design (e.g., "Add a caching layer with Redis").

##  Roadmap

- [x] Phase 0: Project initialization & DB setup.
- [ ] Phase 1 (MVP): Project creation, Gemini Pipeline integration, Basic Mermaid rendering.
- [ ] Phase 2: Version control for designs (v1 -> v2).
- [ ] Phase 3: PDF Export & Markdown download.
- [ ] Phase 4: User Authentication & RBAC.

##  License

This project is open-source and available under the MIT License.