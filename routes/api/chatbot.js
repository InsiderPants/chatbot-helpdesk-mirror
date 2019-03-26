/*
	*API for customer to get resolution using chatbot
*/
const express = require("express"),
	  router = express.Router(),
	  nlpEngine = require("../../utils/nlpEngine.js"),
	  sentimentEngine = require("../../utils/sentimentEngine.js"),
	  findResponse = require("../../utils/findResponse.js"),
	  Customer = require('../../models/customerDB.js'),
	  validateApiRequest = require('../../utils/validateApiRequest.js');

const {
	SERVER_ERROR, UNKNOWN_ERROR
} = require('../../utils/messages').error;

const {
	ACCESS_VALIDATED
} = require('../../utils/messages').success;
/*
	*route  : POST /api/chatbotGetResolution
	*desc   : receive query from *customer* and send reply using chatbot engine
	*access : private route
*/
router.post("/chatbotGetResolution", validateApiRequest, (req,res)=>{
	// Take data from request
	let email = req.body.email,
		query = req.body.message;
	// Use NLP Engine
	query = nlpEngine(query);
	// Use Sentimentatl Analysis Engine
	sentiment = sentimentEngine(query);
	// Find & Return response
	findResponse(query)
		.then(response=> {
			// Save chat in conversation array
			Customer.findOne({'email': email}, function(error, customer){
		        if(error){
		            res.json({
		                success: false,
		                message: SERVER_ERROR
		            });
		        }
		        else{
		        	prevConversation = customer.conversation
		        	newConvoClient = {mtag:'CLIENT', message:query}
		        	newConvoServer = {mtag:'SERVER', message:response}
		            customer.set({conversation:[...prevConversation,newConvoClient,newConvoServer]})
	                customer.save(function(err,_){
	                    if(error){
	                        res.json({
	                            success: false,
	                            message: SERVER_ERROR
	                        });
	                    }else{
	                        // Send response to client
	                        res.status(200).json({
								success: true,
								message: ACCESS_VALIDATED,
								body: {
									reply: response
								}
							})
	                    }
	                })
		        }
		    });
		})
		.catch(err=>res.send({reply:UNKNOWN_ERROR}))
})

module.exports = router;