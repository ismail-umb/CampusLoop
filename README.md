# CampusLoop

CampusLoop – UMass Boston roommate matching platform for students.

## Project Structure

```
CampusLoop
├── client   # Frontend (React + Vite)
└── server   # Backend (Node.js + Express + Prisma)
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)
- PostgreSQL or another database supported by Prisma

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/ismail-umb/CampusLoop.git
cd CampusLoop
```

---

## 2. Setup the Backend (Server)

Go to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder.

Example `.env` file:

```
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_secret_key"
```

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev
```

(Optional) Seed the database with initial data:

```bash
npx prisma db seed
```

Start the backend server:

```bash
npm run dev
```

The backend should start on something like:

```
http://localhost:5000
```

---

## 3. Setup the Frontend (Client)

Open a new terminal and go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on something like:

```
http://localhost:5173
```

---

## 4. Running the Application

1. Start the backend (`server`)
2. Start the frontend (`client`)
3. Open the frontend URL in your browser

The frontend will communicate with the backend API.

---

## Technologies Used

- React (Vite)
- Node.js
- Express
- Prisma ORM
- PostgreSQL

---

## Team Project

This project was developed as part of the **UMass Boston IT Capstone course**.
