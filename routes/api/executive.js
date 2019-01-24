// --- API for customer to get resolution from executive ---

const express = require("express"),
	  router = express.Router();

// @route  : POST /api/executiveGetResolution
// @desc   : receive query from *customer*, send to executive, receive & save(optional) response and return response to customer
// @access : public route
// --TO-DO-- : make this a private route using auth (customer details)
router.post("/executiveGetResolution",(req,res)=>{
	// Take data from request
	console.log(req.body);
	// Send it to executive and receive response

	// Save query - response pair
	
	// Return response object
	response = {
		reply: "Hi! I'm a human, how can I help you today?"
	}
	console.log(response)
	res.send(response)
})

// @route  : POST /api/executiveSaveResolution
// @desc   : receive save request from *executive* and save the query-resolution pair
// @access : public route
// --TO-DO-- : make this a private route using auth (executive login)
router.post("/executiveSaveResolution",(req,res)=>{
	// Take data from request
	console.log(req.body);

	// Save query - response pair
	
	res.send({status:"Successfully saved!"})
})

module.exports = router