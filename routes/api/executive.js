/*
	*API for customer to get resolution from executive
*/
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
	/*
		*route  : POST /api/executiveGetResolution
		*desc   : receive query from customer, send to executive, receive & save(optional) response and return response to customer
		*access : public route
		***TO-DO: make this a private route using auth (customer details)
	*/
	// Creating Socket IO Server
	const executiveChat = io.of('/api/executiveGetResolution')
	// Making Connection
	executiveChat.on('connection', (socket)=>{
		console.log(`A new client is connected`);
		// Collecting Executive Reply and Sending to Customer
		socket.on('executive', (data) => {
			console.log(data);
			socket.emit('customer', data)
		})
		// Collecting Customer Query and Sending to Executive
		socket.on('customer', (data) => {
			console.log(data);
			socket.emit('executive', data)
		})
	})
	/*
		*route  : POST /api/executiveSaveResolution
		*desc   : receive save request from executive and save the query-resolution pair
		*access : public route
		***TO-DO: make this a private route using auth (executive login)
	*/
	app.post("/api/executiveSaveResolution", (req, res) => {
		// Take Data from Request
		var {query, response, dbType} = req.body;
		// Use NLP Engine/ Process the data before saving

		// Save Query-Response pair
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
		} else{
			res.send({
				success: false,
				message: INVALID_REQUEST
			})
		}
	})
}