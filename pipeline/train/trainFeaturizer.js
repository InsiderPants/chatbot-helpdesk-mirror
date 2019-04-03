/*
    *Module for training the featurizer
*/

const featurizer = require('../nlp/featurizer');

// Config
config = {
	vocab_save_path:null
}

// Load data from db to feed in featurizer

// Train featurizer and save
feat = featurizer(train=true,
		vocab_save_path=config.vocab_save_path);