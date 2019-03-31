/*
    *API for Signup
*/
const express = require('express'),
      router = express.Router(),
      Customer = require('../../models/customerDB.js'),
      Executive = require('../../models/executiveDB');

const {
    SERVER_ERROR, DATABASE_SAVE_ERROR, REPEAT_SIGNUP_ERROR
} = require('../../utils/messages').error;

const {
    SIGNUP_SUCCESS
} = require('../../utils/messages').success;
/*
    *route  : POST /auth/customer/signup
    *desc   : receive signup info from customer and add to customerDB
    *access : public route
*/
router.post('/customer/signup', (req, res) => {
    // Extract signup info from request body
    const {email, contact, name} = req.body;
    // Check if the customer already exixts
    Customer.findOne({'email': email}, function(err, customer){
        if(err){
            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(customer == null){
                // New customer
                const newCustomer = new Customer({
                    email: email,
                    contact: contact,
                    name: name
                });
                // Save the new customer in the database
                newCustomer.save(function(err, _) {
                    if(err){
                        res.json({
                            success: false,
                            message: SERVER_ERROR
                        });
                    }
                    else{
                        res.status(200).json({
                            success: true,
                            message: SIGNUP_SUCCESS
                        });
                    }
                });
            }
            // Customer already exists
            else{
                res.json({
                    success: false,
                    message: REPEAT_SIGNUP_ERROR
                });
            }
        }
    });
});

/*
    *route  : POST /auth/executive/signup
    *desc   : receive signup info from executive and add to executiveDB
    *access : public route
*/
router.post('/executive/signup', (req, res) => {
    // Extract signup info from request body
    const {email, contact, name, password} = req.body;
    // Check if the executive already exixts
    Executive.findOne({'email': email}, function(err, executive){
        if(err){
            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(executive == null){
                // New executive
                const newExecutive = new Executive({
                    email: email,
                    contact: contact,
                    name: name
                });
                // Save the new executive in the database
                newExecutive.save(function(err, _) {
                    if(err){
                        res.json({
                            success: false,
                            message: SERVER_ERROR
                        });
                    }
                    else{
                        res.status(200).json({
                            success: true,
                            message: SIGNUP_SUCCESS
                        });
                    }
                });
            }
            // Executive already exists
            else{
                res.json({
                    success: false,
                    message: REPEAT_SIGNUP_ERROR
                });
            }
        }
    });
});

module.exports = router;