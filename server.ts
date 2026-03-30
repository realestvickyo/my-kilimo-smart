import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "kilimo-smart-secret-key-2026";
const DEFAULT_ADMIN_EMAIL = "mathewkkiptoo@gmail.com";

// Initialize SQLite for tracking transactions and users
const db = new Database("kilimo.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    location TEXT,
    crops TEXT DEFAULT '[]',
    isPremium INTEGER DEFAULT 0,
    role TEXT DEFAULT 'client',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    checkoutRequestId TEXT PRIMARY KEY,
    phone TEXT,
    amount REAL,
    status TEXT DEFAULT 'pending',
    resultCode INTEGER,
    resultDesc TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS market_prices (
    id TEXT PRIMARY KEY,
    crop TEXT,
    price REAL,
    location TEXT,
    unit TEXT,
    category TEXT,
    trend TEXT,
    change TEXT,
    verified INTEGER DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pest_alerts (
    id TEXT PRIMARY KEY,
    title TEXT,
    severity TEXT,
    description TEXT,
    location TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    senderId TEXT,
    receiverId TEXT,
    text TEXT,
    read INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Authentication Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- Auth Routes ---
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = Math.random().toString(36).substring(2, 15);
      const role = email === DEFAULT_ADMIN_EMAIL ? 'admin' : 'client';
      
      const stmt = db.prepare("INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)");
      stmt.run(userId, email, hashedPassword, name, role);
      
      const token = jwt.sign({ id: userId, email }, JWT_SECRET);
      res.json({ token, user: { uid: userId, email, name, role, isPremium: false, crops: [] } });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Auto-promote default admin if not already
    if (user.email === DEFAULT_ADMIN_EMAIL && user.role !== 'admin') {
      db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
      user.role = 'admin';
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        uid: user.id, 
        email: user.email, 
        name: user.name, 
        location: user.location,
        role: user.role, 
        isPremium: !!user.isPremium,
        crops: JSON.parse(user.crops || '[]')
      } 
    });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ 
      uid: user.id, 
      email: user.email, 
      name: user.name, 
      location: user.location,
      role: user.role, 
      isPremium: !!user.isPremium,
      crops: JSON.parse(user.crops || '[]')
    });
  });

  app.post("/api/profile/update", authenticateToken, (req: any, res) => {
    const { name, location, crops, isPremium } = req.body;
    const userId = req.user.id;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push("name = ?"); params.push(name); }
    if (location !== undefined) { updates.push("location = ?"); params.push(location); }
    if (crops !== undefined) { updates.push("crops = ?"); params.push(JSON.stringify(crops)); }
    if (isPremium !== undefined) { updates.push("isPremium = ?"); params.push(isPremium ? 1 : 0); }

    if (updates.length === 0) return res.status(400).json({ error: "No updates provided" });

    params.push(userId);
    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...params);

    res.json({ status: "ok" });
  });

  // --- M-Pesa (Daraja) Integration ---
  const getMpesaToken = async () => {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    
    if (!key || !secret) {
      const msg = "M-Pesa credentials missing. Please add MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET to your environment variables in the Settings menu.";
      console.error(msg);
      const error = new Error(msg);
      (error as any).status = 400;
      throw error;
    }

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Basic ${auth}` },
      });
      return response.data.access_token;
    } catch (error: any) {
      const errorData = error.response?.data || error.message;
      console.error("M-Pesa Auth Error:", errorData);
      throw new Error(`M-Pesa Auth Failed: ${JSON.stringify(errorData)}`);
    }
  };

  app.get("/api/mpesa/diagnostics", async (req, res) => {
    const config = {
      hasKey: !!process.env.MPESA_CONSUMER_KEY,
      hasSecret: !!process.env.MPESA_CONSUMER_SECRET,
      hasPasskey: !!process.env.MPESA_PASSKEY,
      shortcode: process.env.MPESA_SHORTCODE || "174379",
      appUrl: process.env.APP_URL || "Not Set",
      env: process.env.MPESA_ENV || "sandbox"
    };
    
    try {
      const token = await getMpesaToken();
      res.json({ status: "ok", message: "Credentials are valid, token generated.", config });
    } catch (error: any) {
      res.status(error.status || 500).json({ status: "error", message: error.message, config });
    }
  });

  app.post("/api/mpesa/stkpush", async (req, res) => {
    const { phone, amount } = req.body;
    
    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required" });
    }

    try {
      const token = await getMpesaToken();
      const shortcode = process.env.MPESA_SHORTCODE || "174379";
      const passkey = process.env.MPESA_PASSKEY;
      
      if (!passkey) {
        const msg = "MPESA_PASSKEY is missing. Please add it to your environment variables in the Settings menu.";
        const error = new Error(msg);
        (error as any).status = 400;
        throw error;
      }

      const date = new Date();
      const timestamp = 
        date.getFullYear().toString() +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0') +
        date.getHours().toString().padStart(2, '0') +
        date.getMinutes().toString().padStart(2, '0') +
        date.getSeconds().toString().padStart(2, '0');

      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      
      let callbackUrl = process.env.APP_URL || "";
      // If APP_URL is a webhook.site, use it directly. Otherwise, append our callback path.
      if (callbackUrl && !callbackUrl.includes("/api/mpesa/callback") && !callbackUrl.includes("webhook.site")) {
        callbackUrl = `${callbackUrl.replace(/\/$/, "")}/api/mpesa/callback`;
      }
      
      if (!callbackUrl) {
        callbackUrl = "https://ais-dev-nvby45z4vqmw5v4mhj64qd-184109094443.europe-west2.run.app/api/mpesa/callback";
      }

      console.log(`[M-Pesa] Initiating STK Push: Phone=${phone}, Amount=${amount}`);
      console.log(`[M-Pesa] Using CallBackURL: ${callbackUrl}`);

      const requestBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: "KilimoSmart",
        TransactionDesc: "Premium Upgrade",
      };

      const response = await axios.post(url, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.ResponseCode === "0") {
        // Store the transaction in SQLite
        const stmt = db.prepare("INSERT INTO transactions (checkoutRequestId, phone, amount) VALUES (?, ?, ?)");
        stmt.run(response.data.CheckoutRequestID, phone, amount);
      }

      res.json(response.data);
    } catch (error: any) {
      const errorData = error.response?.data || error.message;
      console.error("[M-Pesa] STK Push Error:", errorData);
      res.status(error.status || 500).json({ 
        error: typeof errorData === 'string' ? errorData : (errorData.errorMessage || "Internal Server Error"),
        details: errorData
      });
    }
  });

  app.post("/api/mpesa/callback", (req, res) => {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ error: "Invalid callback payload" });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
    console.log(`[M-Pesa] Callback received: ID=${CheckoutRequestID}, Code=${ResultCode}, Desc=${ResultDesc}`);

    const status = ResultCode === 0 ? 'success' : 'failed';
    
    const stmt = db.prepare("UPDATE transactions SET status = ?, resultCode = ?, resultDesc = ?, updatedAt = CURRENT_TIMESTAMP WHERE checkoutRequestId = ?");
    stmt.run(status, ResultCode, ResultDesc, CheckoutRequestID);

    res.json({ ResultCode: 0, ResultDesc: "Success" });
  });

  app.get("/api/mpesa/query/:checkoutRequestId", (req, res) => {
    const { checkoutRequestId } = req.params;
    const stmt = db.prepare("SELECT * FROM transactions WHERE checkoutRequestId = ?");
    const transaction = stmt.get(checkoutRequestId) as any;

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  });

  // Manual success endpoint for testing when using external webhooks
  app.post("/api/mpesa/simulate-success", (req, res) => {
    const { checkoutRequestId } = req.body;
    if (!checkoutRequestId) return res.status(400).json({ error: "CheckoutRequestID required" });

    const stmt = db.prepare("UPDATE transactions SET status = 'success', resultCode = 0, resultDesc = 'Simulated Success', updatedAt = CURRENT_TIMESTAMP WHERE checkoutRequestId = ?");
    const result = stmt.run(checkoutRequestId);

    if (result.changes === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ status: "ok", message: "Success simulated for " + checkoutRequestId });
  });

  // Seed initial data if empty
  const seedData = async () => {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    if (userCount.count === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminId = "admin-001";
      db.prepare("INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)")
        .run(adminId, DEFAULT_ADMIN_EMAIL, hashedPassword, "System Admin", "admin");
      console.log("[Seed] Default admin created: " + DEFAULT_ADMIN_EMAIL);
    }

    const marketCount = db.prepare("SELECT COUNT(*) as count FROM market_prices").get() as any;
    if (marketCount.count === 0) {
      const initialMarkets = [
        { id: '1', crop: 'Maize', price: 4200, unit: '90kg Bag', trend: 'up', change: '+2.4%', location: 'Nairobi', category: 'Cereals' },
        { id: '2', crop: 'Beans (Rosecoco)', price: 12500, unit: '90kg Bag', trend: 'down', change: '-1.2%', location: 'Mombasa', category: 'Legumes' },
        { id: '3', crop: 'Wheat', price: 5100, unit: '90kg Bag', trend: 'up', change: '+0.8%', location: 'Nakuru', category: 'Cereals' },
        { id: '4', crop: 'Potatoes', price: 3200, unit: '50kg Bag', trend: 'up', change: '+5.1%', location: 'Nyandarua', category: 'Vegetables' },
        { id: '5', crop: 'Tomatoes', price: 6500, unit: 'Crate', trend: 'down', change: '-3.4%', location: 'Kiambu', category: 'Vegetables' },
        { id: '6', crop: 'Onions', price: 120, unit: 'kg', trend: 'up', change: '+1.5%', location: 'Kajiado', category: 'Vegetables' },
        { id: '7', crop: 'Avocado', price: 800, unit: 'Crate', trend: 'up', change: '+10.2%', location: 'Murang\'a', category: 'Fruits' },
      ];
      const insert = db.prepare("INSERT INTO market_prices (id, crop, price, unit, trend, change, location, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      initialMarkets.forEach(m => insert.run(m.id, m.crop, m.price, m.unit, m.trend, m.change, m.location, m.category));
    }

    const alertCount = db.prepare("SELECT COUNT(*) as count FROM pest_alerts").get() as any;
    if (alertCount.count === 0) {
      const initialAlerts = [
        { id: '1', title: 'Fall Armyworm Outbreak', severity: 'high', description: 'Significant activity reported in neighboring farms. Immediate scouting of maize fields is required.', location: 'Narok County' },
        { id: '2', title: 'Maize Lethal Necrosis Risk', severity: 'moderate', description: 'Environmental conditions are favorable for MLN spread. Ensure use of certified seeds and crop rotation.', location: 'Rift Valley Region' },
      ];
      const insert = db.prepare("INSERT INTO pest_alerts (id, title, severity, description, location) VALUES (?, ?, ?, ?, ?)");
      initialAlerts.forEach(a => insert.run(a.id, a.title, a.severity, a.description, a.location));
    }
  };
  seedData();

  // --- Admin API ---
  app.get("/api/admin/users", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const stmt = db.prepare("SELECT id as uid, email, name, location, crops, isPremium, role, createdAt FROM users ORDER BY createdAt DESC");
    const users = stmt.all().map((u: any) => ({
      ...u,
      isPremium: !!u.isPremium,
      crops: JSON.parse(u.crops || '[]')
    }));
    res.json(users);
  });

  app.post("/api/admin/users/:id/role", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { role } = req.body;
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
    res.json({ status: "ok" });
  });

  app.post("/api/admin/users/:id/premium", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { isPremium } = req.body;
    db.prepare("UPDATE users SET isPremium = ? WHERE id = ?").run(isPremium ? 1 : 0, req.params.id);
    res.json({ status: "ok" });
  });

  app.get("/api/admin/transactions", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const stmt = db.prepare("SELECT * FROM transactions ORDER BY createdAt DESC");
    const transactions = stmt.all();
    res.json(transactions);
  });

  // --- Market Prices API ---
  app.get("/api/market-prices", (req, res) => {
    const stmt = db.prepare("SELECT * FROM market_prices ORDER BY timestamp DESC");
    const prices = stmt.all().map((p: any) => ({ ...p, verified: !!p.verified }));
    res.json(prices);
  });

  app.post("/api/market-prices", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { crop, price, location, unit, category, trend, change } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO market_prices (id, crop, price, location, unit, category, trend, change) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(id, crop, price, location, unit, category, trend, change || '0%');
    res.json({ id, status: "ok" });
  });

  app.put("/api/market-prices/:id", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { crop, price, location, unit, category, trend, change } = req.body;
    db.prepare("UPDATE market_prices SET crop = ?, price = ?, location = ?, unit = ?, category = ?, trend = ?, change = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ?")
      .run(crop, price, location, unit, category, trend, change, req.params.id);
    res.json({ status: "ok" });
  });

  app.delete("/api/market-prices/:id", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    db.prepare("DELETE FROM market_prices WHERE id = ?").run(req.params.id);
    res.json({ status: "ok" });
  });

  // --- Pest Alerts API ---
  app.get("/api/pest-alerts", (req, res) => {
    const stmt = db.prepare("SELECT * FROM pest_alerts ORDER BY timestamp DESC");
    const alerts = stmt.all();
    res.json(alerts);
  });

  app.post("/api/pest-alerts", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { title, severity, description, location } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    db.prepare("INSERT INTO pest_alerts (id, title, severity, description, location) VALUES (?, ?, ?, ?, ?)")
      .run(id, title, severity, description, location);
    res.json({ id, status: "ok" });
  });

  app.put("/api/pest-alerts/:id", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    const { title, severity, description, location } = req.body;
    db.prepare("UPDATE pest_alerts SET title = ?, severity = ?, description = ?, location = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ?")
      .run(title, severity, description, location, req.params.id);
    res.json({ status: "ok" });
  });

  app.delete("/api/pest-alerts/:id", authenticateToken, (req: any, res) => {
    const admin = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id) as any;
    if (!admin || admin.role !== 'admin') return res.status(403).json({ error: "Admin access required" });

    db.prepare("DELETE FROM pest_alerts WHERE id = ?").run(req.params.id);
    res.json({ status: "ok" });
  });

  // --- Messages API ---
  app.get("/api/messages", authenticateToken, (req: any, res) => {
    const userId = req.user.id;
    const { otherId } = req.query;

    let stmt;
    if (otherId) {
      // Get conversation between two users
      stmt = db.prepare("SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY timestamp ASC");
      const messages = stmt.all(userId, otherId, otherId, userId).map((m: any) => ({ ...m, read: !!m.read }));
      res.json(messages);
    } else {
      // Get all messages for admin or user
      const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId) as any;
      if (user.role === 'admin') {
        stmt = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC");
        const messages = stmt.all().map((m: any) => ({ ...m, read: !!m.read }));
        res.json(messages);
      } else {
        stmt = db.prepare("SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY timestamp ASC");
        const messages = stmt.all(userId, userId).map((m: any) => ({ ...m, read: !!m.read }));
        res.json(messages);
      }
    }
  });

  app.post("/api/messages", authenticateToken, (req: any, res) => {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;
    const id = Math.random().toString(36).substring(2, 15);

    db.prepare("INSERT INTO messages (id, senderId, receiverId, text) VALUES (?, ?, ?, ?)")
      .run(id, senderId, receiverId, text);
    res.json({ id, status: "ok" });
  });

  app.put("/api/messages/read", authenticateToken, (req: any, res) => {
    const { senderId } = req.body;
    const receiverId = req.user.id;

    db.prepare("UPDATE messages SET read = 1 WHERE senderId = ? AND receiverId = ?").run(senderId, receiverId);
    res.json({ status: "ok" });
  });

  app.get("/api/admin/admins", authenticateToken, (req: any, res) => {
    const stmt = db.prepare("SELECT id as uid, name, email FROM users WHERE role = 'admin'");
    const admins = stmt.all();
    res.json(admins);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
