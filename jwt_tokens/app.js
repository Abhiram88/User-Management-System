const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.get('/', (req, res) => {
    res.json(
        {message: 'Welcome to the JWT tutorial'}
        );
});

app.post('/api/posts', verifyToken, (req, res)=>{
    jwt.verify(req.token, 'SeCRetKeY', (err, authData)=>{
        if(err){
            res.send("Unauthorized");
        }
        else{
            res.json(
                {message: 'Post created',
                authData
               });
        }
    });    
})

app.post('/api/login', (req, res)=>{
    const user = {
        id: 1,
        username: 'admin',
        password: 'admin',
        email: 'ab@gmail.com'
    };

    jwt.sign({user: user}, 'SeCRetKeY', {expiresIn: '1m'},(err, token) => {
        res.json({
            token: token
        });
    });
});

// format token 
// Authorization: Bearer <access_token>

// verify Token
function verifyToken(req, res, next){
    // get the auth header value
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader != 'undefined'){
        //Bearer token
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.send("Unauthorized");
    }
}

app.listen(5000, ()=>{
    console.log("listening on port 5000");
})

