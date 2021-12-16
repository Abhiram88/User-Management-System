const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    gender: String,
    status: String,
    password: String,
    token: String
})

const userDb = mongoose.model('userdb', schema)

module.exports = userDb;