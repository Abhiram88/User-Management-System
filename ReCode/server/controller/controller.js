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

exports.findUser = (req, res) =>{
    const id = req.params.id;
    console.log(id)
    if(id){
        console.log(id);
        userDB.findById(id)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || `error occured while retrieving the user ${id}` })
        })
    }
    else{
        res.send("Unable to find user")
    }
}

exports.deleteUser = (req, res) =>{
    const id = req.params.id;
    if(id){
        userDB.findByIdAndDelete(id)
        .then(user => {
            console.log(`deleted user ${req.params.id}`)
            res.send(user)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || `error occured while deleting user ${id}` })
        })
    }
    }
