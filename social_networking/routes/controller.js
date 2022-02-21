var userDB = require('../model/database');
var con = require('../sqlConnection');
var mysql = require('mysql2');



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