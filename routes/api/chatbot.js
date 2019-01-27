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
	console.log("\nBefore : ",query)
	query = nlpEngine(query);
	console.log("After : ",query)

	// use Sentimentatl Analysis Engine
	sentiment = sentimentEngine(query);

	// Find & Return response
	findResponse(query)
		.then(response=> {
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