const db = require('../config/db');
const crypto = require('crypto');
const dayjs = require('dayjs');

// 生成新Token
exports.createToken = (req, res) => {
  const value = req.body.value || crypto.randomBytes(16).toString('hex');
  try {
    const stmt = db.prepare('INSERT INTO token (value) VALUES (?)');
    stmt.run(value);
    res.json({ success: true, value });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Token already exists or error', error: err.message });
  }
};

// 获取所有Token
exports.getAllTokens = (req, res) => {
  const tokens = db.prepare('SELECT * FROM token ORDER BY createdAt DESC').all();
  res.json(tokens);
};

// 删除Token
exports.deleteToken = (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM token WHERE id = ?').run(id);
  res.json({ success: true });
};

// 作废/恢复Token
exports.updateTokenStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  db.prepare('UPDATE token SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
};

// 批量生成Token
exports.batchCreateToken = (req, res) => {
  const { count = 5, validDays = 3 } = req.body;
  if (count < 1 || count > 100) return res.status(400).json({ success: false, message: '数量需在1-100之间' });
  const tokens = [];
  for (let i = 0; i < count; i++) {
    const value = crypto.randomBytes(16).toString('hex');
    try {
      db.prepare('INSERT INTO token (value, validDays) VALUES (?, ?)').run(value, validDays);
      tokens.push(value);
    } catch {}
  }
  res.json({ success: true, tokens });
};

// 导出Token为TXT
exports.exportTokens = (req, res) => {
  const rows = db.prepare('SELECT value FROM token ORDER BY createdAt DESC').all();
  const txt = rows.map(r => r.value).join('\n');
  res.setHeader('Content-disposition', 'attachment; filename=token_list.txt');
  res.setHeader('Content-Type', 'text/plain');
  res.send(txt);
};

// 校验Token有效性（设备绑定版，允许deviceId匹配即通过）
exports.validateToken = (req, res) => {
  const { value, deviceId } = req.body;
  const token = db.prepare('SELECT * FROM token WHERE value = ?').get(value);
  if (!token) return res.json({ valid: false, reason: 'not_found' });

  // 有效期校验
  let now = new Date();
  if (token.activatedAt && token.validDays > 0) {
    const expiredAt = new Date(new Date(token.activatedAt).getTime() + token.validDays * 24 * 3600 * 1000);
    if (now > expiredAt) {
      db.prepare('UPDATE token SET status = ?, expiredAt = ? WHERE id = ?')
        .run('revoked', now.toISOString(), token.id);
      return res.json({ valid: false, reason: 'expired' });
    }
  }

  // 首次激活，未绑定deviceId
  if (token.status === 'active' && !token.deviceId) {
    const activatedAt = now.toISOString();
    const expiredAt = token.validDays > 0 ? new Date(now.getTime() + token.validDays * 24 * 3600 * 1000).toISOString() : null;
    db.prepare('UPDATE token SET status = ?, activatedAt = ?, usedAt = ?, expiredAt = ?, deviceId = ? WHERE id = ?')
      .run('used', activatedAt, activatedAt, expiredAt, deviceId, token.id);
    return res.json({ valid: true, token: { ...token, status: 'used', deviceId, activatedAt, usedAt: activatedAt, expiredAt } });
  }

  // 已绑定deviceId，需匹配（无论status，只要未过期）
  if (token.deviceId === deviceId) {
    return res.json({ valid: true, token });
  } else {
    return res.json({ valid: false, reason: 'device_mismatch' });
  }
};

// 批量删除Token
exports.batchDeleteToken = (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: '请提供要删除的Token id数组' });
  }
  const placeholders = ids.map(() => '?').join(',');
  db.prepare(`DELETE FROM token WHERE id IN (${placeholders})`).run(...ids);
  res.json({ success: true, deleted: ids.length });
};
