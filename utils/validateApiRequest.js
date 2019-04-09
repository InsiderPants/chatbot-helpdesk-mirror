/*
    *Module for validating api request
*/
const jwt = require('jsonwebtoken'),
      {jwtCode} = require('../config/keys');

const {
    UNAUTH_API_REQUEST, INVALID_ACCESS_TOKEN
} = require('../utils/messages').error;

// Middleware to validate API request
const validateApiRequest = (req, res, next) => {
    const { accessToken } = req.body;
    // Check if access token exists in the request
    if(accessToken === ''){
        res.json({
            success: false,
            message: UNAUTH_API_REQUEST
        })
    }
    else{
        // Verify the access token
        jwt.verify(accessToken, jwtCode, (err, decoded)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    message: INVALID_ACCESS_TOKEN
                })
            }
            else{
                // Store email in req to pass to chatbot.js and store convo
                console.log('SERVER: Valid customer request')
                req.body.email = decoded.email
                // Send the request to next middleware
                next();
            }
        })
    }
}

module.exports = validateApiRequest;