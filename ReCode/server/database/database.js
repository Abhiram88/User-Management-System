const mongoose = require('mongoose');

 const connectDB = async() =>{
    try{
        console.log("Hello")
        const con = await mongoose.connect("mongodb+srv://admin:admin@cluster0.dfgdy.mongodb.net/users?retryWrites=true&w=majority")
        console.log(`MONGODB connected: ${con.connection.host}`)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;




