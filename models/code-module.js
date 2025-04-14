const { Schema, model } = require('mongoose');

const CodeSchema = new Schema({
    number: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 1000) }
});

CodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('Code', CodeSchema);
