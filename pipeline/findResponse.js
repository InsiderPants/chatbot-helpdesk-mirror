/*
    *Module for finding response
*/
const searchDatabase = require('./searchDatabase');

async function findResponse(customerQuery,pipeline){
	// Passing through NLP Engine
	// Result object
	var result = {
		"text":customerQuery,
		"sentiment":null,
		"intent":'',
		"confidence":null,
		"entities":[],
		"reply":[],
		"actions":[]
	};
	// Tokens
	tokens = pipeline.tokenizer.tokenize(customerQuery);
	// console.log(tokens)

	// Features to feed in intent classifier
	features = pipeline.featurizer.transform(tokens);
	// console.log(features)
	
	// Named Entity Recognition
	// entities = await pipeline.ner(customerQuery);

	// Intent Classification
	// classifiedResult = await pipeline.intentClassifier.predict(features);
	// result['intent'] = await classifiedResult['intent'];
	// result['confidence'] = await classifiedResult['confidence'];

	// Passing through Sentiment Engine
	// result['sentiment'] = await pipeline.sentimentEngine(result['text']);

	// Search Database using intent for actions
	// result = await searchDatabase(result);

	// console.log(result)
	
	// Return result object
	return result;
}

module.exports = findResponse;