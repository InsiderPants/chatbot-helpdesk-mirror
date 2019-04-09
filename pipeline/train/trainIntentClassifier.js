/*
    *Module for training the intent classifier
*/

const intentClassifier = require('../nlp/intentClassifier');

// Config
config = {
	vocab_load_path:__dirname+'/data/vocab.txt',
	weights_save_path:__dirname+'/data/weights'
}

// Train classifier and save
clf = intentClassifier(train=true,
		weights_load_path=null,
		vocab_load_path=config.vocab_load_path,
		weights_save_path=config.weights_save_path);