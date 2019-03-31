/*
	*API for customer to get resolution from executive
*/
const mongoose = require("mongoose"),
	  intentsDB = require("../../models/intentsDB.js");

const {
	SUCCESSFULLY_ADDED_TO_DATABASE, ACCESS_VALIDATED
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
		*desc   : receive save request from executive and save Intent-Reply-Actions
		*access : public route
		***TO-DO: make this a private route using auth (executive login)
	*/
	app.post("/api/executiveSaveResolution", (req, res) => {
		// Take Data from Request
		var {intent, examples, reply, actions} = req.body;
		// Save Intent-Reply-Actions
		intentsDB.create({
				intent: intent,
				examples: examples,
				reply: reply,
				actions: actions
			})
			.then(obj => {
				res.status(200).json({
					success: true,
					message: SUCCESSFULLY_ADDED_TO_DATABASE
				})
			})
			.catch(err => res.send({
				success: false,
				message: DATADASE_PUSH_ERROR_USER
			}));
	})
}