const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// @desc Register a user
//@route POST /api/users/register
//@access public       
const registerUser = async(req,res) =>{
    const {username, email, password} = req.body;
    if( !username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");   // this returns a response in HTML format so for converting the response to JSON format, for that we need to create a custom middleware -> which reads the request body and responds in json format
    }// check if already registered user 
        const userAvailable =await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered"); 
    }
    //we need to hash our password as we cant store the raw password -> so we install bcrypt library
    
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the no. of salt rounds for hashing of the password
    console.log("hashed password: ",hashedPassword);
    // for all users this hashed password is stored in the database
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    console.log(`user created ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email})}
    else{
            res.status(400);
        throw new Error("user data not valid");
    }
        res.json({message: "Register the user"});
    }

    
    
// @desc login a user
//@route POST /api/users/login
//@access public       
const loginUser =asyncHandler (async(req,res) =>{
    // when a user logins-> the email and pssword is matched 
    //and if the match is there then user is given a json web token 
    //JWT and allowed to login
    const {email, password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    // to check email and password we first need to check if there is
    // any such user in the database or not
    const user = await User.findOne({email});
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({   // signin object in which we need to provide payload
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            }, // define a unique access token secret 
        }, process.env.ACCESS_TOKEN_SECRET);
        {expiresIn: "15m" } // expiration time of token is 1,im only so that user cant use the same token to call the apis
        res.status(200).json({accessToken});
        throw new Error
    }
    else{
        res.status(401);// email or password doesnt match or the user doesnt exist
        throw new Error("email or password is not valid");
    }
    res.json({message: "login the user"});
    });
    // we can use the access token and access all our private routes so that only authenticated users cab access those private routes
    // client needs to pass access token so that authenticated user can access those private routes
// we need a middleware to validate the token that the client is sending
// client sends the accessToken in Bearer section
// when client sends request, we have to validate that token is correct and associated with correct user
// go to user routes



    // @desc current user info
//@route POST /api/users/current
//@access private  
const currentUser = asyncHandler(async(req,res) => {
    res.json(req.user) //req.user gives all info about user;
    
});
// now we need to protect all our contactRoutes
module.exports = {registerUser ,loginUser, currentUser};
