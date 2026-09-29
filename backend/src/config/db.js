import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(__dirname, "../database.sqlite");

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Khởi tạo các bảng dữ liệu THẬT trong SQLite
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      current_exp INTEGER DEFAULT 0,
      available_balance INTEGER DEFAULT 0,
      pending_balance INTEGER DEFAULT 0,
      total_earned INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS conversions (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      platform TEXT,
      title TEXT,
      price INTEGER,
      cashback INTEGER,
      rate TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sync_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS vip_levels (
      level INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      min_exp INTEGER NOT NULL,
      bonus_rate REAL NOT NULL,
      reward_cash INTEGER NOT NULL
    );
  `);

  // Tạo tài khoản Admin mẫu
  const existingUser = await dbInstance.get("SELECT * FROM users WHERE id = 1");
  if (!existingUser) {
    await dbInstance.run(
      "INSERT INTO users (id, name, current_exp, available_balance, pending_balance, total_earned) VALUES (1, 'Vũ Admin', 1400, 1250000, 450000, 8690000)"
    );
  }

  // Tạo sẵn 5 cấp độ VIP mặc định trong DB nếu chưa có
  const existingVip = await dbInstance.get("SELECT COUNT(*) as count FROM vip_levels");
  if (!existingVip || existingVip.count === 0) {
    const defaultLevels = [
      { level: 1, title: "Thành Viên Mới", min_exp: 0, bonus_rate: 0.0, reward_cash: 0 },
      { level: 2, title: "Thành Viên Bạc", min_exp: 1000, bonus_rate: 0.5, reward_cash: 10000 },
      { level: 3, title: "Thành Viên Vàng", min_exp: 3000, bonus_rate: 1.0, reward_cash: 20000 },
      { level: 4, title: "Thành Viên Kim Cương", min_exp: 7500, bonus_rate: 1.5, reward_cash: 50000 },
      { level: 5, title: "Thành Viên Bạch Kim", min_exp: 15000, bonus_rate: 2.0, reward_cash: 100000 },
    ];

    for (const lvl of defaultLevels) {
      await dbInstance.run(
        "INSERT INTO vip_levels (level, title, min_exp, bonus_rate, reward_cash) VALUES (?, ?, ?, ?, ?)",
        [lvl.level, lvl.title, lvl.min_exp, lvl.bonus_rate, lvl.reward_cash]
      );
    }
    console.log("🟢 [Database] Đã tạo 5 Cấp VIP mặc định trong SQLite DB");
  }

  return dbInstance;
}
