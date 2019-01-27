const express = require('express');
const router = express.Router();
const Customer = require('../../models/customerDB.js');

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
                message: 'Server Error'
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
                            message: 'Server Error'
                        });
                    }
                    else{
                        res.status(200).json({
                            success: true,
                            message: 'SignUp successful, please login to continue'
                        });
                    }
                });
            }
            else{
                res.json({
                    success: false,
                    message: 'You are already registered. Please login to continue'
                });
            }
        }
    });

    
    
    
});

module.exports = router;