//var userDB = require('../model/database');
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
var moment = require('moment');
const {format} = require('date-fns');
const axios = require('axios');
const { response } = require('express');

moment.tz.setDefault("Asia/Kolkata");

const API_KEY = "d115711b158b470384571610e61677f0";

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
    if(email && password){
         con.query(checkUser, email, function(err, result){
        if(err) return "error";

            if(password === result[0].password){
                console.log("verified user");
                var token = 'test123';
                res.json([result[0].email, result[0].full_name, "verified", token]);
            }
            else{
                console.log("Unable to verify user")
                res.json("Incorrect username/password");
            }
        })

    }else{
        res.json("Both email and password are required");
    }
   
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

    var getPosts = 'select postid, post, created_on from posts where userid = ?';
    con.query(getPosts, result[0].userid, function(err, result){
        
        for (var i=0; i<result.length; i++){
            if(format(result[i].created_on, 'H') < 12){
                result[i].created_on = format(result[i].created_on, `MMM do h:m'`) + " AM";
            }
            else{
                result[i].created_on = format(result[i].created_on, `MMM do h:m'`) + " PM";
            }
        }        
          res.json([user_id, result]);
        });

});
    
}


exports.getUserPosts = (req,res) => {
    res.send(req.params);
}

exports.submitPost = (req, res) => {
    var post = String(req.params.post);
    const user_id = req.params.id;
    
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M');

    
        //console.log(post)
    var insertPost = 'insert into posts(userid, post, created_on) values (?,?,?)';

    con.query(insertPost, [user_id, post, formatted], function(err, result){
        if(err) throw err;
        return "post inserted"
    });
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

exports.checkFriendRequests =(req, res) => {
    const email = req.params.email;
    var requestedUsers = [];
    var requestedUsersName = [];

    var query = "select requestor from friends where requested = ?";
    var requestorUser = 'select full_name from users where email = ?';

    con.query(query, email, function(err, result){
        if(err) return err;
        
        if(result){
            for (var i=0; i<result.length; i++){
                requestedUsers.push(result[i].requestor);
                //console.log(result)
            }
            if(requestedUsers){
                return res.json([requestedUsers, requestedUsers.length]);
            }
            else{
                return res.json([0]);
            }
        }
        else{
            return res.json([0]);
        }
        
    });
}

exports.getRequestedUsers = (req, res) => {
    const emailPacket = req.params.data;
    console.log(emailPacket)
    var requestedUsers = [];

    var query = 'select full_name from users where email IN (?)';
    console.log(query)
    
    con.query(query, emailPacket, function(err, result){
            if (err) return err;
            console.log("hello")
            console.log(result)
            
        });

}


exports.searchUsers = (req, res) => {
    var searchParameter = req.params.search;
    searchParameter = String(searchParameter);

    var query = 'select email from users where full_name LIKE ?';
    con.query(query, "%"+searchParameter+"%", function(err, result){
        if(err) return err;
        if(result){
            console.log(result)
            res.json(result);
        }
        else{
            res.json(`no record of ${searchParameter} in our database`);
        }
        
    });

}

const NewsAPI = require('newsapi');
const e = require('express');
const newsapi = new NewsAPI(API_KEY);

exports.newsToday = (req, res) => {
    var news = new Map();
    var titles = [];
    var urls = [];

    var newsToday = {};
    
    newsapi.v2.topHeadlines({
        sources: 'bbc-news,the-verge',
        language: 'en',
    }).then(response => {
        for (var i=0; i<response.articles.length; i++){
            //console.log(response.articles[i].title);
            news.set(response.articles[i].title, response.articles[i].url);
        }
        //console.log(news.keys())

        for (const x of news.keys()) {
            titles.push(x);
        }

        for (const x of news.values()) {
            urls.push(x);
        }
        
        for (let i = 0; i < titles.length; i++) {
            newsToday[titles[i]] = urls[i];
        }
        res.json(newsToday)
    });
    
    
}

const verifyToken = (req, res, next) => {
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

// exports.homeRoute = (req, res) => {
//     res.render('loginPage');
// };

// exports.signInRoute = (req, res) => {
//     res.render('loginPage');
// };

// function postArticle(){
//     return "user posted";
// }


/* 
    *************************
    IGNORE
    *************************
*/

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


// exports.forgotPassword = async (req, res) =>{

//     const email = req.body.email;
//     passwordResetKey = process.env.passwordResetKey;
    

//     const user = userDB.findOne({email: email});
//     const user_id = userDB.findOne({email: email}).then((user_id) => {
//         return user_id.id;
//     });

//     console.log(user_id);
    
//     const resetToken = jwt.sign({email: email}, passwordResetKey, {
//         expiresIn: '30sec'
//     });

//     console.log(resetToken);

//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'challapalli.abhiram@gmail.com',
//             pass: process.env.gmailPass
//         }
//     });

//     if(user){
//         var mailOptions = {
//             from: "challapalli.abhiram@gmail.com",
//             to: email,
//             subject: "Password Reset Request",
//             html: `<a href = http://localhost:4000/password_reset_page/${email}>
//                  ${resetToken} </a>`,
    
//         };
    
//         transporter.sendMail(mailOptions, (err, data) => {
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 res.status(200).send(`email sent to ${email}`);
//             }
//         });

//         await userDB.updateOne({email: email}, 
//             {$set:{ 
//                 resetToken: resetToken,
//             }}, { upsert: true });
//     }
//     else{
//         res.send("Unable to find user");
//     }
    
// };

// exports.passwordReset = (req, res) =>{
//     const email = req.params.email;

//     userDB.findOne({email: email}, (err, data) =>{
//         if(data){
//          jwt.verify(data.resetToken, process.env.resetToken, async(err, data) =>{
//             console.log("verified");
//          });
//         }
//     });


// };

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

