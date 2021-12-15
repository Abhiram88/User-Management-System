const { query } = require('express');
var userDB = require('../model/model');

exports.users = (req, res) => {
    userDB.find()
    .then(users => {
        res.send(users)
    }).catch(err=>{
        res.status(500).send({ message: err.message || "error occured while retrieving the user" })
    })
}