const { query } = require('express');
var userDb = require('../model/model');

// create & save new user
exports.create = (req, res) =>{
    if(!req.body){
        res.status(400).send({message: "content cannot be empty"});
        return;
    }

    const user = new userDb({
        name: req.body.name,
        email: req.body.email,
        gender:  req.body.gender,
        status:  req.body.status
    })

    //save user
    user.save(user).then(data=>{
        res.redirect('/')
    }).catch(err=>{
        res.status(500).send({ message: err.message || "error occured while creating the user" })
    })
    
}

exports.find = (req, res) =>{
    if(req.query.id){
        userDb.findById(req.query.id)
        .then(user => {
            console.log(`found user with ${req.query.id}`)
            res.send(user)
        }).catch(err=>{
            res.status(500).send({ message: err.message || "error occured while retrieving the user" })
        })
    }

    userDb.find().then(users => {
        res.send(users)
    }).catch(err=>{
        res.status(500).send({ message: err.message || "error occured while retrieving the user" })
    })
}

exports.update = (req, res) =>{
    if(!req.body){
        res.status(400).send({message: "Data cannot be empty"});
        return;
    }

    const id = req.params.id;
    userDb.findByIdAndUpdate(id, req.body)
    .then(data =>{
        if(!data){
            res.send(`unable to update user ${id}`);
        }
        else{
            console.log(id)
            res.send('data')
        }
    }).catch(err=>{
        res.status(500).send({ message: err.message || `error occured when updating user ${id}` })
    })
}

exports.delete = (req, res) =>{
    const id = req.params.id

    userDb.findByIdAndDelete(id)
    .then(data => {
        if(!data){
            res.send(`unable to delete user ${id}`);
        }
        else{
            res.send({message: `User ${id} was deleted successfully`})
        }
    }).catch(err=>{
        res.status(500).send({ message: err.message || `error occured when deleting the user ${id}` })
    })
}