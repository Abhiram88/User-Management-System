var userDB = require('../model/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { Module } = require('module');
const nodemailer = require('nodemailer');
const { info } = require('console');
dotenv.config({path: 'config.env'});
var con = require('../sqlConnection');
var mysql = require('mysql2');
var datetime = require('node-datetime');
var moment = require('moment-timezone');
const { query } = require('../sqlConnection');
const { post } = require('./userRoutes');


moment.tz.setDefault("Asia/Kolkata");

secretKey = String(process.env.secretKey);

function getPosts(userid){
    let output;
    var result = [];
    const setOutput = (rows) => {
        output = rows;
        console.log(output);
    }

    var getPosts = 'select postid, post from posts where userid = ?';
    con.query(getPosts, userid, (err, rows) => {
        if(err) throw err; 
        setOutput(rows);
    });
    
    console.log("jjj")
    console.log(result)
    
}

// temporary setup for verifying user credentials.. need to add bycrypt
exports.verifyUser = (req, res) => {
    const email = req.query.email;
    const password = req.query.password

    console.log("verify", req.query)
    
    var checkUser = "select * from users where email=?"
    con.query(checkUser, email, function(err, result){
        if(err) return "error";

        if(password === result[0].password){
            console.log("verified user");
            var token = 'test123';
            res.json([result[0].email, result[0].full_name, "verified", token]);
        }
        else{
            res.json("False")
        }
    })

}

exports.loginRoute = (req, res) => {
    var email = req.body.email;
    const password = req.body.password;

    var checkUser = "select userid from users where email = ?"
    con.query(checkUser, email, function(err, result){
        if(err) throw err;
    
    
    var user_id = result[0].userid;

    var getPosts = 'select postid, post from posts where userid = ?';
    con.query(getPosts, result[0].userid, function(err, result){
        // console.log(result)
        res.json([user_id, result]);
    });


    });
    
}


exports.signupRoute = (req, res) => {
    res.render('signup')
}


exports.newUser = (req, res) => {
    const {fullName, email, password} = req.body;
    
    // var currentYear = new Date().getFullYear();
    // var current_time = moment().format("HH:mm")

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M');
    //console.log(formatted);

    var checkUser = "select * from users where email = ?";
    const user = con.query(checkUser, email, function(err, result){
        if(err) throw err;
    });
    
    var createUser = 'insert into users(full_name, email, password, created_on) values (?,?,?,?)';
    var result = con.query(createUser, [fullName, email, password, formatted], function(err, result){
        if(err) throw err;
    });
   
    console.log("User created");
    res.redirect('/signin')

}

exports.userWall = (req, res) =>{
    res.render('wall')
}

exports.getPosts = (req, res) =>{
   var email = req.query.email;
    
    var checkUser = "select userid from users where email = ?"
    con.query(checkUser, email, function(err, result){
        if(err) throw err;

    var user_id = result[0].userid;

    var getPosts = 'select postid, post from posts where userid = ?';
    con.query(getPosts, result[0].userid, function(err, result){
        // console.log(result)
        res.json([user_id, result]);
    });

});
    
}


exports.getUserPosts = (req,res) => {
    res.send(req.params);
}

exports.postRoute = async(req, res) =>{
    var email = String(req.body.id);
    const user_id = req.body.id;

    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M');

    var post = req.body.post
        //console.log(post)
        var insertPost = 'insert into posts(userid, post, created_on) values (?,?,?)';

        con.query(insertPost, [user_id, post, formatted], function(err, result){
            if(err) throw err;
        console.log("post inserted");
        });
   
    var post_data = getPosts(user_id);
    console.log("ho")
    console.log(post_data);
    res.render('wall', {userid: user_id, post_data: post_data});
    
}


exports.getUsers = (req, res) =>{
    let query = 'select * from users';
    con.query(query, function(err, result){
        if(err) throw err;
        res.send(result)
    });
    
}


exports.friendRequest = (req, res) => {
    console.log(req.params);
    var requestor = req.params.fromUser;
    var requested = req.params.toUser;

    let query = "insert into friends(requestor, requested) values(?, ?)";
    let selectQueryRequestor = 'select requestor from friends where requestor=?';
    let selectQueryRequested = 'select requested from friends where requested=?';

    var requestorInfo = con.query(selectQueryRequestor, requestor, function(err, result){
        if(err) return err;
        return result;
    });

    var requestedInfo = con.query(selectQueryRequested, requested, function(err, result){
        if(err) return err;
        return result;
    });

    //console.log(requestedInfo.values)
    if (requestorInfo === requestor && requestedInfo.values === requested){
        console.log("Friends");
    }
    else{
        con.query(query, [requestor, requested],function(err, result){
        if(err) throw err;
        console.log("friend requested");
    });
    }

    
}




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
    res.render('loginPage');
};

exports.signInRoute = (req, res) => {
    res.render('loginPage');
};

function postArticle(){
    return "user posted";
}

// exports.postRoute = (req, res) => { 
//     const authHeader = req.headers.authorization;
//     if(authHeader){
//         const bearerToken = authHeader.split(' ')[1];

//         jwt.verify(bearerToken, secretKey, async (err, data) => {
//             if(err){
//                 res.send("Token is not valid");
//             }
//             else{
//                 await res.send(postArticle()); 
//             }
//         });
//     }
//     else{
//         res.status(401).send("Unauthorized");
//     }
// };




// MongoDB login
// exports.loginRoute = (req, res) => {
//     const {email, password} = req.body;

//     userDB.findOne({'email': email}, async (err, data) =>{
    
//         if(data && await bcrypt.compare(password, data.password)){
//             jwt.sign({'email': data.email}, secretKey, (err, token) =>{
//                 console.log(token);
//                 res.json(`${data.email} is logged in`);
//             });
//         }
//         else{
//             res.send("issue with authentication");
//         }
//     });    
// };


// exports.signupRoute = async (req, res) => {
//     const {name, email, password} = req.body;
//     const encryptedPassword = await bcrypt.hash(req.body.password, 10);

//     const user = new userDB({
//         name: req.body.name,
//         password: encryptedPassword,
//         email: req.body.email
//     });

//     if(user){
//         user.save((err, data) => {
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 res.redirect('/allusers');
//             }
//         });
//     }
// };


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

// exports.getUsers = (req, res) => {
//     console.log(process.env.secretKey)
//     userDB.find((err, data)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.send(data);
//         }
//     }).sort({name: '-1'});
// };

