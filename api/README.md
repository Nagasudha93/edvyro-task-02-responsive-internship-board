# EdVyro Internship Board REST API

REST API for managing internship records using Node.js, Express.js and SQLite.

## Technologies

- Node.js
- Express.js
- SQLite
- better-sqlite3
- CORS

## Setup

```bash
cd api
npm install
npm run dev
```
Server:
http://localhost:5000
## Database
The project uses SQLite for persistent data storage.

Database file:
`internships.db`

The database and initial internship records are automatically created when the application starts.
## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/internships` | List internships |
| GET | `/api/internships/:id` | Get internship by ID |
| POST | `/api/internships` | Create internship |
| PUT | `/api/internships/:id` | Update internship |
| DELETE | `/api/internships/:id` | Delete internship |
## Pagination

Example:

`GET /api/internships?page=1&limit=2`

Response includes:

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
## Create Internship

`POST /api/internships`

Example request:

```json
{
  "id": "INT-106",
  "title": "Java Developer Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "Hyderabad",
  "skills": ["Java", "Spring Boot", "MySQL"],
  "openings": 2
}
```
Response status: `201 Created`

## Update Internship
`PUT /api/internships/INT-106`

Response status: `200 OK`

## Delete Internship

`DELETE /api/internships/INT-106`

Response status: `200 OK`
## Validation

Invalid input returns `400 Bad Request`.

Example:

```json
{
  "error": "title must be a non-empty string"
}
```
If the internship does not exist: `404 Not Found`

If the internship ID already exists: `409 Conflict`
## Project Structure

```text
api/
|-- server.js
|-- db.js
|-- schema.sql
|-- internships.db
|-- package.json
|-- package-lock.json
|-- API-EXAMPLES.md
`-- README.md
```