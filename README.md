# Leave-Optix - Intelligent Leave & Workforce Optimization System

A comprehensive leave management and workforce optimization platform built with modern technologies.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI (Python 3.11+)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT-based)
- **State Management**: React Query + Zustand
- **Deployment**: Docker + Docker Compose

## 📁 Project Structure

```
workload360/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── database/          # Database schemas and migrations
├── docs/              # Documentation
├── docker-compose.yml # Docker orchestration
└── README.md
```

## 🎯 Core Features

1. **Leave Request Management**
   - Submit and track leave requests
   - Multiple leave types (vacation, sick, personal, etc.)
   - Leave balance tracking

2. **Workload Analysis Engine**
   - Team capacity monitoring
   - Workload distribution analytics
   - Resource availability forecasting

3. **Auto-Approval Rule System**
   - Configurable approval workflows
   - Rule-based auto-approvals
   - Escalation policies

4. **Team Calendar**
   - Visual team availability
   - Conflict detection
   - Multi-team view

5. **Manager Dashboard**
   - Team overview and analytics
   - Approval queues
   - Workload insights

6. **Notification System**
   - Real-time notifications
   - Email alerts
   - In-app notifications

## 🏗️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Supabase account

### Environment Setup

1. Clone the repository
2. Copy environment files:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
3. Configure your Supabase credentials in `.env` files

### Running with Docker

```bash
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Running Locally

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📝 License

MIT License

## 👥 Contributors

Your team here
