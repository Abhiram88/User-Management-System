var userDb = require('../model/model');
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.homeRoute = (req, res)=>{
    res.send("Home Route")
}

exports.loginRoute = async (req, res)=>{
    
    const email = req.body.email;
    const password = req.body.password;

    const user = userDb.findOne({'email': email}) 
    .then(async user_data => {
        if(user_data && await bcrypt.compare(password, user_data.password)){
            const token = jwt.sign(
                { user_id: email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
        
              // save user token
              user.token = token;
    
              res.send(user)
        }
    });   
}


exports.signupRoute = async (req, res)=>{

    const {name, email, password } = req.body;

    if(!(email && password && name)){
        res.status(400).send("All input is required");
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = new userDb({
        name: req.body.name,
        email: req.body.email,
        gender:  req.body.gender,
        status:  req.body.status,
        password: encryptedPassword
    })

    // Create token
    console.log(process.env.TOKEN_KEY);
    const token = jwt.sign(
        {user_id: email}, 
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    user.token = token;
    user.save(user).then(data => {
        //res.status(201).json(data);
        res.redirect('/api/users');
    })
    
}