const { model, Schema} = require('mongoose')

const UserSchema = new Schema({
    number: {type: String, required: true, unique: true},
})

module.exports = model('User', UserSchema)