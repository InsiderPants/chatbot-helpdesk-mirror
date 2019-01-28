const jwt = require('jsonwebtoken');
const {jwtCode} = require('../config/keys');

// Middleware to validate API request
const validateApiRequest = (req, res, next) => {
    const { accessToken } = req.body;

    // check if accessToken exists in the request ------
    if(accessToken == undefined){
        res.status(401).json({
            success: false,
            message: 'You are not authorised to access this api'
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
                    message: 'Access token not valid'
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