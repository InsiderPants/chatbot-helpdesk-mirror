// --- API for customer to get resolution from executive ---

const mongoose = require("mongoose"),
	  ordinaryDB = require("../../models/ordinaryDB.js"),
	  faqDB = require("../../models/faqDB.js"),
	  nlpEngine = require("../../utils/nlpEngine.js");

const {
	QUERY_RESOLUTION_ADDED_TO_DATABASE, ACCESS_VALIDATED
} = require('../../utils/messages').success;

const {	
	DATADASE_PUSH_ERROR_USER, INVALID_REQUEST
} = require('../../utils/messages').error;

module.exports = (app, io) => {
	//creating socket io server
	const executiveChat = io.of('/api/executiveGetResolution')

	// @route  : POST /api/executiveGetResolution
	// @desc   : receive query from *customer*, send to executive, receive & save(optional) response and return response to customer
	// @access : public route
	// --TO-DO-- : make this a private route using auth (customer details)
	
	//making connection
	executiveChat.on('connection', (socket) => {
		console.log(`someone is connected`);// for checking
		//collecting executive chat and sending to customer
		socket.on('executive', (data) => {
			console.log(data);
			socket.emit('customer', data)
		})
		// for testing only
		setInterval(() => {
			socket.emit('executive', {
				message: 'just for testing from client'
			})
			socket.emit('customer', {
				message: 'just for testing from executive'
			})
		}, 3000);	
		//sending customer query to executive
		socket.on('customer', (data) => {
			console.log(data);
			socket.emit('executive', data)
		})
	})

	// @route  : POST /api/executiveSaveResolution
	// @desc   : receive save request from *executive* and save the query-resolution pair
	// @access : public route
	// --TO-DO-- : make this a private route using auth (executive login)
	app.post("/api/executiveSaveResolution", (req, res) => {
		// Take data from request
		var {
			query,
			response,
			dbType
		} = req.body;

		// Use NLP Engine
		console.log("\nBefore : ", query)
		query = nlpEngine(query);
		console.log("After : ", query)

		// Save query - response pair
		if (dbType === 'faq') {
			ordinaryDB.create({
					query: query,
					resolution: response
				})
				.then(obj => {
					res.status(200).json({
						success: true,
						message: QUERY_RESOLUTION_ADDED_TO_DATABASE
					})
				})
				.catch(err => res.send({
					success: false,
					message: DATADASE_PUSH_ERROR_USER
				}));
		} else if (dbType == 'ordinary') {
			faqDB.create({
					query: query,
					resolution: response
				})
				.then(obj => {
					res.status(200).json({
						success: true,
						message: QUERY_RESOLUTION_ADDED_TO_DATABASE
					})
				})
				.catch(err => res.send({
					success: false,
					message: DATADASE_PUSH_ERROR_USER
				}));
		} else
			res.send({
				success: false,
				message: INVALID_REQUEST
			})
	})
}