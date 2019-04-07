/*
	*API for customer to get resolution from executive
*/
const mongoose = require("mongoose"),
	  intentsDB = require("../../models/intentsDB.js"),
	  passport	= require('passport');

const {
	SUCCESSFULLY_ADDED_TO_DATABASE
} = require('../../utils/messages').success;

const {	
	SERVER_ERROR, DATABASE_SAVE_ERROR
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
			trainingPhrases: [ { text: 'hi' }, { text: 'hello' } ],
			actions: [ { text: 'g' }, { text: 'p' } ],
			responses: [ { text: 'hi' }, { text: 'there' } ]}
		*/
		var examples=[],reply=[],actions=[];
		for(let t of trainingPhrases){
			examples.push(t.text)
		}
		for(let t of responses){
			reply.push(t.text)
		}
		for(let t of actionsArray){
			actions.push(t.text)
		}
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
							examples: examples,
							reply: reply,
							actions: actions
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
        			intent.examples = examples;
        			intent.reply = reply;
        			intent.actions = actions;
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
}