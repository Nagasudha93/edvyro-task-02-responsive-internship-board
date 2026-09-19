const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "internships.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        mode TEXT NOT NULL,
        location TEXT NOT NULL,
        skills TEXT NOT NULL,
        openings INTEGER NOT NULL CHECK (openings >= 0)
    )
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM internships").get();

if (count.count === 0) {
    const insert = db.prepare(`
        INSERT INTO internships
        (id, title, domain, mode, location, skills, openings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const internships = [
        [
            "INT-101",
            "Frontend Intern",
            "Full Stack Development",
            "Remote",
            "India",
            JSON.stringify(["HTML", "CSS", "JavaScript"]),
            3
        ],
        [
            "INT-102",
            "API Engineering Intern",
            "Full Stack Development",
            "Hybrid",
            "Pune",
            JSON.stringify(["Node.js", "SQL", "Testing"]),
            2
        ],
        [
            "INT-103",
            "UI/UX Intern",
            "UI/UX",
            "Remote",
            "India",
            JSON.stringify(["Figma", "Research", "Accessibility"]),
            1
        ],
        [
            "INT-104",
            "Data Analyst Intern",
            "Data Analytics",
            "On-site",
            "Bengaluru",
            JSON.stringify(["Excel", "SQL", "Data visualisation"]),
            2
        ],
        [
            "INT-105",
            "Security Operations Intern",
            "Cyber Security",
            "Remote",
            "India",
            JSON.stringify(["Linux", "Logs", "Networking"]),
            1
        ]
    ];

    const insertMany = db.transaction((records) => {
        for (const record of records) {
            insert.run(...record);
        }
    });

    insertMany(internships);
}

module.exports = db;