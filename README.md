# Installation & Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env_example.local .env
```

Update the values in `.env` to match your local PostgreSQL configuration.

---

## 4. Create the Database

Create a PostgreSQL database with the name specified in your `.env`.

Example:

```text
compfest_18_db
```

---

## 5. Database Setup

Generate the migration (if needed):

```bash
npm run migration:generate
```

Run the migration:

```bash
npm run migration:run
```

Seed the database:

```bash
npm run seed
```

---

## 6. Start the Application

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

---

# Project Workflow

Whenever you clone the project on a new machine:

```text
Clone Repository
        │
        ▼
npm install
        │
        ▼
Copy .env.example → .env
        │
        ▼
Configure PostgreSQL
        │
        ▼
Create Database
        │
        ▼
npm run migration:generate (only if required)
        │
        ▼
npm run migration:run
        │
        ▼
npm run seed
        │
        ▼
npm run start:dev
```

> **Note:** In most cases, `npm run migration:generate` is only needed when you've modified your TypeORM entities and want to create a new migration. If you're simply setting up the project from an existing repository, you can skip this step and run `npm run migration:run` directly.
