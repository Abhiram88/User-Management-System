var userDB = require('../model/database');
var con = require('../sqlConnection');
var mysql = require('mysql2');


exports.editPost = (req, res) => {
    var postid = req.query.postid;
    const userid = req.query.userid;

    console.log(req.query)
    console.log(hello)
    res.render('update_post', {postid: postid, userid: userid});
};


exports.updatePost = (req, res) =>{
    const id = Number(req.body.postid);
    const post = req.body.post;
    const userid = Number(req.body.userid);
    
    
    console.log(post, userid);
        let updatePost = 'UPDATE posts SET post = ? WHERE postid = ?';
        con.query(updatePost, [post, id], function(err, result){
            if(err) throw err;
            console.log("post updated");
        });

    //res.render('wall', {userid: userid});
    return "post updated";
}

exports.getConnectionDetails = (req, res) => {
    console.log("connection details")
    console.log(con)
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
};

exports.getUsers = (req, res) => {
    sql = 'select * from users';
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
      });
};

exports.findUser = (req, res) =>{
    const id = req.params.id;

    userDB.findById(id, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
};

