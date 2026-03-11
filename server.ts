import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("production.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS product_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS form_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step_number INTEGER,
    title TEXT,
    description TEXT,
    fields TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER,
    professional_name TEXT, -- For historical consistency
    report_date TEXT,
    day_of_week TEXT,
    is_holiday INTEGER,
    location_id INTEGER,
    location_name TEXT,
    data TEXT, -- JSON string of all form fields
    total_production INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get().count;
if (userCount === 0) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "admin");
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("user", "user123", "user");

  const initialProfessionals = [
    "Albert Silva", "Alfredo Neto", "Ana Cristina Santos", "Ana Krasnievicz", "Anderson Pinto",
    "Any Galvão", "Antonio Luiz", "Bárbara Bejarano", "Beto Silva", "Chris Reis",
    "Clauber Matheus", "Duda Schindler", "Emerson Willian", "Fernando de Carvalho",
    "Fernando Moraes", "Gerson Wassouf", "Gilberto Fagundes", "Isabela Duarte",
    "Isabelle Rancan", "Israel Espíndola", "Ivair Xavier Luiz", "Karina Anunciato",
    "Jean Martins", "João Balbueno", "Juscinei Vilela", "Kelly Martins", "Larissa Dandara",
    "Leandro Elias", "Leonardo Guimarães", "Lígia Sabka", "Marcos Phelipe", "Mari Verdan",
    "Mateus Adriano", "Max Silva", "Nathan Rancan", "Nestor Junior", "Nino de Assis",
    "Ricardo Vinícius", "Rodrigo Moreira", "Rosildo Moura", "Sidney Cardoso", "Talita Matsushita"
  ];
  const insertProf = db.prepare("INSERT INTO professionals (name) VALUES (?)");
  initialProfessionals.forEach(p => insertProf.run(p));

  const initialLocations = ["Aparecida do Taboado", "Campo Grande", "Dourados", "Paranaíba", "Três Lagoas"];
  const insertLoc = db.prepare("INSERT INTO locations (name) VALUES (?)");
  initialLocations.forEach(l => insertLoc.run(l));

  const initialProducts = [
    "Matéria para portal", "Nota", "Reportagem de rádio", "Boletim", "Entrevista",
    "Vídeo", "Entrada ao vivo", "Postagem para redes sociais", "Roteiro", "Fotografia"
  ];
  const insertProd = db.prepare("INSERT INTO product_types (name) VALUES (?)");
  initialProducts.forEach(p => insertProd.run(p));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API ROUTES ---

  // Auth
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ id: user.id, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // Professionals
  app.get("/api/professionals", (req, res) => {
    const profs = db.prepare("SELECT * FROM professionals WHERE active = 1 ORDER BY name ASC").all();
    res.json(profs);
  });

  // Locations
  app.get("/api/locations", (req, res) => {
    const locs = db.prepare("SELECT * FROM locations WHERE active = 1 ORDER BY name ASC").all();
    res.json(locs);
  });

  // Product Types
  app.get("/api/product-types", (req, res) => {
    const types = db.prepare("SELECT * FROM product_types WHERE active = 1 ORDER BY name ASC").all();
    res.json(types);
  });

  // Reports
  app.post("/api/reports", (req, res) => {
    const { professionalId, professionalName, reportDate, dayOfWeek, isHoliday, locationId, locationName, data, totalProduction } = req.body;
    const result = db.prepare(`
      INSERT INTO reports (professional_id, professional_name, report_date, day_of_week, is_holiday, location_id, location_name, data, total_production)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(professionalId, professionalName, reportDate, dayOfWeek, isHoliday ? 1 : 0, locationId, locationName, JSON.stringify(data), totalProduction);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports ORDER BY report_date DESC, created_at DESC").all();
    res.json(reports.map(r => ({ ...r, data: JSON.parse(r.data) })));
  });

  // Analytics
  app.get("/api/analytics/dashboard", (req, res) => {
    const { month, year, location, professional } = req.query;
    let query = "SELECT * FROM reports WHERE 1=1";
    const params = [];

    if (month) {
      query += " AND strftime('%m', report_date) = ?";
      params.push(String(month).padStart(2, '0'));
    }
    if (year) {
      query += " AND strftime('%Y', report_date) = ?";
      params.push(String(year));
    }
    if (location) {
      query += " AND location_name = ?";
      params.push(location);
    }
    if (professional) {
      query += " AND professional_name = ?";
      params.push(professional);
    }

    const reports = db.prepare(query).all(params);
    
    // Process analytics
    const journalistRanking = {};
    const productRanking = {};
    const dailyProduction = {};
    const locationProduction = {};

    reports.forEach(r => {
      const data = JSON.parse(r.data);
      
      // Journalist Ranking
      journalistRanking[r.professional_name] = (journalistRanking[r.professional_name] || 0) + r.total_production;
      
      // Daily Production
      dailyProduction[r.report_date] = (dailyProduction[r.report_date] || 0) + r.total_production;

      // Location Production
      locationProduction[r.location_name] = (locationProduction[r.location_name] || 0) + r.total_production;

      // Product Ranking (This requires parsing the 'data' JSON which contains counts per product type)
      // Assuming 'data' has keys matching product type names
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'number') {
          productRanking[key] = (productRanking[key] || 0) + data[key];
        }
      });
    });

    const topJournalists = Object.entries(journalistRanking)
      .map(([name, total]) => ({ name, total: Number(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const topProducts = Object.entries(productRanking)
      .map(([name, total]) => ({ name, total: Number(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const sortedDays = Object.entries(dailyProduction)
      .map(([date, total]) => ({ date, total: Number(total) }))
      .sort((a, b) => b.total - a.total);

    const topDays = sortedDays.slice(0, 5);
    const bottomDays = [...sortedDays].reverse().slice(0, 5);

    const totalContents = reports.reduce((sum, r) => sum + r.total_production, 0);
    const totalReports = reports.length;
    const uniqueDays = Object.keys(dailyProduction).length;

    res.json({
      topJournalists,
      topProducts,
      topDays,
      bottomDays,
      summary: {
        totalContents,
        totalReports,
        avgPerReport: totalReports > 0 ? Number((totalContents / totalReports).toFixed(2)) : 0,
        avgPerDay: uniqueDays > 0 ? Number((totalContents / uniqueDays).toFixed(2)) : 0,
        uniqueDays
      },
      locationProduction
    });
  });

  // Admin Routes
  app.post("/api/admin/professionals", (req, res) => {
    const { name } = req.body;
    try {
      db.prepare("INSERT INTO professionals (name) VALUES (?)").run(name);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Profissional já existe" });
    }
  });

  app.delete("/api/admin/professionals/:id", (req, res) => {
    db.prepare("UPDATE professionals SET active = 0 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
