const jwt = require('jsonwebtoken');
const {jwtCode} = require('../config/keys');

const {
    UNAUTH_API_REQUEST, INVALID_ACCESS_TOKEN
} = require('../utils/messages').error;

// Middleware to validate API request
const validateApiRequest = (req, res, next) => {
    const { accessToken } = req.body;

    // check if accessToken exists in the request ------
    if(accessToken == undefined){
        res.status(401).json({
            success: false,
            message: UNAUTH_API_REQUEST
        })
    }
    else{
        // verify the access token ----------
        jwt.verify(accessToken, jwtCode, (error, decoded) => {
            if(error){
                console.log('client token not valid');
                console.log(error);

                res.status(400).json({
                    success: false,
                    message: INVALID_ACCESS_TOKEN
                })
            }
            else{
                console.log(`api call from ${decoded.email} verified`);
                // Store email in req to pass to chatbot.js and store convo
                req.body.email = decoded.email
                
                // Send the request to next middleware ---------
                next();
            }

        })
    }
}

module.exports = validateApiRequest;