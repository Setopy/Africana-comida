const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  },
  expires: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Token document will be automatically deleted after 30 days
  },
  revoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokedReason: {
    type: String
  }
});

// Add static method to revoke tokens for a user
refreshTokenSchema.statics.revokeTokensForUser = async function(userId, reason = 'User-initiated logout') {
  const now = new Date();
  await this.updateMany(
    { user: userId, revoked: false },
    { 
      revoked: true, 
      revokedAt: now,
      revokedReason: reason
    }
  );
};

// Add static method to clean up expired tokens
refreshTokenSchema.statics.cleanupExpiredTokens = async function() {
  const now = new Date();
  await this.deleteMany({ expires: { $lt: now } });
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);