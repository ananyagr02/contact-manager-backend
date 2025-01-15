const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDb = require("./config/dbConnection");
connectDb();

// now we will test the api using http clients
// for that either use POSTMAN or use thunder-client, thunder-client is in vscode iteslf hence u dont need to switch between differnt applications 
// app.use() using middleware and defining path of our routes

app.use(express.json()) ; // this provides us a parser which
// helps to parse the data stream received from the client
app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));

app.use(errorHandler)  // created an error handler middleware and exported it from there to use it in server.js;
app.listen(port, ()=>{
    console.log("Server is listening to port",port);
});