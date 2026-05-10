import { kv } from "@vercel/kv";

const KEY = "nous-deux-data";

export default async function handler(req, res) {
  // Allow CORS for same-origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const data = await kv.get(KEY);
      return res.status(200).json(data || { names: ["", ""], unlockDate: "", messages: [], setupDone: false });
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: "Erreur de lecture" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "Données invalides" });
      }
      await kv.set(KEY, body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("POST error:", err);
      return res.status(500).json({ error: "Erreur de sauvegarde" });
    }
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
