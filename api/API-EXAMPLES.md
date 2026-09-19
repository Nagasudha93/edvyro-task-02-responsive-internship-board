# EdVyro Internship Board API Examples

## 1. Health Check

GET http://localhost:5000/api/health

Expected response:

```json
{
  "status": "OK",
  "message": "Backend is connected"
}
```
## 2. List Internships

GET http://localhost:5000/api/internships

## 3. List with Pagination

GET http://localhost:5000/api/internships?page=1&limit=2

## 4. Get Internship by ID

GET http://localhost:5000/api/internships/INT-101
## 5. Create Internship

POST http://localhost:5000/api/internships

Content-Type: application/json

Request:

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
Expected status: `201 Created`
## 6. Update Internship

PUT http://localhost:5000/api/internships/INT-106

Content-Type: application/json

Request:

```json
{
  "title": "Java Spring Boot Intern",
  "domain": "Backend Development",
  "mode": "Hybrid",
  "location": "Hyderabad",
  "skills": ["Java", "Spring Boot", "MySQL", "REST API"],
  "openings": 4
}
```
Expected status: `200 OK`
## 7. Delete Internship

DELETE http://localhost:5000/api/internships/INT-106

Expected status: `200 OK`

## 8. Validation Error

Invalid request:

```json
{
  "id": "INT-107",
  "title": "",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "Hyderabad",
  "skills": ["Java"],
  "openings": 2
}
```
Expected status: `400 Bad Request`

Response:

```json
{
  "error": "title must be a non-empty string"
}
```
## 9. Not Found Error

GET http://localhost:5000/api/internships/INVALID-ID

Expected status: `404 Not Found`

Response:

```json
{
  "error": "Internship not found"
}
```