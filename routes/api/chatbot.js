// --- API for customer to get resolution using chatbot ---

const express = require("express"),
	  router = express.Router(),
	  nlpEngine = require("../../utils/nlpEngine.js"),
	  sentimentEngine = require("../../utils/sentimentEngine.js"),
	  findResponse = require("../../utils/findResponse.js");

const validateApiRequest = require('../../utils/validateApiRequest.js');

// @route  : POST /api/chatbotGetResolution
// @desc   : receive query from *customer* and send reply using chatbot engine
// @access : private route
// --TO-DO-- : Add each conversation to the conversation array of the user in the database
router.post("/chatbotGetResolution", validateApiRequest, (req,res)=>{
	// Take data from request
	query = req.body.message;

	// Use NLP Engine
	// var start = new Date().getTime();
	console.log("\nBefore : ",query)
	query = nlpEngine(query);
	console.log("After : ",query)
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
			res.status(200).json({
				success: true,
				message: 'Access validated',
				body: {
					reply: response
				}
			})
		})
		.catch(err=>res.send({reply:"Sorry, unknown error occured. We're looking into the matter."}))
})

module.exports = router;