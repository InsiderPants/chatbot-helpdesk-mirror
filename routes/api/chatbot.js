// --- API for customer to get resolution using chatbot ---

const express = require("express"),
	  router = express.Router(),
	  nlpEngine = require("../../utils/nlpEngine.js"),
	  sentimentEngine = require("../../utils/sentimentEngine.js"),
	  findResponse = require("../../utils/findResponse.js");

// @route  : POST /api/chatbotGetResolution
// @desc   : receive query from *customer* and send reply using chatbot engine
// @access : public route
// --TO-DO-- : make this a private route using auth (customer details)
router.post("/chatbotGetResolution",(req,res)=>{
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
		.then(response=>res.send({reply:response[0]}))
		.catch(err=>res.send({reply:"Sorry, unknown error occured. We're looking into the matter."}))
})

module.exports = router