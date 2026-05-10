import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function init() {
await sql`
CREATE TABLE IF NOT EXISTS app_data (
id TEXT PRIMARY KEY,
value JSONB NOT NULL
)
`;
}

export default async function handler(req, res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") return res.status(200).end();

await init();

if (req.method === "GET") {
try {
const rows = await sql`SELECT value FROM app_data WHERE id = 'nous-deux'`;
if (rows.length === 0) {
return res.status(200).json({ names: ["", ""], unlockDate: "", messages: [], setupDone: false });
}
return res.status(200).json(rows[0].value);
} catch (err) {
console.error(err);
return res.status(500).json({ error: "Erreur de lecture" });
}
}

if (req.method === "POST") {
try {
const body = req.body;
await sql`
INSERT INTO app_data (id, value) VALUES ('nous-deux', ${JSON.stringify(body)}::jsonb)
ON CONFLICT (id) DO UPDATE SET value = ${JSON.stringify(body)}::jsonb
`;
return res.status(200).json({ ok: true });
} catch (err) {
console.error(err);
return res.status(500).json({ error: "Erreur de sauvegarde" });
}
}

return res.status(405).json({ error: "Méthode non autorisée" });
}
