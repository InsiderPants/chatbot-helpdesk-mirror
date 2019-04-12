/*
	*API for customer to get resolution from executive
*/
const mongoose = require("mongoose"),
	  intentsDB = require("../../models/intentsDB.js"),
	  executiveDB = require('../../models/executiveDB.js'),
	  passport	= require('passport'),
	  bcrypt = require('bcryptjs');

const {
	SUCCESSFULLY_ADDED_TO_DATABASE, SUCCESSFULLY_REMOVED_FROM_DATABASE, SUCCESSFULLY_UPDATED
} = require('../../utils/messages').success;

const {	
	SERVER_ERROR, DATABASE_SAVE_ERROR, NO_INTENT_IN_DB, INTENT_NOT_FOUND, OLD_PASSWORD_INCORRECT
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
		*route  : POST /api/executiveSaveIntent
		*desc   : receive save request from executive and save Intent-Reply-Actions
		*access : private route
	*/
	app.post("/api/executiveSaveIntent", passport.authenticate('jwt',{session:false}),(req, res) => {
		// Take Data from Request
		var {intentName, trainingPhrases, responses, actionsArray} = req.body;
		/*
			{intentName: 'greet',
			trainingPhrases: ['hi','hello'],
			actions: ['g','p'],
			responses: ['hi','there']}
		*/

		// Validation of data --TO-DO--


		intentsDB.findOne({'intent':intentName},(err,intent)=>{
			if(err){
	            res.json({
	                success: false,
	                message: SERVER_ERROR
	            });
        	}
        	else{
        		if(intent==null){
        			// new intent
        			// Save Intent-Reply-Actions
					intentsDB.create({
							intent: intentName,
							examples: trainingPhrases,
							reply: responses,
							actions: actionsArray
						})
						.then(intent => {
							res.status(200).json({
								success: true,
								message: SUCCESSFULLY_ADDED_TO_DATABASE
							})
						})
						.catch(err => res.json({
							success: false,
							message: DATABASE_SAVE_ERROR
						}));
        		}
        		else{
        			// intent exists so update intent
        			intent.intent = intentName;
        			intent.examples = trainingPhrases;
        			intent.reply = responses;
        			intent.actions = actionsArray;
        			intent.save()
        				.then(intent=>{
        					res.status(200).json({
								success: true,
								message: SUCCESSFULLY_ADDED_TO_DATABASE
							})
        				})
        				.catch(err => res.json({
							success: false,
							message: DATABASE_SAVE_ERROR
						}));
        		}
        	}
		})
	})
	/*
		*route  : GET /api/executiveViewIntents
		*desc   : receive get request from executive and send all intent names from db
		*access : private route
	*/
	app.get("/api/executiveViewIntents", passport.authenticate('jwt',{session:false}),(req, res) => {
		intentsDB.find((err,intents)=>{
			if(err){
	            res.json({
	                success: false,
	                message: SERVER_ERROR
	            });
        	}
        	else{
        		if(intents.length==0){
        			res.json({
		                success: false,
		                message: NO_INTENT_IN_DB
		            });
        		}else{
        			let intentNames = [];
        			for(let i of intents)
        				intentNames.push(i.intent);
        			res.status(200).json({
		                success: true,
		                message: null,
		                intentNames:intentNames
		            });
        		}
        	}
		})
	})
	/*
		*route  : POST /api/executiveGetIntentInfo
		*desc   : receive post request from executive and send intent info from db
		*access : private route
	*/
	app.post("/api/executiveGetIntentInfo", passport.authenticate('jwt',{session:false}),(req, res) => {
		var {intentName} = req.body;
		intentsDB.findOne({'intent':intentName},(err,intent)=>{
			if(err){
	            res.json({
	                success: false,
	                message: SERVER_ERROR
	            });
        	}
        	else{
        		if(intent==null){
        			// intent doesn't exists
        			res.json({
		                success: false,
		                message: INTENT_NOT_FOUND
		            });
        		}
        		else{
        			// intent exists so send info
        			let data = {
        				intentName: intent.intent,
        				trainingPhrases:intent.examples,
        				responses:intent.reply,
        				actionsArray:intent.actions
        			}
        			res.status(200).json({
		                success: true,
		                message: null,
		                data:data
		            });
        		}
        	}
		})
	})
	/*
		*route  : POST /api/executiveDeleteIntent
		*desc   : receive post request from executive and delete intent from db
		*access : private route
	*/
	app.post("/api/executiveDeleteIntent", passport.authenticate('jwt',{session:false}),(req, res) => {
		var {intentName} = req.body;
		intentsDB.findOneAndDelete({'intent':intentName},(err,intent)=>{
			if(err){
	            res.json({
	                success: false,
	                message: SERVER_ERROR
	            });
        	}
        	else{
        		if(intent==null){
        			// intent doesn't exists
        			res.json({
		                success: false,
		                message: INTENT_NOT_FOUND
		            });
        		}
        		else{
        			// intent exists so we removed it, send acknowledgement
		            res.status(200).json({
		                success: true,
		                message: SUCCESSFULLY_REMOVED_FROM_DATABASE
		            });
        		}
        	}
		})
	})

	/*
		route: Post /api/executiveUpdateContact
		description: api for changing the contact detail of the executive4
		private route
	*/
	app.post('/api/executiveUpdateContact', passport.authenticate('jwt',{session:false}), (req, res) => {
		const { Email, NewContact } = req.body;
		executiveDB.findOneAndUpdate({'email': Email}, {'contact': NewContact}, (err) => {
			if(err) {
				res.json({
					success: false,
					message: SERVER_ERROR
				});
			}
			else {
				res.status(200).json({
					success: true,
					message: SUCCESSFULLY_UPDATED,
				})
			}
		})
	})

	/* 
		route: /api/executiveUpdatePassword
		description: api for password updation
		private route
	*/
	app.post('/api/executiveUpdatePassword', passport.authenticate('jwt',{session:false}), (req, res) => {
		const { Email, OldPassword, NewPassword } = req.body;
		executiveDB.findOne({'email': Email}, (err, executive) => {
			if(err) {
				res.json({
					success: false,
					message: SERVER_ERROR,
				})
			}
			else {
				bcrypt.compare(OldPassword, executive.password)
					.then(match => {
						if(match) {
							bcrypt.genSalt(10, (err, salt) => {
								if(err) {
									res.json({
										success: false,
										message: SERVER_ERROR,
									})
								}
								bcrypt.hash(NewPassword, salt, (err, hash) => {
									if(err) {
										res.json({
											success: false,
											message: SERVER_ERROR,
										})
									}
									executive.set({
										password: hash
									})
									executive.save((err, _) => {
										if(err) {
											res.json({
												success: false,
												message: SERVER_ERROR,
											})
										}
										else {
											res.status(200).json({
												success: true,
												message: SUCCESSFULLY_UPDATED,
											})
										}
									})
								})
							})
						}
						else {
							res.json({
								success: false,
								message: OLD_PASSWORD_INCORRECT,
							})
						}
					})
			}
		})
	})

	/* 
		route: /api/executiveGetUntrainedIntents
		desc: for sending untrained intents list according to page
		private route
	*/
	// app.post('/api/executiveGetUntrainedIntents', passport.authenticate('jwt', {session: false}), (req, res) => {
	// 	const { PageNumber } = req.body;
	// 	let counter = 0;
	// 	intentsDB.find((err, intents) => {
	// 		if(err) {
	// 			res.json({
	// 				success: false,
	// 				message: SERVER_ERROR,
	// 			})
	// 		}
	// 		else {
	// 			if(intents.length === 0) {
	// 				res.json({
	// 					success: false,
	// 					message
	// 				})
	// 			}
	// 		}
	// 	})
	// })
}