/*
    *Module for Setting up the pipeline. Execute it once when server starts 
    and use for inference in each request
*/

const tokenizer = require('./nlp/tokenizer'),
	  featurizer = require('./nlp/featurizer'),
	  ner = require('./nlp/ner'),
	  intentClassifier = require('./nlp/intentClassifier');

function setupPipeline(){
	var pipeline = {};
	// Load tokenizer
	pipeline['tokenizer'] = tokenizer();

	// Load Featurizer
	pipeline['featurizer'] = featurizer(train=false,vocab_load_path=null);

	// Load NER
	pipeline['ner'] = null;

	// Load Intent Classifier
	pipeline['intentClassifier'] = intentClassifier(train=false,weights_load_path=null);

	// Load Sentiment Classifier
	pipeline['sentimentEngine'] = null;

	return pipeline
}

module.exports = setupPipeline