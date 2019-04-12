/*
    *Module for finding response
*/
const mongoose = require("mongoose"),
	  intentsDB = require("../models/intentsDB.js");

function fallbackIntent(result){
	result['intent'] = 'default_fallback';
	result['reply'] = ['Sorry!!!'];
	result['actions'] = ['initiate_fallback'];
	return result;
}

async function findResponse(customerQuery,pipeline){
	// Passing through NLP Engine
	// Result object
	let threshold = 0.3;
	var result = {
		"text":customerQuery,
		"sentiment":null,
		"intent":'',
		"confidence":null,
		"entities":[],
		"reply":[],
		"actions":[]
	};
	// Named Entity Recognition
	// entities = await pipeline.ner(customerQuery);
	// console.log("SERVER: Entities for query : ",entities);

	// Intent Classification
	classifiedResult = await pipeline.intentClassifier.predict(customerQuery);
	result['intent'] = await classifiedResult['intent'];
	result['confidence'] = await classifiedResult['confidence'];

	// Passing through Sentiment Engine
	// result['sentiment'] = await pipeline.sentimentEngine(result['text']);

	// Search Database using intent for actions and reply
	await intentsDB.findOne({'intent':result['intent']},(err,intent)=>{
			if(err){
				// Default fallback intent
				result = fallbackIntent(result);
	        }
	        else{
	        	if(intent==null){
	        		// Default fallback intent
	        		result = fallbackIntent(result);
	        	}
	        	else{
	       			// intent exists
	       			if(result['confidence']<threshold){
	       				result = fallbackIntent(result);
	       			}else{
	       				result['reply'] = intent.reply;
	        			result['actions'] = intent.actions;
	       			}
	        	}
	        }
		});
	// Return result object
	return result
}

module.exports = findResponse;