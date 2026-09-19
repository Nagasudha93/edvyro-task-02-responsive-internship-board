# Responsive Internship Board

**EdVyro Full Stack Development Internship — Task 02**

A responsive full-stack internship listing application built using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite.

The project provides a responsive interface for browsing internship opportunities and a REST API for managing internship records with persistent database storage.

## Features

### Frontend

* Responsive internship listing cards
* Internship search
* Domain filter
* Work mode filter
* Clear filters
* Internship details dialog
* Internship application form
* Form validation
* Loading state
* Empty-result state
* Error state with retry
* Keyboard-friendly navigation
* Accessible form labels
* Responsive layout for mobile, tablet, and desktop
* Internship data loaded from the REST API
* Local browser storage for demo application records

### Backend

* REST API using Node.js and Express.js
* SQLite persistent data storage
* List internships
* Get internship by ID
* Create internship
* Update internship
* Delete internship
* Pagination support
* Input validation
* Consistent HTTP status codes
* Error responses
* Automatic database creation
* Automatic seed data insertion

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Browser DOM APIs
* LocalStorage

### Backend

* Node.js
* Express.js
* SQLite
* better-sqlite3
* CORS

No frontend framework is used.

## Internship Records

The application contains the following initial internship records:

* INT-101 — Frontend Intern
* INT-102 — API Engineering Intern
* INT-103 — UI/UX Intern
* INT-104 — Data Analyst Intern
* INT-105 — Security Operations Intern

The records are automatically inserted into the SQLite database when the backend starts if the database is empty.

## REST API

### Base URL

```text
http://localhost:5000
```

### Endpoints

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/health`          | Check API status     |
| GET    | `/api/internships`     | List internships     |
| GET    | `/api/internships/:id` | Get internship by ID |
| POST   | `/api/internships`     | Create internship    |
| PUT    | `/api/internships/:id` | Update internship    |
| DELETE | `/api/internships/:id` | Delete internship    |

## Pagination

The internship list API supports pagination.

Example:

```text
GET /api/internships?page=1&limit=2
```

Example response:

```json
{
  "page": 1,
  "limit": 2,
  "total": 5,
  "totalPages": 3,
  "internships": []
}
```

## Internship Data Format

```json
{
  "id": "INT-101",
  "title": "Frontend Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "India",
  "skills": ["HTML", "CSS", "JavaScript"],
  "openings": 3
}
```

## Validation

The API validates internship data before creating or updating records.

Examples of validation rules:

* ID must be a non-empty string
* Title must be a non-empty string
* Domain must be a non-empty string
* Mode must be `Remote`, `Hybrid`, or `On-site`
* Location must be a non-empty string
* Skills must be a non-empty array of strings
* Openings must be a non-negative integer

Invalid input returns:

```text
400 Bad Request
```

If an internship is not found:

```text
404 Not Found
```

If an internship ID already exists:

```text
409 Conflict
```

## Database

The backend uses SQLite for persistent storage.

Database file:

```text
internships.db
```

The database is created automatically when the backend starts.

The local database file is excluded from Git using `.gitignore`.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nagasudha93/edvyro-task-02-responsive-internship-board.git
cd edvyro-task-02-responsive-internship-board
```

### 2. Install Backend Dependencies

```bash
cd api
npm install
```

### 3. Start the Backend

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### 4. Start the Frontend

Open another terminal in the project root:

```bash
cd ..
npx live-server
```

The frontend will open in the browser.

The frontend retrieves internship records from:

```text
http://localhost:5000/api/internships
```

## Project Structure

```text
edvyro-task-02-responsive-internship-board/
|
|-- index.html
|-- style.css
|-- script.js
|-- internship-records-sample.json
|-- README.md
|-- .gitignore
|
`-- api/
    |-- server.js
    |-- db.js
    |-- schema.sql
    |-- package.json
    |-- package-lock.json
    |-- API-EXAMPLES.md
    `-- README.md
```

## API Documentation

Detailed backend setup and API information:

```text
api/README.md
```

API request and response examples:

```text
api/API-EXAMPLES.md
```

Database schema:

```text
api/schema.sql
```

## GitHub Repository

```text
https://github.com/Nagasudha93/edvyro-task-02-responsive-internship-board
```

## Project Deployment

The frontend is deployed using GitHub Pages.

The REST API and SQLite database are designed to run locally using Node.js.

## Author

**Nagasudha Kanukuntla**

B.Tech Information Technology
Kamala Institute of Technology & Science
