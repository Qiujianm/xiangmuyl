const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'used', 'revoked'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  usedAt: { type: Date },
  expiredAt: { type: Date },
  remark: { type: String }
});

module.exports = mongoose.model('Token', TokenSchema);