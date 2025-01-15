const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const validateToken = asyncHandler(async(req,res,next) =>{
    let token;
    // when user creates request , token is passed in the header section
//with auth filled
// in header -> you can use the Authorization - Bearer followed by token value
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        // bearer written in 0th index and token written in 1st index
        // extracting info embedded in the token
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
            if(err){
                res.status(401);
                // trying to validate user but user is not authorized for that token
                throw new Error("user is not authorized");
            }
            req.user = decoded.user; // APPENDING THE DECODED INFO INTO THE REQUEST
            next();    
        });
        if(!token){
            res.status(401);
            throw new Error("user is not authorized or token is missing in the request");
        }
    }
})

module.exports = validateToken;
// now use it in user routes
// use validate token for each of the routes