var userDB = require('../model/database');

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