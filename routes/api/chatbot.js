// --- API for customer to get resolution using chatbot ---

const express = require("express"),
	  router = express.Router();

// @route  : POST /api/chatbotGetResolution
// @desc   : receive query from *customer* and send reply using chatbot engine
// @access : public route
// --TO-DO-- : make this a private route using auth (customer details)
router.post("/chatbotGetResolution",(req,res)=>{
	// Take data from request
	console.log(req.body);
	// Preprocess it
	
	// Use NLP Engine

	// use Sentimentatl Analysis Engine

	// Find response
	
	// Return results object
	results = {
		reply: "Hi there! I'm a chatbot, how can I help you today?"
	}
	console.log(results)
	res.send(results)
})

module.exports = router