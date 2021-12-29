var userDB = require('../model/database');
const bcrypt = require('bcrypt');


exports.homeRoute = (req, res) => {
    res.send("Home Page");
};

exports.loginRoute = (req, res) => {
    const {email, password} = req.body;

    userDB.findOne({'email': email}, async (err, data) =>{
        console.log("found user");
        if(data && await bcrypt.compare(password, data.password)){
            res.send("User logged in");
        }
        else{
            res.send("issue with authentication");
        }
    });    
};


exports.signupRoute = async (req, res) => {
    const {name, email, password} = req.body;
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new userDB({
        name: req.body.name,
        password: encryptedPassword,
        email: req.body.email
    });

    if(user){
        user.save((err, data) => {
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/allusers');
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
    }).sort({name: '-1'});
};