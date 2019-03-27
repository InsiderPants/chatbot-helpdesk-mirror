/*
    *Module for NLP Engine
*/
const tokenizer = require('./tokenizer'),
	  featurizer = require('./featurizer'),
	  ner = require('./ner'),
	  synonymsMapping = require('./synonymsMapping'),
	  intentClassifier = require('./intentClassifier'),
	  natural = require('natural');

function nlpEngine(customerQuery){
	// Result object
	result = {
		"text":customerQuery,
		"sentiment":null,
		"intent":'',
		"confidence":null,
		"entities":[],
		"reply":[],
		"actions":[]
	};
	// Tokens
	tokens = tokenizer(customerQuery);
	// Features to feed in intent classifier

	// Named Entity Recognition
	
	// Synonyms Mapping

	// Intent Classification
	
	return result;
}

module.exports = nlpEngine;