var userDB = require('../model/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { Module } = require('module');
const nodemailer = require('nodemailer');
const { info } = require('console');
dotenv.config({path: 'config.env'});

secretKey = String(process.env.secretKey);

const verifyToken = (req, res, next) => {
    console.log("hello")
    const authHeader = req.headers.authorization;
    if(authHeader){
        const bearerToken = authHeader.split(' ')[1];

        jwt.verify(bearerToken, secretKey, (err, data) => {
            if(err){
                res.send("Token is not valid");
            }
            else{
                console.log("tada")
                req.user = data;
                //console.log(req)
                next(); 
            }
        });
    }
    else{
        res.status(401).send("Unauthorized");
    }
};

exports.homeRoute = (req, res) => {
    res.send("Home Page");
};

function postArticle(){
    return "user posted";
}

exports.postRoute = (req, res) => { 
    const authHeader = req.headers.authorization;
    if(authHeader){
        const bearerToken = authHeader.split(' ')[1];

        jwt.verify(bearerToken, secretKey, async (err, data) => {
            if(err){
                res.send("Token is not valid");
            }
            else{
                await res.send(postArticle()); 
            }
        });
    }
    else{
        res.status(401).send("Unauthorized");
    }
};




exports.loginRoute = (req, res) => {
    const {email, password} = req.body;

    userDB.findOne({'email': email}, async (err, data) =>{
    
        if(data && await bcrypt.compare(password, data.password)){
            jwt.sign({'email': data.email}, secretKey, (err, token) =>{
                console.log(token);
                res.json(`${data.email} is logged in`);
            });
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


exports.forgotPassword = async (req, res) =>{

    const email = req.body.email;
    passwordResetKey = process.env.passwordResetKey;
    

    const user = userDB.findOne({email: email});
    const user_id = userDB.findOne({email: email}).then((user_id) => {
        return user_id.id;
    });

    console.log(user_id);
    
    const resetToken = jwt.sign({email: email}, passwordResetKey, {
        expiresIn: '30sec'
    });

    console.log(resetToken);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'challapalli.abhiram@gmail.com',
            pass: process.env.gmailPass
        }
    });

    if(user){
        var mailOptions = {
            from: "challapalli.abhiram@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: `<a href = http://localhost:4000/password_reset_page/${email}>
                 ${resetToken} </a>`,
    
        };
    
        transporter.sendMail(mailOptions, (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                res.status(200).send(`email sent to ${email}`);
            }
        });

        await userDB.updateOne({email: email}, 
            {$set:{ 
                resetToken: resetToken,
            }}, { upsert: true });
    }
    else{
        res.send("Unable to find user");
    }
    
};

exports.passwordReset = (req, res) =>{
    const email = req.params.email;

    userDB.findOne({email: email}, (err, data) =>{
        if(data){
         jwt.verify(data.resetToken, process.env.resetToken, async(err, data) =>{
            console.log("verified");
         });
        }
    });


};

exports.getUsers = (req, res) => {
    console.log(process.env.secretKey)
    userDB.find((err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    }).sort({name: '-1'});
};

