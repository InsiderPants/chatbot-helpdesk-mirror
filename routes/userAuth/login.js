/*
    *API for Login
*/
const express = require('express'),
      router = express.Router(),
      jwt = require('jsonwebtoken'),
      {jwtCode} = require('../../config/keys'),
      bcrypt = require('bcryptjs'),
      passport  = require('passport'),
      Customer = require('../../models/customerDB'),
      Executive = require('../../models/executiveDB');

const {
    SERVER_ERROR, DATABASE_SAVE_ERROR, UNREGISTERED_EMAIL, INCORRECT_PASSWORD
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
*/
router.post('/executive/login', (req, res) => {
    // Extract login info from request body
    const {email,password} = req.body;
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
                // If found, check password
                bcrypt.compare(password,executive.password)
                    .then(isMatch => {
                        if(isMatch){
                            // Create jwt payload
                            // Payload is basically data
                            const payload = {
                                email:executive.email,
                                name:executive.name
                            }
                            // Sign Token
                            // expiresIn is in seconds
                            let hours = 6;
                            jwt.sign(
                                payload,
                                jwtCode,
                                {expiresIn:hours*3600},
                                (err,token)=>{
                                    if(err){
                                        res.json({
                                            success: false,
                                            message: SERVER_ERROR
                                        });
                                    }
                                    // Send response to executive
                                    res.status(200).json({
                                        success: true,
                                        message: LOGIN_SUCCESS,
                                        body: {
                                            name: executive.name,
                                            contact: executive.contact,
                                            accessToken: 'Bearer '+token
                                        }
                                    })
                                });
                        }else{
                            res.json({
                                success: false,
                                message: INCORRECT_PASSWORD
                            });
                        }
                    })
                    .catch(err=>{
                        res.json({
                            success: false,
                            message: SERVER_ERROR
                        });
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