/*
    *API for Login
*/
const express = require('express'),
      router = express.Router(),
      jwt = require('jsonwebtoken'),
      {jwtCode} = require('../../config/keys'),
      Customer = require('../../models/customerDB'),
      Executive = require('../../models/executiveDB');

const {
    SERVER_ERROR, DATABASE_SAVE_ERROR, UNREGISTERED_EMAIL
} = require('../../utils/messages').error;

const {
    LOGIN_SUCCESS
} = require('../../utils/messages').success;
/*
    *route  : POST /auth/customer/login
    *desc   : receive login info from customer and authenticate
    *access : public route
    ***TO-DO: Return previous chat to the user
              Add better Auth
*/
router.post('/customer/login', (req, res) => {
    // Extract login info from request body
    const {email, password} = req.body;
    // Validate from the database
    Customer.findOne({'email': email}, function(err, customer){
        if(err){
            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(customer != null){
                // Generate access Token
                const accessToken = jwt.sign({
                    email: customer.email,
                    name: customer.name
                }, jwtCode);
                // Increment visit counter by one
                customer.set({visitCounter:customer.visitCounter+1})
                customer.save(function(err,_){
                    if(err){
                        res.json({
                            success: false,
                            message: SERVER_ERROR
                        });
                    }else{
                        // Send response to client
                        res.status(200).json({
                            success: true,
                            message: LOGIN_SUCCESS,
                            body: {
                                name: customer.name,
                                contact: customer.contact,
                                email: customer.email,
                                accessToken: accessToken,
                                previousChat: [{mtag:'SERVER', message: "your previous chat"}]
                            }

                        })
                    }
                })
            }
            // If Customer not found
            else{
                res.json({
                    success: false,
                    message: UNREGISTERED_EMAIL
                });
            }
        }
    });
});

/*
    *route  : POST /auth/executive/login
    *desc   : receive login info from executive and authenticate
    *access : public route
    ***TO-DO: Add better Auth
*/
router.post('/executive/login', (req, res) => {
    // Extract login info from request body
    const {email} = req.body;
    // Validate from the database
    Executive.findOne({'email': email}, function(err, executive){
        if(err){
            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(executive != null){
                // Generate access Token
                const accessToken = jwt.sign({
                    email: executive.email,
                    name: executive.name
                }, jwtCode);
                // Send response to executive
                res.status(200).json({
                    success: true,
                    message: LOGIN_SUCCESS,
                    body: {
                        name: executive.name,
                        contact: executive.contact,
                        accessToken: accessToken
                    }
                })
            }
            // If Executive not found
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