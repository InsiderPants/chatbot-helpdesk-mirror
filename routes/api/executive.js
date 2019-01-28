// --- API for customer to get resolution from executive ---

const express = require("express"),
	  router = express.Router(),
	  mongoose = require("mongoose"),
	  ordinaryDB = require("../../models/ordinaryDB.js"),
	  faqDB = require("../../models/faqDB.js")
	  nlpEngine = require("../../utils/nlpEngine.js");

const {
	QUERY_RESOLUTION_ADDED_TO_DATABASE, ACCESS_VALIDATED
} = require('../../utils/messages').success;

const {	
	DATADASE_PUSH_ERROR_USER, INVALID_REQUEST
} = require('../../utils/messages').error;

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
		success: true,
		message: ACCESS_VALIDATED,
		body: {
			reply: "Hi! I'm a human, how can I help you today?"
		}
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
	var { query, response, dbType} = req.body;

	// Use NLP Engine
	console.log("\nBefore : ",query)
	query = nlpEngine(query);
	console.log("After : ",query)

	// Save query - response pair
	if(dbType==='faq'){
		ordinaryDB.create({query:query,resolution:response})
		.then(obj=>{
			res.status(200).json({
				success: true,
				message: QUERY_RESOLUTION_ADDED_TO_DATABASE
			})
		})
		.catch(err=>res.send({success:false,message:DATADASE_PUSH_ERROR_USER}));
	}
	else if(dbType=='ordinary'){
		faqDB.create({query:query,resolution:response})
		.then(obj=>{
			res.status(200).json({
				success: true,
				message: QUERY_RESOLUTION_ADDED_TO_DATABASE
			})
		})
		.catch(err=>res.send({success:false,message:DATADASE_PUSH_ERROR_USER}));
	}
	else
		res.send({success:false,message:INVALID_REQUEST})
})

module.exports = router