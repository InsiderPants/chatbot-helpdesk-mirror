const express = require('express'),
      router = express.Router(),
      jwt = require('jsonwebtoken'),
      {jwtCode} = require('../../config/keys'),
      Customer = require('../../models/customerDB');
const {
    SERVER_ERROR, DATABASE_SAVE_ERROR, UNREGISTERED_EMAIL
} = require('../../utils/messages').error;
const {
    LOGIN_SUCCESS
} = require('../../utils/messages').success;

// @route  : POST /auth/login
// @desc   : receive login info from *customer* and authenticate
// @access : public route
// --TO-DO-- : ---
router.post('/login', (req, res) => {
    // Extract login info from request body
    const {email} = req.body;
    console.log(`Got login request from ${email}`);

    // Validate from the database -------
    Customer.findOne({'email': email}, function(error, customer){
        if(error){
            console.log('Database Error: Error finding user in login');
            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(customer != null){
                // Generate access Token -----------
                const accessToken = jwt.sign({
                    email: customer.email,
                    name: customer.name
                }, jwtCode);

                // Increment visit counter by one
                customer.set({visitCounter:customer.visitCounter+1})
                customer.save(function(err,_){
                    if(error){
                        console.log(DATABASE_SAVE_ERROR);
                        console.log(error);

                        res.json({
                            success: false,
                            message: SERVER_ERROR
                        });
                    }else{
                        // Send response to client ---- 
                        res.status(200).json({
                            success: true,
                            message: LOGIN_SUCCESS,
                            body: {
                                name: customer.name,
                                contact: customer.contact,
                                accessToken: accessToken,
                                previousChat: [{mtag:'SERVER', message: "your previous chat"}]
                            }

                        })
                    }
                })
            }
            // If User not found
            else{
                res.json({
                    success: false,
                    message: UNREGISTERED_EMAIL
                });
            }
        }
    });
});

module.exports = router;