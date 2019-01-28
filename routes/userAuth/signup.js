const express = require('express');
const router = express.Router();
const Customer = require('../../models/customerDB.js');

const {
    SERVER_ERROR, DATABASE_SAVE_ERROR, REPEAT_SIGNUP_ERROR
} = require('../../utils/messages').error;
const {
    SIGNUP_SUCCESS
} = require('../../utils/messages').success;

// @route  : POST /auth/signup
// @desc   : receive signup info from *customer* and add to customerDB
// @access : public route
// --TO-DO-- : ---
router.post('/signup', (req, res) => {
    // Extract signup info from request body
    const { email, contact, name } = req.body;

    // Check if the user already exixts 
    Customer.findOne({'email': email}, function(error, customer){
        if(error){
            console.log('Database Error: Error finding user in signup');
            console.log(error);

            res.json({
                success: false,
                message: SERVER_ERROR
            });
        }
        else{
            if(customer == null){
                // Creating the user Document
                const newCustomer = new Customer({
                    email: email,
                    contact: contact,
                    name: name
                });
                
                // Save the new user in the database -----
                newCustomer.save(function(error, _temp) {
                    if(error){
                        console.log('Error Saving to database');
                        console.log(error);

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