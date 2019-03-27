/*
    *Module for finding response
*/
const nlpEngine = require('./nlp/nlpEngine'),
	  sentimentEngine = require('./sentiment/sentimentEngine'),
	  searchDatabase = require('./searchDatabase');

async function findResponse(customerQuery){
	// Passing through NLP Engine
	// console.log(customerQuery)
	var result = await nlpEngine(customerQuery);
	// console.log(result)
	// Passing through Sentiment Engine
	result['sentiment'] = await sentimentEngine(result['text']);
	// console.log(result)
	// Search Database using intent for actions
	// result = await searchDatabase(result);
	// console.log(result)
	// Return result object
	return await result;
}

module.exports = findResponse;