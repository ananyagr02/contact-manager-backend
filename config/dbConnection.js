// first installed mongoose using npm i mongoose
// to connect with mongodb database we will need a mongoose -> object model design schema for our entities like contacts or user and helps us to communicate with mongodb database
const mongoose = require("mongoose");
const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected: ",connect.connection.host,connect.connection.name);
        }
        catch(err){
            console.log(err);
            process.exit(1);
        }
};
module.exports = connectDb;