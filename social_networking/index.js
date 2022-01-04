const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const connectDB = require('./model/database')


connectDB();

dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 4000

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.json());
const route = require('./routes/router');
app.use('/', require('./routes/router'));




app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`);
});