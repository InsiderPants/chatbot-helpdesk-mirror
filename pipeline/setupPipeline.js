/*
    *Module for Setting up the pipeline. Execute it once when server starts 
    and use for inference in each request
*/

const ner = require('./nlp/ner'),
	  intentClassifier = require('./nlp/intentClassifier');

// Config
const config = {
	vocab_load_path:__dirname+'/train/data/vocab.txt',
	weights_load_path:__dirname+'/train/data/weights'
}


async function setupPipeline(){
	var pipeline = {};
	
	// Load NER
	pipeline['ner'] = null;
	// Load Intent Classifier
	return intentClassifier(train=false,
				weights_load_path=config.weights_load_path,
				vocab_load_path=config.vocab_load_path,
				weights_save_path=null)
			.then(intentClassifier=>{
				pipeline['intentClassifier'] = intentClassifier;
				// Load Sentiment Classifier
				pipeline['sentimentEngine'] = null;
				
				return pipeline
			})
}

module.exports = setupPipeline