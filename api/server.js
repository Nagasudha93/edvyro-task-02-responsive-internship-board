const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function formatInternship(row) {
    if (!row) return null;

    return {
        id: row.id,
        title: row.title,
        domain: row.domain,
        mode: row.mode,
        location: row.location,
        skills: JSON.parse(row.skills),
        openings: row.openings
    };
}

function validateInternship(data) {
    const requiredFields = [
        "id",
        "title",
        "domain",
        "mode",
        "location",
        "skills",
        "openings"
    ];

    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
            return `${field} is required`;
        }
    }

    if (typeof data.id !== "string" || !data.id.trim()) {
        return "id must be a non-empty string";
    }

    if (typeof data.title !== "string" || !data.title.trim()) {
        return "title must be a non-empty string";
    }

    if (typeof data.domain !== "string" || !data.domain.trim()) {
        return "domain must be a non-empty string";
    }

    if (!["Remote", "Hybrid", "On-site"].includes(data.mode)) {
        return "mode must be Remote, Hybrid, or On-site";
    }

    if (typeof data.location !== "string" || !data.location.trim()) {
        return "location must be a non-empty string";
    }

    if (
        !Array.isArray(data.skills) ||
        data.skills.length === 0 ||
        data.skills.some(skill => typeof skill !== "string" || !skill.trim())
    ) {
        return "skills must be a non-empty array of strings";
    }

    if (
        !Number.isInteger(data.openings) ||
        data.openings < 0
    ) {
        return "openings must be a non-negative integer";
    }

    return null;
}

app.get("/", (req, res) => {
    res.json({
        message: "EdVyro Internship Board API is running successfully!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({     
        status: "OK",
        message: "Backend is connected"
    });
});

// LIST - with pagination
app.get("/api/internships", (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const total = db
        .prepare("SELECT COUNT(*) AS count FROM internships")
        .get().count;

    const rows = db
        .prepare(`
            SELECT *
            FROM internships
            ORDER BY id
            LIMIT ? OFFSET ?
        `)
        .all(limit, offset);

    res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        internships: rows.map(formatInternship)
    });
});

// DETAIL
app.get("/api/internships/:id", (req, res) => {
    const row = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(req.params.id);

    if (!row) {
        return res.status(404).json({
            error: "Internship not found"
        });
    }

    res.status(200).json(formatInternship(row));
});

// CREATE
app.post("/api/internships", (req, res) => {
    const error = validateInternship(req.body);

    if (error) {
        return res.status(400).json({
            error
        });
    }

    const existing = db
        .prepare("SELECT id FROM internships WHERE id = ?")
        .get(req.body.id);

    if (existing) {
        return res.status(409).json({
            error: "Internship with this id already exists"
        });
    }

    db.prepare(`
        INSERT INTO internships
        (id, title, domain, mode, location, skills, openings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        req.body.id,
        req.body.title.trim(),
        req.body.domain.trim(),
        req.body.mode,
        req.body.location.trim(),
        JSON.stringify(req.body.skills),
        req.body.openings
    );

    const created = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(req.body.id);

    res.status(201).json(formatInternship(created));
});

// UPDATE
app.put("/api/internships/:id", (req, res) => {
    const existing = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(req.params.id);

    if (!existing) {
        return res.status(404).json({
            error: "Internship not found"
        });
    }

    const updatedData = {
        id: req.params.id,
        ...req.body
    };

    const error = validateInternship(updatedData);

    if (error) {
        return res.status(400).json({
            error
        });
    }

    db.prepare(`
        UPDATE internships
        SET title = ?,
            domain = ?,
            mode = ?,
            location = ?,
            skills = ?,
            openings = ?
        WHERE id = ?
    `).run(
        req.body.title.trim(),
        req.body.domain.trim(),
        req.body.mode,
        req.body.location.trim(),
        JSON.stringify(req.body.skills),
        req.body.openings,
        req.params.id
    );

    const updated = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(req.params.id);

    res.status(200).json(formatInternship(updated));
});

// DELETE
app.delete("/api/internships/:id", (req, res) => {
    const existing = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(req.params.id);

    if (!existing) {
        return res.status(404).json({
            error: "Internship not found"
        });
    }

    db.prepare("DELETE FROM internships WHERE id = ?")
        .run(req.params.id);

    res.status(200).json({
        message: "Internship deleted successfully",
        id: req.params.id
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});