// --- API for customer to get resolution using chatbot ---

const express = require("express"),
	  router = express.Router(),
	  nlpEngine = require("../../utils/nlpEngine.js"),
	  sentimentEngine = require("../../utils/sentimentEngine.js"),
	  findResponse = require("../../utils/findResponse.js"),
	  Customer = require('../../models/customerDB.js');

const validateApiRequest = require('../../utils/validateApiRequest.js');
const {
	SERVER_ERROR, UNKNOWN_ERROR
} = require('../../utils/messages').error;
const {
	ACCESS_VALIDATED
} = require('../../utils/messages').success;

// @route  : POST /api/chatbotGetResolution
// @desc   : receive query from *customer* and send reply using chatbot engine
// @access : private route
// --TO-DO-- : Improve NLP Engine, Set Sentimental Engine
router.post("/chatbotGetResolution", validateApiRequest, (req,res)=>{
	// Take data from request
	let email = req.body.email;
	query = req.body.message;
	

	// Use NLP Engine
	// var start = new Date().getTime();
	// console.log("\nBefore : ",query)
	query = nlpEngine(query);
	// console.log("After : ",query)
	// var end = new Date().getTime();
	// console.log("Call to nlpEngine took " + (end - start) + " milliseconds.")
	
	// use Sentimentatl Analysis Engine
	// start = new Date().getTime();
	// sentiment = sentimentEngine(query);
	// end = new Date().getTime();
	// console.log("Call to sentimentEngine took " + (end - start) + " milliseconds.")
	
	// Find & Return response
	// start = new Date().getTime();
	findResponse(query)
		.then(response=> {
			// end = new Date().getTime();
			// console.log("Call to findResponse took " + (end - start) + " milliseconds.")

			// Save chat in conversation array
			Customer.findOne({'email': email}, function(error, customer){
		        if(error){
		            res.json({
		                success: false,
		                message: SERVER_ERROR
		            });
		        }
		        else{
		        	// customer already exists so no checking for customer==null
		        	conversation = customer.conversation
		        	newConvoClient = {mtag:'CLIENT', message:query}
		        	newConvoServer = {mtag:'SERVER', message:response}
		            customer.set({conversation:[...conversation,newConvoClient,newConvoServer]})
	                customer.save(function(err,_){
	                    if(error){
	                        res.json({
	                            success: false,
	                            message: SERVER_ERROR
	                        });
	                    }else{
	                        // Send response to client ---- 
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