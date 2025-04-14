const { Schema, model } = require('mongoose')

const CardSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronymic: {type: String, required: true},
    user_number: {type: String, required: true},
    card_number: {type: String, unique: true, required: true },
    card_dob: {type: String},
    card_cvv: {type: Number, required: true},
    balance: {type: Number, required: true, default: 5000},
    transfer_history: [{type: Schema.Types.ObjectId, ref: 'Transfer'}],
})
module.exports = model('Card', CardSchema)