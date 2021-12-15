const axios = require('axios');
const { response } = require('express');

exports.homeRoutes = (req, res) =>{
    axios.get('http://localhost:5000/api/users/')
    .then(response => {
        console.log("hellp")
        res.render('index', {users: response.data});
    })
    .catch(err=>{
        res.status(500).send({ message: err.message || "error occured while creating the user" })
    })
}

exports.addUser = (req, res) => {
    res.render('add_user');
}

exports.updateUser = (req, res) => {
    axios.get('http://localhost:5000/api/users', {params: {id: req.query.id}})
    .then( user_data => {
        //console.log(user_data.data)
        res.render("update_user", {user: user_data.data})
    })
    .catch(err=>{
        res.status(500).send({ message: err.message || "error occured while trying to update the user" })
    })
}