const { Schema, model } = require('mongoose');

const CheckSchema = new Schema({
    ticket: { type: Number, required: true, unique: true },
    date: { type: Date, required: true, default: Date },
    sender: { type: String, required: true },
    beneficiary: { type: String, required: true },
    amount: { type: Number, required: true }
})

module.exports = model('Check', CheckSchema)