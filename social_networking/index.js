const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const connectDB = require('./model/database')
const route = require('./routes/userRoutes');
var mysql = require('mysql2');
var cors = require('cors')

//connectDB();

app.use(cors({
    origin: 'http://localhost:4000',
    origin: 'http://localhost:3000',
}));


app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());
app.use('/', require('./routes/userRoutes'));
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))

dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 4000

app.set("view engine", "ejs");


app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`);
});



// var con = mysql.createConnection({
//     //connectionLimit: 10,
//     host: "127.0.0.1",
//     user: "root",
//     database: 'socialnetworking',
//     password: "admin"
//   });

//   pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     }
//     if (connection) connection.release()
//     return
// })



//module.exports = con;