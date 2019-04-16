/*
    *Module for Setting up the pipeline. Execute it once when server starts 
    and use for inference in each request
*/

const ner = require('./nlp/ner'),
	  intentClassifier = require('./nlp/intentClassifier'),
	  sentimentEngine = require('./sentiment/sentimentEngine')

// Config
const config = {
	vocab_load_path:__dirname+'/train/data/intentclassifier/vocab.txt',
	weights_load_path:__dirname+'/train/data/intentclassifier/',
	weights_load_path_sentiment:__dirname+'/train/data/sentiment/'
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
				return sentimentEngine(train=false,
						dataset_path=null,
						embeddings_path=null,
						weights_save_path=null,
						weights_load_path=config.weights_load_path_sentiment)
					.then(sentimentClassifier=>{
						pipeline['sentimentEngine'] = sentimentClassifier;
						return pipeline;
					})
					.catch(err=>{
						console.log('SERVER: Error while loading sentiment engine')
					});
			})
			.catch(err=>{
				console.log('SERVER: Error while loading intent classifier')
			});
}

module.exports = setupPipeline