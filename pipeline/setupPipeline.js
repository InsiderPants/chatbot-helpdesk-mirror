/*
    *Module for Setting up the pipeline. Execute it once when server starts 
    and use for inference in each request
*/

const featurizer = require('./nlp/featurizer'),
	  ner = require('./nlp/ner'),
	  intentClassifier = require('./nlp/intentClassifier');

// Config
const config = {
	vocab_load_path:__dirname+'/train/data/vocab.txt',
	weights_load_path:null
}


async function setupPipeline(){
	var pipeline = {};

	// Load Featurizer
	pipeline['featurizer'] = await featurizer(train=false,vocab_save_path=null,vocab_load_path=config.vocab_load_path);
	
	// Load NER
	// pipeline['ner'] = null;

	// Load Intent Classifier
	pipeline['intentClassifier'] = await intentClassifier(train=false,weights_load_path=config.weights_load_path);

	// Load Sentiment Classifier
	pipeline['sentimentEngine'] = null;

	return pipeline
}

module.exports = setupPipeline