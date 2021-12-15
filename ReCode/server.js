const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const {MongoClient} = require('mongodb');
const connectDB = require('./server/database/database')

connectDB();


dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 8080

app.use(morgan('tiny'));
app.use(bodyparser.urlencoded({extended: true}));
const route = require('./server/routes/router');

app.use('/', require('./server/routes/router'))


app.listen(PORT, ()=>{
    console.log(`listening on port http://localhost:${PORT}...`);
})
