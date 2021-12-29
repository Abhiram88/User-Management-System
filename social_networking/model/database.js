var mongoose = require('mongoose');
const dotenv = require('dotenv');

var mongoDB = 'mongodb+srv://admin:admin@cluster0.dfgdy.mongodb.net/customersDB?retryWrites=true&w=majority'
console.log(mongoDB)
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userModel = mongoose.Schema({
    name: {
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true     
    },
    bio:{
        type: String
    },
    password:{
        type: String
    }
});

module.exports = mongoose.model('UserInfo', userModel);