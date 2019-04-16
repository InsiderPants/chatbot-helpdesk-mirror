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
	let intentThreshold = 0.3;
	let sentimentThreshold = 0.3;
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
	intentClassifiedResult = await pipeline.intentClassifier.predict(customerQuery);
	result['intent'] = intentClassifiedResult['intent'];
	result['confidence'] = intentClassifiedResult['confidence'];

	// Passing through Sentiment Engine
	result['sentiment'] = await pipeline.sentimentEngine.predict(customerQuery);

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
	       			if(result['confidence']<intentThreshold){
	       				result = fallbackIntent(result);
	       			}
	       			else if(result['sentiment']<sentimentThreshold){
	       				result['reply'] = ["I feel it's better to redirect you to human operator right away"]
						result['actions'] = ['initiate_handoff']
	       			}
	       			else{
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