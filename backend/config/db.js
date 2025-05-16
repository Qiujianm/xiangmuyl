const Database = require('better-sqlite3');
const db = new Database('care-internal-demo.db'); // 自动生成.db文件

// 升级表结构，兼容历史数据
// 新增字段：activatedAt、expiredAt、validDays、used、remark
try { db.prepare('ALTER TABLE token ADD COLUMN activatedAt TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE token ADD COLUMN expiredAt TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE token ADD COLUMN validDays INTEGER DEFAULT 0').run(); } catch {}
try { db.prepare('ALTER TABLE token ADD COLUMN used INTEGER DEFAULT 0').run(); } catch {}
try { db.prepare('ALTER TABLE token ADD COLUMN remark TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE token ADD COLUMN deviceId TEXT').run(); } catch {}

// 初始化表（如不存在）
db.prepare(`
  CREATE TABLE IF NOT EXISTS token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    activatedAt TEXT,
    expiredAt TEXT,
    validDays INTEGER DEFAULT 0,
    used INTEGER DEFAULT 0,
    remark TEXT,
    deviceId TEXT
  )
`).run();

module.exports = db; 