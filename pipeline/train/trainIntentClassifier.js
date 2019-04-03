/*
    *Module for training the intent classifier
*/

const intentClassifier = require('../nlp/intentClassifier');

// Config
config = {
	features:null,
	labels:null,
	weights_save_path:null
}

// Load data from db to feed in classifier

// Train classifier and save
clf = intentClassifier(train=true,
		features=config.features,
		labels=config.labels,
		weights_save_path=config.weights_save_path);