// --- API for customer to get resolution using chatbot ---

const express = require("express"),
	  router = express.Router(),
	  nlpEngine = require("../../utils/nlpEngine.js"),
	  sentimentEngine = require("../../utils/sentimentEngine.js"),
	  findResponse = require("../../utils/findResponse.js"),
	  Customer = require('../../models/customerDB.js');

const validateApiRequest = require('../../utils/validateApiRequest.js');

// @route  : POST /api/chatbotGetResolution
// @desc   : receive query from *customer* and send reply using chatbot engine
// @access : private route
// --TO-DO-- : Improve NLP Engine, Set Sentimental Engine
router.post("/chatbotGetResolution", validateApiRequest, (req,res)=>{
	// Take data from request
	var query = req.body.message;
	var email = req.body.email

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
		                message: 'Server Error'
		            });
		        }
		        else{
		        	// customer already exists so no checking for customer==null
		        	conversation = customer.conversation
		        	newConvoClient = {mtag:'CLIENT', message:query}
		        	newConvoServer = {mtag:'SERVER', message:query}
		            customer.set({conversation:[...conversation,newConvoClient,newConvoServer]})
	                customer.save(function(err,_){
	                    if(error){
	                        res.json({
	                            success: false,
	                            message: 'Server Error'
	                        });
	                    }else{
	                        // Send response to client ---- 
	                        res.status(200).json({
								success: true,
								message: 'Access validated',
								body: {
									reply: response
								}
							})
	                    }
	                })
		        }
		    });
		})
		.catch(err=>res.send({reply:"Sorry, unknown error occured. We're looking into the matter."}))
})

module.exports = router;