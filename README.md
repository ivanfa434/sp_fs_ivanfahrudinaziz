Multi-User Project Management App
Sellerpintar Fullstack Technical Test Submission
🚀 Quick Start Guide
Prerequisites

Node.js (v18+)
PostgreSQL or SQLite
Git

1. Clone & Setup
# Clone repository
git clone https://github.com/username/sp_fs_ivanfahrudinaziz.git
cd sp_fs_ivanfahrudinaziz
3. Backend Setup
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start backend server
npm run dev

3. Frontend Setup
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start frontend server
npm run dev



