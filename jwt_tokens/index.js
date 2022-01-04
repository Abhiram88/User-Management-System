const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());


const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin',
        isAdmin: true,
    },
    {
        id: 2,
        username: 'ram',
        password: 'ram',
        isAdmin: false,
    },
];

let refreshTokens = [];

app.post('/api/refeshToken', (req, res)=>{
    // take token from the user.
    const refreshToken = req.body.token;

    // sent err if token is not valid
    if(!refreshToken){
        res.json("No token found");
    }else{
        // create & send new refresh token
        jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user)=>{
            if(err){
                console.log(err);
            }
            else{
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);
                refreshTokens.push(newRefreshToken);
                
                res.json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
        });
    }
    
});

const generateAccessToken = (user) => {
    return jwt.sign(
        {id: user.id, isAdmin: user.isAdmin},
         "mySecretKey",
         {'expiresIn': '1hr'}
         );
}


const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user.id, isAdmin: user.isAdmin},
         "myRefreshSecretKey",
         {'expiresIn': '1hr'}
         );
}


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => {
        return user.username === username && user.password === password;
    });
    if(user){
        //Generate an access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken
        });
    }
    else{
        res.json("Username/password incorrect"); 
    }
    
});


const verify = (req, res, next) =>{
    const authHeader = req.headers.authorization; 
    if(authHeader){
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        jwt.verify(token, "mySecretKey", (err, userData) =>{
            if(err){
                res.send("Token is not valid");
            }
            else{
                req.user = userData;
                //console.log(userData);
                next(); 
            }
        });
    }
    else{
        res.status(401).send("Unauthorized");
    }
};



app.delete('/api/users/:userid', verify, (req, res) => {
    if(req.user.id === req.params.userid || req.user.isAdmin){
        res.status(200).json("User has been deleted");
    }
    else{
        res.status(401).send("Unauthorized to delete user");
    }
});

app.listen(4000, ()=>{
    console.log("listening on port 4000");
});