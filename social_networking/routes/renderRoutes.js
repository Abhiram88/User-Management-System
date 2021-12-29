var userDB = require('../model/database');

exports.homeRoute = (req, res) => {
    res.send("Home Page");
};

exports.signupRoute = (req, res) => {
    const {name, email, password} = req.body;

    const user = new userDB({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });

    if(user){
        user.save((err, data) => {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
            }
        });
    }
};

exports.getUsers = (req, res) => {
    userDB.find((err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
};